"use strict";

const { access, unlink, createReadStream } = require("fs");

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

  /** 
   * 
   UPDATE wp_options SET option_value = replace(option_value, 'http://feller-service.svprodlab.ovh/', 'http://ec2-15-236-205-29.eu-west-3.compute.amazonaws.com') WHERE option_name = 'home' OR option_name = 'siteurl';
   UPDATE wp_posts SET guid = replace(guid, 'http://feller-service.svprodlab.ovh/','http://ec2-15-236-205-29.eu-west-3.compute.amazonaws.com');
   UPDATE wp_posts SET post_content = replace(post_content, 'http://feller-service.svprodlab.ovh', 'http://ec2-15-236-205-29.eu-west-3.compute.amazonaws.com');
   */

  create: async (ctx) => {
    try {
      const candidat = await strapi.services.candidat.add(ctx.request.body);

      const values = { token: candidat.attributes.token, ...ctx.request.body };

      await strapi.services.candidat.sendNotification(values);

      return candidat;
    } catch (e) {
      throw e;
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
  },

  /**
   * generate pdf candidate report result candidate.
   *
   * @return {Object}
   */

  generateReport: async (ctx, _next) => {
    let pdfPath = "";
    try {
      const candidate = await strapi.services.candidat.fetch(ctx.params);
      pdfPath = await strapi.services.candidat.reportPdf(
        ctx.params.id,
        candidate
      );
      ctx.body = createReadStream(pdfPath);
      ctx.attachment(pdfPath);
    } catch (error) {
      throw error;
    } finally {
      access(pdfPath, async (err) => {
        if (err) {
          console.log(`The file ${pdfPath} does not exist.`);
        } else {
          await unlink(pdfPath, async (err) => {
            if (err) console.log("err", err);
          });
        }
      });
    }
  },
};
