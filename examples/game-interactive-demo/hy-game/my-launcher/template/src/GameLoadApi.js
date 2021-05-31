import React, { Component } from 'react'
import { requireNativeComponent, NativeModules } from 'react-native'

export default class GameLoadApi {

    constructor(isDemo) {
        var self = this;
        this.isDemo = isDemo;

        this.queryExtPackageInfo = this.queryExtPackageInfo.bind(this);
        this.requestExtPackageDownload = this.requestExtPackageDownload.bind(this);

        this._onStart = null;
        this._onProgress = null;
        this._onFinish = null;
        this._onError = null;

        this.isFinish = false;
        if (this.isDemo) {
            var count = 0;
            this.timer = setInterval(() => {
                if (count >= 1) {
                    this._onProgress(count/10);
                }

                if (count >= 1000) {
                    this._onProgress(100);
                    this._onFinish("test");
                    clearInterval(self.timer)
                }

                count = count + 10;
            }, 100);
        }
    }



    queryExtPackageInfo() {
        if (this.isDemo) {
            return { extVersionType: 2, extType: 'app_panel', extResPackageUrl: null };
        } else {
            //@TODO
            return {};
        }
    }

    requestExtPackageDownload(onStart, onProgress, onFinish, onError) {
        this._onStart = onStart;
        this._onProgress = onProgress;
        this._onFinish = onFinish;
        this._onError = onError;
        //@TODO
        return;
    }

}
