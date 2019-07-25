#!/bin/sh
echo "#================================#"
kill $1
sleep 1
echo "Attempting git pull..."
git pull
git pull
echo "Git pull end."
echo "Latest commit:"
git log -1
sleep 1
nohup node bot.js &
