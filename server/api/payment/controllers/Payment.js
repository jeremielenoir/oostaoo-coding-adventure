'use strict';
/**
 * Payment.js controller
 *
 * @description: A set of functions called "actions" for managing `Payment`.
 */



const _ = require('lodash');


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
    try{
      console.log('CONTROLLER CREATE : ctx request body : ', ctx.request.body);

      const values = _.omit(ctx.request.body, ['paymentId', 'tests_available', 'test_already_available']);

      // to test datawriting failure and refund service
      // values.echec='echec';

      const result = await strapi.services.payment.add(values);

      const { user_id, offer_id } = values;
      const {test_already_available, tests_available} = ctx.request.body;
      const new_test_available = test_already_available + tests_available;

      if(result){
       await strapi.plugins['users-permissions']
       .services.user.edit({id: user_id}, {offer_id: offer_id, tests_available: new_test_available});
      }

      let user = await strapi.plugins['users-permissions'].services.user.fetch({id: user_id});
      user = {id: user_id, adminId: user.adminId, offer_id, tests_available};

      const jwt = await strapi.plugins['users-permissions'].services.jwt.issue(
          _.pick(user.toJSON ? user.toJSON() : user,
         ['_id', 'id', 'adminId', 'offer_id', 'tests_available']));

      return {result, jwt};

    }catch(err){
      console.log(`CREATE CONTROLLER : erreur d'écriture en base : `, err);

      // Payment Refund
      const refund = await strapi.services.payment.refund(ctx.request.body.paymentId);
      console.log(' CONTROLLER CREATE : refund : ', refund);
      return {refund: refund};
    }
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

  // charge: async (ctx, next) => {
  //   return strapi.services.payment.charge(ctx.request.body)
  //   .then(res =>  {
  //     console.log(res);
  //     return {
  //       status: res.status,
  //       amount: res.amount,
  //       capture: res.captured
  //     };
  //   })
  //   .catch(error => error)
  // },

  pay: async (ctx, next) => {
    const { periodicity } = ctx.request.body.offer;
    if(periodicity == 'unique'){
        return strapi.services.payment.charge(ctx.request.body);
    }else if(periodicity == 'monthly'){
        return strapi.services.payment.subscribe(ctx.request.body);
      }
   }
};
