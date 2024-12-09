#!/bin/bash
# Wait for the application to start
sleep 10
# Check if containers are running
if [ $(docker-compose ps -q | wc -l) -eq 3 ]; then
    echo "Application successfully deployed"
    exit 0
else
    echo "Application deployment failed"
    exit 1
fi
