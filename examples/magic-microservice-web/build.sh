#!/usr/bin/env bash
[ -f /etc/profile ] && . /etc/profile
nvm use stable
rm -rf node_modules
# 外网高速 proxy
export http_proxy=http://10.20.47.148:3128 https_proxy=http://10.20.47.148:3128

#--- 准备环境
DIR=`pwd`
OUTPUT="$DIR/output"

yarn install --registry http://bnpm.byted.org && NODE_ENV=production npm run build


