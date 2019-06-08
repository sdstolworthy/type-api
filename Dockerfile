FROM node:lts
ADD package.json /home/package.json
WORKDIR /home
RUN yarn install
EXPOSE 3000
CMD ["npm", "start:prod"]
