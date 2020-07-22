#!/bin/bash

SCRIPT_NAME=$0;
BIN_DIR=`dirname ${SCRIPT_NAME}`;
BASE_DIR="${BIN_DIR}/..";
BASE_LIB=${BASE_DIR}/lib;
BASE_CONF=${BASE_DIR}/conf;

PID_FILE=${BASE_CONF}/.demoserver.pid;

if [ -f $PID_FILE ];
then
        old_pid=`cat $PID_FILE`;
        pids=`ps aux | grep java | awk '{print $2;}'`;
        for pid in $pids
        do
                if [ $pid -eq $old_pid ];
                then
                        echo "process is running as $pid,please stop it first.";
                        exit 0;
                fi
        done
fi

script="java -Xms2048m -Xmx2048m -Xmn1000m -Xss1000k -XX:PermSize=128M -DLogback.configurationFile=file:${BASE_CONF}/logback.xml -classpath ${BASE_CONF}:${BASE_LIB}/* com.huya.ig.game.DemoMain";
echo $script > /tmp/demoserver.start;
nohup $script &
pid=$!
echo $pid > $PID_FILE;