import JumpGameWorld from './jump/index';
import { logFps, getIsHyExt, getVersion } from './jump/utils';
// import Stats from 'stats.js';

const createCanvas = document.createElement('canvas');
createCanvas.id = 'jump-world-canvas';
document.body.appendChild(createCanvas);

(async () => {
  const isHyExt = getIsHyExt();
  window.__isMobile = isHyExt && !!~window.navigator.userAgent.indexOf('Mobile');

  new JumpGameWorld({
    canvas: createCanvas,
    axesHelper: false, // 辅助线
  });
  
  const version = await getVersion();
  if (!isHyExt || ~[1, 2].indexOf(~~version)) {
    logFps();
  }
})();