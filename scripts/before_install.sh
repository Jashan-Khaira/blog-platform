#!/bin/bash
# Install Docker and dependencies
sudo yum update -y
sudo yum install -y docker python3-pip gcc
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose using alternative method
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory if it doesn't exist
mkdir -p /home/ec2-user/blog-platform
chown ec2-user:ec2-user /home/ec2-user/blog-platform
