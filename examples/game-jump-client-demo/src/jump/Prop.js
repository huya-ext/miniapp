import TWEEN from '@tweenjs/tween.js';
import { getPropSize, rangeNumberInclusive, animate, destroyMesh, showSegments } from './utils';

/**
 * 道具类
 */
class Prop {
  constructor({
    world, // 所处世界
    stage, // 所处舞台
    body, // 主体
    height,
    enterHeight,
    distanceRange,
    prev,
  }) {
    this.world = world;
    this.stage = stage;
    this.body = body;
    this.height = height;
    this.enterHeight = enterHeight;
    this.distanceRange = distanceRange;
    this.prev = prev;

    // 下一个盒子的方向、距离
    this.nextDirection = '';
    this.nextDistance = 0;
  }

  // 计算位置
  computeMyPosition(others = {}) {
    const { world, prev, distanceRange, enterHeight } = this;
    const position = {
      x: 0,
      // 头2个盒子y值为0
      y: enterHeight,
      z: 0,
    };

    if (!prev) {
      // 第1个盒子
      return position;
    }

    if (enterHeight === 0) {
      // // 第2个盒子，固定一个距离
      position.z = world.width / 2;
      // 下一个盒子的方向
      prev.nextDirection = 'z';
      return position;
    }

    const { x, z } = prev.getPosition();
    // 随机2个方向 x or z
    const direction = others.direction || (Math.round(Math.random()) === 0 ? 'x' : 'z');

    // const direction = 1
    const { x: prevWidth, z: prevDepth } = prev.getSize();
    const { x: currentWidth, z: currentDepth } = this.getSize();
    // 根据区间随机一个距离
    const randomDistance = others.distance || rangeNumberInclusive(...distanceRange);

    if (direction === 'x') {
      position.x = x + prevWidth / 2 + randomDistance + currentWidth / 2;
      position.z = z;
      prev.nextDirection = 'x';
    } else {
      position.x = x;
      position.z = z + prevDepth / 2 + randomDistance + currentDepth / 2;
      prev.nextDirection = 'z';
    }
    prev.nextDistance = randomDistance;

    return position;
  }

  // 将道具放入舞台
  enterStage(others = {}) {
    const { stage, body, height } = this;
    const { x, y, z } = this.computeMyPosition(others);

    body.castShadow = true;
    body.receiveShadow = true;
    body.position.set(x, y, z);
    // 需要将盒子放到地面
    body.geometry.translate(0, height / 2, 0);
    stage.add(body);

    // showSegments(body)
    this.entranceTransition();
  }

  // 盒子的入场动画
  entranceTransition(duration = 400) {
    const { body, enterHeight, stage } = this;

    if (enterHeight === 0) {
      return;
    }

    animate(
      {
        to: { y: 0 },
        from: { y: enterHeight },
        duration,
        easing: TWEEN.Easing.Bounce.Out,
      },
      ({ y }) => {
        body.position.setY(y);
        stage.render();
      }
    );
  }

  // 回弹动画
  springbackTransition(duration, isOther) {
    const { body, stage } = this;
    const y = body.scale.y;

    animate(
      {
        from: { y },
        to: { y: 1 },
        duration,
        easing: TWEEN.Easing.Bounce.Out,
      },
      ({ y }) => {
        !isOther && body.scale.setY(y);
        stage.render();
      }
    );
  }

  // containsPoint (x, z) {
  //   const { body } = this
  //   const { type } = body.geometry.userData
  //   const { x: sx, z: sz } = this.getSize()
  //   const { x: px, z: pz } = this.getPosition()

  //   if (type === 'box') {
  //     const halfSx = sx / 2
  //     const halfSz = sz / 2
  //     const minX = px - halfSx
  //     const maxX = px + halfSx
  //     const minZ = pz - halfSz
  //     const maxZ = pz + halfSz

  //     return x >= minX && x <= maxX && z >= minZ && z <= maxZ
  //   } else {
  //     const radius = sx / 2
  //     // 小人脚下中心点离圆心的距离
  //     const distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(pz - z, 2))

  //     return distance <= radius
  //   }
  // }

  /**
   * 计算跌落数据
   * @param {Number} width 小人的宽度
   * @param {Number} x 小人脚下中心点的X值
   * @param {Number} z 小人脚下中心点的Z值
   * @return {
   *   contains, // 小人中心点是否在盒子上
   *   isEdge, // 是否在边缘
   *   translateZ, // 将小人旋转部分移动 -translateZ，将网格移动translateZ
   *   degY, // 调整小人方向，然后使用小人的本地坐标进行平移和旋转
   * }
   */
  computePointInfos(width, x, z) {
    const { body } = this;

    if (!body) {
      return {};
    }

    const { type } = body.geometry.userData;
    const { x: sx, z: sz } = this.getSize();
    const { x: px, z: pz } = this.getPosition();
    const halfWidth = width / 2;

    // 立方体和圆柱体的计算逻辑略有差别
    if (type === 'box') {
      const halfSx = sx / 2;
      const halfSz = sz / 2;
      const minX = px - halfSx;
      const maxX = px + halfSx;
      const minZ = pz - halfSz;
      const maxZ = pz + halfSz;

      const contains = x >= minX && x <= maxX && z >= minZ && z <= maxZ;

      if (contains) {
        return { contains };
      }

      const translateZ1 = Math.abs(z - pz) - halfSz;
      const translateZ2 = Math.abs(x - px) - halfSx;
      // 半空中
      if (translateZ1 >= halfWidth || translateZ2 >= halfWidth) {
        return { contains };
      }

      // 计算是否在盒子的边缘
      let isEdge = false;
      let degY = 0;
      let translateZ = 0;

      // 四个方向上都有可能
      if (x < maxX && x > minX) {
        if (z > maxZ && z < maxZ + halfWidth) {
          degY = 0;
        } else if (z < minZ && z > minZ - halfWidth) {
          degY = 180;
        }
        isEdge = true;
        translateZ = translateZ1;
      } else if (z < maxZ && z > minZ) {
        if (x > maxX && x < maxX + halfWidth) {
          degY = 90;
        } else if (x < minX && x > minX - halfWidth) {
          degY = 270;
        }
        isEdge = true;
        translateZ = translateZ2;
      }

      return {
        contains,
        translateZ,
        isEdge,
        degY,
      };
    } else {
      const radius = sx / 2;
      // 小人脚下中心点离圆心的距离
      const distance = Math.sqrt(Math.pow(px - x, 2) + Math.pow(pz - z, 2));

      const contains = distance <= radius;

      if (contains) {
        return { contains };
      }

      // 半空中
      if (distance >= radius + halfWidth) {
        return { contains };
      }

      // 在圆柱体的边缘
      const isEdge = true;
      const translateZ = distance - radius;

      let degY = (Math.atan(Math.abs(x - px) / Math.abs(z - pz)) * 180) / Math.PI;

      if (x === px) {
        degY = z > pz ? 0 : 180;
      } else if (z === pz) {
        degY = x > px ? 90 : 270;
      } else if (x > px && z > pz) {
      } else if (x > px && z < pz) {
        degY = 180 - degY;
      } else if (z < pz) {
        degY = 180 + degY;
      } else {
        degY = 360 - degY;
      }

      return {
        contains,
        translateZ,
        isEdge,
        degY,
      };
    }
  }

  setNext(next) {
    this.next = next;
  }

  getNext() {
    return this.next;
  }

  getPosition() {
    return this.body.position;
  }

  setPosition(x, y, z) {
    return this.body.position.set(x, y, z);
  }

  scaleY(y) {
    return this.body.scale.setY(y);
  }

  // 获取道具大小
  getSize() {
    return getPropSize(this.body);
  }

  // 销毁道具
  destroy() {
    if (this.prev) {
      this.prev.next = null;
    }
    if (this.next) {
      this.next.prev = null;
    }

    destroyMesh(this.body);

    this.world = null;
    this.stage = null;
    this.body = null;
    this.prev = null;
    this.next = null;
  }
}

export default Prop;
