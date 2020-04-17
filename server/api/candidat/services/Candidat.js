/* global Candidat */
"use strict";

/**
 * Candidat.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require("lodash");

// Strapi utilities.
const utils = require("strapi-hook-bookshelf/lib/utils/");
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");
module.exports = {
  /**
   * Promise to fetch all candidats.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("candidat", params);
    // Select field to populate.
    const populate = Candidat.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    return Candidat.query(function (qb) {
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
      withRelated: filters.populate || populate,
    });
  },

  /**
   * Promise to fetch a/an candidat.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Candidat.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    return Candidat.forge(_.pick(params, "id")).fetch({
      withRelated: populate,
    });
  },

  /**
   * Promise to count a/an candidat.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("candidat", params);

    return Candidat.query(function (qb) {
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
   * Promise to add a/an candidat.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(
      values,
      Candidat.associations.map((ast) => ast.alias)
    );
    const data = _.omit(
      values,
      Candidat.associations.map((ast) => ast.alias)
    );

    // Create entry with no-relational data.
    const entry = await Candidat.forge(data).save();

    // Create relational data and return the entry.
    return Candidat.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an candidat.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(
      values,
      Candidat.associations.map((ast) => ast.alias)
    );
    const data = _.omit(
      values,
      Candidat.associations.map((ast) => ast.alias)
    );

    // Create entry with no-relational data.
    const entry = await Candidat.forge(params).save(data);

    // Create relational data and return the entry.
    return Candidat.updateRelations(
      Object.assign(params, { values: relations })
    );
  },

  /**
   * Promise to remove a/an candidat.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Candidat.associations.map((association) => {
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

    await Candidat.updateRelations(params);

    return Candidat.forge(params).destroy();
  },

  /**
   * Promise to search a/an candidat.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams("candidat", params);
    // Select field to populate.
    const populate = Candidat.associations
      .filter((ast) => ast.autoPopulate !== false)
      .map((ast) => ast.alias);

    const associations = Candidat.associations.map((x) => x.alias);
    const searchText = Object.keys(Candidat._attributes)
      .filter(
        (attribute) =>
          attribute !== Candidat.primaryKey && !associations.includes(attribute)
      )
      .filter((attribute) =>
        ["string", "text"].includes(Candidat._attributes[attribute].type)
      );

    const searchNoText = Object.keys(Candidat._attributes)
      .filter(
        (attribute) =>
          attribute !== Candidat.primaryKey && !associations.includes(attribute)
      )
      .filter(
        (attribute) =>
          ![
            "string",
            "text",
            "boolean",
            "integer",
            "decimal",
            "float",
          ].includes(Candidat._attributes[attribute].type)
      );

    const searchInt = Object.keys(Candidat._attributes)
      .filter(
        (attribute) =>
          attribute !== Candidat.primaryKey && !associations.includes(attribute)
      )
      .filter((attribute) =>
        ["integer", "decimal", "float"].includes(
          Candidat._attributes[attribute].type
        )
      );

    const searchBool = Object.keys(Candidat._attributes)
      .filter(
        (attribute) =>
          attribute !== Candidat.primaryKey && !associations.includes(attribute)
      )
      .filter((attribute) =>
        ["boolean"].includes(Candidat._attributes[attribute].type)
      );

    const query = (params._q || "").replace(/[^a-zA-Z0-9.-\s]+/g, "");

    return Candidat.query((qb) => {
      // Search in columns which are not text value.
      searchNoText.forEach((attribute) => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach((attribute) => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === "true" || query === "false") {
        searchBool.forEach((attribute) => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === "true")}`);
        });
      }

      // Search in columns with text using index.
      switch (Candidat.client) {
        case "mysql":
          qb.orWhereRaw(
            `MATCH(${searchText.join(",")}) AGAINST(? IN BOOLEAN MODE)`,
            `*${query}*`
          );
          break;
        case "pg": {
          const searchQuery = searchText.map((attribute) =>
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
      withRelated: populate,
    });
  },

  /**
   * Promise to remove a/an candidat.
   *
   * @return {Promise}
   */

  reportPdf: async (id, data) => {
    try {
      const fmtMSS = (d) => {
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        const s = Math.floor((d % 3600) % 60);

        return (
          ("0" + h).slice(-2) +
          ":" +
          ("0" + m).slice(-2) +
          ":" +
          ("0" + s).slice(-2)
        );
        // return (m - (m %= 60)) / 60 + (9 < m ? ':' : ':0') + m;
      };
      const removeDuplicates = (rapportTechno) => {
        const unique = {};
        rapportTechno.forEach((i) => {
          if (!unique[i]) {
            unique[i] = true;
          }
        });
        return Object.keys(unique);
      };
      let candidat = null;

      let rapport = null;
      let rapportTechno = [];
      let uniquetechno = null;
      let techno = [];
      let totalTime = 0;

      let listereponse;
      let bonnereponse;

      candidat = data.attributes;

      rapport = candidat.raport_candidat.rapport;

      rapport.forEach((element) => {
        rapportTechno.push(element.index_question.technologies);
        totalTime = totalTime + element.index_question.time;
        listereponse = element.index_question.content.split(", ");
        element.index_question.content = listereponse;
        bonnereponse = element.index_question.answer_value.split(", ");
        element.index_question.answer_value = bonnereponse;
      });

      uniquetechno = removeDuplicates(rapportTechno);
      uniquetechno.forEach(async (id) => {
        const tech = await strapi.services.technologies.fetch({ id });
        techno.push(tech);
      });

      const timespent = fmtMSS(candidat.duree) + "/" + fmtMSS(totalTime);

      const templatePath = path.join(
        __dirname,
        "../../../report-template/",
        "template.ejs"
      );
      const pdfPath = path.join(
        __dirname,
        "../../../report-template/candidates-report/",
        `${id}.pdf`
      );

      const processFile = () =>
        new Promise((resolve, reject) => {
          ejs.renderFile(templatePath, { candidat, timespent }, (err, data) => {
            if (err) reject(err);
            pdf.create(data).toFile(pdfPath, function (err, data) {
              if (err) reject(err);

              resolve(data.filename);
            });
          });
        });

      const result = await processFile();
      return result;
    } catch (error) {
      throw error;
    }
  },
};
