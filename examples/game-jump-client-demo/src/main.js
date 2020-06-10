import JumpGameWorld from './jump';
import { logFps, getIsHyExt, getVersion, getIsAnchor } from './jump/utils';
// import Stats from 'stats.js';

if (!window.Event.initEvent) {
  window.Event.prototype.initEvent = function(name) {
    this._type = name;
  };
}

const createCanvas = document.createElement('canvas');
createCanvas.id = 'jump-world-canvas';
document.body.appendChild(createCanvas);

document.body.style.margin = 0;
document.body.style.fontSize = 0;

(async () => {
  const isHyExt = getIsHyExt();
  window.__isAnchor = getIsAnchor();
  // window.__isAnchor = true;
  window.__userName = 'player1';
  window.__isMobile = isHyExt && !!~window.navigator.userAgent.indexOf('Mobile');

  new JumpGameWorld({
    canvas: createCanvas,
    axesHelper: false, // 辅助线
  });

  const version = await getVersion();
  if (!isHyExt || ~[1, 2].indexOf(~~version)) {
    // logFps();
  }
})();

// 使用stats.js生成的fps统计,计算结果屏幕左上角ui，注意这种方式只能在webview里面能用
// var stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

// function animate() {
//   stats.begin();

//   stats.end();

//   requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);
