FROM node:16.13.1
RUN apt-get update && mkdir -p /app
COPY package*.json /app/
WORKDIR /app/
RUN npm install
COPY index.js /app/
COPY ./ /app/
ENV PORT 80
EXPOSE 80
CMD ["npm", "start"]
