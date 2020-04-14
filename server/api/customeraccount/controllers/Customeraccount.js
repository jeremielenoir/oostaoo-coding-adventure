'use strict';

/**
 * Customeraccount.js controller
 *
 * @description: A set of functions called "actions" for managing `Customeraccount`.
 */
const _ = require('lodash');
const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');

module.exports = {

  /**
   * Retrieve customeraccount records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.customeraccount.search(ctx.query);
    } else {
      return strapi.services.customeraccount.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a customeraccount record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.customeraccount.fetch(ctx.params);
  },

  /**
   * Count customeraccount records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.customeraccount.count(ctx.query);
  },

  /**
   * Create a/an customeraccount record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.customeraccount.add(ctx.request.body);
  },

  /**
   * Update a/an customeraccount record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.customeraccount.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an customeraccount record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.customeraccount.remove(ctx.params);
  },
  /**
   *
   */
  offerFind: async (ctx) => {

    const user = ctx.state.user;
    const account = user.customeraccount;
    const offer = account.offer;

    if (offer) {
      return strapi.services.customeraccount.retrieveSubscription(user, account, offer);
    } else {
      return strapi.services.customeraccount.retrieveTestsStock(user, account);
    }

  },
  /**
   * customeraccount.offer api
   */
  offerCreate: async (ctx) => {

    try {

      const { paymentMethod, paymentIntent } = ctx.request.body;

      // 0 - check first that account is not yet subscribed
      // if it's so, raise error cause it should be updated throw PUT endpoint
      const account = (await strapi.services.customeraccount.fetch({
        id: ctx.state.user.customeraccount.id
      })).toJSON();

      if (account.offer) {

        throw new Error('already subscribed');
      }

      let intent;
      if (paymentMethod) { // payment process started

        intent = await strapi.services.customeraccount.startPaymentIntent(
          ctx.request.body, account, ctx.state.user
        );

      } else if (paymentIntent) { // payment process to finalize

        intent = await strapi.services.customeraccount.finalizePaymentIntent(ctx.request.body);

      }

      // parse stripe intent response
      const parsedIntent = strapi.services.customeraccount.parsePaymentIntent(intent);

      strapi.log.info(`parsed intent for account ${account.id}`, parsedIntent);

      if (parsedIntent.done) {
        await strapi.services.customeraccount.onPaymentSucceed(intent, account, ctx.state.user);
      }

      ctx.send(parsedIntent);


    } catch (e) {
      strapi.log.error(e);
      ctx.status = e.status || 500;
      ctx.body = { status: 'error', message: { code: 'stripe_paiement', message: e.message } };
      ctx.app.emit('error', e, ctx);
    }

  },
  /**
   *
   */
  offerUpdate: async (ctx) => {

    // fetch needed datas
    let account = ctx.state.user.customeraccount;
    const offerId = ctx.request.body.offerId;

    // search for payments
    const payments = await strapi.services.payment.fetchAll({
      customeraccount: account.id,
      offer: account.offer,
      _sort: 'paied_at:DESC'
    });

    let payment;

    if (payments.length === 0) {
      // recover missing payment row
      // reconstritute from stripe data

    } else {
      payment = payments.toArray()[0].toJSON();
    }

    let offer = await strapi.services.offer.fetch({ id: offerId });
    offer = offer.toJSON();

    const subscription = await stripe.subscriptions.retrieve(payment.stripe_subscription_id);
    await stripe.subscriptions.update(payment.stripe_subscription_id, {
      cancel_at_period_end: false,
      items: [{
        id: subscription.items.data[0].id,
        plan: offer.plan,
      }]
    });

    account = await strapi.services.customeraccount.edit({ id: account.id }, { offer: offer.id });
    await strapi.services.payment.edit({ id: payment.id }, { amount: parseInt(offer.price) });

    return { account };
  },
  /**
   *
   */
  offerDestroy: async (ctx) => {
    try {

      const account = ctx.state.user.customeraccount;
      const offer = await strapi.services.offer.fetch({ id: account.offer });

      if (!offer || offer.get('periodicity') !== 'monthly') {
        ctx.badRequest(null, [{ messages: [{ id: 'No subscription to cancel' }] }]);
        return;
      }

      // fetch the payment to cancel
      const payments = await strapi.services.payment.fetchAll({ offer: offer.id, _sort: 'paied_at:DESC' });

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
        .edit({ id: account.id }, { offer: null, tests_stock: 0 });

      ctx.send('{"status":"ok"}');

    } catch (e) {
      console.log(e);
      ctx.status = e.status || 500;
      ctx.body = { status: 'error', message: { code: 'stripe_paiement', message: e.message } };
      ctx.app.emit('error', e, ctx);
    }
  },
  /**
   *
   */
  accountToPro: async (ctx) => {

  },
  /**
   *
   */
  userUpdate: async (ctx) => {

    const accountId = ctx.state.user.customeraccount.id;
    const userIdToEnable = ctx.request.params.idusr;

    const userFromDb = await strapi.plugins['users-permissions'].services
      .user.fetch({ id: userIdToEnable });

    if (userFromDb.customeraccount.id === accountId) {

      return await strapi.plugins['users-permissions'].services
        .user.edit({ id: userIdToEnable }, ctx.request.body);

    } else {
      ctx.status = 500;
      ctx.body = { status: 'error', message: { code: 'error', message: 'fail to update user' } };
    }

  },
  /**
   *
   */
  userFind: async (ctx) => {

    let users = [];
    let account = ctx.state.user.customeraccount;

    const results = await strapi.plugins['users-permissions']
      .services.user.fetchAll({ customeraccount: account.id });

    results
      .forEach(u => {
        users.push(_.omit(u.toJSON ? u.toJSON() : u, ['password', 'resetPasswordToken']));
      });

    return users;
  },
  /**
   *
   */
  userCreate: async (ctx) => {

    try {

      const account = ctx.state.user.customeraccount;

      if (ctx.state.user.role.type !== 'account_admin') {
        return ctx.forbidden(null, 'Action interdite.');
      }

      const advanced = await strapi.store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced'
      }).get();

      if (advanced.unique_email && ctx.request.body.email) {
        const users = await strapi.plugins['users-permissions']
          .services.user.fetchAll({ email: ctx.request.body.email });

        if (users && users.length > 0) {
          return ctx.badRequest(null, ctx.request.admin ?
            [{ messages: [{ id: 'Auth.form.error.email.taken', field: ['email'] }] }] :
            'Email is already taken.');
        }
      }

      if (!ctx.request.body.role) {
        const defaultRole = await strapi.plugins['users-permissions'].services.role
          .fetch({ type: advanced.default_role }, []);

        ctx.request.body.role = defaultRole._id || defaultRole.id;
      }

      ctx.request.body.provider = 'local';
      ctx.request.body.customeraccount = account.id;

      const data = await strapi.plugins['users-permissions'].services.user
        .add(ctx.request.body);

      // Send 201 `created`
      ctx.created({ data });

    } catch (error) {
      console.error(error);
      ctx.badRequest(null, ctx.request.admin ?
        [{ messages: [{ id: error.message, field: error.field }] }] :
        error.message);
    }
  },
  /**
   *
   */
  userDestroy: async (ctx) => {

    const accountId = ctx.state.user.customeraccount.id;
    const userToRemoveId = ctx.request.params.idusr;

    const userFromDb = await strapi.plugins['users-permissions'].services
      .user.fetch({ id: userToRemoveId });

    if (userFromDb.customeraccount.id === accountId) {
      return await strapi.plugins['users-permissions'].services
        .user.edit({ id: userToRemoveId }, { blocked: true });

    } else {
      ctx.status = 500;
      ctx.body = { status: 'error', message: { code: 'error', message: 'fail to remove user' } };
    }

  }
};
