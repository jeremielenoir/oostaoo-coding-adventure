"use strict";

/**
 * Question.js controller
 *
 * @description: A set of functions called "actions" for managing `Question`.
 */

module.exports = {
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
  },
  /**
   * populate question from spreadsheet.
   *
   * @return {Object}
   */

  populate: async (ctx, next) => {
    try {
      //  console.log(" ctx.body", ctx.params)
      const { spreadsheetId, ranges } = ctx.request.body;
      const result = await strapi.services.question.fetchSpreadsheet(
        spreadsheetId,
        ranges
      );
      console.log("result[0]",result[0])
      const arrPromises = [];
      result.forEach(async r => {
        try {
          console.log("r",r)
          arrPromises.push(strapi.services.question.add(r));
        } catch (error) {
          throw error;
        }
      });
      const rsults = await Promise.all(arrPromises);
      console.log("promises", rsults);
      return result;
    } catch (error) {
      throw error;
    }
  }
};
