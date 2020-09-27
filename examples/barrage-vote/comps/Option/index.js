import { UI } from "@hyext/hy-ui";
import React, { PureComponent } from "react";
const { View, Text, Input, Tip, Image } = UI;
import "./index.hycss";
import { StyleSheet } from "react-native";
import { logger, getMaxNum, isMaxOnly } from "../../utils/utils.js";
import IconWin from "../../assets/icon-win-ribbon.png";
import IconTie from "../../assets/icon-tie-ribbon.png";

const styles = StyleSheet.create({
  inputIntendStyle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
  },
  inputStyle: {
    width: 161,
    height: 38,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
  },
});

/***
 * 选项组件
 */
export class Option extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      voteTitle: "",
    };
  }

  handleBlur = async (...args) => {
    const { voteTitle } = this.state;
    let beyoundLength = false;
    if (voteTitle.length > 5) {
      beyoundLength = true;
      Tip.show("选项文案限5个字", 1000);
    }
    let req = { text: voteTitle || "" };
    let isReport = true;
    await global.hyExt.order
      .reportText(req)
      .then(() => {
        logger.log("发起小程序文本的秩序审核成功");
      })
      .catch((err) => {
        logger.log("发起小程序文本的秩序审核失败，错误信息：", err.message);
        isReport = false;
        if (beyoundLength) {
          setTimeout(() => {
            Tip.show(`秩序文本审核不通过`, 2000);
          }, 2000);
        } else {
          Tip.show(`秩序文本审核不通过`, 2000);
        }
      });
    if (!isReport || beyoundLength) {
      setTimeout(() => {
        this.setState({
          voteTitle: "",
        });
        this.props.handleInputChange("", this.props.voteIdx);
      }, 200);
    }
  };

  render() {
    const { voteIdx, item, voteList, voteStatus } = this.props;
    const { voteTitle } = this.state;
    let maxNum = 0;
    let isOnly = false;
    if (voteStatus === 1) {
      maxNum = getMaxNum(voteList);
      isOnly = isMaxOnly(voteList);
    }
    return (
      <View className="option-content">
        <Text className="option-title">{`输入: ${voteIdx + 1}`}</Text>
        <Input
          ref={`textInput`}
          inputStyle={styles.inputIntendStyle}
          style={styles.inputStyle}
          value={voteTitle || ""}
          placeholder={item.default || ""}
          onBlur={this.handleBlur}
          editable={voteStatus === -1}
          onChange={(value) => {
            if (voteStatus !== -1) return;
            this.setState({
              voteTitle: value,
            });
            this.props.handleInputChange(value, voteIdx);
          }}
        />
        {voteStatus !== -1 && (
          <Text className="vote-num">{`投票人数：${item.num || 0}人 `}</Text>
        )}
        {voteStatus === 1 &&
          item.title !== "" &&
          (() => {
            if (isOnly && item.num === maxNum)
              return (
                <Image className="icon-win" mode="contain" src={IconWin} />
              );
            if (!isOnly && item.num === maxNum)
              return (
                <Image className="icon-win" mode="contain" src={IconTie} />
              );
            return (
              <Image className="icon-win" mode="contain" src={undefined} />
            );
          })()}
      </View>
    );
  }
}
