# build stage
#FROM node:18.16.0-alpine as build-stage
FROM node:18.16.0 as build-stage
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 3000

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
