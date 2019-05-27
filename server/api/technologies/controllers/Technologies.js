'use strict';

/**
 * Technologies.js controller
 *
 * @description: A set of functions called "actions" for managing `Technologies`.
 */

module.exports = {

  /**
   * Retrieve technologies records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.technologies.search(ctx.query);
    } else {
      return strapi.services.technologies.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a technologies record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.technologies.fetch(ctx.params);
  },

  /**
   * Count technologies records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.technologies.count(ctx.query);
  },

  /**
   * Create a/an technologies record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.technologies.add(ctx.request.body);
  },

  /**
   * Update a/an technologies record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.technologies.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an technologies record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.technologies.remove(ctx.params);
  }
};
