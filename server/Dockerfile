FROM node:12-alpine as build

RUN mkdir /server

COPY --chown=node:node . /server

WORKDIR /server

RUN yarn install

CMD ["node","server.js"]


