import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import "./app.hycss";
import { logger, timeTrigger, timeModify } from "../utils/utils.js";
import { AddPrize } from "../comps/AddPrize/index.js";
import { Option } from "../comps/Option/index.js";
import { SetTime } from "../comps/SetTime/index.js";
import IconStartBtn from "../assets/icon-start-btn.png";

const { View, Text, Input, Tip, ScrollView, Dialog, BackgroundImage } = UI;
const hyExt = global.hyExt;

const _voteList = [
  { default: "如黄焖鸡，限5字", title: "", num: 0, color: "#FF7F69" },
  { default: "如红烧鱼，限5字", title: "", num: 0, color: "#5BE2FF" },
];
const _timeList = [{ num: 1 }, { num: 5 }, { num: 10 }, { num: null }];

class App extends Component {
  constructor() {
    super();
    this.state = {
      voteTitle: "", // 投票主题
      voteList: _voteList, // 投票选项
      voteStatus: -1, // 投票状态 -1=未开启 0=进行中 1=结束
      timeList: _timeList,
      isSelectIdx: null, // 默认选项 不选
      isSelectTime: null, // 默认选择 时间
    };
  }

  postLocalMessage = (postMsg) => {
    let args = {
      eventName: "message-popup",
      message: JSON.stringify(postMsg),
    };
    hyExt.observer
      .postLocalMessage(args)
      .then(() => {
        logger.log("触发小程序本地消息成功", args);
      })
      .catch((err) => {
        logger.log("触发小程序本地消息失败，错误信息：" + err.message);
      });
  };

  checkData = () => {
    const {
      voteTitle,
      voteList,
      voteStatus,
      isSelectIdx,
      isSelectTime,
    } = this.state;
    if (voteTitle === "") {
      Tip.show("请输入投票主题", 2000);
      return false;
    }
    let listLength = voteList.filter((item) => item.title !== "");
    if (listLength.length < 2) {
      Tip.show("请输入投票选项", 2000);
      return false;
    }
    if (isSelectIdx === null || isSelectTime === null) {
      Tip.show("请选择投票时长", 2000);
      return false;
    }
    return true;
  };

  emitConfig = (postMsg) => {
    hyExt.observer
      .emit("config-push", `${JSON.stringify(postMsg)}`)
      .then(() => {
        logger.log(`向客户端小程序广播信息成功！`);
      })
      .catch((err) => {
        logger.log("向客户端小程序广播信息失败" + err);
      });
  };

  setStorage = (args) => {
    hyExt.storage
      .setItem("barrageVote", `${JSON.stringify(args)}`)
      .then(() => {
        logger.log("设置小程序简易存储键值对成功");
      })
      .catch((err) => {
        hyExt.logger.info(
          "设置小程序简易存储键值对失败，错误信息：" + err.message
        );
      });
  };

  emitMessage = async () => {
    const {
      voteTitle,
      voteList,
      voteStatus,
      isSelectIdx,
      isSelectTime,
    } = this.state;

    if (voteStatus === -1) {
      let checkDataRsp = await this.checkData();
      if (!checkDataRsp) return;
      let postMsg = Object.assign({}, {
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus: 0,
          closeBtn: false,
        }
      );

      this.setState({
          voteStatus: 0,
        }, () => {
          this.setStorage(postMsg);
          this.emitConfig(postMsg);
          this.postLocalMessage(postMsg);
        }
      );
    }
    if (voteStatus === 0) {
      this.setState({ voteStatus: 1 }, () => {
        let postMsg = Object.assign({}, {
            voteTitle,
            voteList,
            isSelectIdx,
            isSelectTime,
            voteStatus: 1,
            closeBtn: true,
          }
        );
        this.postLocalMessage(postMsg);
      });
    }
    if (voteStatus === 1) {
      this.setState({
        voteTitle: "",
        voteList: _voteList,
        voteStatus: -1,
        timeList: _timeList,
        isSelectIdx: null,
        isSelectTime: null,
      });
    }
  };

  setMsgListener = (...args) => {
    let rsp = args[0];
    let rspObj = JSON.parse(rsp) || {};
    const { voteList, voteStatus } = rspObj;
    this.setState({
      voteList,
      voteStatus,
      textBar: JSON.stringify(args),
    });
  };

  messageEventListener = () => {
    let args = {
      eventName: "message-to-streamer",
      callback: this.setMsgListener.bind(this),
    };
    hyExt.observer
      .onLocalMessage(args)
      .then(() => {
        logger.log(`监听本地小程序消息成功`);
      })
      .catch((err) => {
        logger.log("监听本地小程序消息失败，错误信息：" + err.message);
      });
  };

  componentDidMount() {
    this.messageEventListener();
  }

  componentWillUnmount() {
    const {
      voteTitle,
      voteList,
      isSelectIdx,
      isSelectTime,
      voteStatus,
    } = this.state;
    if (voteStatus === 0) {
      let postMsg = Object.assign({}, {
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus: 1,
          closeBtn: true,
        }
      );
      this.postLocalMessage(postMsg);
    } else {
      let postMsg = Object.assign({}, {
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus,
          closeBtn: true,
        }
      );
      this.postLocalMessage(postMsg);
    }
  }

  addVoteList = () => {
    const { voteList } = this.state;
    switch (true) {
      case voteList.length === 2:
        voteList.push({
          default: "如炸鸡翅，限5字",
          title: "",
          num: 0,
          color: "#FFAC39",
        });
        break;
      case voteList.length === 3:
        voteList.push({
          default: "如烧花鸭，限5字",
          title: "",
          num: 0,
          color: "#F36EF7",
        });
        break;
    }

    this.setState({ voteList });
  };

  handleBlur = async () => {
    const { voteTitle } = this.state;
    let beyoundLength = false;
    if (voteTitle.length > 8) {
      beyoundLength = true;
      Tip.show("主题文案限8个字", 1000);
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
        this.setState({ voteTitle: "" });
      }, 200);
    }
  };

  panelContent = () => {
    const {
      voteTitle,
      voteList,
      isSelectIdx,
      timeList,
      voteStatus,
      isSelectTime,
    } = this.state;
    let isShow = this.checkShow();
    return (
      <ScrollView className="scroller" contentContainerStyle={styles.scroller}>
        <Text className="main-text">投票主题</Text>
        <Input
          ref={`titleInput`}
          style={styles.inputStyle}
          inputStyle={styles.inputIntendStyle}
          value={voteTitle || ""}
          placeholder={"输入投票主题，如今晚吃什么，限8个字"}
          onBlur={this.handleBlur}
          editable={voteStatus === -1}
          onChange={(value) => {
            if (voteStatus !== -1) return;
            this.setState({ voteTitle: value });
          }}
        />

        <View className="option-list">
          {(voteList || [0, 1, 2, 3]).map((item, idx) => {
            return (
              <Option
                key={`option_${idx}`}
                item={item}
                voteIdx={idx}
                voteStatus={voteStatus}
                voteList={voteList}
                handleInputChange={this.handleInputChange}
              />
            );
          })}
        </View>
        {voteStatus === -1 && voteList.length < 4 && (
          <AddPrize addVoteList={this.addVoteList} />
        )}
        {voteStatus !== -1 && <View className="place-holder-line"></View>}
        {voteStatus === -1 && <Text className="time-text">投票时间</Text>}
        {voteStatus === -1 && (
          <View className="set-time-content">
            {(timeList || []).map((item, idx) => {
              return (
                <SetTime
                  key={idx}
                  isSelected={isSelectIdx === idx}
                  timeItem={item}
                  itemIdx={idx}
                  handleTimeInputChange={this.handleTimeInputChange}
                  voteStatus={voteStatus}
                  onPressNum={(itemIdx) => {
                    this.setState({
                      isSelectIdx: itemIdx,
                      isSelectTime:
                        this.state.timeList[itemIdx] &&
                        this.state.timeList[itemIdx].num,
                    });
                  }}
                />
              );
            })}
          </View>
        )}

        <Timer voteStatus={voteStatus} isSelectTime={isSelectTime} />

        <TouchableOpacity className="start-game" onPress={this.emitMessage}>
          <BackgroundImage
            className="start-img"
            mode="contain"
            src={isShow ? IconStartBtn : undefined}
          >
            <Text className="start-text" numberOfLines={1}>
              {(() => {
                if (voteStatus === -1) return "开启投票";
                if (voteStatus === 0) return "结束投票";
                if (voteStatus === 1) return "再来一轮";
              })()}
            </Text>
          </BackgroundImage>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  render() {
    return <View className="container">{this.panelContent()}</View>;
  }

  checkShow = () => {
    const { voteTitle, voteList, isSelectIdx, isSelectTime } = this.state;
    if (voteTitle === "") return false;
    let listLength = voteList.filter((item) => item.title !== "");
    if (listLength.length < 2) return false;
    if (isSelectIdx === null || isSelectTime === null) return false;
    return true;
  };

  handleTimeInputChange = (value, itemIdx) => {
    this.setState((prevState) => {
      let newList = prevState.timeList.map((item, idx) => {
        if (itemIdx === idx) {
          return Object.assign(item, { num: +value });
        }
        return item;
      });
      return {
        timeList: newList,
      };
    });
  };

  handleInputChange = (value, voteIdx) => {
    this.setState((prevState) => {
      let newList = prevState.voteList.map((item, idx) => {
        if (voteIdx === idx) {
          return Object.assign(item, { title: value });
        }
        return item;
      });
      return {
        voteList: newList,
      };
    });
  };
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.voteStatus === 1 && prevProps.voteStatus !== 1) {
      this.setState({ time: 0 });
    }
  }

  render() {
    const { voteStatus, isSelectTime } = this.props;
    switch (true) {
      case voteStatus === -1:
        return null;
      case voteStatus === 0:
        timeTrigger({
          id: "BarrageVoteStreamer",
          time: isSelectTime * 60 * 1000 || 0,
          cb: (payload) => {
            this.setState({ time: payload });
          },
        });
        return (
          <Text className="clock">{timeModify(this.state.time || 0)}</Text>
        );
      case voteStatus === 1:
        timeTrigger({
          id: "BarrageVoteStreamer",
          unInstall: true,
        });
        return <Text className="clock">已结束</Text>;
      default:
        return null;
    }
  }
}

const styles = StyleSheet.create({
  scroller: {},
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  inputIntendStyle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
  },
  inputStyle: {
    width: "100%",
    height: 38,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
});

export default App;
