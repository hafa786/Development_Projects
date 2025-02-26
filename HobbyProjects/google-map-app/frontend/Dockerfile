# Step 1: Use the official Node.js image to build the React app
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig.json ./
# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install --verbose --legacy-peer-deps

# Copy the rest of the React application code into the container
COPY . .

# Build the React app in production mode
RUN npm run build

# Step 2: Use a lightweight web server (nginx) to serve the build files
FROM nginx:alpine

# Copy the build output from the first stage into nginx's public directory
COPY --from=build /app/build /usr/share/nginx/html

# Set environment variables (optional)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Expose port 80 for the web server
EXPOSE 80

# Start nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
