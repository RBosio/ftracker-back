FROM node:20-alpine3.18

WORKDIR /app

CMD [ "npm", "run", "start:dev" ]