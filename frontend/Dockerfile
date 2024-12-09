FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean npm installation
RUN rm -rf node_modules && \
    npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install @babel/plugin-proposal-private-property-in-object --save-dev

# Copy the rest of the application
COPY . .

# Add node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Set development environment
ENV NODE_ENV=development

EXPOSE 3000

# Start the application
CMD ["react-scripts", "start"]
