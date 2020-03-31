'use strict';
/**
 *
 */
const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');
/**
 *
 */
module.exports = {
  /**
   *
   */
  unsubscribe: async (ctx) => {
    try {

      const account = ctx.state.user.customeraccount;
      const offer = await strapi.services.offer.fetch({id: account.offer});

      if (!offer || offer.get('periodicity') !== 'monthly') {
        ctx.badRequest(null, [{ messages: [{ id: 'No subscription to cancel' }] }]);
        return;
      }

      // fetch the payment to cancel
      const payments = await strapi.services.payment.fetchAll({offer: offer.id, _sort: 'paied_at:DESC'});

      if (!payments || payments.length === 0) {
        // TODO use stripe api to fetch payment for user even if not registred in database
        ctx.badRequest(null, [{ messages: [{ id: 'No payment found for subscription' }] }]);
        return;
      }

      const payment = payments.toJSON()[0];

      // cancel payment
      await stripe.subscriptions.del(payment.stripe_subscription_id);

      // update account
      await strapi.services.customeraccount
        .edit({id: account.id}, {offer: null, tests_stock: 0});

      ctx.send('{"status":"ok"}');

    } catch (e) {
      console.log(e);
      ctx.status = e.status || 500;
      ctx.body = {status: 'error', message: {code: 'stripe_paiement', message: e.message}};
      ctx.app.emit('error', e, ctx);
    }
  }
};
