import { UI } from "@hyext/hy-ui";
import React, { PureComponent } from "react";
import { StyleSheet } from "react-native";
import "./index.hycss";

const { View, Text, Button, Input, Tip } = UI;

const styles = StyleSheet.create({
  inputIntendStyle: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
  },
  inputStyle: {
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    borderRadius: 4,
  },
});
let isNumber = /^\d+$/;

/***
 * 进度条组件
 */
export class SetTime extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      voteTime: null,
    };
  }

  render() {
    const {
      timeItem,
      isSelected,
      onPressNum,
      itemIdx,
      voteStatus,
    } = this.props;
    const { voteTime } = this.state;
    const borderStyle = {
      borderColor: isSelected ? "#FFC600" : "transparent",
    };

    switch (true) {
      case itemIdx <= 2:
        return (
          <Button
            className="num-item-btn"
            onPress={() => {
              onPressNum(itemIdx);
            }}
          >
            <View className="num-item" style={borderStyle}>
              <Text className="item-name">{timeItem.num}分钟</Text>
            </View>
          </Button>
        );
      case itemIdx == 3:
        return (
          <Button
            className="num-item-btn"
            onPress={() => {
              onPressNum(itemIdx);
            }}
          >
            <View className="num-item" style={borderStyle}>
              <Input
                ref={`timeInput`}
                inputStyle={styles.inputIntendStyle}
                style={styles.inputStyle}
                maxLength={8}
                value={voteTime || ``}
                placeholder={"自定义"}
                onChange={(value) => {
                  if (voteStatus !== -1) return;
                  this.setState({
                    voteTime: value,
                  });
                  if (!isNumber.test(value)) {
                    Tip.show(`请输入整数数字`, 2000);
                    this.setState({
                      voteTime: null,
                    });
                    return;
                  }
                  if (Number(value) > 30) {
                    this.setState({
                      voteTime: null,
                    });
                    Tip.show(`投票时长不能超过30分钟`, 2000);
                    return;
                  }
                  this.props.handleTimeInputChange(value, itemIdx);
                }}
              />
            </View>
          </Button>
        );
      default:
        return null;
    }
  }
}
