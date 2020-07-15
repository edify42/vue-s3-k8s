FROM node:lts-alpine3.9 AS BUILDER

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn
ADD index.html .eslintrc.js .eslintignore .babelrc /app/
COPY build /app/build
COPY config /app/config
COPY src /app/src
COPY static /app/static
RUN ["yarn", "run", "build"]


FROM node:lts-alpine3.9
WORKDIR /run
COPY --from=BUILDER /app/dist /run/dist
COPY --from=BUILDER /app/node_modules /run/node_modules
COPY server /run/server
COPY package.json /run
RUN cat /run/dist/index.html
CMD ["yarn", "run", "serve2"]
