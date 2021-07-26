import { UI } from '@hyext/hy-ui'
import React, { Component } from 'react'
import './style.hycss'
import styles from "../../common/styles";
const { View, Text, ScrollView, Stepper, Image } = UI

export class SetGift extends Component {
  constructor() {
    super()
    this.state = {
      min: 1,
      max: 20,
    }
  }

  render() {
    const { min, max } = this.state;
    const { giftInfo, handleChange } = this.props;
    console.log(2222, giftInfo);

    return (
      <View className="selector-content">
        <View className="title-content"><Text className="title">参与礼物</Text></View>

        <ScrollView className="scroller" horizontal={true} showsHorizontalScrollIndicator={true} contentContainerStyle={styles.giftScroller}>
          {(giftInfo || []).map((item, idx) => {
              return (
                <View className="gift-item" key={idx}>
                  <View className="item-info">
                    <Image className="item-image" src={item.giftGif || ''} resizeMode="contain" />
                    <Text className="item-name">{item.giftName || ''}</Text>
                  </View>
                  <Stepper
                    min={min}
                    max={max}
                    editable={false}
                    value={item.target || 1}
                    style={styles.stepperStyle}
                    operatorStyle={styles.stepperOperatorStyle}
                    inputStyle={styles.stepperInputStyle}
                    operatorIconColor='#fff'
                    onChange={(value, oldValue, action) => {
                      handleChange({ value, ...item })
                    }}
                  />
                </View>
              )
          })}
        </ScrollView>
      </View>
    );
  }
}
