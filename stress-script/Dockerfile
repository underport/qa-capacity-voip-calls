# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY qa-app/* /app/

# Instalar OpenSSL
RUN apt-get update && apt-get install -y openssl net-tools vim

# Install the dependencies in the container
RUN npm install

# Install PM2 globally in the container
RUN npm install pm2 -g

RUN apt-get update \
    && apt-get clean \
    && apt-get autoclean \
    && apt-get autoremove --purge \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 3005

# Specify the command to run when the container starts
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]