FROM node:alpine

COPY . /var/www/interview

WORKDIR /var/www/interview

RUN npm install

EXPOSE 4000 3000

COPY docker-entrypoint.sh ./entrypoint.sh

RUN chown node:node entrypoint.sh
RUN chown -R node:node /var/www/interview

RUN chmod 755 ./entrypoint.sh

USER node

CMD ["sh", "./entrypoint.sh"]