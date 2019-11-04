'use strict';

/**
 * Entreprise.js controller
 *
 * @description: A set of functions called "actions" for managing `Entreprise`.
 */

module.exports = {

  /**
   * Retrieve entreprise records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.entreprise.search(ctx.query);
    } else {
      return strapi.services.entreprise.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a entreprise record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.entreprise.fetch(ctx.params);
  },

  /**
   * Count entreprise records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.entreprise.count(ctx.query);
  },

  /**
   * Create a/an entreprise record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.entreprise.add(ctx.request.body);
  },

  /**
   * Update a/an entreprise record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.entreprise.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an entreprise record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.entreprise.remove(ctx.params);
  }
};
