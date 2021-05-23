FROM node:12-alpine as build

RUN mkdir /client

COPY --chown=node:node . /client

WORKDIR /client

#RUN cat yarn.lock

RUN yarn install

RUN yarn run build

#RUN yarn run build-i18n:fr
RUN yarn run build-i18n:en
#RUN yarn run build-i18n:jp
#RUN yarn run build-i18n:es

RUN cd dist && ls -lia

FROM nginx:latest as http-server

COPY --from=build /client/dist/client /usr/share/nginx/html

RUN cd /usr/share/nginx/html && ls
