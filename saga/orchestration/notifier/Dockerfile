FROM node:18-alpine AS build

WORKDIR /app

COPY --from=root /saga/orchestration/package*.json ./
COPY --from=root /saga/orchestration/tsconfig.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

RUN npm ci --only=production

CMD ["npm", "start"]
