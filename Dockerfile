FROM node:14.20.1-buster

USER root
RUN mkdir /usr/src/metadata
WORKDIR /usr/src/metadata
COPY package.json /usr/src/metadata

RUN git config --global url.https://github.com/.insteadOf git://github.com/
#RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get update \
    && apt-get install -y curl 
   # && apt-get install -y npm

#RUN npm version
RUN npm i
COPY . .

CMD ./start.sh
