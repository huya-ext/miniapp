import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TextInput, ScrollView, Button, Picker, TouchableOpacity } from 'react-native';
import hyExt from 'hyliveext-rn-sdk';
import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp

import CONFIG from '../assets/config'
import eventBus from '../tools/bus'

import util from '../assets/util'

export default class Mask extends Component {
    constructor() {
        super();
        
        this.hideDialog = this.hideDialog.bind(this);
    }

    hideDialog() {
        eventBus.emit('hideAddOptionDialog');
        console.log('点击了蒙层');
    }

    render() {
        return (
            <TouchableOpacity onPress={this.hideDialog} style={styles.mask}> 
                <View ></View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0,0,0.6)'
    }
})