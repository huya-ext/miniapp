import { withPopupLayout } from "@hyext/popup";

const CONTIANER_WIDTH = 400; // 小程序容器宽度，即设计稿上小程序的宽度
const CONTAINER_HEIGHT = 400; // 小程序容器宽度，即设计稿上小程序的宽度

// 下载了demo的同学，可以随便改位置
export const MeasureBox = withPopupLayout(
  (rootLayoutInfo) => {
    return {
      left: '5%',
      top: '5%',
    };
  },
  {
    defaultHeight: CONTAINER_HEIGHT,
    defaultWidth: CONTIANER_WIDTH,
    border: false
  }
);