FROM node:18-alpine AS build

WORKDIR /app

COPY --from=circuit-breaker-root /package*.json ./
COPY --from=circuit-breaker-root /tsconfig.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

RUN apk add --update bash

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

CMD ["npm", "start"]
