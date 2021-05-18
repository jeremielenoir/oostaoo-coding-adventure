#!/bin/bash
aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 164476836539.dkr.ecr.eu-west-3.amazonaws.com
docker-compose up -d