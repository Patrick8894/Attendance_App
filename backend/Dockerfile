# backend/Dockerfile
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install

# Bundle app source
COPY . .

# Expose port and start application
EXPOSE 5000
CMD ["npm", "run", "dev"]