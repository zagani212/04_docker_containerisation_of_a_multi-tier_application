FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ARG NGINX_API_UPSTREAM=api:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s|REPLACE_UPSTREAM|${NGINX_API_UPSTREAM}|g" /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
