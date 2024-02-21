# Use the official Node.js image as base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code to the working directory
COPY . .

# Expose port 3000 (or any other port your application is listening on)
EXPOSE 3000

# Command to run your Node.js application
CMD ["node", "index.js"]