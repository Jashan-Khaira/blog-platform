#!/bin/bash
set -e  # Exit on error

echo "Starting application deployment..."
cd /home/ec2-user/blog-platform

# Ensure docker and docker-compose are available in PATH
export PATH=$PATH:/usr/local/bin

# Print versions and system info
echo "Docker version:"
docker --version
echo "Docker Compose version:"
docker-compose --version
echo "Disk space:"
df -h

# Stop and remove existing containers
echo "Stopping existing containers..."
docker-compose down --remove-orphans || true
docker system prune -f

# Pull or build images
echo "Building/Pulling images..."
docker-compose build --no-cache

# Start the application with a timeout
echo "Starting containers..."
timeout 300 docker-compose up -d

# Check container status
echo "Checking container status..."
docker-compose ps
docker-compose logs

# Verify all services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "Failed to start containers"
    docker-compose logs
    exit 1
fi

echo "Application deployment completed successfully"
