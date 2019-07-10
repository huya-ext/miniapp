import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp

import eventBus from '../tools/bus'

export default class Toast extends Component{
    constructor(initialProps) {
        super();

        this.state = {
            toastText: ""
        }

        this.timer = null;
    }

    componentDidMount() {
        eventBus.on('showToast', toastText => {
            this.timer && clearTimeout(this.timer);

            this.setState({
                toastText
            }, () => {
                this.timer = setTimeout(() => {
                    this.setState({
                        toastText: ""
                    })
                }, 1500)
            })
        })
    }

    render() {
        const { toastText } = this.state;
        return (
            toastText ? 
            <View style={styles.toastWrapper}>
                <Text style={styles.toastText}>{toastText}</Text>
            </View>
            : 
            <View></View>
        )
    }
}

const styles = StyleSheet.create({
    toastWrapper: {
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        top: px2dp(200),
        left: 0,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    toastText: {
        color: '#fff',
        fontSize: px2dp(30),
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: px2dp(6),
        paddingTop: px2dp(20),
        paddingBottom: px2dp(20),
        paddingLeft: px2dp(30),
        paddingRight: px2dp(30),
    },
    hide: {
        display: 'none'
    }
})