"use strict";

/**
 * Question.js controller
 *
 * @description: A set of functions called 'actions' for managing `Question`.
 */
const { fetchSpreadSheet } = require("../utils/populate");
module.exports = {
  /**
   * Populate questions from google spreadsheet.
   *
   * @return {Object|Array}
   */

  populate: async ctx => {
    try {
      // const ranges = [
      //   "A1:A149",
      //   "B1:B149",
      //   "C1:C149",
      //   "D1:D149",
      //   "E1:E149",
      //   "F1:F149",
      //   "G1:G149",
      //   "H1:H149",
      //   "I1:I149",
      //   "J1:J149"
      // ];
      // const spreadsheetId = "1X3x5HJVyAyg9MZTfhw044wEafHpoInT_L1rU-CnZdjE";

      const {ranges,spreadsheetId} = ctx.request.body
      const res = await fetchSpreadSheet(spreadsheetId, ranges);
      //console.log("res", res);
      return res;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve question records.
   *
   * @return {Object|Array}
   */

  find: async ctx => {
    if (ctx.query._q) {
      return strapi.services.question.search(ctx.query);
    } else {
      return strapi.services.question.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a question record.
   *
   * @return {Object}
   */

  findOne: async ctx => {
    return strapi.services.question.fetch(ctx.params);
  },

  /**
   * Count question records.
   *
   * @return {Number}
   */

  count: async ctx => {
    return strapi.services.question.count(ctx.query);
  },

  /**
   * Create a/an question record.
   *
   * @return {Object}
   */

  create: async ctx => {
    return strapi.services.question.add(ctx.request.body);
  },

  /**
   * Update a/an question record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.question.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an question record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.question.remove(ctx.params);
  }
};
