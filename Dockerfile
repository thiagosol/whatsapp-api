FROM node:18-alpine

WORKDIR /app

RUN apk add \
    chromium \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY package*.json ./
RUN npm install --only=production

COPY src/ ./src

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "src/server.js"]
