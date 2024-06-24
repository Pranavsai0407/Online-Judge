FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN   npm install
COPY . .
# Create the uploads directory
RUN mkdir -p uploads/profile
EXPOSE 5000
CMD ["node","index.js"]