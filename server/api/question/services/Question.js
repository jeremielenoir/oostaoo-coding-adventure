/* global Question */
'use strict';

/**
 * Question.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
//const utils = require('strapi-hook-bookshelf/lib/utils/');
const { exec } = require('child_process');
const shortid = require('shortid');
const Technologies = require('../../technologies/services/Technologies');
const { createReadStream, createWriteStream, unlink, access } = require('fs');
const randomstring = require('randomstring');
const { google } = require('googleapis');
const keys = require('../../../roodeo.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const UPLOAD_DIR = 'filescripts';
const fs = require('fs');

//const encoding = require("encoding-japanese");
module.exports = {
  /**
   * Promise to fetch all questions.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('question', params);
    // Select field to populate.
    const populate = Question.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    return Question.query(function (qb) {
      _.forEach(filters.where, (where, key) => {
        if (
          _.isArray(where.value) &&
          where.symbol !== 'IN' &&
          where.symbol !== 'NOT IN'
        ) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](
              key,
              where.symbol,
              where.value[value],
            );
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: filters.populate || populate,
    });
  },

  /**
   * Promise to fetch a/an question.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Question.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    return Question.forge(_.pick(params, 'id')).fetch({
      withRelated: populate,
    });
  },

  /**
   * Promise to count a/an question.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('question', params);

    return Question.query(function (qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](
              key,
              where.symbol,
              where.value[value],
            );
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an question.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(
      values,
      Question.associations.map((ast) => ast.alias),
    );
    const data = _.omit(
      values,
      Question.associations.map((ast) => ast.alias),
    );

    // Create entry with no-relational data.
    const entry = await Question.forge(data).save();

    // Create relational data and return the entry.
    return Question.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an question.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(
      values,
      Question.associations.map((ast) => ast.alias),
    );
    const data = _.omit(
      values,
      Question.associations.map((ast) => ast.alias),
    );

    // Create entry with no-relational data.
    const entry = await Question.forge(params).save(data);

    // Create relational data and return the entry.
    return Question.updateRelations(
      Object.assign(params, { values: relations }),
    );
  },

  /**
   * Promise to remove a/an question.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Question.associations.map((association) => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Question.updateRelations(params);

    return Question.forge(params).destroy();
  },

  /**
   * Promise to search a/an question.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('question', params);
    // Select field to populate.
    const populate = Question.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    const associations = Question.associations.map((x) => x.alias);
    const searchText = Object.keys(Question._attributes)
      .filter(
        (attribute) =>
          attribute !== Question.primaryKey &&
          !associations.includes(attribute),
      )
      .filter((attribute) =>
        ['string', 'text'].includes(Question._attributes[attribute].type),
      );

    const searchNoText = Object.keys(Question._attributes)
      .filter(
        (attribute) =>
          attribute !== Question.primaryKey &&
          !associations.includes(attribute),
      )
      .filter(
        (attribute) =>
          ![
            'string',
            'text',
            'boolean',
            'integer',
            'decimal',
            'float',
          ].includes(Question._attributes[attribute].type),
      );

    const searchInt = Object.keys(Question._attributes)
      .filter(
        (attribute) =>
          attribute !== Question.primaryKey &&
          !associations.includes(attribute),
      )
      .filter((attribute) =>
        ['integer', 'decimal', 'float'].includes(
          Question._attributes[attribute].type,
        ),
      );

    const searchBool = Object.keys(Question._attributes)
      .filter(
        (attribute) =>
          attribute !== Question.primaryKey &&
          !associations.includes(attribute),
      )
      .filter((attribute) =>
        ['boolean'].includes(Question._attributes[attribute].type),
      );

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Question.query((qb) => {
      // Search in columns which are not text value.
      searchNoText.forEach((attribute) => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach((attribute) => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach((attribute) => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Question.client) {
        case 'mysql':
          qb.orWhereRaw(
            `MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`,
            `*${query}*`,
          );
          break;
        case 'pg': {
          const searchQuery = searchText.map((attribute) =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`,
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      withRelated: populate,
    });
  },

  /**
   * Promise to add separator to spreadsheet questions.
   *
   * @return {Promise}
   */

  addSeparatorSpreadSheet: async (spreadsheetId, ppage, first, last) => {
    try {
      let page = '';

      if (ppage.length === 3 && ppage.startsWith('C')) {
        page = 'C++';
      } else if (ppage.length === 10 && ppage.startsWith('Angular')) {
        page = 'Angular 2+';
      } else {
        page = ppage;
      }

      const ranges = [`${page}!${first}:${last}`];
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        [SCOPES],
      );
      await client.authorize();
      const gsapi = google.sheets({ version: 'v4', auth: client });

      const {
        data: { valueRanges },
      } = await gsapi.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      const data = valueRanges.map((val) => val.values)[0];
      const newData = data.map((e) => {
        if (e && e[6]) {
          const tab = e[6].split('☼');
          return tab.join('&#x263C;');
        }
      });
      const values = newData.map((e) => [e]);
      const updateOptions = {
        spreadsheetId,
        range: `${page}!${first}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      };
      await gsapi.spreadsheets.values.update(updateOptions);
      return 'ok';
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  },

  /**
   * Promise to fetch spreadsheet questions.
   *
   * @return {Promise}
   */
  fetchSpreadsheet: async (spreadsheetId, ppage, first, last) => {
    try {
      let page = ppage;

      if (ppage.length === 3 && ppage.startsWith('C')) {
        page = 'C++';
      } else if (ppage.length === 10 && ppage.startsWith('Angular')) {
        page = 'Angular 2+';
      }

      const ranges = [`${page}!${first}:${last}`];
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        [SCOPES],
      );

      console.log('RANGES', ranges);
      await client.authorize();
      const gsapi = google.sheets({ version: 'v4', auth: client });

      const {
        data: { valueRanges },
      } = await gsapi.spreadsheets.values.batchGet({ spreadsheetId, ranges });

      const data = valueRanges.map((val) => val.values)[0];

      console.log('GET SPREADSHEET DATAS', data);

      const arrValues = [];
      for (let i = 0; i < data.length; i++) {
        arrValues.push(data[i]);
      }

      let arrTech = [];

      const techFieldValues = [...new Set(arrValues.map((val) => val[1]))];

      const techs = await Technologies.fetchAll({});

      if (techs && techs.length > 0) {
        techFieldValues.forEach((val) => {
          techs.forEach((tech) => {
            if (
              val &&
              tech &&
              tech.attributes &&
              tech.attributes.name &&
              val.toString() === tech.attributes.name.toString()
            ) {
              if (
                arrTech.findIndex(
                  (t) => t && t.name.toString() === val.toString(),
                ) < 0
              ) {
                arrTech.push({ name: val, id: tech.id });
              }
            }
          });
        });
      } else {
        techFieldValues.forEach((techno) => {
          arrTech.push({ name: techno, id: null });
        });
      }


      const techVals = arrTech.map((t) => t.name);

      const diffTech = _.difference(techFieldValues, techVals);

      if (diffTech && diffTech.length > 0) {
        diffTech.forEach((tech) => arrTech.push({ name: tech, id: null }));
      }

      const arrTechPromise = [];

      console.log(arrTech);

      arrTech.forEach(async (tech) => {
        arrTechPromise.push(
          new Promise((resolve, reject) => {
            if (tech && tech.id) {
              resolve(tech);
            } else {
              return strapi.services.technologies
                .add({ name: tech.name })
                .then((techno) => resolve({ name: tech.name, id: techno.id }))
                .catch((e) => reject(e));
            }
          }),
        );
      });

      arrTech = await Promise.all(arrTechPromise);

      const questions = [];
      arrValues.forEach((val) => {
        const tech = arrTech.find(
          (t) => t && t.name && t.name.toString() === val[1],
        );
        questions.push({
          id: val[0] || null,
          technologies: tech,
          name: val[2],
          name_en: val[3],
          name_es: val[4],
          name_jp: val[5],
          content: val[6],
          content_en: val[7],
          content_es: val[8],
          content_jp: val[9],
          answer_value: val[10],
          answer_value_en: val[11],
          answer_value_es: val[12],
          answer_value_jp: val[13],
          time: val[14],
          level: val[15],
          type: val[16],
          points: val[17],
          theme: val[18],
          theme_en: val[19],
          theme_es: val[20],
          theme_jp: val[21],
          titre: val[22],
          titre_en: val[23],
          titre_es: val[24],
          titre_jp: val[25],
        });
      });

      const arrPromises = [];

      questions.forEach((question) => {
        arrPromises.push(
          new Promise((resolve, reject) => {
            if (question.id) {
              const id = question.id;
              delete question.id;
              strapi.services.question
                .edit(
                  { id },
                  {
                    ...question,
                    technologies: question.technologies,
                  },
                )
                .then((r) => resolve(r))
                .catch((err) => {
                  console.log('ERREUR', err);
                  reject(err);
                });
            } else {
              strapi.services.question
                .add({
                  ...question,
                  technologies: question.technologies,
                })
                .then((r) => resolve(r))
                .catch((err) => {
                  console.log('ERROR ADD', err);
                  reject(err);
                });
            }
            //delete question.id;
          }),
        );
      });

      const results = await Promise.all(arrPromises);
      const ids = results.map((r) => [r.id]);

      const updateOptions = {
        spreadsheetId,
        range: `${page}!A${first}:A${last}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: ids },
      };

      await gsapi.spreadsheets.values.update(updateOptions);
      return results;
    } catch (error) {
      console.log('ERROR', error);
      throw error;
    }
  },

  /**
   * Promise to execute algorihtmic questions.
   *
   * @return {Promise}
   */
  executeScript: async (file, questionId) => {
    try {
      let functionName;
      let regexExtractFunctionNameJS = new RegExp('(?<=function )(.*)(?=[(])');
      let consoleLogText;

      const generateStrings = (numberOfStrings, stringLength) => {
        const s = new Set();

        while (s.size < numberOfStrings) {
          s.add(randomstring.generate(stringLength));
        }
        const val = s.values().next();

        return val;
      };
      const storeUpload = async ({ filename, extension }) => {
        const random = await shortid.generate();
        let id = '';
        let path = '';
        const randomname = generateStrings(1, 10).value;
        const javafilename = `Main${randomname.charAt(0).toUpperCase() + randomname.slice(1)
          }`;

        switch (extension) {
          case 'java':
            id = `${javafilename}.${extension}`;
            path = `${UPLOAD_DIR}/${javafilename}.${extension}`;

            break;
          default:
            id = `${random}.${extension}`;
            path = `${UPLOAD_DIR}/${id}`;
            break;
        }

        return new Promise((resolve, reject) =>
          createReadStream(filename)
            .on('data', (chunk) => {
              functionName = chunk
                .toString()
                .match(regexExtractFunctionNameJS)[0];
            })
            .pipe(createWriteStream(path))
            .on('finish', () => resolve({ id, path, extension }))
            .on('error', (error) => reject(error)),
        );
      };

      const deleteFile = async (id) => {
        try {
          const filepath = `${UPLOAD_DIR}/${id}`;
          access(filepath, async (err) => {
            if (err) {
              console.log(`The file ${filepath} does not exist.`);
            } else {
              await fs.unlink(filepath, async (err) => {
                if (err) throw err;
              });
            }
          });
        } catch (error) {
          throw error;
        }
      };
      const processUpload = async (upload) => {
        const { name, path } = upload;
        const extension = name.split('.')[1];
        const res = await storeUpload({
          filename: path,
          extension,
        });
        return res;
      };

      const { path: filetoexecute, extension, id } = await processUpload(file);
      let script = '';
      let compiledfile = `${filetoexecute.split('.')[0]}`;

      const question = (
        await strapi.services.question.fetch({
          id: questionId,
        })
      ).toJSON();
      const questionAnswerValues = JSON.parse(question.answer_value);

      const scriptjava = `sed -i ${''} s/Main/${compiledfile.split('/')[1]
        }/g ${filetoexecute}`;
      switch (extension) {
        case 'js':
          ({ consoleLogText, script } = executeJsFile(
            consoleLogText,
            functionName,
            questionAnswerValues,
            filetoexecute,
            script,
          ));
          break;
        case 'py':
          script = `python3 ${filetoexecute}`;
          break;

        case 'php':
          script = `php ${filetoexecute}`;
          break;
        case 'cpp':
        case 'c':
          script = `gcc ${filetoexecute} -o ${compiledfile} && ./${compiledfile}`;
          break;

        case 'java':
          script = `${scriptjava} && javac ${filetoexecute} && cd ${UPLOAD_DIR} && java ${compiledfile.split('/')[1].split('.')[0]
            } `;
          break;

        default:
          break;
      }

      /// Recuperer la sortie de la fonctions
      return new Promise((resolve, reject) => {
        exec(script, async (error, stdout) => {

          let answerValues = [];
          let resultScript = stdout
            .toString()
            .trim()
            .replace(/\s/g, ',')
            .split(',')
            .map((number) => {
              return parseInt(number, 10);
            });

          questionAnswerValues.map((a) => {
            answerValues.push(a.result);
          });

          const testCode = questionAnswerValues.map((a) => ({
            eval: resultScript.find((b) => b === a.result),
            resultValidation: !!resultScript.find((b) => b === a.result),
          }));

          const testAnswer =
            JSON.stringify(answerValues) == JSON.stringify(resultScript);

          if (error) {
            reject({ result: error.message || error, success: false });
          }

          resolve({ testCode: testCode, testAnswer: testAnswer });

          await deleteFile(id);
          await deleteFile(
            extension.toString() === 'java'
              ? id.split('.')[0] + '.class'
              : id.split('.')[0],
          );
        });
      });
    } catch (error) {
      throw error;
    }

    function executeJsFile(
      consoleLogText,
      functionName,
      params,
      filetoexecute,
      script,
    ) {
      var allParams = '';
      params.forEach((element, i) => {
        if (element.type === 'array') {
          let data = element.eval;
          if (i === 0) return (allParams += functionName + '([' + data + '])');
          else return (allParams += ', ' + functionName + '([' + data + '])');
        } else {
          allParams = functionName + '(' + element.eval + ')';
          return allParams;
        }
      });
      consoleLogText = 'console.log(' + allParams + ')';

      fs.appendFile(filetoexecute, consoleLogText, function (err) {
        if (err) throw err;
        console.log('console.log added in File JS!');
      });

      script = `node ${filetoexecute}`;
      return { consoleLogText, script };
    }
  },

  /**
   * Promise to execute algorihtmic questions.
   *
   * @return {Promise}
   */

  fillSpreadsheetByTechno: async (spreadsheetId, page, first, last, techno) => {
    try {
      const technology = techno.toString();
      const ranges = [`${page}!${first}:${last}`];
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        [SCOPES],
      );
      await client.authorize();
      const gsapi = google.sheets({ version: 'v4', auth: client });

      const {
        data: { valueRanges },
      } = await gsapi.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges,
      });

      const data = valueRanges.map((val) => val.values)[0];

      const arrValues = [];
      const fields = data[0];

      for (var i = 1; i < data.length; i++) {
        if (data[i][1].toString() === technology) {
          arrValues.push(data[i]);
        }
      }

      const resourceFields = {
        spreadsheetId: spreadsheetId,

        resource: {
          data: [
            {
              range: `${technology}!A1:V1`, // Update a row
              values: [fields],
            },
          ],
          valueInputOption: 'USER_ENTERED',
        },
      };
      await gsapi.spreadsheets.values.batchUpdate(resourceFields);
      const dataCopied = [
        {
          range: `${technology}!A2:V${arrValues.length + 1}`, // Update a 2d range
          majorDimension: 'ROWS',
          values: arrValues,
        },
      ];

      const resource = {
        spreadsheetId: spreadsheetId,

        resource: { data: dataCopied, valueInputOption: 'USER_ENTERED' },
      };

      await gsapi.spreadsheets.values.batchUpdate(resource);

      return arrValues;
    } catch (error) {
      throw error;
    }
  },
};
