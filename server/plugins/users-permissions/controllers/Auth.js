'use strict';

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require('crypto');
const _ = require('lodash');
const stripe = require('stripe')('sk_test_SHGN7PIdottD4WBLCcdSfbwA00kPGubvOC');
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
  callback: async (ctx) => {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    if (provider === 'local') {
      if (
        !_.get(await store.get({ key: 'grant' }), 'email.enabled') &&
        !ctx.request.admin
      ) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.email.provide' }] }]
            : 'Please provide your username or your e-mail.',
        );
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.password.provide' }] }]
            : 'Please provide your password.',
        );
      }

      const query = {};

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne(query, ['role']);

      if (!user) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.invalid' }] }]
            : 'Identifier or password invalid.',
        );
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        !user.confirmed
      ) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.confirmed' }] }]
            : 'Your account email is not confirmed.',
        );
      }

      if (user.blocked) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.blocked' }] }]
            : 'Your account has been blocked by the administrator.',
        );
      }

      if (user.role.type !== 'root' && ctx.request.admin) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.noAdminAccess' }] }]
            : "You're not an administrator.",
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.password.local' }] }]
            : 'This user never set a local password, please login thanks to the provider used during account creation.',
        );
      }

      const validPassword = strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password);

      if (!validPassword) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.invalid' }] }]
            : 'Identifier or password invalid.',
        );
      } else {
        ctx.send({
          jwt: strapi.plugins['users-permissions'].services.jwt.issue(
            _.pick(user.toJSON ? user.toJSON() : user, [
              '_id',
              'id',
              'adminId',
              'offer_id',
              'tests_available',
              'customeraccount',
              'entreprise',
            ]),
          ),
          user: _.omit(user.toJSON ? user.toJSON() : user, [
            'password',
            'resetPasswordToken',
          ]),
        });

        // Re credited the test stocks if the current subscription is active
        const account = (
          await strapi.services.customeraccount.fetch({
            id: user.customeraccount,
          })
        ).toJSON();

        let subscription = await stripe.subscriptions.list({
          customer: account.stripe_customer_id,
          status: 'active',
          collection_method: 'charge_automatically',
          limit: 1,
        });

        if (!subscription.data[0]) {
          console.error('no subscription found');
        } else {
          let dateCancelSubscription = new Date(
            subscription.data[0].current_period_end * 1000,
          );

          let newTestsStock =
            parseInt(account.tests_stock) + parseInt(account.offer.tests_stock);
  
          if (
            !subscription.data[0] &&
            !subscription.data[0].cancel_at_period_end &&
            account.offer.tests_stock !== -1 &&
            new Date() > dateCancelSubscription
          ) {
            console.log('re-credit tests stock monthly subscription');
            await strapi.services.customeraccount.edit(
              {
                id: user.customeraccount,
              },
              {
                tests_stock: newTestsStock,
              },
            );
          }
        }
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest(null, 'This provider is disabled.');
      }

      // Connect the user thanks to the third-party provider.
      let user, error;

      try {
        [user] = await strapi.plugins[
          'users-permissions'
        ].services.providers.connect(provider, ctx.query);
      } catch (error) {
        // redirect user with error message
        //return ctx.response.redirect(`/home/register?error=${error}`);
        return ctx.badRequest(
          null,
          error === 'array'
            ? ctx.request.admin
              ? error[0]
              : error[1]
            : error.message,
        );
      }

      if (!user) {
        return ctx.badRequest(
          null,
          error === 'array' ? (ctx.request.admin ? error[0] : error[1]) : error,
        );
      }
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
        _.pick(user, ['_id', 'id', 'adminId']),
      );
      return ctx.response.redirect(`/home/register?jwt=${jwt}`);
    }
  },

  changePassword: async (ctx) => {
    const params = _.assign({}, ctx.request.body, ctx.params);

    if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const user = await strapi
        .query('user', 'users-permissions')
        .findOne({ resetPasswordToken: params.code });

      if (!user) {
        return ctx.badRequest(
          null,
          ctx.request.admin
            ? [{ messages: [{ id: 'Auth.form.error.code.provide' }] }]
            : 'Incorrect code provided.',
        );
      }

      // Delete the current code
      user.resetPasswordToken = null;

      user.password = await strapi.plugins[
        'users-permissions'
      ].services.user.hashPassword(params);

      // Remove relations data to update user password.
      const data = _.omit(
        user,
        strapi.plugins['users-permissions'].models.user.associations.map(
          (ast) => ast.alias,
        ),
      );

      // Update the user.
      await strapi.query('user', 'users-permissions').update(data);

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue(
          _.pick(user.toJSON ? user.toJSON() : user, ['_id', 'id']),
        ),
        user: _.omit(user.toJSON ? user.toJSON() : user, [
          'password',
          'resetPasswordToken',
        ]),
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.password.matching' }] }]
          : 'Passwords do not match.',
      );
    } else {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.params.provide' }] }]
          : 'Incorrect params provided.',
      );
    }
  },

  connect: async (ctx, next) => {
    const grantConfig = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'grant',
      })
      .get();

    const [protocol, host] = strapi.config.url.split('://');
    _.defaultsDeep(grantConfig, { server: { protocol, host } });
    const provider =
      process.platform === 'win32'
        ? ctx.request.url.split('\\')[2].split('?')[0]
        : ctx.request.url.split('/')[2].split('?')[0];

    const config = grantConfig[provider];

    if (!_.get(config, 'enabled')) {
      return ctx.badRequest(null, 'This provider is disabled.');
    }
    const grant = require('grant-koa');
    const g = grant(grantConfig);

    g.config.facebook.redirect_uri = config.callback;
    g.config.google.redirect_uri = config.callback;
    ctx.query.code = ctx.query.code && ctx.query.code.replace('\\', '/'); // ADD THIS LINE
    return g(ctx, next);
  },

  forgotPassword: async (ctx) => {
    const { email, url } = ctx.request.body;

    // Find the user user thanks to his email.
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ email });

    // User not found.
    if (!user) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.user.not-exist' }] }]
          : 'This email does not exist.',
      );
    }

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex');

    // Set the property code.
    user.resetPasswordToken = resetPasswordToken;

    const settings = (
      await strapi
        .store({
          environment: '',
          type: 'plugin',
          name: 'users-permissions',
        })
        .get({ key: 'email' })
    )['reset_password'].options;

    settings.message = await strapi.plugins[
      'users-permissions'
    ].services.userspermissions.template(settings.message, {
      URL: url,
      USER: _.omit(user.toJSON ? user.toJSON() : user, [
        'password',
        'resetPasswordToken',
        'role',
        'provider',
      ]),
      TOKEN: resetPasswordToken,
    });

    settings.object = await strapi.plugins[
      'users-permissions'
    ].services.userspermissions.template(settings.object, {
      USER: _.omit(user.toJSON ? user.toJSON() : user, [
        'password',
        'resetPasswordToken',
        'role',
        'provider',
      ]),
    });

    try {
      // Send an email to the user.
      await strapi.plugins['email'].services.email.send({
        to: user.email,
        from:
          settings.from.email || settings.from.name
            ? `"${settings.from.name}" <${settings.from.email}>`
            : undefined,
        replyTo: settings.response_email,
        subject: settings.object,
        text: settings.message,
        html: settings.message,
      });
    } catch (err) {
      return ctx.badRequest(null, err, 'erreursameres');
    }

    // Remove relations data to update user code.
    const data = _.omit(
      user,
      strapi.plugins['users-permissions'].models.user.associations.map(
        (ast) => ast.alias,
      ),
    );

    // Update the user.
    await strapi.query('user', 'users-permissions').update(data);

    ctx.send({ ok: true });
  },

  register: async (ctx) => {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const settings = await pluginStore.get({
      key: 'advanced',
    });

    if (!settings.allow_register) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.advanced.allow_register' }] }]
          : 'Register action is currently disabled.',
      );
    }

    const params = _.assign(ctx.request.body, {
      provider: 'local',
    });

    // Password is required.
    if (!params.password) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.password.provide' }] }]
          : 'Please provide your password.',
      );
    }

    // Email is required.
    if (!params.email) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.email.provide' }] }]
          : 'Please provide your email.',
      );
    }

    // Throw an error if the password selected by the user
    // contains more than two times the symbol '$'.
    if (
      strapi.plugins['users-permissions'].services.user.isHashed(
        params.password,
      )
    ) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.password.format' }] }]
          : 'Your password cannot contain more than three times the symbol `$`.',
      );
    }

    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ type: 'account_admin' }, []);

    if (!role) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.role.notFound' }] }]
          : 'Impossible to find the default account role.',
      );
    }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email.toLowerCase());

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.email.formatd' }] }]
          : 'Please provide valid email address.',
      );
    }

    params.role = role.id || role._id;
    params.password = await strapi.plugins[
      'users-permissions'
    ].services.user.hashPassword(params);

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    });

    if (user && user.provider === params.provider) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.email.taken' }] }]
          : 'Email is already taken.',
      );
    }

    if (user && user.provider !== params.provider && settings.unique_email) {
      return ctx.badRequest(
        null,
        ctx.request.admin
          ? [{ messages: [{ id: 'Auth.form.error.email.taken' }] }]
          : 'Email is already taken.',
      );
    }

    try {
      if (!settings.email_confirmation) {
        params.confirmed = true;
      }

      // by default, every new registered user has a free offer (id: 14)
      // and 0 available tests
      // params.offer_id = 14;
      // params.tests_available = 0;

      let user = await strapi.query('user', 'users-permissions').create(params);

      // add offer
      const offer = await strapi.services.offer.fetch({ title: 'Gratuit' });
      console.log('offer', offer);
      const newCustomer = await stripe.customers.create({
        email: params.email,
      });

      
      const account = await strapi.services.customeraccount.add({
        type: params.accountType || 'personal',
        stripe_customer_id: newCustomer.id,
        offer: { id: offer.attributes.id },
        tests_stock: offer.attributes.tests_stock,
      });
      console.log('customer account', account.attributes);

      await strapi.plugins['users-permissions'].services.user.edit(
        _.pick(user, ['_id', 'id']),
        { customeraccount: account.attributes.id },
      );

      const jwt = strapi.plugins['users-permissions'].services.jwt.issue(
        _.pick(user.toJSON ? user.toJSON() : user, ['id', '_id']),
      );

      if (settings.email_confirmation) {
        const storeEmail =
          (await pluginStore.get({
            key: 'email',
          })) || {};

        const settings = storeEmail['email_confirmation']
          ? storeEmail['email_confirmation'].options
          : {};

        settings.message = await strapi.plugins[
          'users-permissions'
        ].services.userspermissions.template(settings.message, {
          URL: new URL(
            '/auth/email-confirmation',
            strapi.config.url,
          ).toString(),
          USER: _.omit(user.toJSON ? user.toJSON() : user, [
            'password',
            'resetPasswordToken',
            'role',
            'provider',
          ]),
          CODE: jwt,
        });

        settings.object = await strapi.plugins[
          'users-permissions'
        ].services.userspermissions.template(settings.object, {
          USER: _.omit(user.toJSON ? user.toJSON() : user, [
            'password',
            'resetPasswordToken',
            'role',
            'provider',
          ]),
        });

        try {
          // Send an email to the user.
          await strapi.plugins['email'].services.email.send({
            to: (user.toJSON ? user.toJSON() : user).email,
            from:
              settings.from.email && settings.from.name
                ? `"${settings.from.name}" <${settings.from.email}>`
                : undefined,
            replyTo: settings.response_email,
            subject: settings.object,
            text: settings.message,
            html: settings.message,
          });
        } catch (err) {
          return ctx.badRequest(null, err);
        }
      }

      ctx.send({
        jwt: !settings.email_confirmation ? jwt : undefined,
        user: _.omit(user.toJSON ? user.toJSON() : user, [
          'password',
          'resetPasswordToken',
        ]),
      });
    } catch (err) {
      const adminError = _.includes(err.message, 'username')
        ? 'Auth.form.error.username.taken'
        : 'Auth.form.error.email.taken';

      ctx.badRequest(
        null,
        ctx.request.admin ? [{ messages: [{ id: adminError }] }] : err.message,
      );
    }
  },

  emailConfirmation: async (ctx) => {
    const params = ctx.query;

    let user;
    try {
      user = await strapi.plugins['users-permissions'].services.jwt.verify(
        params.confirmation,
      );
    } catch (err) {
      return ctx.badRequest(null, 'This confirmation token is invalid.');
    }

    await strapi.plugins['users-permissions'].services.user.edit(
      _.pick(user, ['_id', 'id']),
      { confirmed: true },
    );

    const settings = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    ctx.redirect(settings.email_confirmation_redirection || '/');
  },
};
