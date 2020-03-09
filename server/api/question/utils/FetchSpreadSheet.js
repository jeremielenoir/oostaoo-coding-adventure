
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const ranges = [
  'A1:A149',
  'B1:B149',
  'C1:C149',
  'D1:D149',
  'E1:E149',
  'F1:F149',
  'G1:G149',
  'H1:H149',
  'I1:I149',
  'J1:J149'
];

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = 'token.json';
const spreadsheetId = '1X3x5HJVyAyg9MZTfhw044wEafHpoInT_L1rU-CnZdjE';
async function fetchSpreadSheet() {
  try {
    const creds = strapi.config.environments.development.credentials;

    return authorize(creds, listMajors);
  } catch (error) {
    throw error;
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  // Pulling the data from the specified spreadsheet and the specified range
  var result = sheets.spreadsheets.values.batchGet(
    {
      spreadsheetId,

      ranges
    },
    (err, response) => {
      if (err) return console.log('The API returned an error: ' + err);

      return response.data.valueRanges;
    }
  );

  return result;
}

module.exports = {
  fetchSpreadSheet
};
