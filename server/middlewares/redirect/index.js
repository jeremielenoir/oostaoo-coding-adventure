const path = require('path');

module.exports = strapi => {
  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {
        let langage = ctx.request.url.indexOf('/en/');
        if(ctx.request.url.indexOf('api') > -1 || ctx.request.url.indexOf('assets') > -1 || ctx.request.url.indexOf('admin') > -1 || ctx.request.url.indexOf('content-manager') > -1){
          await next();
        } else if(ctx.request.url.indexOf('evaluate') > -1 ||
          ctx.request.url.indexOf('campaigns') > -1 ||
          ctx.request.url.indexOf('dashboard') > -1 ||
          ctx.request.url.indexOf('home') > -1 ||
          ctx.request.url.indexOf('candidats') > -1 ||
          ctx.request.url.indexOf('questions') > -1 ||
          ctx.request.url.indexOf('not-found') > -1
        ) {
          console.log('langage');
          if(langage > -1){
            ctx.url = '/en/index.html';
          }else{
            ctx.url = '/index.html';
          }
          
          await next();
        }
        else{
          await next();
        }
      });
      cb();
    }
  };
};
