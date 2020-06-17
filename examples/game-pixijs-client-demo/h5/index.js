// 游戏素材的设计分辨率
let defaultWidthPixel = 1080;

//终端的实际分辨率
let width = window.innerWidth;
let height = window.innerHeight;

//以终端的宽度为准,计算相对设计分辨率的游戏画面伸缩比例
let ratio = width / defaultWidthPixel;

//游戏画面宽度,以设计分辨率为准
let showWidth = defaultWidthPixel
//游戏画面高度,  showHeight = height / (width / defaultWidthPixel)
let showHeight = height / ratio

//地牢的围墙宽度
let containerPadding = 50;

//地牢的宽度
let containerWidth = showWidth - containerPadding;
//地牢的高度
let containerHeight = showHeight - containerPadding;

console.log('game size:' + width + " x " + height + " defaultWidthPixel:" + defaultWidthPixel);


let Application = PIXI.Application,
  Container = PIXI.Container,
  resources = PIXI.loader.resources,
  Graphics = PIXI.Graphics,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

//Create a Pixi Application
let app = new Application({
  width: showWidth,
  height: showHeight,
  antialiasing: true,
  transparent: false,
  backgroundColor: 0x757161,
  resolution: ratio,//指定游戏画面整体伸缩比例
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


let state, explorer, huyazai, blobs, chimes, exit, player, dungeon,
  door, healthBar, message, gameScene, gameOverScene, enemies, id,
  huyazaiTexture1, huyazaiTexture2;

var moveDirect, moveDirectDef, againBt, againBtBg, againBtContainer, bgAudio;


/**
 * 初始化游戏主场景
 */
function initGameMainScene() {

  //播放背景音乐
  bgAudio = document.createElement("audio");
  bgAudio.setAttribute("src", "./audio/bg.mp3");
  bgAudio.setAttribute("loop", true);
  bgAudio.play();
  
  //pc端浏览器限制,音频无法自动播放,必须用户点击一下鼠标才能开始播放
  document.addEventListener("mousedown", function (e) {
    if (bgAudio.paused) { //判读是否播放  
      bgAudio.play(); //没有就播放 
    }
  }, false);


  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);


  //调用小程序API获得版本信息
  window['hyExt'].env.getVersionType().then(versionInfo => {
    log('获取当前小程序版本信息成功，返回：' + JSON.stringify(versionInfo))

    let vName;
    switch (versionInfo.versionType) {
      case 1:
        vName = '开发版本'
        break;
      case 2:
        vName = '测试版本'
        break;
      case 3:
        vName = '正式版本'
        break;
    }
    let vTips = new Text("小游戏版本:" + vName, new TextStyle({
      fontFamily: "Futura",
      fontSize: 30,
      fill: "white",
      fontWeight: 'bold',
      stroke: '#4a1850',
      strokeThickness: 2,
    }));
    vTips.x = 10;
    vTips.y = showHeight - 60;
    gameScene.addChild(vTips);
  }).catch(err => {
    log('获取当前小程序版本信息失败，错误信息：' + err.message)
  })


  //Dungeon
  dungeon = new Sprite(PIXI.Texture.from('images/dungeon.png'));
  dungeon.width = showWidth;
  dungeon.height = showHeight;
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(PIXI.Texture.from('images/door.png'));
  door.width = 64;
  door.height = 64;
  door.position.set(50, 0);
  gameScene.addChild(door);

  //Explorer
  explorer = new Sprite(PIXI.Texture.from('images/explorer.png'));
  explorer.width = 63;
  explorer.height = 96;
  explorer.x = 20;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;

  gameScene.addChild(explorer);


  // create a texture from an image path
  huyazaiTexture1 = PIXI.Texture.from('images/huyazai.png');

  // create a second texture
  huyazaiTexture2 = PIXI.Texture.from('images/huyazai2.png');

  // create a new Sprite using the texture
  huyazai = new PIXI.Sprite(huyazaiTexture1);

  //huyazai
  // huyazai =  PIXI.Sprite.from('images/huyazai.png'); 
  huyazai.anchor.set(0.5);
  huyazai.x = gameScene.width - 100;
  huyazai.y = gameScene.height / 2 - huyazai.height / 2;
  gameScene.addChild(huyazai);

  //Make the blobs
  let numberOfBlobs = 8,
    spacing = 90,
    xOffset = 120,
    speed = 8,
    direction = 1;

  //An array to store all the blob monsters
  blobs = [];


  let klTexture = PIXI.Texture.from('images/kl.png');

  //Make as many blobs as there are `numberOfBlobs`
  for (let i = 0; i < numberOfBlobs; i++) {

    //Make a blob
    let blob = new Sprite(klTexture);

    //Space each blob horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first blob should be added
    let x = spacing * i + xOffset;

    //Give the blob a random y position
    let y = randomInt(0, app.stage.height - blob.height);

    //Set the blob's position
    blob.x = x;
    blob.y = y;

    // console.log("blob:" + x);

    //Set the blob's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the blob will
    //move up. Multiplying `direction` by `speed` determines the blob's
    //vertical direction
    blob.vy = speed * direction;

    //Reverse the direction for the next blob
    direction *= -1;

    //Push the blob into the `blobs` array
    blobs.push(blob);

    //Add the blob to the `gameScene`
    gameScene.addChild(blob);
  }

  //血条
  healthBar = new HealthBar(gameScene,
    { showWidth: showWidth });

  // 摇杆
  var joystick = new Joystick(gameScene,
    {
      outer: "./images/Joystick.png",//摇杆的背景
      inner: "./images/SmallHandleFilled.png", //摇杆中心
      rockerX: showWidth / 2, //摇杆的x坐标 
      rockerY: showHeight - 200, //摇杆的y坐标
      outerScale: {
        x: 0.8,
        y: 0.8,
      },
      innerScale: {
        x: 1,
        y: 1
      },
      onJoyStickMove: function () {
        console.log('onJoyStickMove:');
      },
      onJoyStickEnd: function () {
        console.log('onJoyStickEnd:');
        moveDirect = null;
      },
      onJoyStickMove: function (stickObj) {
        //console.log('onJoyStickMove:' + JSON.stringify(stickObj));
        moveDirect = stickObj.direct;
      }
    });

  moveDirectDef = joystick.getMoveDirectDef();

  //Set the game state
  state = playScenceLoop;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

/**
 * 初始化游戏结束场景
 */
function initGameOverScene() {

  //Create the `gameOver` scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);

  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;

  //Create the text sprite and add it to the `gameOver` scene
  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 80,
    fill: "white",
    align: 'center',
  });
  message = new Text("游戏结束!", style);
  message.x = showWidth / 2;
  message.y = showHeight / 2;
  message.anchor.set(0.5);
  gameOverScene.addChild(message);


  new Button(gameOverScene, {
    text: '再来一局', onPointerup: () => {
      reStart();
    }
  });

}


/**
 * 重新开局
 */
function reStart() {
  explorer.x = 20;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;

  healthBar.setWidth(128);

  huyazai.texture = huyazaiTexture1;

  huyazai.x = gameScene.width - 100;
  huyazai.y = gameScene.height / 2 - huyazai.height / 2;
  huyazai.catch = false;

  gameScene.visible = true;
  gameOverScene.visible = false;

  //播放背景音乐
  bgAudio.play();

  state = playScenceLoop;

}


/**
 * 玩家移动
 */
function doMove() {
  if (moveDirect != null) {
    let movePix = 5;
    switch (moveDirect) {
      case moveDirectDef.BOTTOM:
        explorer.y = explorer.y + movePix;
        break;
      case moveDirectDef.TOP:
        explorer.y = explorer.y - movePix;
        break;
      case moveDirectDef.LEFT:
        explorer.x = explorer.x - movePix;
        break;
      case moveDirectDef.RIGHT:
        explorer.x = explorer.x + movePix;
        break;
      case moveDirectDef.TOP_LEFT:
        explorer.x = explorer.x - movePix;
        explorer.y = explorer.y - movePix;
        break;
      case moveDirectDef.TOP_RIGHT:
        explorer.x = explorer.x + movePix;
        explorer.y = explorer.y - movePix;
        break;
      case moveDirectDef.BOTTOM_LEFT:
        explorer.x = explorer.x - movePix;
        explorer.y = explorer.y + movePix;
        break;
      case moveDirectDef.BOTTOM_RIGHT:
        explorer.x = explorer.x + movePix;
        explorer.y = explorer.y + movePix;
        break;
    }
  }
}

/**
 * 游戏主场景循环
 * @param {*} delta 
 */
function playScenceLoop(delta) {
  doMove();

  //use the explorer's velocity to make it move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  //Contain the explorer inside the area of the dungeon
  contain(explorer, { x: containerPadding, y: containerPadding, width: containerWidth, height: containerHeight });
  //contain(explorer, stage);

  //Set `explorerHit` to `false` before checking for a collision
  let explorerHit = false;

  //Loop through all the sprites in the `enemies` array
  blobs.forEach(function (blob) {

    //Move the blob
    blob.y += blob.vy;

    //Check the blob's screen boundaries
    let blobHitsWall = contain(blob, { x: containerPadding, y: containerPadding, width: containerWidth, height: containerHeight });

    //If the blob hits the top or bottom of the stage, reverse
    //its direction
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }

    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if (hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }
  });

  //如果当前帧被怪碰到
  if (explorerHit) {

    //如果前一帧还没被怪碰到
    if (explorer.hit != 1) {
      //Make the explorer semi-transparent
      explorer.alpha = 0.5;
      explorer.hit = 1;

      //Reduce the width of the health bar's inner rectangle by 1 pixel
      healthBar.setWidth(healthBar.getWidth() - 1);

      //播放音效
      let y = document.createElement("audio");
      y.setAttribute("src", "./audio/rivalHp.mp3");
      y.play();

    } else {
      //如果前一帧已经被怪碰到就什么都不做
    }

  } else {
    //如果当前帧没有被怪碰到
    explorer.alpha = 1;
    explorer.hit = 0;
  }

  //Check for a collision between the explorer and the huyazai
  if (hitTestRectangle(explorer, huyazai)) {

    if (huyazai.catch != true) {
      //播放音效
      let y = document.createElement("audio");
      y.setAttribute("src", "./audio/face.mp3");
      y.play();
    }

    //If the huyazai is touching the explorer, center it over the explorer
    huyazai.x = explorer.x + 25;
    huyazai.y = explorer.y - 25;
    huyazai.texture = huyazaiTexture2;
    huyazai.catch = true;
  }


  if (healthBar.getWidth() < 0) {
    state = endScenceLoop;
    message.text = "你输了!";

    //播放音效
    let y = document.createElement("audio");
    y.setAttribute("src", "./audio/lose.mp3");
    y.play();

    bgAudio.pause();
  }

  if (hitTestRectangle(huyazai, door)) {
    state = endScenceLoop;
    message.text = "你赢了!";

    //播放音效
    let y = document.createElement("audio");
    y.setAttribute("src", "./audio/win.mp3");
    y.play();

    bgAudio.pause();
  }
}

/**
 * 游戏结束
 */
function endScenceLoop() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}


/**
 * 游戏主循环
 * @param {*} delta 
 */
function gameLoop(delta) {
  state(delta);
}



initGameMainScene();
initGameOverScene();