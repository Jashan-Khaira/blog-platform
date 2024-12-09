provider "aws" {
  region = "us-east-1"  # or your preferred region
}

# VPC and networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "blog-platform-dev-vpc"
    Environment = "dev"
  }
}

# EC2 instance for the application
resource "aws_instance" "app_server" {
  ami           = "ami-0453ec754f44f9a4a"  # Amazon Linux 2023 AMI ID
  instance_type = "t2.micro"

  tags = {
    Name        = "blog-platform-dev"
    Environment = "dev"
  }

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              service docker start
              usermod -a -G docker ec2-user
              curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              EOF
}

# Security group
resource "aws_security_group" "app_sg" {
  name        = "blog-platform-dev-sg"
  description = "Security group for blog platform dev environment"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
