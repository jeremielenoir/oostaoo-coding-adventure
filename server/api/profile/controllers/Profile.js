'use strict';

/**
 * Profile.js controller
 *
 * @description: A set of functions called "actions" for managing `Profile`.
 */

module.exports = {

  /**
   * Retrieve profile records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.profile.search(ctx.query);
    } else {
      return strapi.services.profile.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a profile record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.profile.fetch(ctx.params);
  },

  /**
   * Count profile records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.profile.count(ctx.query);
  },

  /**
   * Create a/an profile record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.profile.add(ctx.request.body);
  },

  /**
   * Update a/an profile record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.profile.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an profile record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.profile.remove(ctx.params);
  }
};
