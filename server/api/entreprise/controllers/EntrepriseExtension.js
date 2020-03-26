module.exports = {
  /**
   *
   */
  attachEntrepriseToAccount: async (ctx, entreprise) => {
    await strapi.services.customeraccount.edit(
      {
        id: ctx.state.user.owned_customeraccount.id
      },
      { entreprise: entreprise.id }
    );
  }
};
