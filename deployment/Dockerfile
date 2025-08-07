FROM node:current-alpine3.22

WORKDIR /app

RUN apk add git

COPY package.json package-lock.json .
RUN npm install

COPY . .

RUN npm run build -- --no-lint

CMD ["npm", "run", "start"]
