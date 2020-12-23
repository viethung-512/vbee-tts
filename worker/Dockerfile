FROM node:12
ENV CI=true

RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN mkdir -p /opt/node/js \
    && cd /opt/node \
    && npm i canvas

WORKDIR /opt/node/js

# WORKDIR /app
# #  add libraries; sudo so non-root user added downstream can get sudo
# RUN apk add --no-cache \
#     sudo \
#     curl \
#     build-base \
#     g++ \
#     libpng \
#     libpng-dev \
#     jpeg-dev \
#     pango-dev \
#     cairo-dev \
#     giflib-dev \
#     python \
#     ;

# #  add glibc and install canvas
# RUN apk --no-cache add ca-certificates wget  && \
#     wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
#     wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
#     apk add glibc-2.29-r0.apk


COPY package*.json ./

RUN npm install
COPY . .

CMD ["npm", "start"]