'use strict';

/**
 * Utilsateurentreprise.js controller
 *
 * @description: A set of functions called "actions" for managing `Utilsateurentreprise`.
 */

module.exports = {

  /**
   * Retrieve utilsateurentreprise records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.utilsateurentreprise.search(ctx.query);
    } else {
      return strapi.services.utilsateurentreprise.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a utilsateurentreprise record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.utilsateurentreprise.fetch(ctx.params);
  },

  /**
   * Count utilsateurentreprise records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.utilsateurentreprise.count(ctx.query);
  },

  /**
   * Create a/an utilsateurentreprise record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.utilsateurentreprise.add(ctx.request.body);
  },

  /**
   * Update a/an utilsateurentreprise record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.utilsateurentreprise.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an utilsateurentreprise record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.utilsateurentreprise.remove(ctx.params);
  }
};
