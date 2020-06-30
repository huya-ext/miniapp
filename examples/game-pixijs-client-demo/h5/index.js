// 游戏素材的设计分辨率
let defaultWidthPixel = 1080;

//终端的实际分辨率
let width = window.innerWidth;
let height = window.innerHeight;

//像素转换
var pixelConv = new PixelConversion(defaultWidthPixel, width);
PIXI.pixelConv = pixelConv;
console.log('pixelConversion: 100 -> ' + PIXI.pixelConv.convert(100));

//游戏画面宽度,
let showWidth = width
//游戏画面高度,
let showHeight = height

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
  resolution: 1,
  // resizeTo: window,//指定窗口大小改变自动resize
}
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);


let state, explorer, huyazai, blobs, chimes, exit, player, dungeon,
  door, healthBar, message, gameScene, gameOverScene, enemies, id,
  huyazaiTexture1, huyazaiTexture2, vTips, joystick,restartButton;

var moveDirect, moveDirectDef, againBt, againBtBg, againBtContainer;


/**
 * 初始化游戏主场景
 */
function initGameMainScene() {


  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);


  //调用小程序API获得版本信息
  if (window['hyExt'] != undefined) {
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
      vTips = new Text("小游戏版本:" + vName, new TextStyle({
        fontFamily: "Futura",
        fontSize: PIXI.pixelConv.convert(30),
        fill: "white",
        fontWeight: 'bold',
        stroke: '#4a1850',
        strokeThickness: 2,
      }));
      gameScene.addChild(vTips);

      vTips.x = PIXI.pixelConv.convert(10);
      vTips.y = showHeight - PIXI.pixelConv.convert(60);

    }).catch(err => {
      log('获取当前小程序版本信息失败，错误信息：' + err.message)
    })
  }

  //Dungeon
  dungeon = new Sprite(PIXI.Texture.from('images/dungeon.png'));
  gameScene.addChild(dungeon);

  //Door
  door = new Sprite(PIXI.Texture.from('images/door.png'));

  gameScene.addChild(door);

  //Explorer
  explorer = new Sprite(PIXI.Texture.from('images/explorer.png'));


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

  gameScene.addChild(huyazai);

  //Make the blobs
  let numberOfBlobs = 8,
    spacing = PIXI.pixelConv.convert(100),
    xOffset = PIXI.pixelConv.convert(120),
    speed = PIXI.pixelConv.convert(8),
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
  joystick = new Joystick(gameScene,
    {
      outer: "./images/Joystick.png",//摇杆的背景
      inner: "./images/SmallHandleFilled.png", //摇杆中心
      rockerX: showWidth / 2, //摇杆的x坐标 
      rockerY: showHeight - PIXI.pixelConv.convert(200), //摇杆的y坐标
      outerScale: {
        x: PIXI.pixelConv.convert(0.8),
        y: PIXI.pixelConv.convert(0.8),
      },
      innerScale: {
        x: PIXI.pixelConv.convert(1),
        y: PIXI.pixelConv.convert(1)
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

  //显示
  showGameMainScene();

  //Set the game state
  state = playScenceLoop;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

/**
 *  显示主场景
 */
function showGameMainScene() {
  console.log('showGameMainScene');

  healthBar.setPosition(showWidth - PIXI.pixelConv.convert(250), PIXI.pixelConv.convert(4));


  if (vTips) {
    vTips.x = PIXI.pixelConv.convert(10);
    vTips.y = showHeight - PIXI.pixelConv.convert(60);
    console.log('vTips.y:'+ vTips.y);
  }

  dungeon.width = showWidth;
  dungeon.height = showHeight;


  door.width = PIXI.pixelConv.convert(64);
  door.height = PIXI.pixelConv.convert(64);
  door.position.set(PIXI.pixelConv.convert(50), 0);

  explorer.width = PIXI.pixelConv.convert(63);
  explorer.height = PIXI.pixelConv.convert(96);
  explorer.x = PIXI.pixelConv.convert(20);
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;

  huyazai.width = PIXI.pixelConv.convert(100);
  huyazai.height = PIXI.pixelConv.convert(89);

  huyazai.x = gameScene.width - PIXI.pixelConv.convert(150);
  huyazai.y = gameScene.height / 2 - huyazai.height / 2;

  
  joystick.position(showWidth / 2,
    showHeight - PIXI.pixelConv.convert(200));

  //Make the blobs
  let numberOfBlobs = 8,
    spacing = PIXI.pixelConv.convert(100),
    xOffset = PIXI.pixelConv.convert(120),
    speed = PIXI.pixelConv.convert(8),
    direction = 1;

  //Make as many blobs as there are `numberOfBlobs`
  for (let i = 0; i < numberOfBlobs; i++) {

    //Make a blob
    let blob = blobs[i];

    //Space each blob horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first blob should be added
    let x = spacing * i + xOffset;

    //Give the blob a random y position
    let y = randomInt(0, app.stage.height - blob.height);

    blob.width = PIXI.pixelConv.convert(100);
    blob.height = PIXI.pixelConv.convert(89);
    
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
  }

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
  message = new Text("游戏结束!", {
    fontSize: PIXI.pixelConv.convert(80),
    fill: "white",
    align: 'center',
  });

  message.anchor.set(0.5);
  gameOverScene.addChild(message);


  restartButton = new Button(gameOverScene, {
    text: '再来一局', onPointerup: () => {
      reStart();
    }
  });

  showGameOverScene();

}

/**
 *  显示游戏结束场景
 */
function showGameOverScene() {
  message.x = showWidth / 2;
  message.y = showHeight / 2;

  restartButton.resize();
}


/**
 * 重新开局
 */
function reStart() {
  explorer.x = PIXI.pixelConv.convert(20);
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;

  healthBar.setWidth(PIXI.pixelConv.convert(128));

  huyazai.texture = huyazaiTexture1;

  huyazai.x = gameScene.width - PIXI.pixelConv.convert(100);
  huyazai.y = gameScene.height / 2 - huyazai.height / 2;
  huyazai.catch = false;

  gameScene.visible = true;
  gameOverScene.visible = false;


  state = playScenceLoop;

}


/**
 * 玩家移动
 */
function doMove() {
  if (moveDirect != null) {
    let movePix = PIXI.pixelConv.convert(5);
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

  //地牢的围墙宽度
  let containerPadding = PIXI.pixelConv.convert(50);

  //地牢的宽度
  let containerWidth = showWidth - containerPadding;

  //地牢的高度
  let containerHeight = showHeight - containerPadding;


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
      healthBar.setWidth(healthBar.getWidth() - PIXI.pixelConv.convert(10));

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
    huyazai.x = explorer.x + PIXI.pixelConv.convert(25);
    huyazai.y = explorer.y - PIXI.pixelConv.convert(25);
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

  }

  if (hitTestRectangle(huyazai, door)) {
    state = endScenceLoop;
    message.text = "你赢了!";

    //播放音效
    let y = document.createElement("audio");
    y.setAttribute("src", "./audio/win.mp3");
    y.play();

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

/**
 * 监听窗口大小改变
 */
function onWindowReSize() {
  //终端的实际分辨率
  width = window.innerWidth;
  height = window.innerHeight;

  PIXI.pixelConv.resize(width);

  //游戏画面宽度,
  showWidth = width
  //游戏画面高度,
  showHeight = height

  console.log('game size:' + width + " x " + height + " defaultWidthPixel:" + defaultWidthPixel);

  app.renderer.resize(width, height);

  showGameMainScene();
  showGameOverScene();

}

initGameMainScene();
initGameOverScene();

// Set resize event
window.addEventListener('resize', onWindowReSize);
