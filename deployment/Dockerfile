FROM node:current-alpine3.22

WORKDIR /app

COPY package.json package-lock.json .

RUN apk add git
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]
