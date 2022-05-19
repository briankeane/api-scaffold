FROM node:lts-bullseye-slim

# Create new user
WORKDIR /usr/src/app

COPY package.* /usr/src/app/

RUN apt-get update && apt install -y netcat

# env-cmd and sequelize at the command-line for
# easier development
RUN npm install -g env-cmd sequelize-cli

RUN npm install
