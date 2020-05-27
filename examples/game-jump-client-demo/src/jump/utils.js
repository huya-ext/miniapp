import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

const { random, sqrt, floor, pow, sin, cos, tan, PI } = Math;

export let propCounter = 0;
export const incrementPropCounter = () => propCounter++;
export const resetPropCounter = () => (propCounter = 0);

export const colors = [0x67c23a, 0xe6a23c, 0xf56c6c, 0x909399, 0x409eff, 0xffffff];

/**
 * 根据角度计算相机初始位置
 * @param {Number} verticalDeg 相机和场景中心点的垂直角度
 * @param {Number} horizontalDeg 相机和x轴的水平角度
 * @param {Number} top 相机上侧面
 * @param {Number} bottom 相机下侧面
 * @param {Number} near 摄像机视锥体近端面
 * @param {Number} far 摄像机视锥体远端面
 */
export function computeCameraInitalPosition(verticalDeg, horizontalDeg, top, bottom, near, far) {
  const verticalRadian = verticalDeg * (PI / 180);
  const horizontalRadian = horizontalDeg * (PI / 180);
  const minY = cos(verticalRadian) * bottom;
  const maxY = sin(verticalRadian) * (far - near - top / tan(verticalRadian));

  if (minY > maxY) {
    console.warn('警告: 垂直角度太小了!');
    return;
  }
  const y = minY + (maxY - minY) / 2;
  const longEdge = y / tan(verticalRadian);
  const x = sin(horizontalRadian) * longEdge;
  const z = cos(horizontalRadian) * longEdge;

  return { x, y, z };
}

// 材质
export const baseMeshLambertMaterial = new THREE.MeshLambertMaterial();
// 立方体
export const baseBoxBufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 10, 4, 10);
baseBoxBufferGeometry.userData.type = 'box';
// 圆柱体
export const baseCylinderBufferGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 30, 5);
baseCylinderBufferGeometry.userData.type = 'Cylinder';

// 物体销毁
export const destroyMesh = (mesh) => {
  if (mesh.geometry) {
    mesh.geometry.dispose();
    mesh.geometry = null;
  }
  if (mesh.material) {
    mesh.material.dispose();
    mesh.material = null;
  }

  mesh.parent.remove(mesh);

  mesh.parent = null;
  mesh = null;
};

export const randomArrayElm = (array) => array[floor(random() * array.length)];

export const rangeNumberInclusive = (min, max) => floor(random() * (max - min + 1)) + min;

export const getPropSize = (box) => {
  const box3 = getPropSize.box3 || (getPropSize.box3 = new THREE.Box3());
  box3.setFromObject(box);
  return box3.getSize(new THREE.Vector3());
};

// 斜抛计算
export const computeObligueThrowValue = function(v0, theta, G) {
  const sin2θ = sin(2 * theta);
  const sinθ = sin(theta);

  const rangeR = (pow(v0, 2) * sin2θ) / G;
  const rangeH = pow(v0 * sinθ, 2) / (2 * G);
  // const rangeT = 2 * v0 * sinθ / G

  return {
    rangeR,
    rangeH,
    // rangeT
  };
};
/**
 * 获取静止盒子的碰撞检测器
 * @param {Mesh} prop 检测的盒子
 * @param {String} direction 物体过来的方向（世界坐标系）
 * @param {Boolean} isForward 基于方向的前后
 */
export const getHitValidator = (prop, direction, isForward) => {
  const origin = prop.position.clone();
  const vertices = prop.geometry.attributes.position;
  const length = vertices.count;

  // 盒子是静止的，先将顶点到中心点的向量准备好，避免重复计算
  const directionVectors = Array.from({ length })
    .map((_, i) => new THREE.Vector3().fromBufferAttribute(vertices, i))
    .filter((vector3) => {
      // 过滤掉一部分盒子离小人远端的顶点
      if (direction === 'z' && isForward) {
        // 从当前盒子倒向目标盒子
        return vector3.z < 0;
      } else if (direction === 'z') {
        // 从目标盒子倒向当前盒子
        return vector3.z > 0;
      } else if (direction === 'x' && isForward) {
        return vector3.x < 0;
      } else if (direction === 'x') {
        return vector3.x > 0;
      }
    })
    .map((localVertex) => {
      const globaVertex = localVertex.applyMatrix4(prop.matrix);
      // 先将向量准备好
      return globaVertex.sub(prop.position);
    });

  return (littleMan) => {
    for (let i = 0, directionVector; (directionVector = directionVectors[i]); i++) {
      const raycaster = new THREE.Raycaster(origin, directionVector.clone().normalize());
      const collisionResults = raycaster.intersectObject(littleMan, true);

      // 发生了碰撞
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 1.2) {
        return true;
      }
    }
    return false;
  };
};

export const showSegments = (mesh) => {
  const geometry = mesh.geometry.clone();
  const material = new THREE.PointsMaterial({
    size: 3,
    color: 0x58d68d,
    transparent: true,
  });
  const particle = new THREE.Points(geometry, material);

  mesh.add(particle);
};

/**
 * 根据射程算出落地点
 * @param {Number} range 射程
 * @param {Object} c1 起跳点
 * @param {Object} p2 目标盒子中心点
 */
export const computePositionByRangeR = function(range, c1, p2) {
  const { x: c1x, z: c1z } = c1;
  const { x: p2x, z: p2z } = p2;

  const p2cx = p2x - c1x;
  const p2cz = p2z - c1z;
  const p2c = sqrt(pow(p2cz, 2) + pow(p2cx, 2));

  const jumpDownX = (p2cx * range) / p2c;
  const jumpDownZ = (p2cz * range) / p2c;

  return {
    jumpDownX: c1x + jumpDownX,
    jumpDownZ: c1z + jumpDownZ,
  };
};

export const animate = (configs, onUpdate, onComplete) => {
  const {
    from,
    to,
    duration,
    easing = (k) => k,
    autoStart = true, // 为了使用tween的chain
  } = configs;

  const tween = new TWEEN.Tween(from)
    .to(to, duration)
    .easing(easing)
    .onUpdate(onUpdate)
    .onComplete(() => {
      onComplete && onComplete();
    });

  if (autoStart) {
    tween.start();
  }

  animateFrame();
  return tween;
};

const animateFrame = function() {
  if (animateFrame.openin) {
    return;
  }
  animateFrame.openin = true;

  const animate = () => {
    const id = requestAnimationFrame(animate);
    if (!TWEEN.update()) {
      animateFrame.openin = false;
      cancelAnimationFrame(id);
    }
  };
  animate();
};

// 利用requestAnimationFrame自己实现的fps统计，计算结果每秒console.log一次
export const logFps = () => {
  var rAF = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  var frame = 0;
  var allFrameCount = 0;
  var lastTime = Date.now();
  var lastFameTime = Date.now();

  var loop = function() {
    var now = Date.now();
    var fs = now - lastFameTime;
    var fps = Math.round(1000 / fs);

    lastFameTime = now;
    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
    allFrameCount++;
    frame++;

    if (now > 1000 + lastTime) {
      fps = Math.round((frame * 1000) / (now - lastTime));
      console.log(`${new Date()} 1S内 FPS：`, fps);
      frame = 0;
      lastTime = now;
    }

    rAF(loop);
  };

  loop();
};

export const getIsHyExt = () => !!window.hyExt;

export const getVersion = () =>
  new Promise((resolve, reject) => {
    if (getIsHyExt()) {
      hyExt.env
        .getVersionType()
        .then((resp) => {
          hyExt.logger.info('获取当前小程序版本信息成功，返回：' + JSON.stringify(resp));
          resolve(~~resp.versionType);
        })
        .catch((err) => {
          hyExt.logger.info('获取当前小程序版本信息失败，错误信息：' + err.message);
          reject(err.message);
        });
    } else {
      resolve(false);
    }
  });

export const getPlatform = () =>
  new Promise((resolve, reject) => {
    if (getIsHyExt()) {
      hyExt.env
        .getInitialParam()
        .then((resp) => {
          hyExt.logger.info('获取当前小程序初始化参数成功，返回：' + JSON.stringify(resp));
          resolve(resp.platform);
        })
        .catch((err) => {
          hyExt.logger.info('获取当前小程序初始化参数失败，错误信息：' + err.message);
          reject(err.message);
        });
    } else {
      resolve(false);
    }
  });
