'use strict';
import {
  TouchableWithoutFeedback
} from 'react-native'
import React from 'react'
import {UI} from '@hyext/hy-ui'
import '../assets/css/SelectGift.hycss'

const { Text,
  View,
  ScrollView,
  Button,
  Image
} = UI;

const SelectGift = ({data, changeGift}) => {
  return (
    <View className="container">
      <Text className="selectText">选择礼物</Text>
      <Image src={data.giftGif} mode="cover" className="image"></Image> 
      <TouchableWithoutFeedback  onPress={()=>changeGift(-1)}>
        <View className="left"></View>
      </TouchableWithoutFeedback>
        <TouchableWithoutFeedback   onPress={()=>changeGift(1)}>
          <View className="right"></View>
        </TouchableWithoutFeedback>
      <Text className="selectText">{data.giftName}</Text>
    </View>
  )
}


export default SelectGift