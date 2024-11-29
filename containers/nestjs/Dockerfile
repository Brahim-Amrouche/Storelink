FROM node:alpine3.19

WORKDIR /usr/backend/
COPY ./backend/package.json ./

RUN npm install
# RUN nvm install 22 && npm install

CMD ["npm", "run", "start:dev"] 