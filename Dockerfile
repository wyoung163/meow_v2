FROM ubuntu:20.04
RUN apt-get update && mkdir -p /app
COPY . /app/
WORKDIR /app/
RUN npm install
CMD node
