# Use official Node.js LTS image
FROM node:22-alpine

# Create and set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port your app runs on (adjust if different)
EXPOSE 5000 

# Start the app
CMD ["node", "index.js"]

