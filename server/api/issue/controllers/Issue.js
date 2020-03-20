'use strict';

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
 * Issue.js controller
 *
 * @description: A set of functions called "actions" for managing `Issue`.
 */

module.exports = {

  /**
   * Retrieve issue records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.issue.search(ctx.query);
    } else {
      return strapi.services.issue.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a issue record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.issue.fetch(ctx.params);
  },

  /**
   * Count issue records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.issue.count(ctx.query);
  },

  /**
   * Create a/an issue record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    console.log("ctx.request.body: ", ctx.request.body);
    let ticket_number = ctx.request.body.Nom;
    var cryptoData = crypto
      .createHash("md5")
      .update(ticket_number)
      .digest("hex");
    // // console.log("cryptoData: ", cryptoData);
    // // console.log('ctx.request.body: ', ctx.request.body);
    // let getEmail_message = ctx.request.body.email_content;
    // console.log("getEmail_message: ", getEmail_message);
    // let email_title = ctx.request.body.email_title;
    // let getEmail_message_crypto = getEmail_message.replace(
    //   "...",
    //   "?id=" + cryptoData //or iplocal replace localhost
    // );
    // // console.log('postEmail_message: ', postEmail_message);
    // let getNom = ctx.request.body.Nom;
    // console.log("nom: ", getNom);
    // let nameCandidats = ctx.request.body.name_candidats.join();
    // console.log("nameCandidats: ", nameCandidats);
    // let postEmail_message = getEmail_message_crypto.replace(
    //   nameCandidats,
    //   getNom
    // );

    ctx.request.body = {
      Lastname: ctx.request.body.Nom,
      Email: ctx.request.body.email,
      Title: ctx.request.body.Subject,
      Description: ctx.request.body.Message,
      Ticket_number: cryptoData,
    };
    const depositObj = {
      ...ctx.request.body,
    };

    try {
      // console.log('ctx.request.body dans TRY: ', ctx.request.body);
      // console.log(email_title);
      let issue = await strapi.services.issue.add(depositObj);
      const options = {
        to: "jumel.elodie@oostaoo.com",
        from: ctx.request.body.Email,
        replyTo: "no-reply@strapi.io",
        subject: ctx.request.body.Title,
        html: ctx.request.body.Description
      };
      await transporter.sendMail(options);
      return issue;
    } catch (e) {
      return null;
    }
    // return strapi.services.issue.add(ctx.request.body);


  },

  /**
   * Update a/an issue record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.issue.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an issue record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.issue.remove(ctx.params);
  }
};
