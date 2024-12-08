# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages
RUN npm install

# Build the Next.js application
RUN npm run build

# Create the startup script before changing user
RUN echo '#!/bin/sh\n\
echo "Starting Next.js application..."\n\
echo "Port: $PORT"\n\
exec npm start' > ./start.sh && \
    chmod +x ./start.sh

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the application
CMD ["./start.sh"]