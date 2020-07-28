#!/bin/bash
echo 'tap'
cd /home/ec2-user/roodeo
pm2 restart server
cd ../interview-roodeo
pm2 restart index