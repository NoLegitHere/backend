# Stage 1: Build the React app
FROM node:22.11.0 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which the app will run
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
