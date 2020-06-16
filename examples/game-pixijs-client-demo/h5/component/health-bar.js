/**
 * 血条demo
 * 注意: 仅为示例,逻辑不完整,请勿在正式环境使用
 * @param {*} gameScene 
 * @param {*} opts 
 */
function HealthBar(gameScene, opts) {
    this.settings = opts;

    let healthTip = new Text("血量：", {
        fontFamily: "Futura",
        fontSize: 23,
        fill: ['red'],
        stroke: '#ffffff',
        strokeThickness: 4,
    });

    healthTip.x = this.settings.showWidth - 240;
    healthTip.y = 4;
    gameScene.addChild(healthTip);

    //Create the health bar
    this.healthBar = new Container();
    this.healthBar.position.set(this.settings.showWidth - 170, 4)
    gameScene.addChild(this.healthBar);

    //Create the black background rectangle
    let innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 10, 128, 12);
    innerBar.endFill();
    this.healthBar.addChild(innerBar);

    //Create the front red rectangle
    let outerBar = new Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 10, 128, 12);
    outerBar.endFill();
    this.healthBar.addChild(outerBar);

    this.healthBar.outer = outerBar;
}

HealthBar.prototype.setWidth = function (width) {
    this.healthBar.outer.width = width;
}

HealthBar.prototype.getWidth = function () {
    return this.healthBar.outer.width;
}





