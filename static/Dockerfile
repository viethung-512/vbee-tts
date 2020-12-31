FROM node:alpine

ENV CI=true

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]