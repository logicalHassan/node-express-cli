FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock  ./

RUN yarn install --production --pure-lockfile

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]