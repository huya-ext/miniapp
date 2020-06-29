import * as THREE from 'three';
import { animate, destroyMesh, compare, findValue } from './utils';
import { MeshText2D, SpriteText2D, textAlign } from 'three-text2d';

/**
 * 场景类
 */
class Stage {
  constructor({
    world,
    width,
    height,
    canvas,
    axesHelper = false, // 辅助线
    cameraNear, // 相机近截面
    cameraFar, // 相机远截面
    cameraInitalPosition, // 相机初始位置
    lightInitalPosition, // 光源初始位置
    textInitalPosition, // 初始位置
  }) {
    this.world = world;
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.axesHelper = axesHelper;
    // 正交相机配置
    this.cameraNear = cameraNear;
    this.cameraFar = cameraFar;
    this.cameraInitalPosition = cameraInitalPosition;
    this.lightInitalPosition = lightInitalPosition;
    this.textInitalPosition = textInitalPosition;

    this.scene = null;
    this.plane = null;
    this.light = null;
    this.camera = null;
    this.renderer = null;

    this.clickName = __isMobile ? 'touchstart' : 'click';

    this.init();
  }

  init() {
    this.createScene();
    this.createPlane();
    this.createLight();
    this.createCamera();
    this.createRenterer();
    // this.createText();
    this.createHud();
    // this.changeEndHud();
    this.render();
  }

  // 场景销毁
  destroy() {
    destroyMesh(this.camera);
    destroyMesh(this.light);
    destroyMesh(this.plane);

    this.scene.remove(this.camera);
    this.scene.remove(this.light);
    this.scene.remove(this.plane);
    this.scene.children.forEach(destroyMesh);
    this.scene.children = null;

    this.scene.dispose();
    this.renderer.dispose();

    this.canvas = null;
    this.scene = null;
    this.plane = null;
    this.light = null;
    this.camera = null;
    this.text = 0;

    this.renderer = null;
  }

  // 重置场景到初始状态
  reset() {
    const { plane, light, lightTarget, lightInitalPosition, camera, cameraInitalPosition } = this;
    plane.position.x = 0;
    plane.position.z = 0;
    lightTarget.position.x = 0;
    lightTarget.position.z = 0;
    light.position.set(lightInitalPosition.x, lightInitalPosition.y, lightInitalPosition.z);
    camera.position.x = cameraInitalPosition.x;
    camera.position.z = cameraInitalPosition.z;
  }

  // 场景
  createScene() {
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0xd6dbdf);

    if (this.axesHelper) {
      scene.add(new THREE.AxesHelper(10e3));
    }
  }

  createText() {
    const { textInitalPosition } = this;
    this.text = new SpriteText2D('0', { align: textAlign.right, font: '30px Arial', fillStyle: '#000000', antialias: true });
    this.text.position.set(textInitalPosition.x, textInitalPosition.y, textInitalPosition.z);
    this.add(this.text);
  }

  // 地面
  createPlane() {
    const { scene } = this;
    const geometry = new THREE.PlaneBufferGeometry(10e2, 10e2, 1, 1);
    const meterial = new THREE.ShadowMaterial();
    meterial.opacity = 0.5;

    const plane = (this.plane = new THREE.Mesh(geometry, meterial));

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -0.1;
    // 接收阴影
    plane.receiveShadow = true;
    scene.add(plane);
  }

  // 光
  createLight() {
    const {
      scene,
      lightInitalPosition: { x, y, z },
      height,
    } = this;
    const light = (this.light = new THREE.DirectionalLight(0xffffff, 0.5));
    const lightTarget = (this.lightTarget = new THREE.Object3D());

    light.target = lightTarget;
    light.position.set(x, y, z);
    // 开启阴影投射
    light.castShadow = true;
    // // 定义可见域的投射阴影
    light.shadow.camera.left = -height;
    light.shadow.camera.right = height;
    light.shadow.camera.top = height;
    light.shadow.camera.bottom = -height;
    light.shadow.camera.near = 0;
    light.shadow.camera.far = 2000;
    // 定义阴影的分辨率
    light.shadow.mapSize.width = 1600;
    light.shadow.mapSize.height = 1600;

    // 环境光
    scene.add(new THREE.AmbientLight(0xe5e7e9, 0.4));
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2));
    scene.add(lightTarget);
    scene.add(light);
  }

  // 相机
  createCamera() {
    const {
      scene,
      width,
      height,
      cameraInitalPosition: { x, y, z },
      cameraNear,
      cameraFar,
    } = this;

    // 这里使用正交相机，注意正交相机和透视相机是有区别的
    const camera = (this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      cameraNear,
      cameraFar
    ));

    // 使用透视相机
    // const camera = (this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, cameraNear, cameraFar));

    camera.position.set(x, y, z);
    camera.lookAt(scene.position);
    scene.add(camera);
  }

  // 渲染器
  createRenterer() {
    const { canvas, width, height } = this;
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // 透明场景
      antialias: true, // 抗锯齿
    }));

    renderer.setSize(width, height);
    // 开启阴影
    renderer.shadowMap.enabled = true;
    // 设置设备像素
    renderer.setPixelRatio(window.devicePixelRatio);
  }

  // 执行渲染（这里为多场景渲染，一个是游戏3D场景，另一个是2D HUD场景）
  render() {
    const { scene, camera, hudScene, hudCamera } = this;
    this.renderer.autoClear = false;
    this.renderer.clear();
    this.renderer.render(scene, camera);
    this.renderer.clearDepth();
    this.renderer.render(hudScene, hudCamera);
  }

  createHud() {
    const hudScene = (this.hudScene = new THREE.Scene());
    if (this.axesHelper) {
      hudScene.add(new THREE.AxesHelper(10e3));
    }
    // const hudCamera = (this.hudCamera = new THREE.PerspectiveCamera(
    //   50,
    //   this.width / this.height,
    //   0.1,
    //   2000
    // ));
    const hudCamera = (this.hudCamera = new THREE.OrthographicCamera(
      -this.width / 2,
      this.width / 2,
      this.height / 2,
      -this.height / 2,
      this.cameraNear,
      this.cameraFar
    ));

    hudScene.add(hudCamera);
    hudCamera.position.set(0, 0, 1000);
    hudCamera.lookAt(0, 0, 0);
  }

  changeStartHud() {
    while (this.hudScene.children.length) {
      this.hudScene.remove(this.hudScene.children[0]);
    }

    // 制作2D canvas内容,作为离屏canvas使用,后续要增加排行榜等功能，也可用此方式
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.width; //屏幕的宽高
    this.hudCanvas.height = this.height;
    this.context = this.hudCanvas.getContext('2d');
    this.context.fillStyle = 'rgba(219, 219, 219, 1)';
    this.context.fillRect(0, 0, this.width, this.height);

    // this.context.restore();
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(32)}px Arial`;
    this.context.fillText('跳一跳', this.width / 2, this.height / 3);
    // this.context.save();

    this.context.strokeStyle = 'black';
    // this.context.lineJoin = 'round';
    this.context.lineWidth = setPx(3);
    this.context.strokeRect(this.width / 2 - setPx(60), (this.height * 3) / 4 - setPx(50), setPx(120), setPx(50));

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(20)}px Arial`;
    this.context.fillText('开始游戏', this.width / 2, (this.height * 3) / 4 - setPx(25));

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(18)}px Arial`;
    this.context.fillText('多人游戏 >', this.width / 2, (this.height * 3) / 4 + setPx(40));

    this.changeTexture();

    this.clickFunc = (event) => {
      const { touches } = event;
      const _event = touches ? event.touches[0] : event;
      const { clientX, clientY } = _event;
      const { width, height } = this;
      let beginX = width / 2 - setPx(60);
      let endX = width / 2 + setPx(60);
      let endY = (height * 3) / 4;
      let beginY = endY - setPx(50);
      // 开始游戏
      if (clientX >= beginX && clientX <= endX && clientY >= beginY && clientY <= endY) {
        this.world.setType(1);
        this.canvas.removeEventListener(this.clickName, this.clickFunc);
        this.world.reset();
      }

      beginX = width / 2 - setPx(60);
      endX = width / 2 + setPx(60);
      endY = (height * 3) / 4 + setPx(49);
      beginY = endY - setPx(18);
      // 多人运动
      if (clientX >= beginX && clientX <= endX && clientY >= beginY && clientY <= endY) {
        this.world.setType(2);
        this.canvas.removeEventListener(this.clickName, this.clickFunc);
        this.changeMiddleHud('连接中...');
        this.world.initWss();
      }
    };

    // 这里给整个canvas增加点击事件，通过坐标找到重新开始点击按钮
    this.canvas.addEventListener(this.clickName, this.clickFunc, false);
  }

  changeMiddleHud(text = '', isShowBtn) {
    // 制作2D canvas内容,作为离屏canvas使用,后续要增加排行榜等功能，也可用此方式
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.width; //屏幕的宽高
    this.hudCanvas.height = this.height;
    this.context = this.hudCanvas.getContext('2d');
    this.context.fillStyle = 'rgba(219, 219, 219, 1)';
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(22)}px Arial`;
    this.context.fillText(text, this.width / 2, this.height / 2);

    if (isShowBtn) {
      this.context.strokeStyle = 'black';
      // this.context.lineJoin = 'round';
      this.context.lineWidth = setPx(3);
      this.context.strokeRect(this.width / 2 - setPx(60), (this.height * 3) / 4 - setPx(50), setPx(120), setPx(50));

      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = '#000';
      this.context.font = `${setPx(20)}px Arial`;
      this.context.fillText('返回首页', this.width / 2, (this.height * 3) / 4 - setPx(25));

      this.clickFunc = (event) => {
        const { touches } = event;
        const _event = touches ? event.touches[0] : event;
        const { clientX, clientY } = _event;
        const { width, height } = this;
        let beginX = width / 2 - setPx(60);
        let endX = width / 2 + setPx(60);
        let endY = (height * 3) / 4;
        let beginY = endY - setPx(50);
        // 开始游戏
        if (clientX >= beginX && clientX <= endX && clientY >= beginY && clientY <= endY) {
          this.canvas.removeEventListener(this.clickName, this.clickFunc);
          this.changeStartHud();
        }
      };

      // 这里给整个canvas增加点击事件，通过坐标找到重新开始点击按钮
      this.canvas.addEventListener(this.clickName, this.clickFunc, false);
    }

    this.changeTexture();
  }

  changeMatchHud() {
    const length = this.world.wss ? this.world.wss.players.length : 1;

    this.canvas.removeEventListener(this.clickName, this.clickFunc);
    this.hudScene.remove(this.scorePlane);

    // 制作2D canvas内容,作为离屏canvas使用,后续要增加排行榜等功能，也可用此方式
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.width; //屏幕的宽高
    this.hudCanvas.height = this.height;
    this.context = this.hudCanvas.getContext('2d');
    this.context.fillStyle = 'rgba(219, 219, 219, 1)';
    this.context.fillRect(0, 0, this.width, this.height);

    // this.context.restore();
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(30)}px Arial`;
    this.context.fillText('当前房间人数：', this.width / 2, this.height / 3);
    // this.context.save();

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = 'red';
    this.context.font = `${setPx(40)}px Arial`;
    this.context.fillText(length, this.width / 2, this.height / 3 + setPx(70));

    if (length > 1) {
      if (__isAnchor) {
        this.context.strokeStyle = 'black';
        // this.context.lineJoin = 'round';
        this.context.lineWidth = setPx(3);
        this.context.strokeRect(this.width / 2 - setPx(60), (this.height * 3) / 4 - setPx(50), setPx(120), setPx(50));

        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = '#000';
        this.context.font = `${setPx(20)}px Arial`;
        this.context.fillText('开始游戏', this.width / 2, (this.height * 3) / 4 - setPx(25));
        
        this.clickFunc = (event) => {
          const { touches } = event;
          const _event = touches ? event.touches[0] : event;
          const { clientX, clientY } = _event;
          const { width, height } = this;
          let beginX = width / 2 - setPx(60);
          let endX = width / 2 + setPx(60);
          let endY = (height * 3) / 4;
          let beginY = endY - setPx(50);
          // 开始游戏
          if (clientX >= beginX && clientX <= endX && clientY >= beginY && clientY <= endY) {
            // this.world.setType(2);
            this.canvas.removeEventListener(this.clickName, this.clickFunc);
            this.world.wss.sendStartGame();
            // this.hudScene.remove(this.scorePlane);
            // this.world.reset();
          }
        };

        // 这里给整个canvas增加点击事件，通过坐标找到重新开始点击按钮
        this.canvas.addEventListener(this.clickName, this.clickFunc, false);
      } else {
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = '#000';
        this.context.font = `${setPx(18)}px Arial`;
        this.context.fillText('等待主播开始游戏，请耐心等待...', this.width / 2, (this.height * 3) / 4 - setPx(25));
      }
    } else {
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = '#000';
      this.context.font = `${setPx(18)}px Arial`;
      this.context.fillText('要两人以上才能开始游戏，请耐心等待...', this.width / 2, (this.height * 3) / 4 - setPx(25));
    }

    this.changeTexture();
  }

  changeGoHud() {
    while (this.hudScene.children.length) {
      this.hudScene.remove(this.hudScene.children[0]);
    }

    // 制作2D canvas内容,作为离屏canvas使用,后续要增加排行榜等功能，也可用此方式
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.width; //屏幕的宽高
    this.hudCanvas.height = this.height;
    this.context = this.hudCanvas.getContext('2d');
    this.context.clearRect(0, 0, this.width, this.height);

    this.context.textAlign = 'left';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#000';
    this.context.font = `${setPx(30)}px Arial`;
    this.context.fillText(this.world.count, setPx(60), setPx(60));

    if (this.world.type !== 1) {
      this.context.textAlign = 'right';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = '#000';
      this.context.font = `${setPx(20)}px Arial`;
      this.context.fillText(`倒计时：${this.world.wss.gameDuration - this.world.wss.timeLeft}`, this.width - setPx(30), setPx(55));

      const list = Object.keys(this.world.wss.playerMap).reduce(
        (_list, uid) => [..._list, ...[{ uid, value: this.world.wss.playerMap[uid] }]],
        []
      );
      list.sort(compare('value')).forEach((item, index) => {
        this.context.textAlign = 'right';
        this.context.textBaseline = 'middle';
        this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.context.font = `${setPx(12)}px Arial`;
        this.context.fillText(`${findValue(item.uid, this.world.wss.playerInfo, 'nick')}：${item.value}`, this.width - setPx(30), setPx(80) + (index + 1) * setPx(16));
      });
    }

    this.changeTexture();
  }

  changeEndHud(rank) {
    // 制作2D canvas内容,作为离屏canvas使用,后续要增加排行榜等功能，也可用此方式
    this.hudCanvas = document.createElement('canvas');
    this.hudCanvas.width = this.width; //屏幕的宽高
    this.hudCanvas.height = this.height;
    this.context = this.hudCanvas.getContext('2d');
    this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.context.fillRect(0, 0, this.width, this.height);

    // this.context.restore();
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#fff';
    this.context.font = `${setPx(30)}px Arial`;
    this.context.fillText('得分： ' + this.world.count, this.width / 2, this.height / 3);
    // this.context.save();

    if (rank) {
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = '#fff';
      this.context.font = `${setPx(30)}px Arial`;
      this.context.fillText('排名： ' + rank, this.width / 2, this.height / 3 + setPx(50));
    }

    this.context.strokeStyle = 'white';
    // this.context.lineJoin = 'round';
    this.context.lineWidth = setPx(3);
    this.context.strokeRect(this.width / 2 - setPx(60), (this.height * 3) / 4 - setPx(50), setPx(120), setPx(50));

    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#fff';
    this.context.font = `${setPx(22)}px Arial`;
    this.context.fillText('返回首页', this.width / 2, (this.height * 3) / 4 - setPx(25));

    this.changeTexture(1.5);

    this.clickFunc = (event) => {
      const { touches } = event;
      const _event = touches ? event.touches[0] : event;
      const { clientX, clientY } = _event;
      const { width, height } = this;
      const beginX = width / 2 - setPx(60);
      const endX = width / 2 + setPx(60);
      const _height = height / 1.5;
      const endY = (_height * 3) / 4 + (height - _height) / 2;
      const beginY = endY - setPx(50);
      if (clientX >= beginX && clientX <= endX && clientY >= beginY && clientY <= endY) {
        this.canvas.removeEventListener(this.clickName, this.clickFunc);
        this.changeStartHud();
      }
    };

    // 这里给整个canvas增加点击事件，通过坐标找到重新开始点击按钮
    this.canvas.addEventListener(this.clickName, this.clickFunc, false);
  }

  changeTexture(num = 1) {
    // 将canvas作为材质的一面贴上去
    this.geometry = new THREE.PlaneGeometry(this.width / num, this.height / num); // 按比例设置宽高
    this.scoreTexture = new THREE.CanvasTexture(this.hudCanvas);
    this.scoreTexture.minFilter = this.scoreTexture.magFilter = THREE.LinearFilter;
    this.scoreTexture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({
      map: this.scoreTexture,
      transparent: true,
      opacity: 1,
    });
    const scorePlane = (this.scorePlane = new THREE.Mesh(this.geometry, material));
    scorePlane.position.set(0, 0, 0);

    this.hudScene.add(scorePlane); // 将生成的平面添加到hudScene场景中即可
    this.render();
  }

  // 处理得分
  handleCount(isInit) {
    const { text } = this;
    isInit ? (text.text = '0') : text.text++;
    this.render();
  }

  // center为2个盒子的中心点
  moveCamera({ cameraTo, center, lightTo, textTo }, onComplete, duration) {
    const { camera, plane, light, lightTarget, lightInitalPosition, text } = this;
    // 移动相机
    animate(
      {
        from: { ...camera.position },
        to: cameraTo,
        duration,
      },
      ({ x, z }) => {
        camera.position.x = x;
        camera.position.z = z;
        this.render();
      },
      onComplete
    );

    // 灯光和目标也需要动起来，为了保证阴影位置不变
    const { x: lightInitalX, z: lightInitalZ } = lightInitalPosition;
    animate(
      {
        from: { ...light.position },
        to: lightTo,
        duration,
      },
      ({ x, y, z }) => {
        lightTarget.position.x = x - lightInitalX;
        lightTarget.position.z = z - lightInitalZ;
        light.position.set(x, y, z);
      }
    );

    // 移动文字
    // animate(
    //   {
    //     from: { ...text.position },
    //     to: textTo,
    //     duration,
    //   },
    //   ({ x, y, z }) => {
    //     text.position.x = x;
    //     // text.position.y = y;
    //     text.position.z = z;
    //     this.render();
    //   }
    // );

    // 保证不会跑出有限大小的地面
    plane.position.x = center.x;
    plane.position.z = center.z;
  }

  // 场景中添加物体
  add(...args) {
    return this.scene.add(...args);
  }
  // 移除场景中的物体
  remove(...args) {
    return this.scene.remove(...args);
  }
}

export default Stage;
