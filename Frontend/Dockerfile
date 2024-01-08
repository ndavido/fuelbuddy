FROM node:14-alpine

WORKDIR /app/frontend

COPY package.json package-lock.json /app/frontend/
RUN npm install --production && npm install -g expo-cli
COPY . /app/frontend/

CMD ["npm", "start"]

