# Step 1: Use the official Node.js image to build the React app
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY tsconfig.json ./

# Step 4: Clear npm cache and install dependencies
RUN npm cache clean --force && npm install --verbose --legacy-peer-deps

# Step 5: Copy the rest of the React application code into the container
COPY . .

# Step 6: Start nginx to serve the React app
EXPOSE 5000
CMD ["npm", "run", "dev"]
