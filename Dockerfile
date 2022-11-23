FROM node:16-alpine3.15

RUN mkdir -p /app/
WORKDIR /app
COPY src /app/src/
COPY package.json /app/
COPY tsconfig.json /app/

RUN set -x && \
    npm install && \
    npm run build
