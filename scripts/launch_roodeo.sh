#!/bin/bash
cd /home/ec2-user/roodeo
pm2 restart server.js
cd ../interview/server
pm2 restart index.js