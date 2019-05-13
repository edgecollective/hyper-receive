FROM node:11
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3282 
ENTRYPOINT ["node","index.js"]
CMD [ "[publickey]" ]
