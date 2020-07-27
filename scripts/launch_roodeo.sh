#!/bin/bash
cd /home/ec2-user/roodeo
pm2 restart server.js
cd ../interview-roodeo
pm2 start index.js