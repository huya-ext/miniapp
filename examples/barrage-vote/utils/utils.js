
// 观众端 web pc app
const ExtTypes = 'web_video_com,pc_panel,app_panel';

const LOG_PREFIX = 'barrage-vote . '
export const logger = {
  PREFIX: 'barrage-vote . ',
  log(msg, data) {
    console.log(`%c ===${LOG_PREFIX} ${msg}`, 'color: green;', data)
  },
  info(msg, data) {
    console.log(`%c ===${LOG_PREFIX} ${msg}`, 'color: blue;', data)
  },
  warn(msg, data) {
    console.log(`%c ===${LOG_PREFIX} ${msg}`, 'color: orange;', data)
  }
}

export const getTime = (dateInstance) => {
  const date = new Date() || dateInstance
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export const once = (fn) => {
  let called = false
  let result
  return (...args) => {
    if (called) {
      return result
    }
    result = fn.apply(this, args)
    called = true
    return result
  }
}

export const resolveSDKErrorMsg = (e) => {
  const sdkErrMsg = e.message
  let msg = ''

  try {
    const errObj = JSON.parse(sdkErrMsg)
    msg = errObj.msg
  } catch (error) {
    msg = sdkErrMsg
  }

  return msg
}

export const createPromifyWithCatchFn = (api, errMsg, handleErrorFn) => {
  return (...args) => {
    return new Promise((resolve) => {
      api.apply(null, args).then((res) => {
        resolve(res)
      }).catch((e) => {
        handleErrorFn(errMsg, e)
        resolve(false)
      })
    })
  }
}

export const formatText = (str = '', limitCount = 6) => {
  const ellipsis = '...'
  if (str.length > limitCount) {
    str = str.slice(0, limitCount) + ellipsis
  }
  return str
}

const leadingZero = (number) => {
  return number < 10 ? "0" + number : number;
}

export const getTimeText = (lLotteryTs) => {
  let time = new Date(lLotteryTs * 1000);
  return `${time.getMonth() + 1}-${time.getDate()} ${leadingZero(time.getHours())}:${leadingZero(time.getMinutes())}`
}

/**
 * 倒数计时器
 * @param {number} id // 计时器ID 必填，每个计时器的独有ID
 * @param {number} time // 初试时间
 * @param {function} cb(payload:倒数的当前时间)
 * @param {number} interval // 跳动间隔
 * @param {boolean} unInstall // 卸载计时器
 */
export const timeTrigger = ({
    id = 0,
    time = 0,
    cb = () => { },
    interval = 1000,
    unInstall = false,
  })  => {
    if (unInstall) {
      window.clearInterval(window[`timer_trigger_${id}`]);
      window[`timer_trigger_${id}`] = undefined;
      return;
    }
    if (window[`timer_trigger_${id}`]) return;
    if (time < 1) return;

    let thisTime = time;
    window[`timer_trigger_${id}`] = window.setInterval(() => {
      thisTime -= interval
      if (thisTime > 0) {
        cb(thisTime);
        return;
      }
      window.clearInterval(window[`timer_trigger_${id}`]);
      window[`timer_trigger_${id}`] = undefined;
      cb(0)
    }, interval)
}

/**
 * 时间格式化成 nDays 00:00:00
 * @param {number} originTime // 初始时间
 */
export const timeModify = (originTime) => {
  const time = Number.parseInt(originTime / 1000);
  return `${(Array(2).join(0) + Number.parseInt(time / 60) % 60).slice(-2)} : ${(Array(2).join(0) + time % 60).slice(-2)}`;
}


// 获取开播类型  iScreenType 屏幕类型，0-默认，1-横屏
export const getOnLiveInfo = () => {
  let liveType = null;
  return new Promise((resolve,reject) => {
    global.hyExt.backend.commonQuery({
      key: 'getOnLiveInfo',
      param: {}
    }).then(resp => {
      console.log('通用查询接口成功，返回：' + JSON.stringify(resp))
      let data = resp && resp.data;
      liveType = data.screenType === 0 && data.liveSourceType !== 10;
      resolve(liveType)
    }).catch(err => {
      console.log('通用查询接口失败，错误信息：' + err.message)
      reject(null)
    })
  })
}

// 判断是否为竖屏开播类型
export const isPortrait = async () => {
  return await getOnLiveInfo().then((res)=> {
    console.log(`判断是否为竖屏开播类型 res`, res);
    return res;
 }).catch(err => {
   console.log(`判断是否为竖屏开播类型`, err);
   return false;
 })
}

// 获取数组中最大值
export const getMaxNum = (list) => {
  let indexOfMax = 0;
  return (list || []).reduce( (a,c,i) => c.num > a ? (indexOfMax = i,c.num) : a, 0)
}

// 判断最大值是否只有一个
export const isMaxOnly = (list) => {
  let maxNum = getMaxNum(list);
  return (list || []).filter(item => item.num === maxNum).length === 1
}

// 防抖
export function debounce(fn, wait) {
    let timeout;
    return function (...arg) {
      const context = this;
      if (!timeout) fn.apply(this, arg)
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
    }
  }

// 节流
export function throttle(fn, wait) {
    let canRun = true;
    return function () {
      if (!canRun) { return }
      canRun = false;
      setTimeout((...arg) => {
        fn.apply(this, arg);
        canRun = true;
      }, wait)
    }
  }