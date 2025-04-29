FROM node:22-alpine

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn install --production --pure-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]