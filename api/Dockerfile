FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && chown -R node:node /app

COPY --chown=node:node . .

ENV NODE_ENV=production
EXPOSE 3000

USER node
CMD ["npm", "start"]
