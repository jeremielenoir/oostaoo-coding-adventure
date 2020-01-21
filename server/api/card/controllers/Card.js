'use strict';

/**
 * Card.js controller
 *
 * @description: A set of functions called "actions" for managing `Card`.
 */

module.exports = {

  /**
   * Retrieve card records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.card.search(ctx.query);
    } else {
      return strapi.services.card.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a card record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.card.fetch(ctx.params);
  },

  /**
   * Count card records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.card.count(ctx.query);
  },

  /**
   * Create a/an card record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.card.add(ctx.request.body);
  },

  /**
   * Update a/an card record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.card.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an card record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.card.remove(ctx.params);
  }
};
