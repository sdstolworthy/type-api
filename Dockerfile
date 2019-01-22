FROM node:latest

RUN node -v
RUN npm i -g npm yarn typescript
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN cd /app
RUN yarn

EXPOSE 3100

CMD ["npm", "start"]
