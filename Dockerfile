FROM node:16.20-alpine3.16

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3030

CMD ["yarn", "start:prod"]
