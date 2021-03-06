/* global Facture */
'use strict';

/**
 * Facture.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');
const pdf = require("html-pdf");
const ejs = require("ejs");
const path = require("path");

module.exports = {

  /**
   * Promise to fetch all factures.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('facture', params);
    // Select field to populate.
    const populate = Facture.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Facture.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value) && where.symbol !== 'IN' && where.symbol !== 'NOT IN') {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
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
   * Promise to fetch a/an facture.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Facture.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Facture.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an facture.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('facture', params);

    return Facture.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value]);
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an facture.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Facture.associations.map(ast => ast.alias));
    const data = _.omit(values, Facture.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Facture.forge(data).save();

    // Create relational data and return the entry.
    return Facture.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an facture.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Facture.associations.map(ast => ast.alias));
    const data = _.omit(values, Facture.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Facture.forge(params).save(data);

    // Create relational data and return the entry.
    return Facture.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an facture.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Facture.associations.map(association => {
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

    await Facture.updateRelations(params);

    return Facture.forge(params).destroy();
  },

  /**
   * Promise to search a/an facture.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('facture', params);
    // Select field to populate.
    const populate = Facture.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Facture.associations.map(x => x.alias);
    const searchText = Object.keys(Facture._attributes)
      .filter(attribute => attribute !== Facture.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Facture._attributes[attribute].type));

    const searchNoText = Object.keys(Facture._attributes)
      .filter(attribute => attribute !== Facture.primaryKey && !associations.includes(attribute))
      .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Facture._attributes[attribute].type));

    const searchInt = Object.keys(Facture._attributes)
      .filter(attribute => attribute !== Facture.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Facture._attributes[attribute].type));

    const searchBool = Object.keys(Facture._attributes)
      .filter(attribute => attribute !== Facture.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Facture._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Facture.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Facture.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
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
      withRelated: populate
    });
  },


   /**
   * Promise to facture pdf file.
   *
   * @return {Promise}
   */

  reportBillPdf: async (id, data) => {
    try {
      
console.log("id",id)
console.log("data",data)
      const templatePath = path.join(
        __dirname,
        "../../../facture-template/",
        "template.ejs"
      );
      const pdfPath = path.join(
        __dirname,
        "../../../facture-template/facture-report/",
        `${id}.pdf`
      );

      const processFile = () =>
        new Promise((resolve, reject) => {
          ejs.renderFile(templatePath, { data}, (err, data) => {
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
