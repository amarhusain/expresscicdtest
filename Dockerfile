

#  ========= CONFIGURE NODEJS ===========
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json .

# Install app dependencies
RUN npm ci

# Copy app files
COPY . .

# Set the env to "production"
ENV NODE_ENV production

# Expose the port on which the app will be running (8080 is the default that `serve` uses)
EXPOSE 8080

# Start the app
CMD [ "npm", "start" ]

# docker build -t smart_cubicle_backend .
# docker run -p 8080:8080 smart_cubicle_backend 