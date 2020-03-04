const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const TOKEN_PATH = "token.json";

async function fetchSpreadSheet(spreadsheetId, ranges) {
  try {
    const creds = strapi.config.environments.development.credentials;
    const res = await authorize(creds, spreadsheetId, ranges);
    return res;
  } catch (error) {
    throw error;
  }
}

function readToken(TOKEN_PATH, auth, spreadsheetId, ranges) {
  return new Promise((resolve, _reject) => {
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) {
        const res = await getNewToken(auth);
        return resolve(res);
      }
      auth.setCredentials(JSON.parse(token));
      const res = await listMajors(auth, spreadsheetId, ranges);
      resolve(res);
    });
  });
}
async function authorize(credentials, spreadsheetId, ranges) {
  try {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    const res = await readToken(TOKEN_PATH, auth, spreadsheetId, ranges);
    return res;
  } catch (error) {
    throw error;
  }
}

function getValues(sheets, spreadsheetId, ranges) {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.batchGet(
      {
        spreadsheetId,

        ranges
      },
      (err, response) => {
        if (err) reject(err);
        return resolve(response);
      }
    );
  });
}

async function listMajors(auth, spreadsheetId, ranges) {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const result = await getValues(sheets, spreadsheetId, ranges);
    return result.data.valueRanges;
  } catch (error) {
    throw error;
  }
}

async function getNewToken(auth, spreadsheetId, ranges) {
  const authUrl = auth.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    auth.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      auth.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      listMajors(auth, spreadsheetId, ranges);
    });
  });
}

module.exports = {
  fetchSpreadSheet
};
