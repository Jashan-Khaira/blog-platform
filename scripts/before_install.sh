#!/bin/bash
# Update system and install dependencies
yum update -y
yum install -y docker python3-pip gcc
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory if it doesn't exist
mkdir -p /home/ec2-user/blog-platform
chown ec2-user:ec2-user /home/ec2-user/blog-platform