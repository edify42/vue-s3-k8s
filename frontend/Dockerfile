FROM node:lts-alpine3.9

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn
ADD index.html .eslintrc.js .eslintignore .babelrc /app/
COPY build /app/build
COPY config /app/config
COPY src /app/src
COPY static /app/static
CMD ["yarn", "run", "dev"]