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
      if (offer.get('periodicity') == 'unique') {
        paymentResult = await paymentServiceExtension.charge(userEmail, paymentToken.id, offer.get('price'));
      } else if (offer.get('periodicity') == 'monthly') {
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
        email: userEmail,
        offer_id: offer.get('id'),
        offer_nom: offer.get('title'),
        user_id: ctx.state.user.id,
        user: ctx.state.user.username,
        username: ctx.state.user.username,
        date_payment: new Date().getTime()
      });

      if (!paymentRow) {
        throw new Error('Un problème technique est survenu');
      }

      // 3 - update user tests stock
      let new_tests_stock = -1;
      if (parseInt(offer.get('tests_stock')) !== -1) {
        new_tests_stock = parseInt(offer.get('tests_stock')) + ctx.state.user.tests_available;
      }

      let user = await strapi.plugins['users-permissions']
        .services.user.edit(
          { id: ctx.state.user.id },
          { offer_id: offer.get('id'), tests_available: new_tests_stock }
        );

      // 4 - recreate token based on new offer
      const jwt = await strapi.plugins['users-permissions'].services.jwt.issue(
        lodash.pick(user.toJSON ? user.toJSON() : user, ['_id', 'id', 'adminId', 'offer_id', 'tests_available']));

      return { newToken: jwt };

    } catch (e) {
      console.error(e);
      if (paimentDone) { // refund
        const refund = await paymentServiceExtension.refund(ctx.request.body.paymentToken.id);
        console.warn('customer get refund after payment failure', ctx.state.user.id);
        return { refund: refund };
      }
    }

  }
};

