/**
 * 血条demo
 * 注意: 仅为示例,逻辑不完整,请勿在正式环境使用
 * @param {*} gameScene 
 * @param {*} opts 
 */
function HealthBar(gameScene, opts) {
    this.settings = opts;

    this.healthBarWrap = new Container();
    this.healthBarWrap.position.set(this.settings.showWidth - PIXI.pixelConv.convert(250), PIXI.pixelConv.convert(4))

    this.healthTip = new Text("血量：", {
        fontFamily: "Futura",
        fontSize: PIXI.pixelConv.convert(30),
        fill: ['red'],
        stroke: '#ffffff',
        strokeThickness: PIXI.pixelConv.convert(4),
    });

    // this.healthTip.x = this.settings.showWidth - PIXI.pixelConv.convert(240);
    // this.healthTip.y = PIXI.pixelConv.convert(4);
    this.healthBarWrap.addChild(this.healthTip);

    //Create the health bar
    this.healthBar = new Container();
    this.healthBar.x = PIXI.pixelConv.convert(80);
    this.healthBar.y = PIXI.pixelConv.convert(6);


    //Create the black background rectangle
    let innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, PIXI.pixelConv.convert(10), PIXI.pixelConv.convert(128), PIXI.pixelConv.convert(12));
    innerBar.endFill();
    this.healthBar.addChild(innerBar);

    //Create the front red rectangle
    let outerBar = new Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, PIXI.pixelConv.convert(10), PIXI.pixelConv.convert(128), PIXI.pixelConv.convert(12));
    outerBar.endFill();
    this.healthBar.addChild(outerBar);

    this.healthBar.outer = outerBar;

    this.healthBarWrap.addChild(this.healthBar);

    gameScene.addChild(this.healthBarWrap);
}

HealthBar.prototype.setWidth = function (width) {
    this.healthBar.outer.width = width;
}

HealthBar.prototype.getWidth = function () {
    return this.healthBar.outer.width;
}

HealthBar.prototype.setPosition = function (x, y) {
    this.healthBarWrap.x = x;
    this.healthBarWrap.y = y;
}




