import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./index.hycss";
import { addClassForSence } from "@hyext/sence-responser";
import IconWin from "../../assets/icon-win.png";
import IconTie from "../../assets/icon-tie.png";
import { getMaxNum, isMaxOnly } from "../../utils/utils";

const { View, Text, Image } = UI;

/***
 * 进度条组件
 */
export class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, pgIdx, voteList, voteStatus } = this.props;
    if (item && item.title === "") return null;
    let totalNum = 0;
    let byThousand = false;
    let maxNum = 0;
    let isOnly = false;
    if (voteStatus === 1) {
      maxNum = getMaxNum(voteList);
      isOnly = isMaxOnly(voteList);
    }
    voteList.forEach((element) => {
      let itemNum = parseInt(element.num);
      if (itemNum > 999) {
        byThousand = true;
      }
      totalNum += itemNum;
    });
    const progressStyle = {
      width: `${totalNum !== 0 ? (item.num / totalNum) * 100 : 0}%`,
      backgroundColor: (item && item.color) || "transparent",
    };

    return (
      <View className={addClassForSence("progress-item")}>
        <View className={addClassForSence("title-content")}>
          <Text
            className={addClassForSence("progress-title")}
            style={{ fontSize: 13 }}
          >{`发 ${pgIdx + 1} : `}</Text>
          <Text
            className={addClassForSence("progress-title")}
            style={{ color: (item && item.color) || "#fff", fontSize: 13 }}
          >{`${item && item.title}`}</Text>
        </View>

        <View className={addClassForSence("progress-show")}>
          <View className={addClassForSence("progress-content")}>
            <View
              className={addClassForSence("progress-on")}
              style={progressStyle}
            ></View>
          </View>
          <Text
            className={addClassForSence("people-num")}
            style={{ fontSize: 13 }}
          >{`${
            byThousand
              ? `${parseInt((item.num / totalNum) * 100)}%`
              : `${item && item.num}人`
          }`}</Text>
        </View>
        {voteStatus === 1 &&
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
