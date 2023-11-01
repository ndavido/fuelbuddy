FROM node:14

WORKDIR /app/frontend

COPY package.json package-lock.json /app/frontend/

RUN npm install
RUN npm install -g expo-cli

COPY . /app/frontend/

CMD ["npm", "start"]
