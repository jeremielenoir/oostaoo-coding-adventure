'use strict';

const nodemailer = require('nodemailer');

const crypto = require('crypto');

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'lenoir.jeremie@oostaoo.com',
    pass: 'marijuana'
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

  create: async (ctx) => {
    // console.log(strapi.services.campaign);
    //faire un get campaigns avec ctx.request.body.token? qui est l'id de la campaign?
    var idCampaignNom = ctx.request.body.token + ctx.request.body.Nom;
    // console.log('ctx.request.body.token: ', ctx.request.body.token);
    
    // console.log("idCampaignNom: ", idCampaignNom);
    var cryptoData = crypto
      .createHash('md5')
      .update(idCampaignNom)
      .digest('hex');
    // console.log("cryptoData: ", cryptoData);
    // console.log('ctx.request.body: ', ctx.request.body);
    let email_message = ctx.request.body.email_content;
    let email_title = ctx.request.body.email_title;
    ctx.request.body = {
      Nom : ctx.request.body.Nom,
      email : ctx.request.body.email,
      token : ctx.request.body.token
    };
    const depositObj = {
      ...ctx.request.body,
      token: cryptoData
    };

    try {
      // console.log('ctx.request.body dans TRY: ', ctx.request.body);
      // console.log(email_title);
      let candidat = await strapi.services.candidat.add(depositObj);
      const options = {
        to: ctx.request.body.email,
        from: 'lenoir.jeremie@gmail.com',
        replyTo: 'no-reply@strapi.io',
        subject: email_title,
        html: email_message
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
