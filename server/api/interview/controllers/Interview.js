"use strict";

/**
 * Interview.js controller
 *
 * @description: A set of functions called "actions" for managing `Interview`.
 */
const nodemailer = require("nodemailer");

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
      const result = await strapi.services.interview.add(ctx.request.body);

      const candidatOption = {
        to: result.candidat.email,
        from: "chagnon.maxime@oostaoo.com",
        replyTo: "no-reply@strapi.io",
        subject: "Entretien vidéoconférence",
        html: `
        <h1>Bonjour ${result.name}</h1>

        <p>C'est avec un réel plaisir que nous vous convions à un entretien vidéo conférence le ${result.interview_date} suite aux résultats de vos tests</p>

        <p>
        <a href='https://app.slack.com/${result.id}'>Lien vidéoconférence</a>
        </p>
        `,
      };

      const interviewersOption = {
        to: result.interviewers.map((e) => e.email),
        from: "chagnon.maxime@oostaoo.com",
        replyTo: "no-reply@strapi.io",
        subject: "Entretien vidéoconférence",
        html: `
        <h1>Bonjour </h1>

        <p>C'est avec un réel plaisir que nous vous convions à un entretien vidéo conférence le ${result.interview_date} avec ${result.candidat.name}suite aux résultats favorables aux tests</p>

        <p>
        <a href='https://app.slack.com/${result.id}'>Lien vidéoconférence</a>
        </p>
        `,
      };

      await Promise.all([
        transporter.sendMail(candidatOption),
        transporter.sendMail(interviewersOption),
      ]);
      return result;
    } catch (error) {
      throw error;
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
