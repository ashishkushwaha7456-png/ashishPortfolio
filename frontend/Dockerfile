FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN SKIP_TYPE_CHECK=1 SKIP_LINT=1 NODE_OPTIONS="--max-old-space-size=2048" npm run build

EXPOSE 3000

CMD ["npm", "start"]