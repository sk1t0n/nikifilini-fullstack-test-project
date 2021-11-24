FROM node:16-slim AS builder
WORKDIR /app
COPY ./ ./
RUN yarn && yarn run build

FROM node:16-slim
WORKDIR /app
COPY --from=builder /app/build /app
RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", ".", "-n", "-p", "8080"]
