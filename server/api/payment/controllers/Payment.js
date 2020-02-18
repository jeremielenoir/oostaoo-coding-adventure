'use strict';

/**
 * Payment.js controller
 *
 * @description: A set of functions called "actions" for managing `Payment`.
 */

module.exports = {

  /**
   * Retrieve payment records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.payment.search(ctx.query);
    } else {
      return strapi.services.payment.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a payment record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.payment.fetch(ctx.params);
  },

  /**
   * Count payment records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.payment.count(ctx.query);
  },

  /**
   * Create a/an payment record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.payment.add(ctx.request.body);
  },

  /**
   * Update a/an payment record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.payment.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an payment record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.payment.remove(ctx.params);
  },

  charge: async (ctx, next) => {
    return strapi.services.payment.charge(ctx.request.body)
    .then(res =>  {
      console.log(res);
      return {
        status: res.status,
        amount: res.amount,
        capture: res.captured
      };
    })
    .catch(error => error)
  },

  subscribe: async (ctx, next) => {
    console.log('subscribe coontroller')
    return strapi.services.payment.subscribe(ctx.request.body)
    .then(res =>  {
      console.log(res);
      // return {
      //   status: res.status,
      //   amount: res.amount,
      //   capture: res.captured
      // };
      return res;
    })
    .catch(error => error)
  },
};
