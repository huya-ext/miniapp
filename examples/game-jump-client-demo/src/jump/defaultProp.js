import { randomArrayElm, rangeNumberInclusive, propCounter, incrementPropCounter, colors } from './utils';

// 静态
export const statics = [
  // ...
];

// 非静态
export const actives = [
  // 默认纯色立方体创造器
  function defaultCreator(THREE, helpers) {
    const {
      propSizeRange: [min, max],
      propHeight,
      baseMeshLambertMaterial,
      baseBoxBufferGeometry,
      options = {},
      others = {}
    } = helpers;

    incrementPropCounter();

    // 随机颜色
    const color = others.color || randomArrayElm(colors);
    // 随机大小，头2个盒子固定一下大小
    const size = others.size || (propCounter < 3 ? max : rangeNumberInclusive(min, max));

    const geometry = baseBoxBufferGeometry.clone();
    geometry.scale(size, propHeight, size);

    const material = baseMeshLambertMaterial.clone();
    material.setValues({ ...{ color }, ...options });

    return new THREE.Mesh(geometry, material);
  },
  function defaultCreator (THREE, helpers) {
    const {
      propSizeRange: [min, max],
      propHeight,
      baseMeshLambertMaterial,
      baseCylinderBufferGeometry,
      options = {},
      others = {}
    } = helpers

    incrementPropCounter()

    // 随机颜色
    const color = others.color || randomArrayElm(colors)
    // 随机大小，头2个盒子固定一下大小
    const size = others.size || (propCounter < 3 ? max : rangeNumberInclusive(min, max))

    const geometry = baseCylinderBufferGeometry.clone()
    geometry.scale(Math.ceil(size / 2), propHeight, Math.ceil(size / 2))

    const material = baseMeshLambertMaterial.clone()
    material.setValues({ ...{ color }, ...options });

    return new THREE.Mesh(geometry, material)
  },
];
