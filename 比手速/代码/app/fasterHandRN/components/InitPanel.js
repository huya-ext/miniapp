/**
 * @author Kekobin
 */
'use strict';

import React from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
// import px2dp from '../util/pxUtil'
import bus from '../util/bus'

const InitPanel = () => {
    return (
      <View style={[styles.initPanel, styles.xxxx]} className={'as'}>
        <Text>比手速，替主播做出选择！</Text>
        <Text>考验手速的时候来了，快速点击选项，替纠结的主播做出选择！</Text>
        <TouchableWithoutFeedback onPress={()=>bus.emit('join')}><Text>我要参与</Text></TouchableWithoutFeedback>
      </View>
    )
}


const styles = StyleSheet.create({
  initPanel:{
    flexDirection:'column',
    alignItems:'center'
  }
})

export default InitPanel;
