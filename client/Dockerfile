FROM node:latest as build

RUN mkdir /client

COPY --chown=node:node . /client

WORKDIR /client

RUN yarn install

RUN yarn run build

#RUN yarn run build-i18n:fr
RUN yarn run build-i18n:en
#RUN yarn run build-i18n:jp
#RUN yarn run build-i18n:es

FROM nginx:latest as http-server

COPY --from=build /client/dist/client /usr/share/nginx/html