# server

A quick description of server.

## facebook provider

Add callback uri to app in developers.facebook.com (https://xxxxxxxx.ngrok.io/auth/facebook/callback)

In strapi "url de redirection front end" matches the "grant.facebook.callback"  
So we added in providers.js (case facebook) a post (or get with query param) on the authorization server with url (/oauth/access_token) redirect_uri: grant.facebook.callback

Grant has to open the browser windows to make the user accepts our app (grant(next)) for unknown reason  grant.redirect_uri is undefined
we had to add g.config.facebook.redirect_uri = config.callback;

(grant must know client_id, redirect_uri to open the window allowing user to accept that we access his informations. 
 (there will be an error "make sure that the redirect_uri match the one you provided in acceptation windows". the uri is in g.config.someprovider.redirect_uri ))

(facebook callback is recommended to be on  /connect/:provider/callback 
so we can add  in routes.json and add handler auth/:provider/callback  but on /connect/:provider/callback (to handle the code and the access_token) 
but it is duplicate code.
(we could also put auth/:provider/callback in strapi configuration "url de redirection front end")
