'use strict';

/**
 * Address.js controller
 *
 * @description: A set of functions called "actions" for managing `Address`.
 */

module.exports = {

  /**
   * Retrieve address records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.address.search(ctx.query);
    } else {
      return strapi.services.address.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a address record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.address.fetch(ctx.params);
  },

  /**
   * Count address records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.address.count(ctx.query);
  },

  /**
   * Create a/an address record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const address = await strapi.services.address.add(ctx.request.body);
    await strapi.services.customeraccount.edit({
      id: ctx.state.user.customeraccount.id
    }, {
      billing_address: address.id
    }) ;
    return address;
  },

  /**
   * Update a/an address record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.address.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an address record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.address.remove(ctx.params);
  }
};
