'use strict';

/**
 * Programminglanguage.js controller
 *
 * @description: A set of functions called "actions" for managing `Programminglanguage`.
 */

module.exports = {

  /**
   * Retrieve programminglanguage records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.programminglanguage.search(ctx.query);
    } else {
      return strapi.services.programminglanguage.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a programminglanguage record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.programminglanguage.fetch(ctx.params);
  },

  /**
   * Count programminglanguage records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.programminglanguage.count(ctx.query);
  },

  /**
   * Create a/an programminglanguage record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.programminglanguage.add(ctx.request.body);
  },

  /**
   * Update a/an programminglanguage record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.programminglanguage.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an programminglanguage record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.programminglanguage.remove(ctx.params);
  }
};
