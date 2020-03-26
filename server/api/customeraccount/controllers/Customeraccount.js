'use strict';

/**
 * Customeraccount.js controller
 *
 * @description: A set of functions called "actions" for managing `Customeraccount`.
 */

module.exports = {

  /**
   * Retrieve customeraccount records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.customeraccount.search(ctx.query);
    } else {
      return strapi.services.customeraccount.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a customeraccount record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.customeraccount.fetch(ctx.params);
  },

  /**
   * Count customeraccount records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.customeraccount.count(ctx.query);
  },

  /**
   * Create a/an customeraccount record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.customeraccount.add(ctx.request.body);
  },

  /**
   * Update a/an customeraccount record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.customeraccount.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an customeraccount record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.customeraccount.remove(ctx.params);
  }
};
