import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import {
  baseMeshLambertMaterial,
  computeObligueThrowValue,
  computePositionByRangeR,
  animate,
  destroyMesh,
  getHitValidator,
} from './utils';
import Particle from './Particle';

/**
 * 人物类
 */
class LittleMan {
  constructor({ world, color, G, options = {}, isOther, restart, currentProp, nextProp }) {
    this.world = world;
    this.color = color;
    this.G = G;
    this.options = options;
    this.isOther = isOther;
    this.v0 = world.width / 10;
    this.theta = 90;

    this.headSegment = null;
    this.bodyScaleSegment = null;
    this.bodyRotateSegment = null;
    this.body = null;

    this.unbindFunc = null;

    this.currentProp = currentProp;
    this.nextProp = nextProp;
    this.powerStorageDuration = 1500;

    this.stage = null;

    this.restart = restart;

    this.createBody();
    this.particle = new Particle({
      triggerObject: this.body,
      world,
    });
    this.resetPowerStorageParameter();
  }

  // 销毁小人
  destroy() {
    this.particle.destroy();
    destroyMesh(this.headSegment);
    destroyMesh(this.bodyScaleSegment);
    destroyMesh(this.bodyRotateSegment);
    destroyMesh(this.body);

    this.unbindFunc && this.unbindFunc();
    this.world = null;
    this.particle = null;
    this.headSegment = null;
    this.bodyScaleSegment = null;
    this.bodyRotateSegment = null;
    this.body = null;
    this.unbindFunc = null;

    this.currentProp = null;
    this.nextProp = null;

    this.stage = null;
  }

  bindEvent() {
    const { canvas } = this.world;
    // const isMobile = 'ontouchstart' in document;
    const mousedownName = __isMobile ? 'touchstart' : 'mousedown';
    const mouseupName = __isMobile ? 'touchend' : 'mouseup';

    // 该起跳了
    const mouseup = () => {
      if (this.jumping) {
        return;
      }
      this.jumping = true;
      // 蓄力动作应该停止
      this.poweringUp = false;
      // 停止粒子流
      this.particle.stopRunParticleFlow();

      this.jump();
      canvas.removeEventListener(mouseupName, mouseup);
    };

    // 蓄力的时候
    const mousedown = (event) => {
      event.preventDefault();
      // 跳跃没有完成不能操作
      if (this.poweringUp || this.jumping || !this.currentProp || this.gameOver || (this.world.type !== 1 && this.world.wss && this.world.wss.isEnd)) {
        return;
      }
      this.poweringUp = true;
      // 开启粒子流
      this.particle.runParticleFlow();
      this.powerStorage();
      canvas.addEventListener(mouseupName, mouseup, false);
    };

    canvas.addEventListener(mousedownName, mousedown, false);

    return () => {
      canvas.removeEventListener(mousedownName, mousedown);
      canvas.removeEventListener(mouseupName, mouseup);
    };
  }

  // 创建身体
  createBody() {
    const {
      color,
      world: { width },
      options,
    } = this;
    const material = baseMeshLambertMaterial.clone();
    material.setValues({ ...{ color }, ...options });

    // 头部
    const headSize = (this.headSize = width * 0.03);
    const headTranslateY = (this.headTranslateY = headSize * 4.5);
    const headGeometry = new THREE.SphereGeometry(headSize, 16, 16);
    const headSegment = (this.headSegment = new THREE.Mesh(headGeometry, material));
    headSegment.castShadow = true;
    headSegment.translateY(headTranslateY);

    // 身体
    this.width = headSize * 1.2 * 2;
    this.height = headSize * 5;
    this.bodySize = headSize * 4;
    const bodyBottomGeometry = new THREE.CylinderBufferGeometry(headSize * 0.9, this.width / 2, headSize * 2.5, 16);
    bodyBottomGeometry.translate(0, headSize * 1.25, 0);
    const bodyCenterGeometry = new THREE.CylinderBufferGeometry(headSize, headSize * 0.9, headSize, 16);
    bodyCenterGeometry.translate(0, headSize * 3, 0);
    const bodyTopGeometry = new THREE.SphereGeometry(headSize, 16, 16);
    bodyTopGeometry.translate(0, headSize * 3.5, 0);

    const bodyGeometry = new THREE.Geometry();
    bodyGeometry.merge(bodyTopGeometry);
    bodyGeometry.merge(new THREE.Geometry().fromBufferGeometry(bodyCenterGeometry));
    bodyGeometry.merge(new THREE.Geometry().fromBufferGeometry(bodyBottomGeometry));

    // 缩放控制
    const translateY = (this.bodyTranslateY = headSize * 1.5);
    const bodyScaleSegment = (this.bodyScaleSegment = new THREE.Mesh(bodyGeometry, material));
    bodyScaleSegment.castShadow = true;
    bodyScaleSegment.translateY(-translateY);

    // 旋转控制
    const bodyRotateSegment = (this.bodyRotateSegment = new THREE.Group());
    bodyRotateSegment.add(headSegment);
    bodyRotateSegment.add(bodyScaleSegment);
    bodyRotateSegment.translateY(translateY);

    // 整体身高 = 头部位移 + 头部高度 / 2 = headSize * 5
    const body = (this.body = new THREE.Group());
    body.add(bodyRotateSegment);
  }

  // 进入舞台
  enterStage(stage, { x, y, z }, nextProp, isBindEvent = true) {
    const { body } = this;

    body.position.set(x, y, z);

    this.stage = stage;
    // 进入舞台时告诉小人目标
    this.nextProp = nextProp;

    stage.add(body);
    stage.render();
    if (isBindEvent) {
      this.unbindFunc = this.bindEvent();
    }
  }

  resetPowerStorageParameter() {
    // 由于蓄力导致的变形，需要记录后，在空中将小人复原
    this.toValues = {
      headTranslateY: 0,
      bodyScaleXZ: 0,
      bodyScaleY: 0,
    };
    this.fromValues = this.fromValues || {
      headTranslateY: this.headTranslateY,
      bodyScaleXZ: 1,
      bodyScaleY: 1,
      propScaleY: 1,
    };
  }

  // 蓄力
  powerStorage() {
    const {
      stage,
      powerStorageDuration,
      body,
      bodyScaleSegment,
      headSegment,
      bodySize,
      fromValues,
      currentProp,
      world: { propHeight },
    } = this;

    this.powerStorageTime = Date.now();
    this.resetPowerStorageParameter();

    const tween = animate(
      {
        from: { ...fromValues },
        to: {
          headTranslateY: bodySize - bodySize * 0.6,
          bodyScaleXZ: 1.3,
          bodyScaleY: 0.6,
          propScaleY: 0.6,
        },
        duration: powerStorageDuration,
      },
      ({ headTranslateY, bodyScaleXZ, bodyScaleY, propScaleY }) => {
        if (!this.poweringUp) {
          // 抬起时停止蓄力
          tween.stop();
        } else {
          headSegment.position.setY(headTranslateY);
          bodyScaleSegment.scale.set(bodyScaleXZ, bodyScaleY, bodyScaleXZ);
          currentProp.scaleY(propScaleY);
          body.position.setY(propHeight * propScaleY);

          // 保存此时的位置用于复原
          this.toValues = {
            headTranslateY,
            bodyScaleXZ,
            bodyScaleY,
          };

          stage.render();
        }
      }
    );
  }

  computePowerStorageValue() {
    const { powerStorageDuration, powerStorageTime, v0, theta } = this;
    const diffTime = Date.now() - powerStorageTime;
    const time = Math.min(diffTime, powerStorageDuration);
    const percentage = time / powerStorageDuration;

    return {
      v0: v0 + 30 * percentage,
      theta: theta - 40 * percentage,
    };
  }

  // 跳跃
  jump(x, y, z, i) {
    const {
      stage,
      body,
      currentProp,
      nextProp,
      world: { propHeight },
    } = this;
    const duration = 400;
    const start = body.position;
    const target = nextProp.getPosition();
    const { x: startX, y: startY, z: startZ } = start;

    // 开始游戏时，小人从第一个盒子正上方入场做弹球下落
    if (this.restart || (!currentProp && startX === target.x && startZ === target.z)) {
      animate(
        {
          from: { y: startY },
          to: { y: propHeight },
          duration,
          easing: TWEEN.Easing.Bounce.Out,
        },
        ({ y }) => {
          body.position.setY(y);
          stage.render();
        },
        () => {
          this.currentProp = nextProp;
          this.nextProp = nextProp.getNext();
          this.jumping = false;
          this.restart = false;
        }
      );
    } else {
      if (!currentProp) {
        return;
      }

      const { bodyScaleSegment, headSegment, G, world, width } = this;
      const { v0, theta } = this.computePowerStorageValue();
      const { rangeR, rangeH } = y ? { rangeH: y } : computeObligueThrowValue(v0, theta * (Math.PI / 180), G);

      const { jumpDownX, jumpDownZ } = x || z ? { jumpDownX: x, jumpDownZ: z } : computePositionByRangeR(rangeR, start, target);

      // 水平匀速
      animate(
        {
          from: {
            x: startX,
            z: startZ,
            ...this.toValues,
          },
          to: {
            x: jumpDownX,
            z: jumpDownZ,
            ...this.fromValues,
          },
          duration,
        },
        ({ x, z, headTranslateY, bodyScaleXZ, bodyScaleY }) => {
          body.position.setX(x);
          body.position.setZ(z);
          headSegment.position.setY(headTranslateY);
          bodyScaleSegment.scale.set(bodyScaleXZ, bodyScaleY, bodyScaleXZ);
        }
      );

      // y轴上升段、下降段
      const rangeHeight = Math.max(world.width / 3, rangeH) + propHeight;
      const yUp = animate(
        {
          from: { y: startY },
          to: { y: rangeHeight },
          duration: duration * 0.65,
          easing: TWEEN.Easing.Cubic.Out,
          autoStart: false,
        },
        ({ y }) => {
          body.position.setY(y);
        }
      );
      const yDown = animate(
        {
          from: { y: rangeHeight },
          to: { y: propHeight },
          duration: duration * 0.35,
          easing: TWEEN.Easing.Cubic.In,
          autoStart: false,
        },
        ({ y }) => {
          body.position.setY(y);
        },
        () => yDownCallBack()
      );

      yUp.chain(yDown).start();

      // 空翻
      this.flip(duration);
      // 从起跳开始就回弹
      currentProp.springbackTransition(500, this.isOther);

      const sendJumpCmd = (isSuccess) => {
        world.wss.sendJumpCmd(
          {
            id: world.currentPropIndex,
            x: startX,
            y: startY,
            z: startZ,
          },
          {
            id: isSuccess ? world.currentPropIndex + 1 : 0,
            x: jumpDownX,
            y: rangeH,
            z: jumpDownZ,
          }
        );
      };

      // 落地后的回调
      const yDownCallBack = () => {
        const currentInfos = currentProp.computePointInfos(width, jumpDownX, jumpDownZ);
        const nextInfos = nextProp.computePointInfos(width, jumpDownX, jumpDownZ);

        // 没有落在任何一个盒子上方
        if (!currentInfos.contains && !nextInfos.contains) {
          // gameOver 游戏结束，跌落
          console.log('GameOver');
          this.fall(currentInfos, nextInfos);
          if (world.type === 2) {
            sendJumpCmd();
          }
          setTimeout(() => {
            if (world.type !== 1 && world.wss && world.wss.isEnd) {
              return;
            }
            if (!this.isOther) {
              if (this.world.type === 1) {
                this.unbindFunc();
                stage.changeEndHud();
              } else {
                this.restart = true;
                const restartPostion = currentProp.getPosition();
                this.world.initLittleMan(restartPostion.x, restartPostion.z, true, currentProp, nextProp);
                this.destroy();
                stage.render();
              }
            }
          }, 1000);
        } else {
          bufferUp
            .onComplete(() => {
              if (world.type !== 1 && world.wss && world.wss.isEnd) {
                return;
              }
              if (nextInfos.contains) {
                if (this.isOther) {
                  world.handleProp(this.isOther, i);
                } else {
                  // 落在下一个盒子才更新场景
                  // 落地后，计算得分 -> 生成下一个方块 -> 移动镜头 -> 更新关心的盒子 -> 结束
                  world.handleCount();
                  world.handlePropIndex();
                  world.handleProp();
                  world.moveCamera();

                  if (world.type === 2) {
                    sendJumpCmd(true);
                  }
                }

                this.currentProp = nextProp;
                this.nextProp = nextProp.getNext();
              } else {
                if (world.type === 2) {
                  sendJumpCmd();
                }
              }

              // 粒子喷泉
              this.particle.runParticleFountain();
              // 跳跃结束了
              this.jumping = false;
            })
            .start();
        }
      };

      // 落地缓冲段
      const bufferUp = animate(
        {
          from: { s: 0.8 },
          to: { s: 1 },
          duration: 100,
          autoStart: false,
        },
        ({ s }) => {
          bodyScaleSegment.scale.setY(s);
        }
      );
    }
  }

  // 空翻
  flip(duration) {
    const { currentProp, bodyRotateSegment } = this;
    let increment = 0;

    animate(
      {
        from: { deg: 0 },
        to: { deg: 360 },
        duration,
        easing: TWEEN.Easing.Sinusoidal.InOut,
      },
      ({ deg }) => {
        if (currentProp.nextDirection === 'x') {
          bodyRotateSegment.rotateZ(-(deg - increment) * (Math.PI / 180));
        } else {
          bodyRotateSegment.rotateX((deg - increment) * (Math.PI / 180));
        }
        increment = deg;
      }
    );
  }

  // 跌落
  fall(currentInfos, nextInfos) {
    const {
      stage,
      body,
      currentProp,
      nextProp,
      world: { propHeight },
    } = this;
    // 跳跃方向
    const direction = currentProp.nextDirection;
    let degY,
      translateZ,
      validateProp, // 需要检测的盒子
      isForward; // 相对方向的前、后

    if (currentInfos.isEdge && nextInfos.isEdge) {
      // 同时在2个盒子边缘
      return;
    } else if (currentInfos.isEdge) {
      // 当前盒子边缘
      degY = currentInfos.degY;
      translateZ = currentInfos.translateZ;
      validateProp = nextProp;
      isForward = true;
    } else if (nextInfos.isEdge) {
      // 目标盒子边缘
      degY = nextInfos.degY;
      translateZ = nextInfos.translateZ;
      // 目标盒子边缘可能是在盒子前方或盒子后方
      if (direction === 'z') {
        isForward = degY < 90 && degY > 270;
      } else {
        isForward = degY < 180;
      }
      validateProp = isForward ? null : currentProp;
    } else {
      // 空中掉落
      return animate(
        {
          from: { y: propHeight },
          to: { y: 0 },
          duration: 400,
          easing: TWEEN.Easing.Bounce.Out,
        },
        ({ y }) => {
          body.position.setY(y);
          stage.render();
        }
      );
    }

    // 将粒子销毁掉
    this.particle.destroy();

    const { bodyRotateSegment, bodyScaleSegment, headSegment, bodyTranslateY, width, height } = this;
    const halfWidth = width / 2;

    // 将旋转原点放在脚下，同时让小人面向跌落方向
    headSegment.translateY(bodyTranslateY);
    bodyScaleSegment.translateY(bodyTranslateY);
    bodyRotateSegment.translateY(-bodyTranslateY);
    bodyRotateSegment.rotateY(degY * (Math.PI / 180));

    // 将旋转原点移动到支撑点
    headSegment.translateZ(translateZ);
    bodyScaleSegment.translateZ(translateZ);
    bodyRotateSegment.translateZ(-translateZ);

    let incrementZ = 0;
    let incrementDeg = 0;
    let incrementY = 0;

    let hitValidator = validateProp && getHitValidator(validateProp.body, direction, isForward);

    // 第一段 先沿着支点旋转
    const rotate = animate(
      {
        from: {
          degY: 0,
        },
        to: {
          degY: 90,
        },
        duration: 500,
        autoStart: false,
        easing: TWEEN.Easing.Quintic.In,
      },
      ({ degY }) => {
        if (hitValidator && hitValidator(body.children[0])) {
          rotate.stop();
          hitValidator = null;
        } else {
          bodyRotateSegment.rotateX((degY - incrementDeg) * (Math.PI / 180));
          incrementDeg = degY;
          stage.render();
        }
      }
    );
    // 第二段 跌落，沿z轴下落，沿y轴向外侧偏移
    const targZ = propHeight - halfWidth - translateZ;
    const fall = animate(
      {
        from: {
          y: 0,
          z: 0,
        },
        to: {
          y: halfWidth - translateZ,
          z: targZ,
        },
        duration: 300,
        autoStart: false,
        easing: TWEEN.Easing.Bounce.Out,
      },
      ({ z, y }) => {
        if (hitValidator && hitValidator(body.children[0])) {
          fall.stop();

          // 稍微处理一下，头撞到盒子的情况
          const radian = Math.atan((targZ - z) / height);
          if (isForward && direction === 'z') {
            bodyRotateSegment.translateY(-height);
            body.position.z += height;
            body.rotateX(-radian);
          } else if (direction === 'z') {
            bodyRotateSegment.translateY(-height);
            body.position.z -= height;
            body.rotateX(radian);
          } else if (isForward && direction === 'x') {
            bodyRotateSegment.translateY(-height);
            body.position.x += height;
            body.rotateZ(radian);
          } else if (direction === 'x') {
            bodyRotateSegment.translateY(-height);
            body.position.x -= height;
            body.rotateZ(-radian);
          }
          stage.render();
          hitValidator = null;
        } else {
          headSegment.translateZ(z - incrementZ);
          bodyScaleSegment.translateZ(z - incrementZ);
          bodyRotateSegment.translateY(y - incrementY);
          incrementZ = z;
          incrementY = y;
          stage.render();
        }
      }
    );

    rotate.chain(fall).start();
  }
}

export default LittleMan;
