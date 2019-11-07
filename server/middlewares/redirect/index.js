const path = require('path');

module.exports = strapi => {
  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {
        if(ctx.request.url.indexOf('api') > -1 || ctx.request.url.indexOf('assets') > -1 || ctx.request.url.indexOf('admin') > -1 || ctx.request.url.indexOf('content-manager') > -1){
          await next();
        }else {
          await next();
        }

      });

      cb();
    }
  };
};
