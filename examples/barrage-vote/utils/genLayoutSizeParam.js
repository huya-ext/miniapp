import { isPortrait } from './utils'
const isWeb = global.__os === 'web';

function calc(size) {
  return (isWeb && isPortrait()) ? size / 2 : size;
}

function genSizeForPlatform({
  containerWidth,
  containerHeight,
  top,
  left
}) {
  let w =  calc(containerWidth);
  let h =  calc(containerHeight);

  let x = calc(left);
  let y =  calc(top);

  return {
    w,
    h,
    x,
    y
  }
}


/**
 * 获取setLayout中尺寸相关参数
 * @property {number} screenWidth 小程序容器宽度
 * @property {number} screenHeight 小程序容器高度
 * @property {number} containerWidth 小程序宽度
 * @property {number} containerHeight 小程序高度
 * @property {number} top 小程序具体容器左上角的纵向距离
 * @property {number} left 小程序距离容器左上角的横向距离
 * @property {number} designWidth 小程序设计稿宽度
 * @returns {object} {x,y,width,height}
 */
function genLayoutSizeParam({
  screenWidth,
  screenHeight,
  containerWidth,
  containerHeight,
  top,
  left,
  designWidth = 750
}) {
  if (!screenWidth || !screenHeight) {
    return;
  }

  const { w, h, x, y} = genSizeForPlatform({
    containerWidth,
    containerHeight,
    top,
    left
  })

  return  {
    x: x / designWidth,
    y: (y / screenHeight) * (screenWidth / designWidth),
    width: w / designWidth,
    height: (h / screenHeight) * (screenWidth / designWidth)
  }
}

export default genLayoutSizeParam;