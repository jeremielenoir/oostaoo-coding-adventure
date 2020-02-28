'use strict';

/**
 * Feedback.js controller
 *
 * @description: A set of functions called "actions" for managing `Feedback`.
 */

module.exports = {

  /**
   * Retrieve feedback records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.feedback.search(ctx.query);
    } else {
      return strapi.services.feedback.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a feedback record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.feedback.fetch(ctx.params);
  },

  /**
   * Count feedback records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.feedback.count(ctx.query);
  },

  /**
   * Create a/an feedback record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.feedback.add(ctx.request.body);
  },

  /**
   * Update a/an feedback record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.feedback.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an feedback record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.feedback.remove(ctx.params);
  }
};
