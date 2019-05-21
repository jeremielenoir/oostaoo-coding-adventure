'use strict';

/**
 * Usercodingame.js controller
 *
 * @description: A set of functions called "actions" for managing `Usercodingame`.
 */

module.exports = {

  /**
   * Retrieve usercodingame records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.usercodingame.search(ctx.query);
    } else {
      return strapi.services.usercodingame.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a usercodingame record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.usercodingame.fetch(ctx.params);
  },

  /**
   * Count usercodingame records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.usercodingame.count(ctx.query);
  },

  /**
   * Create a/an usercodingame record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.usercodingame.add(ctx.request.body);
  },

  /**
   * Update a/an usercodingame record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.usercodingame.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an usercodingame record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.usercodingame.remove(ctx.params);
  }
};
