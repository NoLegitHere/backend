# Use the official Node.js image as the base image
FROM node:22.11.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the backend will run
EXPOSE 3001

# Command to start the backend server
CMD ["node", "server.js"]
