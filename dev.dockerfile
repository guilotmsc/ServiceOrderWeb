FROM node:14

ENV NODE_ENV=development

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY --chown=node:node . .

RUN npm install
ENV NODE_PATH /home/node/app/node_modules/
COPY . .

USER node

EXPOSE 3000