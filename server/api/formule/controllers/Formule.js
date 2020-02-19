'use strict';

/**
 * Formule.js controller
 *
 * @description: A set of functions called "actions" for managing `Formule`.
 */

module.exports = {

  /**
   * Retrieve formule records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.formule.search(ctx.query);
    } else {
      return strapi.services.formule.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a formule record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.formule.fetch(ctx.params);
  },

  /**
   * Count formule records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.formule.count(ctx.query);
  },

  /**
   * Create a/an formule record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.formule.add(ctx.request.body);
  },

  /**
   * Update a/an formule record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.formule.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an formule record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.formule.remove(ctx.params);
  }
};
