FROM node:12.19.0-alpine3.11
RUN mkdir /app
WORKDIR /app
COPY ["package.json", "package-lock.json", "/app/"]
RUN npm install --production
COPY . /app
CMD ["npm", "start"]
