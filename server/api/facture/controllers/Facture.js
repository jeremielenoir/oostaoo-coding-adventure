"use strict";

/**
 * Facture.js controller
 *
 * @description: A set of functions called "actions" for managing `Facture`.
 */
const { access, unlink, createReadStream } = require("fs");
module.exports = {
  /**
   * Retrieve facture records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.facture.search(ctx.query);
    } else {
      return strapi.services.facture.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a facture record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.facture.fetch(ctx.params);
  },

  /**
   * Count facture records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.facture.count(ctx.query);
  },

  /**
   * Create a/an facture record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.facture.add(ctx.request.body);
  },

  /**
   * Update a/an facture record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.facture.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an facture record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.facture.remove(ctx.params);
  },

  /**
   * generate pdf bill.
   *
   * @return {Object}
   */

  generateBillPdf: async (ctx, _next) => {
    let pdfPath = "";
    try {
      const facture = await strapi.services.facture.fetch(ctx.params);
      pdfPath = await strapi.services.facture.reportBillPdf(
        ctx.params.id,
        facture.attributes
      );
      ctx.body = createReadStream(pdfPath);
      ctx.attachment(pdfPath);
    } catch (error) {
      console.log("error generateBillPdf", error);
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
