import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./app.hycss";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  ResponsiveRoot,
  addClassForSence,
  getCurrentSence,
} from "@hyext/sence-responser";
import { logger, timeTrigger, timeModify, throttle } from "../utils/utils.js";
import { Progress } from "../comps/Progress/index.js";

const { View, Text, ScrollView, BackgroundImage, Image } = UI;
const hyExt = global.hyExt;

// app 竖屏
const APP_PORTRAIT = {
  x: "0.60", // 小程序左上角横坐标占容器宽度比例
  y: "0.42", // 小程序左上角纵坐标占容器宽度比例
  width: "0.36", // 小程序宽度占容器的比例
  height: "0.22", // 小程序高度占容器的比例
};

// app 横屏
const APP_LANDSCAPE = {
  x: "0.79", // 小程序左上角横坐标占容器宽度比例
  y: "0.15",
  width: "0.2",
  height: "0.46", // 小程序高度占容器的比例
};

let currentSence = getCurrentSence();
let PopupConfig =
  currentSence === "app_portrait" ? APP_PORTRAIT : APP_LANDSCAPE;

let isShow = false;

let clockTime = null;
class App extends Component {
  constructor() {
    super();
    this.timeOut = null;
    this.state = {
      x: PopupConfig.x, // 小程序左上角横坐标占容器宽度比例
      y: PopupConfig.y, // 小程序左上角纵坐标占容器宽度比例
      width: PopupConfig.width, // 小程序宽度占容器的比例
      height: PopupConfig.height, // 小程序高度占容器的比例

      barrageTimes: 0,
      voteTitle: "", // 投票主题
      voteList: [], // 投票选项
      voteListNum: [], // 投票选项数目
      voteStatus: 0, // 投票状态 0=进行中 1=结束
      isSelectIdx: null, // 默认选项 不选
      isSelectTime: 0, // 默认选择 时间
      barrageList: [], // 弹幕消息队列
      closeBtn: false, // 观众端浮窗是否关闭
      diffTime: null, // 标记时间戳
    };
  }

  setLayout(params) {
    PopupConfig = false ? APP_LANDSCAPE : APP_PORTRAIT;

    this.setState({
        x: PopupConfig.x, // 小程序左上角横坐标占容器宽度比例
        y: PopupConfig.y, // 小程序左上角纵坐标占容器宽度比例
        width: PopupConfig.width, // 小程序宽度占容器的比例
        height: PopupConfig.height, // 小程序高度占容器的比例
      }, () => {
        hyExt.panel
          .setLayout({
            visible: params,
            x: Number(this.state.x),
            y: Number(this.state.y),
            width: Number(this.state.width),
            height: Number(this.state.height),
            ref: "player",
            alpha: 1,
          })
          .catch((err) => {
            hyExt.logger.info("设置小程序布局失败，错误信息：" + err.message);
          });
      }
    );
  }

  emitMessage = () => {
    const { voteListNum, closeBtn, voteStatus } = this.state;
    let postMsg = Object.assign({}, { lN: voteListNum, vS: voteStatus, cT: clockTime, cB: closeBtn });
    hyExt.observer
      .emit("message-push", `${JSON.stringify(postMsg)}`)
      .then(() => {
        logger.log(`向客户端小程序广播信息成功！`);
      })
      .catch((err) => {
        logger.log("向客户端小程序广播信息失败" + err);
      });
  };

  postLocalMessage() {
    const {
      voteTitle,
      voteList,
      isSelectIdx,
      isSelectTime,
      closeBtn,
      voteStatus,
    } = this.state;
    let postMsg = Object.assign({}, {
        voteTitle,
        voteList,
        isSelectIdx,
        isSelectTime,
        voteStatus,
        clockTime: clockTime,
        closeBtn,
      }
    );
    let args = {
      eventName: "message-to-streamer",
      message: JSON.stringify(postMsg),
    };
    hyExt.observer
      .postLocalMessage(args)
      .then(() => {
        logger.log("触发小程序本地消息成功" + JSON.stringify(args));
      })
      .catch((err) => {
        logger.log("触发小程序本地消息失败，错误信息：" + err.message);
      });
  }

  setMsgListener(...args) {
    let rsp = args[0];
    let rspObj = JSON.parse(rsp) || {};
    const {
      voteTitle,
      voteList,
      isSelectIdx,
      isSelectTime,
      voteStatus,
    } = rspObj;
    clockTime = isSelectTime;
    this.setState({
        voteTitle,
        voteList,
        isSelectIdx,
        isSelectTime,
        voteStatus,
        closeBtn: false,
        voteListNum: [],
        diffTime: `${+new Date()}`,
      }, () => {
        if (!isShow && voteStatus !== -1) {
          this.timeOut && clearTimeout(this.timeOut);
          isShow = !isShow;
          this.setLayout(true);
        }
        if (voteStatus === 1) {
          this.finishGame();
        }
      }
    );
  }

  messageEventListener() {
    let args = {
      eventName: "message-popup",
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
  }

  setBarrageChange(...args) {
    if (this.state.voteStatus === 1) return;
    const { barrageList, voteList } = this.state;
    let brgObj = args[0] || {};
    let brgIdx = Number(brgObj.content);
    if (voteList[brgIdx - 1] && voteList[brgIdx - 1].title === "") return;
    if (barrageList.some((item) => item.unionId === brgObj.unionId)) return;
    if (
      !voteList.some((item, idx) => {
        return idx + 1 === brgIdx;
      })
    )
      return;
    barrageList.push(brgObj);
    this.setState((prevState) => {
      let newList = prevState.voteList.map((item, idx) => {
        if (brgIdx === idx + 1) {
          return Object.assign(item, { num: item.num + 1 });
        }
        return item;
      });
      let newNumList = newList.map((item, idx) => {
        return { num: item.num };
      });
      return {
        voteList: newList,
        voteListNum: newNumList,
      };
    });
    this.setState({
        barrageList,
        closeBtn: false,
      }, () => {
        this.postLocalMessage();
      }
    );
  }

  onBarrageChange() {
    let cb = this.setBarrageChange.bind(this);
    hyExt.context
      .onBarrageChange({}, cb)
      .then(() => {
        logger.log("监听弹幕消息成功");
      })
      .catch((err) => {
        logger.log("监听弹幕消息失败，错误信息：" + err.message);
      });
  }

  finishGame = () => {
    this.setState({
        voteStatus: 1,
        barrageList: [],
        closeBtn: true,
        voteListNum: [],
      }, () => {
        clockTime = null;
        this.emitMessage();
        this.timeOut = setTimeout(() => {
          if (this.state.voteStatus === 1) {
            isShow = false;
            this.setLayout(false);
          }
        }, 10 * 1000);
      }
    );
  };

  finishGameBtn = () => {
    this.setState({
        voteStatus: 1,
        barrageList: [],
        closeBtn: true,
        voteListNum: [],
      }, () => {
        clockTime = null;
        this.postLocalMessage();
        this.emitMessage();
        isShow = false;
        this.setLayout(false);
      }
    );
  };

  clockFinish = () => {
    this.setState({
        voteStatus: 1,
        barrageList: [],
        closeBtn: false,
        voteListNum: [],
      }, () => {
        clockTime = null;
        this.postLocalMessage();
        this.timeOut = setTimeout(() => {
          if (this.state.voteStatus === 1) {
            this.setState({ closeBtn: true }, () => {
              this.emitMessage();
            });
            isShow = false;
            this.setLayout(false);
          }
        }, 10 * 1000);
      }
    );
  };

  componentDidMount() {
    this.setLayout(false);
    this.onBarrageChange();
    this.messageEventListener();
  }

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  panelContent = () => {
    const {
      voteTitle,
      voteList,
      voteStatus,
    } = this.state;
    return (
      <View className={addClassForSence("panel-bg")}>
        <BackgroundImage
          className="panel-bg-img"
          mode="contain"
          resizeMode="stretch"
          src={require("../assets/icon-bg.png")}
        >
          <ScrollView
            className="scroller"
            contentContainerStyle={styles.scroller}
            showsVerticalScrollIndicator={false}
          >
            <Text className={addClassForSence("pupop-title")}>
              {voteTitle || ``}
            </Text>
            {(voteList || []).map((item, idx) => {
              return (
                <Progress
                  key={`progress_${idx}`}
                  item={item}
                  pgIdx={idx}
                  voteList={voteList}
                  voteStatus={voteStatus}
                />
              );
            })}
          </ScrollView>
          {voteStatus === 1 && (
            <TouchableOpacity
              className={addClassForSence("button-close")}
              onPress={this.finishGameBtn}
            >
              <Image
                className={addClassForSence("img-close")}
                mode="contain"
                src={require("../assets/icon-close.png")}
              />
            </TouchableOpacity>
          )}
        </BackgroundImage>
      </View>
    );
  };

  renderView = () => {
    const { voteStatus, isSelectTime, diffTime } = this.state;
    return (
      <View className="container">
        {this.panelContent()}
        <BackgroundImage
          className={addClassForSence("timer-bg")}
          mode="contain"
          src={require("../assets/icon-timer.png")}
        >
          <Timer
            voteStatus={voteStatus}
            isSelectTime={isSelectTime}
            diffTime={diffTime}
            clockFinish={this.clockFinish}
            emitMessage={throttle(this.emitMessage, 2000)}
          />
        </BackgroundImage>
      </View>
    );
  };

  render() {
    return (
      <ResponsiveRoot
        renderView={this.renderView}
        onLayoutChange={() => {
          let onLayoutSence = getCurrentSence();
          PopupConfig =
            onLayoutSence === "app_portrait" ? APP_PORTRAIT : APP_LANDSCAPE;
          this.setState({
            x: PopupConfig.x, // 小程序左上角横坐标占容器宽度比例
            y: PopupConfig.y, // 小程序左上角纵坐标占容器宽度比例
            width: PopupConfig.width, // 小程序宽度占容器的比例
            height: PopupConfig.height, // 小程序高度占容器的比例
          });
        }}
      />
    );
  }
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
  }

  setTime = () => {
    const { isSelectTime } = this.props;
    timeTrigger({
      id: "BarrageVoteStreamer",
      time: isSelectTime * 60 * 1000 || 0,
      cb: (payload) => {
        clockTime = parseInt(payload / 1000);
        this.setState({
            time: payload,
          }, () => {
            this.props.emitMessage();
          }
        );
        if (isSelectTime !== 0 && payload === 0) {
          this.props.clockFinish();
        }
      },
    });
  };

  cleanTime = () => {
    timeTrigger({
      id: "BarrageVoteStreamer",
      unInstall: true,
    });
  };

  componentDidMount() {
    this.setTime();
  }

  componentDidUpdate(prevProps) {
    if (this.props.voteStatus === 1 && prevProps.voteStatus !== 1) {
      this.setState({ time: 0 });
    }
    if (
      this.props.voteStatus === 0 &&
      this.props.diffTime !== prevProps.diffTime
    ) {
      this.cleanTime();
      this.setTime();
    }
  }

  render() {
    const { voteStatus } = this.props;
    switch (true) {
      case voteStatus === 0:
        return (
          <Text className="clock">{timeModify(this.state.time || 0)}</Text>
        );
      case voteStatus === 1:
        clockTime = null;
        this.cleanTime();
        return <Text className="clock">已结束</Text>;
      default:
        return null;
    }
  }
}

const styles = StyleSheet.create({
  scroller: {
    alignItems: "center",
  },
});

export default App;
