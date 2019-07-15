const path = require('path');

module.exports = strapi => {
  return {
    initialize: function(cb) {
      strapi.app.use(async (ctx, next) => {
        if(ctx.request.url.indexOf('api') > -1){
          ctx.redirect('https://codingame.com/evaluate/?id=337368884a6d4da896a9ca7b3b3efe8d56aca7a');
          await next();
        }else if(ctx.request.url.indexOf('labs') > -1 ||
           ctx.request.url.indexOf('modules') > -1 ||
           ctx.request.url.indexOf('parcours') > -1 ||
           ctx.request.url.indexOf('quizs') > -1 ||
           ctx.request.url.indexOf('error') > -1
        ){
          ctx.url = '/index.html';
          await next();
        }else{
          await next();
        }

      });

      cb();
    }
  };
};
