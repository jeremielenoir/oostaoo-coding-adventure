"use strict";

const nodemailer = require("nodemailer");

const crypto = require("crypto");

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "lenoir.jeremie@oostaoo.com",
    pass: "marijuana"
  }
});

/**
 * Candidat.js controller
 *
 * @description: A set of functions called "actions" for managing `Candidat`.
 */

module.exports = {
  /**
   * Retrieve candidat records.
   *
   * @return {Object|Array}
   */

  find: async ctx => {
    if (ctx.query._q) {
      return strapi.services.candidat.search(ctx.query);
    } else {
      return strapi.services.candidat.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a candidat record.
   *
   * @return {Object}
   */

  findOne: async ctx => {
    return strapi.services.candidat.fetch(ctx.params);
  },

  /**
   * Count candidat records.
   *
   * @return {Number}
   */

  count: async ctx => {
    return strapi.services.candidat.count(ctx.query);
  },

  /**
   * Create a/an candidat record.
   *
   * @return {Object}
   */

  create: async ctx => {
    var idCampaignNom = ctx.request.body.token + ctx.request.body.Nom;
    console.log("idCampaignNom: ", idCampaignNom);
    var cryptoData = crypto
      .createHash("md5")
      .update(idCampaignNom)
      .digest("hex");
    console.log("cryptoData: ", cryptoData);
    console.log("ctx.request.body: ", ctx.request.body);
    const depositObj = {
      ...ctx.request.body,
      token: cryptoData
    };

    try {
      let candidat = await strapi.services.candidat.add(depositObj);
      const options = {
        to: ctx.request.body.email,
        from: "lenoir.jeremie@gmail.com",
        replyTo: "no-reply@strapi.io",
        subject: "Use strapi email provider successfully",
        html: `
            Bonjour mendoza,

              Votre candidature a retenu notre attention.

              Dans le cadre de notre processus de recrutement, nous avons le plaisir de vous inviter à passer une évaluation technique.
              Vous pourrez choisir le moment le plus approprié pour vous pour passer ce test.

              Quand vous serez prêt(e), cliquez sur le lien ci- dessous pour accéder à la page d’accueil de votre session: <a href='http://localhost:4200/evaluate'>http://localhost:4200/evaluate?id={{cryptoData}}</a>.

                Bonne chance !

                Cordialement,
                -----
                [[name]]
                [[poste]]
                [[Entreprise]]
          `
      };

      await transporter.sendMail(options);

      return candidat;
    } catch (e) {
      return null;
    }
  },

  /**
   * Update a/an candidat record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.candidat.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an candidat record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.candidat.remove(ctx.params);
  }
};
