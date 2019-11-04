'use strict';

/**
 * Utilisateursadmin.js controller
 *
 * @description: A set of functions called "actions" for managing `Utilisateursadmin`.
 */

module.exports = {

  /**
   * Retrieve utilisateursadmin records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.utilisateursadmin.search(ctx.query);
    } else {
      return strapi.services.utilisateursadmin.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a utilisateursadmin record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.utilisateursadmin.fetch(ctx.params);
  },

  /**
   * Count utilisateursadmin records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.utilisateursadmin.count(ctx.query);
  },

  /**
   * Create a/an utilisateursadmin record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.utilisateursadmin.add(ctx.request.body);
  },

  /**
   * Update a/an utilisateursadmin record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.utilisateursadmin.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an utilisateursadmin record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.utilisateursadmin.remove(ctx.params);
  }
};
