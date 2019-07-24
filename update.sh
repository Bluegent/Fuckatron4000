#!/bin/sh
echo " #================================#"
killall node
sleep 1
git pull
sleep 1
nohup node bot.js &
echo " #================================#"
