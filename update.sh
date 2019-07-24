#!/bin/sh
echo " #================================#"
killall node
sleep 5
git pull
sleep 5
nohup node bot.js
echo " #================================#"
