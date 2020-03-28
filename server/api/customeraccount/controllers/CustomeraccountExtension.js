const _ = require('lodash');

module.exports = {
  /**
   *
   */
  accountToPro: async (ctx) => {

  },
  /**
   *
   */
  users: async (ctx) => {
    let users = [];
    let account = ctx.state.user.customeraccount;
    const results = await strapi.plugins['users-permissions']
      .services.user.fetchAll({customeraccount: account.id});
    results.forEach(u => {
      users.push(_.omit(u.toJSON ? u.toJSON() : u, ['password', 'resetPasswordToken']));
    });
    return users;
  },
  /**
   *
   */
  addUser: async (ctx) => {

    try {

      const account = ctx.state.user.customeraccount;

      if (ctx.state.user.role.type !== 'authenticated') {
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
      ctx.created(data);

    } catch(error) {
      console.error(error);
      ctx.badRequest(null, ctx.request.admin ?
        [{ messages: [{ id: error.message, field: error.field }] }] :
        error.message);
    }
  }
};
