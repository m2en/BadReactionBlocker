FROM node:18 AS Build

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . ./

RUN yarn build

FROM node:18 AS Deps

WORKDIR /deps
COPY --from=Build /build/package.json /build/yarn.lock ./
RUN yarn install --production

FROM gcr.io/distroless/nodejs:18

WORKDIR /app

USER not-root

COPY --from=deps /deps/package.json ./
COPY --from=deps /deps/node_modules ./node_modules/
COPY --from=build /build/build ./build/

CMD ["./build/index.js"]
