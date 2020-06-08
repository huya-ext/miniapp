import React from 'react'
import {UI} from '@hyext/hy-ui'
import '../assets/css/Popbox.hycss'
import { TouchableWithoutFeedback } from 'react-native'
const { Text, View } = UI;

const Popbox = ({showPophandle}) => {
    return (
      <View className="popBox">
        <View className="content">
          <View className="bd">
            <Text className="h4">内容包含敏感信息，请重新输入</Text>
            <View className="hitBtn">
              <TouchableWithoutFeedback onPress={()=>showPophandle(false)}>
                <View className="a1"><Text>确认</Text></View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    )
}

export default Popbox