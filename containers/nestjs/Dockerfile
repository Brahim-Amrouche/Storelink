FROM node:alpine3.19

WORKDIR /usr/backend/
COPY ./backend/package.json ./

RUN npm install
# RUN nvm install 22 && npm install
COPY --chmod=744 ./containers/nestjs/runserver.bash /usr


CMD ["/usr/runserver.bash"] 