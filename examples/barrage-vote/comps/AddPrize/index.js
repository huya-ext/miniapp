import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import "./index.hycss";
import IconAdd from "../../assets/icon-add.png";

const { View, Text, Image } = UI;

/***
 * 奖品选择组件
 */
export class AddPrize extends Component {
  render() {
    const { addVoteList } = this.props;
    return (
      <View className="add-content">
        <TouchableOpacity className="button-select" onPress={addVoteList}>
          <Image className="add-img" mode="contain" src={IconAdd} />
          <Text className="add-text">添加选项</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
