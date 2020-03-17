/* global Question */
"use strict";

/**
 * Question.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require("lodash");

// Strapi utilities.
const utils = require("strapi-hook-bookshelf/lib/utils/");
const { google } = require("googleapis");
const keys = require("../../../roodeo.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

module.exports = {
  /**
   * Promise to fetch all questions.
   *
   * @return {Promise}
   */

  fetchAll: params => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("question", params);
    // Select field to populate.
    const populate = Question.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Question.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (
          _.isArray(where.value) &&
          where.symbol !== "IN" &&
          where.symbol !== "NOT IN"
        ) {
          for (const value in where.value) {
            qb[value ? "where" : "orWhere"](
              key,
              where.symbol,
              where.value[value]
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
      withRelated: filters.populate || populate
    });
  },

  /**
   * Promise to fetch a/an question.
   *
   * @return {Promise}
   */

  fetch: params => {
    // Select field to populate.
    const populate = Question.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Question.forge(_.pick(params, "id")).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an question.
   *
   * @return {Promise}
   */

  count: params => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("question", params);

    return Question.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? "where" : "orWhere"](
              key,
              where.symbol,
              where.value[value]
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

  add: async values => {
    // Extract values related to relational data.
    const relations = _.pick(
      values,
      Question.associations.map(ast => ast.alias)
    );
    const data = _.omit(
      values,
      Question.associations.map(ast => ast.alias)
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
      Question.associations.map(ast => ast.alias)
    );
    const data = _.omit(
      values,
      Question.associations.map(ast => ast.alias)
    );

    // Create entry with no-relational data.
    const entry = await Question.forge(params).save(data);

    // Create relational data and return the entry.
    return Question.updateRelations(
      Object.assign(params, { values: relations })
    );
  },

  /**
   * Promise to remove a/an question.
   *
   * @return {Promise}
   */

  remove: async params => {
    params.values = {};
    Question.associations.map(association => {
      switch (association.nature) {
        case "oneWay":
        case "oneToOne":
        case "manyToOne":
        case "oneToManyMorph":
          params.values[association.alias] = null;
          break;
        case "oneToMany":
        case "manyToMany":
        case "manyToManyMorph":
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

  search: async params => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("question", params);
    // Select field to populate.
    const populate = Question.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Question.associations.map(x => x.alias);
    const searchText = Object.keys(Question._attributes)
      .filter(
        attribute =>
          attribute !== Question.primaryKey && !associations.includes(attribute)
      )
      .filter(attribute =>
        ["string", "text"].includes(Question._attributes[attribute].type)
      );

    const searchNoText = Object.keys(Question._attributes)
      .filter(
        attribute =>
          attribute !== Question.primaryKey && !associations.includes(attribute)
      )
      .filter(
        attribute =>
          ![
            "string",
            "text",
            "boolean",
            "integer",
            "decimal",
            "float"
          ].includes(Question._attributes[attribute].type)
      );

    const searchInt = Object.keys(Question._attributes)
      .filter(
        attribute =>
          attribute !== Question.primaryKey && !associations.includes(attribute)
      )
      .filter(attribute =>
        ["integer", "decimal", "float"].includes(
          Question._attributes[attribute].type
        )
      );

    const searchBool = Object.keys(Question._attributes)
      .filter(
        attribute =>
          attribute !== Question.primaryKey && !associations.includes(attribute)
      )
      .filter(attribute =>
        ["boolean"].includes(Question._attributes[attribute].type)
      );

    const query = (params._q || "").replace(/[^a-zA-Z0-9.-\s]+/g, "");

    return Question.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === "true" || query === "false") {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === "true")}`);
        });
      }

      // Search in columns with text using index.
      switch (Question.client) {
        case "mysql":
          qb.orWhereRaw(
            `MATCH(${searchText.join(",")}) AGAINST(? IN BOOLEAN MODE)`,
            `*${query}*`
          );
          break;
        case "pg": {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(" || ")} @@ to_tsquery(?)`, query);
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
      withRelated: populate
    });
  },

  /**
   * Promise to fetch spreadsheet questions.
   *
   * @return {Promise}
   */
  fetchSpreadsheet: async (spreadsheetId, ranges) => {
    try {
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        [SCOPES]
      );
      await client.authorize();
      const gsapi = google.sheets({ version: "v4", auth: client });

      const {
        data: { valueRanges }
      } = await gsapi.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges
      });

      const data = valueRanges.map(val => val.values);
      const arr = data[0];
      const arrValues = [];
      const arrFields = arr[0];
      for (var i = 1; i < arr.length; i++) {
        arrValues.push(arr[i]);
      }

      let arrTech = [];

      const techFieldValues = [...new Set(arrValues.map(val => val[1]))];

      const techs = await Technologies.fetchAll({});

      if (techs && techs.length > 0) {
        techFieldValues.forEach(val => {
          techs.forEach(tech => {
            if (
              val &&
              tech &&
              tech.attributes &&
              tech.attributes.name &&
              val.toString() === tech.attributes.name.toString()
            ) {
              if (
                arrTech.findIndex(
                  t => t && t.name.toString() === val.toString()
                ) < 0
              ) {
                arrTech.push({ name: val, id: tech.id });
              }
            }
          });
        });
      } else {
        techFieldValues.forEach(techno => {
          arrTech.push({ name: techno, id: null });
        });
      }

      const techVals = arrTech.map(t => t.name);

      const diffTech = _.difference(techFieldValues, techVals);

      if (diffTech && diffTech.length > 0) {
        diffTech.forEach(tech => arrTech.push({ name: tech, id: null }));
      }
      const arrTechPromise = [];

      arrTech.forEach(async tech => {
        arrTechPromise.push(
          new Promise((resolve, reject) => {
            if (tech && tech.id) {
              resolve(tech);
            } else {
              return strapi.services.technologies
                .add({ name: tech.name })
                .then(techno => resolve({ name: tech.name, id: techno.id }))
                .catch(e => reject(e));
            }
          })
        );
      });

      arrTech = await Promise.all(arrTechPromise);

      const questions = [];
      arrValues.forEach((val, _index) => {
        const tech = arrTech.find(
          t => t && t.name && t.name.toString() === val[1]
        );

        questions.push({
          id: val[0] || null,
          [arrFields[1].toLowerCase()]: tech,
          [arrFields[2].toLowerCase()]: val[2],

          [arrFields[3].toLowerCase()]: val[3],
          [arrFields[4].toLowerCase()]: val[4],
          [arrFields[5].toLowerCase()]: val[5],

          [arrFields[6].toLowerCase()]: val[6],
          [arrFields[7].toLowerCase()]: val[7],
          [arrFields[8].toLowerCase()]: val[8],
          [arrFields[9].toLowerCase()]: val[9]
        });
      });

      const arrPromises = [];

      questions.forEach(question => {
        arrPromises.push(
          new Promise((resolve, reject) => {
            if (question.id) {
              const id = question.id;
              delete question.id;
              return strapi.services.question
                .edit(
                  { id },
                  {
                    ...question,
                    technologies: question.technologies
                  }
                )
                .then(r => resolve(r))
                .catch(err => reject(err));
            }
            delete question.id;
            return strapi.services.question
              .add({
                ...question,
                technologies: question.technologies
              })
              .then(r => resolve(r))
              .catch(err => reject(err));
          })
        );
      });
      const results = await Promise.all(arrPromises);
      const ids = results.map(r => [r.id]);

      const updateOptions = {
        spreadsheetId,
        range: "Feuille 1!A2",
        valueInputOption: "USER_ENTERED",
        resource: { values: ids }
      };
      await gsapi.spreadsheets.values.update(updateOptions);
      return results;
    } catch (error) {
      throw error;
    }
  }
};
