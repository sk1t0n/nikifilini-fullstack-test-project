FROM node:16-slim
WORKDIR /app
COPY ./ ./
RUN yarn && yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
