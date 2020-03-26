'use strict';

const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');

module.exports = {
  /**
   *
   */
  refund: async (paymentId) => {
    console.log('SERVICE REFUND : paymentId : ', paymentId);
    let refund;
    const paymentType = paymentId.substring(0, 2);
    if (paymentType == 'ch') {
      refund = await stripe.refunds.create({
        charge: paymentId
      });
    } else if (paymentType == 'su') {
      refund = await stripe.subscriptions.del(paymentId);
    }
    return refund;
  },
  /**
   *
   */
  charge: async (email, paymentToken, amount) => {
    try {

      const customer = await stripe.customers.create({
        email: email,
        source: paymentToken
      });

      return await stripe.charges.create({
        amount: amount * 100,
        currency: 'EUR',
        customer: customer.id
      });

    } catch (error) {
      console.log('error : ', error);
      return error;
    }
  },
  /**
   *
   */
  subscribe: async (email, paymentToken, plan) => {
    try {

      const customer = await stripe.customers.create({
        email: email,
        source: paymentToken
      });

      return await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          plan: plan
        }]
      });

    } catch (error) {
      console.log('error : ', error);
      return error;
    }
  }
};
