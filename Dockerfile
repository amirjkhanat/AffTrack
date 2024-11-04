# Use Node.js base image
FROM node:18-alpine

# Install Redis and other dependencies
RUN apk add --no-cache redis curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Copy Redis configuration
COPY redis.conf /etc/redis/redis.conf

# Create healthcheck script
RUN echo '#!/bin/sh\n\
redis-cli ping > /dev/null\n\
if [ $? -ne 0 ]; then\n\
  exit 1\n\
fi\n\
ps aux | grep "npm run worker" | grep -v grep > /dev/null\n\
if [ $? -ne 0 ]; then\n\
  exit 1\n\
fi\n\
exit 0' > /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Create start script
RUN echo "#!/bin/sh\n\
redis-server /etc/redis/redis.conf &\n\
sleep 2\n\
npm run worker" > start.sh
RUN chmod +x start.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD [ "/healthcheck.sh" ]

# Expose Redis port
EXPOSE 6379

# Start Redis and the worker
CMD ["./start.sh"] 