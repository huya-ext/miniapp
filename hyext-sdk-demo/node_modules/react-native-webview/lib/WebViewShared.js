import escapeStringRegexp from 'escape-string-regexp';
import React from 'react';
import { Linking, UIManager as NotTypedUIManager, View, ActivityIndicator, Text, } from 'react-native';
import styles from './WebView.styles';
var UIManager = NotTypedUIManager;
var defaultOriginWhitelist = ['http://*', 'https://*'];
var extractOrigin = function (url) {
    var result = /^[A-Za-z][A-Za-z0-9+\-.]+:(\/\/)?[^/]*/.exec(url);
    return result === null ? '' : result[0];
};
var originWhitelistToRegex = function (originWhitelist) {
    return "^" + escapeStringRegexp(originWhitelist).replace(/\\\*/g, '.*');
};
var passesWhitelist = function (compiledWhitelist, url) {
    var origin = extractOrigin(url);
    return compiledWhitelist.some(function (x) { return new RegExp(x).test(origin); });
};
var compileWhitelist = function (originWhitelist) {
    return ['about:blank'].concat((originWhitelist || [])).map(originWhitelistToRegex);
};
var createOnShouldStartLoadWithRequest = function (loadRequest, originWhitelist, onShouldStartLoadWithRequest) {
    return function (_a) {
        var nativeEvent = _a.nativeEvent;
        var shouldStart = true;
        var url = nativeEvent.url, lockIdentifier = nativeEvent.lockIdentifier;
        if (!passesWhitelist(compileWhitelist(originWhitelist), url)) {
            Linking.openURL(url);
            shouldStart = false;
        }
        if (onShouldStartLoadWithRequest) {
            shouldStart = onShouldStartLoadWithRequest(nativeEvent);
        }
        loadRequest(shouldStart, url, lockIdentifier);
    };
};
var getViewManagerConfig = function (viewManagerName) {
    if (!UIManager.getViewManagerConfig) {
        return UIManager[viewManagerName];
    }
    return UIManager.getViewManagerConfig(viewManagerName);
};
var defaultRenderLoading = function () { return (<View style={styles.loadingOrErrorView}>
    <ActivityIndicator />
  </View>); };
var defaultRenderError = function (errorDomain, errorCode, errorDesc) { return (<View style={styles.loadingOrErrorView}>
    <Text style={styles.errorTextTitle}>Error loading page</Text>
    <Text style={styles.errorText}>{"Domain: " + errorDomain}</Text>
    <Text style={styles.errorText}>{"Error Code: " + errorCode}</Text>
    <Text style={styles.errorText}>{"Description: " + errorDesc}</Text>
  </View>); };
export { defaultOriginWhitelist, createOnShouldStartLoadWithRequest, getViewManagerConfig, defaultRenderLoading, defaultRenderError, };
