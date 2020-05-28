import { randomArrayElm, rangeNumberInclusive, colors } from './utils';

/**
 * 地图创造器，主要提供给多人同屏功能使用
 */
class MapCreator {
  // 初始化地图配置
  initMapConfig() {
    const base = 750;
    const configs = [];
    const [min, max] = [~~(base / 6), ~~(base / 3.5)];
    const propDistanceRange = [~~(min / 2), max * 2];

    for (let i = 0; i < 10; i++) {
      // 随机颜色
      const color = randomArrayElm(colors);
      // 随机大小，头2个盒子固定一下大小
      const size = i < 2 ? max : rangeNumberInclusive(min, max);
      // 随机形状
      const shape = i < 2 ? 0 : randomArrayElm([0, 1]);
      // 根据区间随机一个距离
      const distance = rangeNumberInclusive(...propDistanceRange);
      // 随机2个方向 x or z
      const direction = i < 3 ? 'z' : Math.round(Math.random()) === 0 ? 'x' : 'z';
      configs.push({
        color,
        size,
        shape,
        distance,
        direction,
      });
    }

    return configs;
  }
}

export default MapCreator;
