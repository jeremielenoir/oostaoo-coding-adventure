"use strict";

/**
 * Interview.js controller
 *
 * @description: A set of functions called "actions" for managing `Interview`.
 */
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const ical = require("ical-generator");
const moment = require("moment-timezone");

// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "assessment@roodeo.com",
    pass: "Oostaoo@2020",
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
      const encodedData = {
        interview_id,
        interview_date,
        candidat: {
          email: candidats[0].email,
          name: candidats[0].name,
        },
      };
      /*  const cryptoData = crypto
        .createHash("md5")
        .update(JSON.stringify(encodedData))
        .digest("hex"); */
      //const cryptoData = sha256(JSON.stringify(encodedData));AES.
      const cryptoData = await jwt.sign(encodedData, "roodeo");

      const link = `${interview_link}${cryptoData}`;

      const expression = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
      const regex = new RegExp(expression);
      const getEmail_message_crypto = email_content.replace(regex, link);
      const to = [candidats[0].email, user.email];
      const organizer = `${user.prenom} ${user.nom} <${user.email}>`;
      const icalEvent = ical({
        domain: "roodeo.com",

        events: [
          {
            start: moment(interview_date),
            end: moment(interview_date).add(1, "hour"),
            timestamp: moment(),
            summary: email_title,
            organizer,
          },
        ],
      }).toString();
      const options = {
        to,
        from: "assessment@roodeo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: getEmail_message_crypto,
        icalEvent,
      };

      await transporter.sendMail(options);
      const updated = await strapi.services.interview.edit(
        {
          id: interview.attributes.id,
          email_content: getEmail_message_crypto,
        },
        {
          interview_link: link,
        }
      );

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

      if (!ctx.params.id) {
        throw new Error("Unknown user");
      }

      const encodedData = {
        interview_date,
        interview_id: ctx.params.id,
        candidat: {
          email: candidats[0].email,
          name: candidats[0].name,
        },
      };

      const cryptoData = await jwt.sign(JSON.stringify(encodedData), "roodeo");

      const link = `${interview_link}${cryptoData}`;

      const expression = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
      const regex = new RegExp(expression);
      const getEmail_message_crypto = email_content.replace(regex, link);

      const to = [candidats[0].email, user.email];
      const organizer = `${user.prenom} ${user.nom} <${user.email}>`;
      const icalEvent = ical({
        domain: "roodeo.com",

        events: [
          {
            start: moment(interview_date),
            end: moment(interview_date).add(1, "hour"),
            timestamp: moment(),
            summary: email_title,
            organizer,
          },
        ],
      }).toString();
      const options = {
        to,
        from: "assessment@roodeo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: getEmail_message_crypto,
        icalEvent,
      };
      const updatedData = {
        /*   candidats,
        users: [{ id: user.id }], */
        interview_date,
        interview_link: link,
        email_content: getEmail_message_crypto,
      };

      await transporter.sendMail(options);
      const updated = await strapi.services.interview.edit(
        ctx.params,
        updatedData
      );

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
  cancel: async (ctx, next) => {
    try {
      const {
        // interview_date,
        candidats,
        user,
        email_title,
        email_content,
        id,
      } = ctx.request.body;

      const interview = await strapi.services.interview.fetch({ id });

      if (!interview) {
        throw new Error("Interview not found");
      }

      const to = [candidats[0].email, user.email];

      const options = {
        to,
        from: "assessment@roodeo.com",
        replyTo: "no-reply@strapi.io",
        subject: email_title,
        html: email_content,
      };
      await strapi.services.interview.remove({ id: interview.attributes.id });
      await transporter.sendMail(options);

      return true;
    } catch (error) {
      throw error;
    }
  },
};
