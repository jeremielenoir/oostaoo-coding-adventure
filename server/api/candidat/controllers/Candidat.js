'use strict';

const nodemailer = require('nodemailer');

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

  find: async (ctx) => {
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

  findOne: async (ctx) => {
    return strapi.services.candidat.fetch(ctx.params);
  },

  /**
   * Count candidat records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.candidat.count(ctx.query);
  },

  /**
   * Create a/an candidat record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    try{
      let candidat = await strapi.services.candidat.add(ctx.request.body);

      const options = {
        to: 'lenoir.jeremie@gmail.com',
        from: 'lenoir.jeremie@gmail.com',
        replyTo: 'no-reply@strapi.io',
        subject: 'Use strapi email provider successfully',
        text: 'Hello world!',
        html: 'Hello world!'
      };

      await transporter.sendMail(options);

      return candidat;
    }catch(e){
      return null;
    }

  },

  /**
   * Update a/an candidat record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.candidat.edit(ctx.params, ctx.request.body) ;
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
