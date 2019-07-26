'use strict';

/**
 * Facture.js controller
 *
 * @description: A set of functions called "actions" for managing `Facture`.
 */

module.exports = {

  /**
   * Retrieve facture records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.facture.search(ctx.query);
    } else {
      return strapi.services.facture.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a facture record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.facture.fetch(ctx.params);
  },

  /**
   * Count facture records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.facture.count(ctx.query);
  },

  /**
   * Create a/an facture record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.facture.add(ctx.request.body);
  },

  /**
   * Update a/an facture record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.facture.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an facture record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.facture.remove(ctx.params);
  }
};
