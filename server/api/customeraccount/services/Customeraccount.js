/* global Customeraccount */
'use strict';

/**
 * Customeraccount.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all customeraccounts.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Customeraccount.query(function (qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value) && where.symbol !== 'IN' && where.symbol !== 'NOT IN') {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: filters.populate || populate
    });
  },

  /**
   * Promise to fetch a/an customeraccount.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Customeraccount.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an customeraccount.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);

    return Customeraccount.query(function (qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value]);
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an customeraccount.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Customeraccount.associations.map(ast => ast.alias));
    const data = _.omit(values, Customeraccount.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Customeraccount.forge(data).save();

    // Create relational data and return the entry.
    return Customeraccount.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an customeraccount.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Customeraccount.associations.map(ast => ast.alias));
    const data = _.omit(values, Customeraccount.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Customeraccount.forge(params).save(data);

    // Create relational data and return the entry.
    return Customeraccount.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an customeraccount.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    params.values = {};
    Customeraccount.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Customeraccount.updateRelations(params);

    return Customeraccount.forge(params).destroy();
  },

  /**
   * Promise to search a/an customeraccount.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('customeraccount', params);
    // Select field to populate.
    const populate = Customeraccount.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Customeraccount.associations.map(x => x.alias);
    const searchText = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Customeraccount._attributes[attribute].type));

    const searchNoText = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Customeraccount._attributes[attribute].type));

    const searchInt = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Customeraccount._attributes[attribute].type));

    const searchBool = Object.keys(Customeraccount._attributes)
      .filter(attribute => attribute !== Customeraccount.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Customeraccount._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Customeraccount.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Customeraccount.client) {
        case 'mysql':
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      withRelated: populate
    });
  },
  /**
   *
   */
  refund: async (paymentId) => {

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

      // check if user already registred
      let customer = await stripe.customers.list({ email: email, limit: 1 });

      if (!customer) {
        // if not yet create it
        customer = await stripe.customers.create({
          email: email,
          source: paymentToken
        });
      }

      // charge the customer
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

      // check if user already registred
      let customer = await stripe.customers.list({ email: email, limit: 1 });

      if (!customer) {
        // if not yet create it
        customer = await stripe.customers.create({
          email: email,
          source: paymentToken
        });
      }

      // search for active subscription
      let subscription = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active', // TODO how to handle other status
        collection_method: 'charge_automatically',
        limit: 1
      });

      // prevent user for double subscription
      // it may be an upgrade/downgrade, but it must be treated by change_offer endpoint
      if (subscription) {
        throw new Error('You are already subscribed to an offer');
      }

      // all fine, then create the subscription
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
  },
  /**
   *
   * @param {*} paymentData
   * @param {*} account
   */
  startPaymentIntent: async (paymentData, account, user) => {

    const { offerId, receiptEmail, paymentMethod } = paymentData;
    const offer = (await strapi.services.offer.fetch({ id: offerId })).toJSON();

    if (!account.stripe_customer_id) {

      // create stripe customer if not exists
      const customerName = account.entreprise ? account.entreprise.nom : (user.prenom + ' ' + user.nom);
      const phone = account.entreprise ? account.entreprise.tel : (user.tel ? user.tel : user.mobile);
      const email = account.entreprise ? account.entreprise.email : user.email;

      let customer = await stripe.customers.list({email: email, limit: 1});

      if (customer.error) {

        strapi.log.error(customer.error);
        throw new Error(customer.error.message);

      } else if (customer.data.length === 0) {

        customer = await stripe.customers.create({
          // address: account.billing_address,
          email: email,
          name: customerName,
          invoice_settings: {
            default_payment_method: paymentMethod
          },
          phone: phone
          /*,
          shipping: {
            address: account.billing_address,
            name: customerName,
            phone: phone
          }*/
        });

        if (customer.error) {
          strapi.log.error(customer.error);
          throw new Error(customer.error.message);
        }

        account.stripe_customer_id = customer.id;
        await strapi.services.customeraccount.edit({ id: account.id }, { stripe_customer_id: customer.id });

        strapi.log.info(`customer created to stripe ${customer.id} for account ${account.id}`);

      } else {

        customer = customer.data[0];
        strapi.log.info(`customer retrieved from stripe ${customer.id} for account ${account.id}`);

      }

    }

    await stripe.paymentMethods.attach(paymentMethod, {customer: account.stripe_customer_id});

    strapi.log.info('payment method attached to customer');

    let subscription;
    let intent;
    if (offer.periodicity === 'monthly') {

      subscription = await stripe.subscriptions.create({
        customer: account.stripe_customer_id,
        default_payment_method: paymentMethod,
        items: [{ plan: offer.plan }],
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          offer: offer.id,
          account: account.id,
          user: user.id
        }
      });

      if (subscription.error) {
        strapi.log.error(subscription.error);
        throw new Error(subscription.error.message);
      }

      const { latest_invoice } = subscription;
      const { payment_intent } = latest_invoice;

      intent = await stripe.paymentIntents.update(payment_intent.id, {
        metadata: {
          offer: offer.id,
          account: account.id,
          user: user.id
        }
      });

      strapi.log.info(`subscription created to stripe ${subscription.id} for account ${account.id}`);
      strapi.log.info(`intent created to stripe ${intent.id} for account ${account.id}`);

    } else {

      intent = await stripe.paymentIntents.create({
        customer: account.stripe_customer_id,
        description: 'buy offer ' + offer.description,
        amount: offer.price * 100,
        currency: 'EUR',
        receipt_email: receiptEmail,
        payment_method: paymentMethod,
        confirmation_method: 'manual',
        confirm: true,
        use_stripe_sdk: true,
        metadata: {
          offer: offer.id,
          account: account.id,
          user: user.id
        }
      });

      if (intent.error) {
        strapi.log.error(intent.error);
        throw new Error(intent.error.message);
      }

      strapi.log.info(`intent created to stripe ${intent.id} for account ${account.id}`);

    }

    return intent;

  },
  /**
   *
   */
  finalizePaymentIntent: async (paymentData) => {
    const { paymentIntent } = paymentData;
    const intent = await stripe.paymentIntents.confirm(paymentIntent);
    console.log(`intent confirmed to stripe ${intent.id}`);
    return intent;
  },
  /**
   *
   */
  onPaymentSucceed: async (intent, account, user) => {

    try {

      const offer = (await strapi.services.offer.fetch({ id: intent.metadata.offer })).toJSON();

      // 2 - add payment row
      const payment = await strapi.services.payment.add({
        amount: offer.price,
        user: user.id,
        offer: offer.id,
        paied_at: new Date(),
        stripe_payment_intent: intent.id,
        customeraccount: account.id
      });
      console.log(`payment created ${payment.id}`);

      // 3 - update user tests stock
      let new_tests_stock = -1;
      if (parseInt(offer.tests_stock) !== -1) {
        new_tests_stock = parseInt(offer.tests_stock) + account.tests_stock;
      }

      await strapi.services.customeraccount.edit(
        { id: account.id },
        { offer: offer.id, tests_stock: new_tests_stock }
      );
      console.log(`account ${account.id} updated with new offer: id:${offer.id}, tests_stock:${new_tests_stock}`);

      // temp code until dev fetch offer info from account rather than user
      await strapi.plugins['users-permissions'].services.user.edit(
        { id: user.id },
        { offer_id: offer.id, offer: offer.id, tests_available: new_tests_stock}
      );
      console.log(`user ${user.id} updated with new offer: id:${offer.id}, tests_stock:${new_tests_stock}`);

    } catch (e) {
      console.error('paiement was success but couldn\'t update account with new offer\n' +
       `account:${account.id}, user:${user.id}`, e);
    }
  },
  /**
   *
   */
  parsePaymentIntent: (intent) => {
    // Generate a response based on the intent's status
    switch (intent.status) {
      case 'requires_action':
      case 'requires_source_action':
        // Card requires authentication
        return {
          requiresAction: true,
          clientSecret: intent.client_secret
        };
      case 'requires_payment_method':
      case 'requires_source':
        // Card was not properly authenticated, suggest a new payment method
        return {
          error: 'Votre carte a été rejetée. Merci d\'utiliser un autre moyen de paiement'
        };
      case 'succeeded':
        // Payment is complete, authentication not required
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
        console.log('💰 Payment received!');
        return { done: true, clientSecret: intent.client_secret };
    }
  },
  /**
   *
   */
  retrieveSubscription: async (user, account, offer) => {

    const payments = (await strapi.services.payment.fetchAll({
      customeraccount: account.id,
      _sort: 'id:DESC'
    })).toJSON();

    const { charges } = await stripe.paymentIntents.retrieve(payments[0].stripe_payment_intent);
    const { card } = await stripe.paymentMethods.retrieve(charges.data[0].payment_method);
    const sub = await stripe.subscriptions.list({
      limit: 1,
      customer: account.stripe_customer_id
    });

    return {
      offer: offer,
      card: {
        last4: card.last4,
        exp_month: card.exp_month,
        exp_year: card.exp_year
      },
      sub: {
        cancel_at_period_end: sub.data[0].cancel_at_period_end,
        cancel_at: sub.data[0].cancel_at,
        current_period_start: sub.data[0].current_period_start,
        current_period_end: sub.data[0].current_period_end,
        status: sub.data[0].status,
        created: sub.data[0].created,
        ended_at: sub.data[0].ended_at
      }
    };

  },
  /**
   *
   */
  retrieveTestsStock: async (user, account) => {
  },
  /**
   *
   */
  repairAccountOffer: async (account) => {
    let subscriptionParams= {
     // customer: account.stripe_customer_id,
      limit: 1
    }

    if ( account && account.stripe_customer_id){
      subscriptionParams.customer = account.stripe_customer_id
    }
    const subscriptions = await stripe.subscriptions.list(subscriptionParams);
    if (subscriptions && subscriptions.data[0]) {
      const subscription = await stripe.subscriptions.retrieve(subscriptions.data[0].id);
      if (subscription) {
        // read repair
        if (subscription.status === 'active' && !account.offer) {
          const offs = (await strapi.services.offer.fetchAll({ plan: subscription.plan.id })).toJSON();
          await strapi.services.customeraccount.edit({ id: account.id }, { offer: offs[0].id });
        }
      }
    }
  }
};
