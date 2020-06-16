/**
 * 按钮组件,demo
 * 注意: 仅为示例,逻辑不完整,请勿在正式环境使用
 * @param {*} scene 
 * @param {*} opts 
 */
function Button(scene, opts) {
    let that = this;
    this.settings = opts;

    againBtContainer = new Container();

    //Create the front red rectangle
    againBtBg = new Graphics();
    drawBtBg(false);
    againBtContainer.addChild(againBtBg);

    againBt = new Text(this.settings.text, {
        fontFamily: "Futura",
        fontSize: 60,
        fill: "white",
        align: 'center',
    });
    againBt.x = againBtBg.width / 2;
    againBt.y = againBtBg.height / 2;
    againBt.anchor.set(0.5);
    againBtContainer.addChild(againBt);

    againBt.interactive = true;
    againBt.buttonMode = true;
    againBt.on('pointerdown', onPointerdown)
        .on('pointerup', onPointerup)
        .on('pointerupoutside', onPointerup)

    againBtContainer.x = showWidth / 2 - againBtContainer.width / 2;
    againBtContainer.y = showHeight / 2 + message.height;

    againBtContainer.outer = againBt;

    scene.addChild(againBtContainer);


    function onPointerdown(event) {
        console.log("event:onPointerdown:" + (event.data ? (event.data.global.x + " " + event.data.global.y) : ""));
        drawBtBg(true);
        that.settings.onPointerdown && that.settings.onPointerdown();
    };

    function onPointerup(event) {
        console.log("event:onPointerup:" + (event.data ? (event.data.global.x + " " + event.data.global.y) : ""));
        drawBtBg(false);
        that.settings.onPointerup && that.settings.onPointerup();
    };


    /**
     * 修改再来一次按钮的背景色
     * @param {*} isAct 
     */
    function drawBtBg(isAct) {
        var color = 0xe33e33;
        if (isAct) {
            color = 0xf66f66;
        }
        againBtBg.beginFill(color);
        againBtBg.drawRoundedRect(0, 0, 300, 100, 10);
        againBtBg.endFill();
    }
}






