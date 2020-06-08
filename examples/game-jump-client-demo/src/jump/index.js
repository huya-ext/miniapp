import { computeCameraInitalPosition, resetPropCounter } from './utils';
import Stage from './Stage';
import PropCreator from './PropCreator';
import Prop from './Prop';
import LittleMan from './LittleMan';

/**
 * 游戏总入口
 */
class JumpGameWorld {
  constructor({ canvas, needDefaultCreator = true, axesHelper = false }) {
    const { innerWidth, innerHeight } = window;
    this.G = 9.8;
    this.canvas = canvas;
    this.width = innerWidth;
    this.height = innerHeight;
    this.needDefaultCreator = needDefaultCreator;
    this.axesHelper = axesHelper;

    const [min, max] = [~~(innerWidth / 6), ~~(innerWidth / 3.5)];
    this.propSizeRange = [min, max];
    this.propHeight = ~~(max / 2);
    this.propDistanceRange = [~~(min / 2), max * 2];

    this.stage = null;
    this.propCreator = null;
    this.mapCreator = null;
    this.littleMans = [];
    this.props = [];

    // 得分
    this.count = 0;
    this.currentPropIndex = 0;

    this.propStrs = [];

    this.init();
  }

  init() {
    this.initStage();
    this.initPropCreator();
    this.computeSafeClearLength();
    this.create();
  }

  async create() {
    // 得分清0
    this.handleCount(true);
    // 第一个道具
    this.createProp(0);
    // 第二个道具
    this.createProp(0);

    // 首次调整相机
    this.moveCamera(0);
    // 创建人物
    this.initLittleMan();
  }

  reset() {
    this.clear();
    this.create();
  }

  // 游戏销毁
  destroy() {
    this.clear();
  }

  // 让游戏回到初始状态
  clear() {
    this.stage && this.stage.reset();

    this.props.forEach((prop) => prop.destroy());
    this.props = [];
    resetPropCounter();

    this.littleMans.forEach((littleMan) => littleMan.destroy());
    this.littleMans = [];

    this.count = 0;
    this.currentPropIndex = 0;
    this.propStrs = [];
  }

  // 初始化舞台
  initStage() {
    const { canvas, axesHelper, width, height } = this;
    const cameraNear = 0.1;
    const cameraFar = 3000;
    // 计算相机应该放在哪里
    const cameraInitalPosition = (this.cameraInitalPosition = computeCameraInitalPosition(
      35,
      225,
      height / 2,
      height / 2,
      cameraNear,
      cameraFar
    ));
    const lightInitalPosition = (this.lightInitalPosition = { x: -300, y: 600, z: 200 });
    const textInitalPosition = (this.textInitalPosition = { x: width / 5, y: height / 1.6, z: 0 });

    this.stage = new Stage({
      world: this,
      width,
      height,
      canvas,
      axesHelper,
      cameraNear,
      cameraFar,
      cameraInitalPosition,
      lightInitalPosition,
      textInitalPosition,
    });
  }

  // 初始化道具生成器
  initPropCreator() {
    const { needDefaultCreator, propSizeRange, propHeight } = this;

    // 管理所有道具
    this.propCreator = new PropCreator({
      propHeight,
      propSizeRange,
      needDefaultCreator,
    });
  }

  // 对外的新增生成器的接口
  createPropCreator(...args) {
    this.propCreator.createPropCreator(...args);
  }

  // 初始化小人
  initLittleMan() {
    const { stage, propHeight, G, props } = this;
    const littleMan = new LittleMan({
      world: this,
      color: 0x386899,
      G,
    });
    littleMan.enterStage(stage, { x: 0, y: propHeight + 80, z: 0 }, props[0]);
    littleMan.jump();

    this.littleMans.push(littleMan);
  }

  handleProp(isOther, index) {
    const {
      props: { length },
      currentPropIndex,
    } = this;
    if (isOther || currentPropIndex == length - 1) {
      try {
        const item = this.configs[(isOther ? index : currentPropIndex) + 1];
        this.createProp(undefined, undefined, isOther ? { opacity: 0.2, transparent: true } : undefined, {
          ...item,
          ...{
            size: item.size,
            distance: item.distance,
          },
        });
      } catch (e) {
        this.createProp(undefined, undefined, isOther ? { opacity: 0.2, transparent: true } : undefined);
      }
    } else {
      this.changeProp();
    }
  }

  changeProp() {
    const { props, currentPropIndex } = this;
    props[currentPropIndex + 1].body.material.opacity = 1;
  }

  // 创建盒子
  createProp(enterHeight = 100, index = -1, options, others) {
    const {
      propCreator,
      propHeight,
      propSizeRange: [min, max],
      propDistanceRange,
      stage,
      props,
      props: { length },
    } = this;

    if (others) {
      const str = JSON.stringify(others);
      if (~this.propStrs.indexOf(str)) {
        return;
      } else {
        this.propStrs.push(str);
      }
    }

    const currentProp = props[length - 1];
    const prop = new Prop({
      world: this,
      stage,
      // 头2个盒子用第一个创造器生成
      body: others
        ? propCreator.createPropByOther(options, others)
        : propCreator.createProp(index === -1 ? (length < 3 ? 0 : index) : index, options),
      height: propHeight,
      prev: currentProp,
      enterHeight,
      distanceRange: propDistanceRange,
    });
    const size = prop.getSize();

    if (size.y !== propHeight) {
      console.warn(`高度: ${size.y},盒子高度必须为 ${propHeight}`);
    }
    if (size.x < min || size.x > max) {
      console.warn(`宽度: ${size.x}, 盒子宽度必须为 ${min} - ${max}`);
    }
    if (size.z < min || size.z > max) {
      console.warn(`深度: ${size.z}, 盒子深度度必须为 ${min} - ${max}`);
    }

    if (currentProp) {
      currentProp.setNext(prop);
    }

    prop.enterStage(others);
    props.push(prop);

    return prop;
  }

  handleCount(isInit) {
    this.stage.handleCount(isInit);
  }

  handlePropIndex() {
    this.currentPropIndex++;
  }

  // 移动相机，总是看向最后2个盒子的中间位置
  moveCamera(duration = 500) {
    const {
      stage,
      width,
      height,
      cameraInitalPosition: { x: cameraX, y: cameraY, z: cameraZ },
      lightInitalPosition: { x: lightX, y: lightY, z: lightZ },
      textInitalPosition: { x: textX, y: textY, z: textZ },
    } = this;
    // 将可视区向上偏移一点，这样看起来道具的位置更合理
    const cameraOffsetY = height / 10;
    const textOffsetY = height / ((height / width) * 4);

    // const { x, y, z } = this.getLastTwoCenterPosition();
    const { x, y, z } = this.getCurTwoCenterPosition();
    const cameraTo = {
      x: x + cameraX + cameraOffsetY,
      y: cameraY, // 高度是不变的
      z: z + cameraZ + cameraOffsetY,
    };
    const lightTo = {
      x: x + lightX,
      y: lightY,
      z: z + lightZ,
    };
    const textTo = {
      x: x + textX,
      y: textY,
      z: z + textZ - textOffsetY,
    };

    // 移动舞台相机
    const options = {
      cameraTo,
      lightTo,
      textTo,
      center: { x, y, z },
    };
    stage.moveCamera(
      options,
      () => {
        this.clearProps();
      },
      duration
    );
  }

  // 计算最新的2个盒子的中心点
  getLastTwoCenterPosition() {
    const {
      props,
      props: { length },
    } = this;
    const { x: x1, z: z1 } = props[length - 2].getPosition();
    const { x: x2, z: z2 } = props[length - 1].getPosition();

    return {
      x: x1 + (x2 - x1) / 2,
      z: z1 + (z2 - z1) / 2,
    };
  }

  // 计算当前位置2个盒子的中心点
  getCurTwoCenterPosition() {
    const {
      props,
      // props: { length },
      currentPropIndex,
    } = this;
    const { x: x1, z: z1 } = props[currentPropIndex + 1].getPosition();
    const { x: x2, z: z2 } = props[currentPropIndex].getPosition();

    return {
      x: x1 + (x2 - x1) / 2,
      z: z1 + (z2 - z1) / 2,
    };
  }

  // 销毁道具
  clearProps() {
    const {
      safeClearLength,
      props,
      props: { length },
    } = this;
    const point = 4;

    if (length > safeClearLength) {
      props.slice(0, point).forEach((prop) => prop.destroy());
      this.props = props.slice(point);
      this.currentPropIndex -= point;
    }
  }

  // 估算销毁安全值
  computeSafeClearLength() {
    const { width, height, propSizeRange } = this;
    const minS = propSizeRange[0];
    const hypotenuse = Math.sqrt(minS * minS + minS * minS);
    this.safeClearLength = Math.ceil(width / minS) + Math.ceil(height / hypotenuse / 2) + 1;
  }
}

export default JumpGameWorld;
