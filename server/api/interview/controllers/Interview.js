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
        interview_link,
      } = ctx.request.body;

      const interview = await strapi.services.interview.add({
        candidats,
        users: [{ id: user.id }],
        interview_date,
      });

      const interview_id = interview.attributes.id;
      const cryptoData = crypto
        .createHash("md5")
        .update(interview_id.toString())
        .digest("hex");
      const link = `${interview_link}?id=${cryptoData}`;
      const getEmail_message_crypto = email_content.replace(
        interview_link,
        link //or iplocal replace localhost
      );
      const to = [candidats[0].email, user.email];

      const options = {
        to,
        from: "chagnon.maxime@oostaoo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: getEmail_message_crypto,
      };

      const [_, updated] = await Promise.all([
        transporter.sendMail(options),
        strapi.services.interview.edit(
          {
            id: interview.attributes.id,
            email_content: getEmail_message_crypto,
          },
          {
            interview_link: link,
          }
        ),
      ]);
      return updated;
    } catch (e) {
      throw e;
    }
  },

  /**
   * Update a/an interview record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    try {
      //console.log("ctx.request.body", ctx.request.body);
      const {
        interview_date,
        candidats,
        user,
        email_title,
        email_content,
        interview_link,
      } = ctx.request.body;
      const cryptoData = crypto
        .createHash("md5")
        .update(ctx.params.id.toString().toString())
        .digest("hex");
      const link = `${interview_link}?id=${cryptoData}`;
      const getEmail_message_crypto = email_content.replace(
        interview_link,
        link //or iplocal replace localhost
      );
      const to = [candidats[0].email, user.email];

      const options = {
        to,
        from: "chagnon.maxime@oostaoo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: getEmail_message_crypto,
      };
      const updatedData = {
        /*   candidats,
        users: [{ id: user.id }], */
        interview_date,
        interview_link: link,
        email_content: getEmail_message_crypto,
      };
      const [_, updated] = await Promise.all([
        transporter.sendMail(options),
        strapi.services.interview.edit(ctx.params, updatedData),
      ]);

      return updated;
    } catch (error) {
      throw error;
    }
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
