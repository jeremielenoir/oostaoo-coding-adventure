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
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const axios = require("axios");
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

  checkTechnology: async params => {
    return Technologies.forge(_.pick(params, "name"))
      .fetch({})
      .then(isTechno => {
        if (isTechno) {
          return isTechno.id;
        } else {
          return strapi.services.technologies
            .add(params)
            .then(techno => {
              return techno.id;
            })
            .catch(err => err);
        }
      })
      .catch(err => err);
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
      const technogologies = [...new Set(arrValues.map(val => val[1]))];

      technogologies.forEach(techno => {
        arrTech.push({ technology: techno });
      });
      const arrTechPromise = [];

      arrTech.forEach(async tech => {
        arrTechPromise.push(
          new Promise((resolve, reject) => {
            return strapi.services.technologies
              .add({ name: tech.technology })
              .then(techno =>
                resolve({
                  technology: tech.technology,
                  id: techno.id
                })
              )
              .catch(e => reject(e));
          })
        );
      });
      arrTech = await Promise.all(arrTechPromise);
      
      const questions = [];
      arrValues.forEach((val, _index) => {
        const tech = arrTech.find(t => t.technology.toString() === val[1]);
        
        questions.push({
          // "id-prefix": `${index}_${val[1]}`,
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

     

      return questions;
    } catch (error) {
      throw error;
    }
  }
};
