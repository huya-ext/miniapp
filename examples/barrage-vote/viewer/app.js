import { UI } from "@hyext/hy-ui";
import React, { Component } from "react";
import "./app.hycss";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  ResponsiveRoot,
  addClassForSence,
  getCurrentSence,
} from "@hyext/sence-responser";
const { View, Text, ScrollView, BackgroundImage, Image } = UI;
import { logger, timeTrigger, timeModify } from "../utils/utils.js";
import { Progress } from "../comps/Progress/index.js";

const hyExt = global.hyExt;
// app 竖屏
const APP_PORTRAIT = {
  x: "0.60", // 小程序左上角横坐标占容器宽度比例
  y: "0.42", // 小程序左上角纵坐标占容器宽度比例
  width: "0.36", // 小程序宽度占容器的比例
  height: "0.22",
};
// app 横屏
const APP_LANDSCAPE = {
  x: "0.79", // 小程序左上角横坐标占容器宽度比例
  y: "0.15",
  width: "0.2",
  height: "0.46", // 小程序高度占容器的比例
};
// web 横屏
const WEB_LANDSCAPE = {
  x: "0.88", // 小程序左上角横坐标占容器宽度比例
  y: "0.73", // 小程序左上角纵坐标占容器宽度比例
  width: "0.11", // 小程序宽度占容器的比例
  height: "0.23", // 小程序高度占容器的比例
};
// web 竖屏 这个数值不可靠
const WEB_PORTRAIT = {
  x: "0.54", // 小程序左上角横坐标占容器宽度比例
  y: "0.76", // 小程序左上角纵坐标占容器宽度比例
  width: "0.11", // 小程序宽度占容器的比例
  height: "0.23", // 小程序高度占容器的比例
};
let currentSence = getCurrentSence();
let isPorTrait = false;

let PopupConfig = {};
if (currentSence === "web") {
  PopupConfig = WEB_LANDSCAPE;
} else {
  PopupConfig = currentSence === "app_portrait" ? APP_PORTRAIT : APP_LANDSCAPE;
}

let isShow = false;
let countDownTime = null;
let paramState = false;
let timestamp = null;

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
      voteTitle: "235", // 投票主题
      voteList: [], // 投票选项
      voteStatus: 0, // 投票状态 0=进行中 1=结束
      isSelectIdx: null, // 默认选项 不选
      isSelectTime: 0, // 默认选择 时间
      barrageList: [], // 弹幕消息队列
      diffTime: null, // 标记时间戳
    };
  }

  setLayout(params) {
    logger.log(`popup-reposition viewer`, params);
    paramState = params;
    global.hyExt.panel
      .setLayout({
        visible: params,
        x: Number(this.state.x),
        y: Number(this.state.y),
        width: Number(this.state.width),
        height: Number(this.state.height),
        alpha: 1,
      })
      .catch((err) => {
        hyExt.logger.info("设置小程序布局失败，错误信息：" + err.message);
      });
  }

  getStorage = () => {
    hyExt.storage
      .getItem("barrageVote")
      .then((value) => {
        logger.log(
          "获取小程序简易存储键值对成功，返回：" + JSON.stringify(value)
        );
        let rspObj = JSON.parse(value) || {};
        const {
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus,
        } = rspObj;
        this.setState({
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus,
        });
      })
      .catch((err) => {
        logger.log("获取小程序简易存储键值对失败，错误信息：" + err.message);
      });
  };

  configEventListener() {
    hyExt.observer.on("config-push", (res) => {
      console.error("[TEST-MSG] message]:", res);

      let rspObj = JSON.parse(res) || {};

      timestamp = +new Date();

      const {
        voteTitle,
        voteList,
        isSelectIdx,
        isSelectTime,
        voteStatus,
        closeBtn,
      } = rspObj;

      this.setState({
          voteTitle,
          voteList,
          isSelectIdx,
          isSelectTime,
          voteStatus,
        }, () => {
          if (!isShow && voteStatus !== 1) {
            this.timeOut && clearTimeout(this.timeOut);
            isShow = !isShow;

            console.error("[TEST-MSG] message First Show]:", this.state);

            this.setLayout(true);
          }
          if (voteStatus === 1 && closeBtn) {
            this.timeOut = setTimeout(() => {
              this.setLayout(false);
            }, 10 * 1000);
          }
        }
      );
    });
  }

  messageEventListener() {
    hyExt.observer.on("message-push", (res) => {
      logger.log("[messageEventListener message]:", res);
      let rspObj = JSON.parse(res) || {};
      timestamp = +new Date();
      const { lN, vS, cT, cB } = rspObj;
      countDownTime = cT;
      this.setState({
          voteList: (this.state.voteList || []).map((item, idx) => {
            if (lN[idx] !== undefined) {
              return Object.assign(item, lN[idx]);
            }
            return item;
          }),
          voteStatus: vS,
          diffTime: `${+new Date()}`,
        }, () => {
          if (!isShow && vS !== 1) {
            this.timeOut && clearTimeout(this.timeOut);
            isShow = !isShow;
            this.setLayout(true);
          }
          if (vS === 1 && cB) {
            this.timeOut = setTimeout(() => {
              isShow = false;
              this.setLayout(false);
            }, 10 * 1000);
          }
        }
      );
    });
  }

  componentDidMount() {
    this.setLayout(false);
    this.getStorage();
    this.configEventListener();
    this.messageEventListener();
  }

  clockFinish = () => {
    this.setState({
        voteStatus: 1,
      }, () => {
        this.timeOut = setTimeout(() => {
          logger.log(`clockFinish`);
          isShow = false;
          this.setLayout(false);
        }, 10 * 1000);
      }
    );
  };

  heartBeatFinish = () => {
    isShow = false;
    this.setLayout(false);
  };

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  panelContent = () => {
    const { voteTitle, voteList, voteStatus } = this.state;
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
            <Text
              className={addClassForSence("pupop-title")}
              style={{ fontSize: 16 }}
            >
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
              onPress={() => {
                this.setState({
                    voteStatus: 1,
                  }, () => {
                    isShow = false;
                    this.setLayout(false);
                  }
                );
              }}
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
    let onLayoutSence = getCurrentSence();
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
            diffTime={diffTime}
            isSelectTime={isSelectTime}
            clockFinish={this.clockFinish}
            heartBeatFinish={this.heartBeatFinish}
          />
        </BackgroundImage>
      </View>
    );
  };

  render() {
    return (
      <ResponsiveRoot
        renderView={this.renderView}
        onLayoutChange={async (e) => {
          let onLayoutSence = getCurrentSence();
          if (onLayoutSence === "web") {
            PopupConfig = WEB_LANDSCAPE;
          } else {
            PopupConfig =
              onLayoutSence === "app_portrait" ? APP_PORTRAIT : APP_LANDSCAPE;
          }
          this.setState({
              x: PopupConfig.x, // 小程序左上角横坐标占容器宽度比例
              y: PopupConfig.y, // 小程序左上角纵坐标占容器宽度比例
              width: PopupConfig.width, // 小程序宽度占容器的比例
              height: PopupConfig.height, // 小程序高度占容器的比例
            }, () => {
              this.setLayout(paramState);
            }
          );
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
    const { voteStatus, isSelectTime } = this.props;
    let isSelect = isSelectTime * 60;
    let cuntDown = countDownTime;
    let startTime =
      countDownTime === null || isSelect === cuntDown ? isSelect : cuntDown;
    console.log(1111, `TIMER:`, this.props, countDownTime, startTime);
    timeTrigger({
      id: "BarrageVoteStreamer",
      time: startTime * 1000 || 0,
      cb: (payload) => {
        this.setState({
          time: payload,
        });
        let nowStamp = +new Date();
        if (timestamp !== null && nowStamp - timestamp > 30000) {
          logger.log(`TIMER 30秒超时:`, this.props, countDownTime);
          this.props.heartBeatFinish();
        }
        if (isSelectTime !== 0 && payload === 0) {
          logger.log(`倒计时结束`);
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
    const { voteStatus, isSelectTime } = this.props;
    switch (true) {
      case voteStatus === 0:
        return (
          <Text className="clock" style={{ fontSize: 16 }}>
            {timeModify(this.state.time || 0)}
          </Text>
        );
      case voteStatus === 1:
        countDownTime = null;
        this.cleanTime();
        return (
          <Text className="clock" style={{ fontSize: 16 }}>
            已结束
          </Text>
        );
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
