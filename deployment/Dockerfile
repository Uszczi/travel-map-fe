FROM node:current-alpine3.22

WORKDIR /app

RUN apk add git

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
