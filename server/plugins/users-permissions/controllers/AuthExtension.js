
const _ = require('lodash');

module.exports = {
  /**
   *
   */
  registerCustomerAccount: async (ctx, user, param) => {

    const account = await strapi.services.customeraccount.add({
      type: param.accountType || 'personal',
      admin: user._id || user.id
    });

    return await strapi.plugins['users-permissions']
      .services.user.edit(_.pick(user, ['_id', 'id']), {owned_customeraccount: account.id});

  }
};
