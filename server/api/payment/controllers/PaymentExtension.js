'use strict';
const lodash = require('lodash');
const offerServiceDefault = require('../../offer/services/Offer');
const paymentServiceExtension = require('../services/PaymentExtension');
/**
 *
 */
module.exports = {
  /**
   *
   */
  finalize: async (ctx, next) => {

    let paimentDone = false;
    try {

      // 1 - realize payment on stripe
      const userEmail = ctx.state.user.email;
      const offer = await offerServiceDefault.fetch({ id: ctx.request.body.offer });
      const paymentToken = ctx.request.body.paymentToken;

      let paymentResult;
      if (offer.get('periodicity') === 'unique') {
        paymentResult = await paymentServiceExtension.charge(userEmail, paymentToken.id, offer.get('price'));
      } else if (offer.get('periodicity') === 'monthly') {
        paymentResult = await paymentServiceExtension.subscribe(userEmail, paymentToken.id, offer.get('plan'));
      } else {
        throw new Error('Pas de paiment requis');
      }

      if (!paymentResult.status || !(paymentResult.status === 'succeeded' || 'active')) {
        throw new Error('Un problème technique est survenu');
      }

      paimentDone = true;

      // 2 - add payment row
      const paymentRow = await strapi.services.payment.add({
        amount: offer.get('price'),
        user: ctx.state.user.id,
        offer: offer.get('id'),
        paied_at: new Date(),
        stripe_customer_id: paymentResult.customer,
        stripe_token_id: paymentToken.id,
        stripe_charge_id: offer.get('periodicity') !== 'monthly' ? paymentResult.id : null,
        stripe_subscription_id: offer.get('periodicity') === 'monthly' ? paymentResult.id : null,
        customeraccount: ctx.state.user.customeraccount.id
      });

      if (!paymentRow) {
        throw new Error('Un problème technique est survenu');
      }

      // 3 - update user tests stock
      let new_tests_stock = -1;
      if (parseInt(offer.get('tests_stock')) !== -1) {
        new_tests_stock = parseInt(offer.get('tests_stock')) + ctx.state.user.customeraccount.tests_stock;
      }

      let user = await strapi.services.customeraccount.edit(
        { id: ctx.state.user.customeraccount.id },
        { offer: offer.get('id'), tests_stock: new_tests_stock }
      );

      // 4 - recreate token based on new offer
      const jwt = await strapi.plugins['users-permissions'].services.jwt.issue(
        lodash.pick(user.toJSON ? user.toJSON() : user, ['_id', 'id', 'adminId', 'offer_id', 'tests_available']));

      return { newToken: jwt };

    } catch (e) {
      if (paimentDone) { // refund
        // const refund =
        await paymentServiceExtension.refund(ctx.request.body.paymentToken.id);
        console.warn('customer get refund after payment failure', ctx.state.user.id);
        // TODO handle refund
        // { refund: refund };
      }
      ctx.status = e.status || 500;
      ctx.body = {status: 'error', message: {code: 'stripe_paiement', message: e.message}};
      ctx.app.emit('error', e, ctx);
    }

  }
};

