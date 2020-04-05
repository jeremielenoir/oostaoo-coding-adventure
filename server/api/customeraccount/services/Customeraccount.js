/* global Customeraccount */
'use strict';

/**
 * Customeraccount.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all customeraccounts.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Customeraccount.query(function(qb) {
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
   * Promise to fetch a/an customeraccount.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Customeraccount.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an customeraccount.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);

    return Customeraccount.query(function(qb) {
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
   * Promise to add a/an customeraccount.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Customeraccount.associations.map(ast => ast.alias));
    const data = _.omit(values, Customeraccount.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Customeraccount.forge(data).save();

    // Create relational data and return the entry.
    return Customeraccount.updateRelations({ id: entry.id , values: relations });
  },

  /**
   * Promise to edit a/an customeraccount.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Customeraccount.associations.map(ast => ast.alias));
    const data = _.omit(values, Customeraccount.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Customeraccount.forge(params).save(data);

    // Create relational data and return the entry.
    return Customeraccount.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an customeraccount.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Customeraccount.associations.map(association => {
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

    await Customeraccount.updateRelations(params);

    return Customeraccount.forge(params).destroy();
  },

  /**
   * Promise to search a/an customeraccount.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Customeraccount.associations.map(x => x.alias);
    const searchText = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Customeraccount._attributes[attribute].type));

    const searchNoText = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Customeraccount._attributes[attribute].type));

    const searchInt = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Customeraccount._attributes[attribute].type));

    const searchBool = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Customeraccount._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Customeraccount.query(qb => {
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
      switch (Customeraccount.client) {
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
   *
   */
  refund: async (paymentId) => {

    let refund;
    const paymentType = paymentId.substring(0, 2);
    if (paymentType == 'ch') {
      refund = await stripe.refunds.create({
        charge: paymentId
      });
    } else if (paymentType == 'su') {
      refund = await stripe.subscriptions.del(paymentId);
    }
    return refund;
  },
  /**
   *
   */
  charge: async (email, paymentToken, amount) => {

    try {

      // check if user already registred
      let customer = await stripe.customers.list({email: email, limit: 1});

      if (!customer) {
        // if not yet create it
        customer = await stripe.customers.create({
          email: email,
          source: paymentToken
        });
      }

      // charge the customer
      return await stripe.charges.create({
        amount: amount * 100,
        currency: 'EUR',
        customer: customer.id
      });

    } catch (error) {
      console.log('error : ', error);
      return error;
    }

  },
  /**
   *
   */
  subscribe: async (email, paymentToken, plan) => {

    try {

      // check if user already registred
      let customer = await stripe.customers.list({email: email, limit: 1});

      if (!customer) {
        // if not yet create it
        customer = await stripe.customers.create({
          email: email,
          source: paymentToken
        });
      }

      // search for active subscription
      let subscription = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active', // TODO how to handle other status
        collection_method: 'charge_automatically',
        limit: 1
      });

      // prevent user for double subscription
      // it may be an upgrade/downgrade, but it must be treated by change_offer endpoint
      if (subscription) {
        throw new Error('You are already subscribed to an offer');
      }

      // all fine, then create the subscription
      return await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          plan: plan
        }]
      });

    } catch (error) {
      console.log('error : ', error);
      return error;
    }
  }
};
