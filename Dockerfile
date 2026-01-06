FROM node:18-alpine

WORKDIR /app

# Copy dependency files first (layer caching)
COPY src/package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY src/index.js ./

EXPOSE 3000

CMD ["npm", "start"]

