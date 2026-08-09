FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Only install production dependencies (much faster)
RUN npm ci --omit=dev

# Copy pre-compiled folders from the host
COPY .next ./.next
COPY public ./public
COPY next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]