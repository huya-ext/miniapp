#!/bin/bash

BIN_DIR=`dirname $0;`;
BASE_DIR="${BIN_DIR}/..";
BASE_CONF=${BASE_DIR}/conf;

pidfile=${BASE_CONF}/.demoserver.pid;
if [ ! -f $pidfile ];
then
        echo pid file $pidfile not found.;
        exit 0;
fi
pids=`cat $pidfile`;
for pid in $pids
do
 kill $pid;
done
rm -rf $pidfile;
exit 0;