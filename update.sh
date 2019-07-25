#!/bin/sh
echo "#================================#"
kill $1
sleep 1
echo "Attempting git pull..."
git pull
git pull
echo "Latest commit:"
git log --pretty=oneline -1
sleep 1
nohup node bot.js &
