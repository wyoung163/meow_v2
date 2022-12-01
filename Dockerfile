FROM node:16.13.1
RUN apt-get update && mkdir -p /app
COPY package*.json /app/
WORKDIR /app/
RUN npm install
COPY app.js /app/
CMD [ "node", "app.js" ]
