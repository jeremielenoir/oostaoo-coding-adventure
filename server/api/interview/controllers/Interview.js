"use strict";

/**
 * Interview.js controller
 *
 * @description: A set of functions called "actions" for managing `Interview`.
 */
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "chagnon.maxime@oostaoo.com",
    pass: "oostaoo123",
  },
});
module.exports = {
  /**
   * Retrieve interview records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.interview.search(ctx.query);
    } else {
      return strapi.services.interview.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a interview record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.interview.fetch(ctx.params);
  },

  /**
   * Count interview records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.interview.count(ctx.query);
  },

  /**
   * Create a/an interview record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    try {
      const {
        interview_date,
        candidats,
        user,
        email_title,
        email_content,
      } = ctx.request.body;

      const interview = await strapi.services.candidat.add({
        candidats,
        user,
        interview_date,
      });

      const cryptoData = crypto
        .createHash("md5")
        .update(interview.id)
        .digest("hex");

      let getEmail_message_crypto = email_content.replace(
        "...",
        "?id=" + cryptoData //or iplocal replace localhost
      );

      
 
      const options = {
        to: [candidats.email, user.email],
        from: "chagnon.maxime@oostaoo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: getEmail_message_crypto,
      };
      await transporter.sendMail(options);
      return interview;
    } catch (e) {
        console.log("error create interview", e);
      throw e;
    }
  },

  /**
   * Update a/an interview record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.interview.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an interview record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.interview.remove(ctx.params);
  },
};
