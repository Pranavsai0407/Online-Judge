FROM node:18-alpine

# Install necessary packages
RUN apk update && \
    apk add --no-cache g++ python3 openjdk11-jre gcc

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8000 (assuming your Node.js server listens on this port)
EXPOSE 8000

# Command to run the Node.js server
CMD ["node", "index.js"]
