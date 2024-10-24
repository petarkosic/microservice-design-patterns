FROM node:18-alpine AS build

WORKDIR /app

COPY --from=root /package*.json ./
COPY --from=root /tsconfig.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

RUN apk add --update bash

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=root /wait-for-it.sh .

RUN chmod +x ./wait-for-it.sh
# Convert line endings to Unix format
RUN dos2unix ./wait-for-it.sh

RUN npm ci --only=production

CMD ["npm", "start"]
