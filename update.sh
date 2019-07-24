#!/bin/sh
echo "#================================#"
killall node
sleep 1
echo "Attempting git pull..."
git pull
git pull
echo "Git pull end."
sleep 1
nohup node bot.js &
