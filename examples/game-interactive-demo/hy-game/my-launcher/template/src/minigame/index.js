import React, { Component } from 'react';
import { NativeModules, DeviceEventEmitter, NativeEventEmitter } from 'react-native';

const HYExtMiniGame = NativeModules.HYExtMiniGame;

class RequestSubscription {

    constructor(subscription1, subscription2, subscription3) {
        this.subscription1 = subscription1;
        this.subscription2 = subscription2;
        this.subscription3 = subscription3;
    }
    remove() {
        if (this.subscription1) {
            this.subscription1.remove();
            this.subscription1 = null;
        }
        if (this.subscription2) {
            this.subscription2.remove();
            this.subscription2 = null;
        }
        if (this.subscription3) {
            this.subscription3.remove();
            this.subscription3 = null;
        }
    }
}

function requestDownload(callback) {
    const timestamp = new Date().getTime();
    const taskId = timestamp.toString();
    const eventEmitter = new NativeEventEmitter(HYExtMiniGame);
    const subscription1 = eventEmitter.addListener('kEventDownloadCompleted', (ev) => {
        console.log('[VIPER] received completed');
        if (ev && ev.taskId == taskId) {
            if (callback && callback.onCompleted) {
                callback.onCompleted(ev);
            }
        }
    });
    const subscription2 = eventEmitter.addListener('kEventDownloadFailed', (ev) => {
        console.log('[VIPER] received failed');
        if (ev && ev.taskId == taskId) {
            if (callback && callback.onFailed) {
                callback.onFailed(ev);
            }
        }
    });
    const subscription3 = eventEmitter.addListener('kEventDownloadProgress', (ev) => {
        console.log('[VIPER] received progress');
        if (ev && ev.taskId == taskId) {
            if (callback && callback.onProgress) {
                callback.onProgress(ev);
            }
        }
    });
    HYExtMiniGame.requestDownload({
        taskId: taskId
    }).then((resp) => {
        console.log('[VIPER] request start success');
    }).catch((err) => {
        console.log('[VIPER] request start failed');
    });
    return new RequestSubscription(subscription1, subscription2, subscription3);
}

export default {
    requestDownload,
    RequestSubscription
}
