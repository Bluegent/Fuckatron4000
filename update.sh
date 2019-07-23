#!/bin/sh
echo " #================================#"
killall node
git pull
nohup node bot.js
echo " #================================#"