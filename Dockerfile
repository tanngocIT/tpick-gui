FROM node:16-alpine as build-stage
WORKDIR /app
ADD package.json /app/package.json
RUN yarn install
ADD . /app
RUN yarn build


FROM nginx:1.19
COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
