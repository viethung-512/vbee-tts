FROM node:alpine
# ENV CI=true

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN rm -rf /app/.env
RUN npm run build

EXPOSE 4000

CMD ["node", "server"]