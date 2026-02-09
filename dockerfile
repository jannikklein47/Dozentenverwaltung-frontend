FROM node:22.13.1-alpine

RUN apk update
RUN apk add --update nodejs npm

WORKDIR /app
COPY package*.json ./

RUN npm install -g @quasar/cli

RUN npm install -g express

RUN npm install

COPY . .

RUN quasar build

EXPOSE 443

CMD [ "npm", "run", "start" ]