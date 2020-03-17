"use strict";

/**
 * Question.js controller
 *
 * @description: A set of functions called 'actions' for managing `Question`.
 */

const { google } = require("googleapis");
const keys = require("../../../roodeo.json");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
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

  populate: async (ctx, _next) => {
    try {
      const { spreadsheetId, ranges } = ctx.query;
      const result = await strapi.services.question.fetchSpreadsheet(
        spreadsheetId,
        JSON.parse(ranges)
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  /**
   * execute question script.
   *
   * @return {Object}
   */
  execute: async (ctx, _next) => {
    try {
      const file = ctx.request.body.files;
      const result = await strapi.services.question.executeScript(
        file.files,
        "js"
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
};
