#!bin/bash
source /etc/environment

export HOME="/data/webapps/transcode-node.v.huya.com"
export PM2_HOME="/data/webapps/transcode-node.v.huya.com/.pm2"
export NODE_HOME="/usr/local/node"
export PATH="$NODE_HOME/bin:$PATH"
export NODE_PATH="$NODE_HOME:$NODE_HOME/lib/node_modules"
export NODE_USER="www-data"


/usr/local/node/bin/pm2 stop transcode-node-slave
/usr/local/node/bin/pm2 start /data/webapps/transcode-node.v.huya.com/index.js --name transcode-node-slave -- --port 9082