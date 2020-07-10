
/**
 * 虚拟摇杆控件
 * 注意: 仅为示例,逻辑不完整,请勿在正式环境使用
 * @param {*} parentContainer 
 * @param {*} opts 
 */
function Joystick(parentContainer, opts) {
    var that = this;

    this.MOVE_DIRECT = {
        LEFT: 'left',
        TOP: 'top',
        BOTTOM: 'bottom',
        RIGHT: 'right',
        TOP_LEFT: 'top_left',
        TOP_RIGHT: 'top_right',
        BOTTOM_LEFT: 'bottom_left',
        BOTTOM_RIGHT: 'bottom_right',
    }

    // {
    //     outer: "./images/Joystick.png",//摇杆的背景
    //     inner: "./images/SmallHandleFilled.png", //摇杆中心
    //     rockerX: 100, //摇杆的x坐标 
    //     rockerY: window.innerHeight - 100, //摇杆的y坐标
    //     outerScale: {
    //         x: 0.3,
    //         y: 0.3
    //     },
    //     innerScale: {
    //         x: 0.5,
    //         y: 0.5
    //     },
            // onJoyStickMove: function () {
            //     console.log('onJoyStickMove:');
            // },
            // onJoyStickEnd: function () {
            //     console.log('onJoyStickEnd:');
            //     moveDirect = null;
            // },
    //     onJoyStickMove: function (stickObj) {
    //          console.log('stickObj:' + JSON.stringify(stickObj));
    //     }
    // };

    this.settings = opts;

    this.parentContainer = parentContainer;
    this.containerJoystick = {};
    this.outer = {};
    this.inner = {};
    this.outerRadius = 0;//这是外置摇杆半径。
    this.innerRadius = 0;//这是摇内置摇杆的半径。

    console.log('Joystick init.');

    //加载相关资源
    that.loadResources(function () {
        that.initRocker();
    });
};

/**
 * 获得移动方向定义
 */
Joystick.prototype.getMoveDirectDef = function () {
    var that = this;
    return that.MOVE_DIRECT;
}


/**
 * 资源加载
 * @param {*} callback 
 */
Joystick.prototype.loadResources = function (callback) {
    var that = this;
    PIXI.loader.add('outer', that.settings.outer);
    PIXI.loader.add('inner', that.settings.inner);
    PIXI.loader.once('complete', function () {
        if (callback) {
            callback();
        }
    });
    PIXI.loader.load();
};

/**
 * 初始化摇杆
 */
Joystick.prototype.initRocker = function () {
    var outerImg = PIXI.Texture.fromImage(this.settings.outer);
    var innerImg = PIXI.Texture.fromImage(this.settings.inner);

    this.containerJoystick = new PIXI.Container();

    this.outer = new PIXI.Sprite(outerImg);
    this.inner = new PIXI.Sprite(innerImg);

    this.outer.scale = this.settings.outerScale;
    this.inner.scale = this.settings.innerScale;

    this.outer.anchor = { x: 0.5, y: 0.5 };
    this.inner.anchor = { x: 0.5, y: 0.5 };

    this.containerJoystick.anchor = { x: 0.5, y: 0.5 };
    this.containerJoystick.addChild(this.outer);
    this.containerJoystick.addChild(this.inner);

    this.outerRadius = this.containerJoystick.width / 2; //外置摇杆半径
    this.innerRadius = this.inner.width / 2; //内置摇杆半径

    this.containerJoystick.position = {
        x: this.settings.rockerX, //中心X坐标
        y: this.settings.rockerY //中心Y坐标
    };
    this.parentContainer.addChild(this.containerJoystick);
    this.initRockerEvents();
};


/**
 * 初始化摇杆
 */
Joystick.prototype.position = function (x,y) {
    this.settings.rockerX =x;
    this.settings.rockerY =y;
    this.containerJoystick.position = {
        x: this.settings.rockerX, //中心X坐标
        y: this.settings.rockerY //中心Y坐标
    };
}

/**
 * 初始化事件
 */
Joystick.prototype.initRockerEvents = function () {
    var that = this;
    this.containerJoystick.interactive = true;
    var dragging = false;
    var eventData = {};

    function onDragStart(event) {
        eventData = event.data;
        var startPosition = eventData.getLocalPosition(this.parent);
        dragging = true;
        if (that.settings.onJoyStickStart != undefined) {
            that.settings.onJoyStickStart();
        }
    }

    function onDragEnd(event) {
        if (dragging == false) {
            return;
        }
        dragging = false;
        that.inner.position = {
            x: 0,
            y: 0
        };

        if (that.settings.onJoyStickEnd != undefined) {
            that.settings.onJoyStickEnd();
        }
    }

    function onDragMove(event) {
        if (dragging == false) {
            return;
        }
        var newPosition = eventData.getLocalPosition(this.parent);
        //x轴移动距离
        var sideX = newPosition.x - that.settings.rockerX;
        //y轴移动距离
        var sideY = newPosition.y - that.settings.rockerY;

        var centePoint = {
            x: 0,
            y: 0
        };

        var currentAngle = 0; //当前摇杆的角度

        if (sideX == 0 && sideY == 0) {
            return;
        }

        //判断执行计算的半径。
        var calRadius = 0;

        //判断移动的距离是否超过外圈，参考勾股定理
        if (sideX * sideX + sideY * sideY >= that.outerRadius * that.outerRadius) {
            calRadius = that.outerRadius;
            //超过外圈，以外圈半径计算。
        }
        else {
            //未超过，以内外圈差值计算
            calRadius = that.outerRadius - that.innerRadius;
        }

        //采用WebGL使用的是正交右手坐标系
        /**
         * x轴最左边为-1，最右边为1；
         * y轴最下边为-1，最上边为1；
         *          Y
         *          ^
         *          |
         *     180  |  90
         *    ------------> X
         *     270  |  360
         *          |
         *          |
         */

        var direct = that.MOVE_DIRECT.LEFT;

        //X轴方向没有移动
        if (sideX == 0) {
            if (sideY > 0) {
                centePoint = {
                    x: 0
                    , y: sideY > that.outerRadius ? that.outerRadius : sideY
                };
                currentAngle = 270;
                direct = that.MOVE_DIRECT.BOTTOM;
            } else {
                centePoint = {
                    x: 0
                    , y: -(Math.abs(sideY) > that.outerRadius ? that.outerRadius : Math.abs(sideY))
                };
                currentAngle = 90;
                direct = that.MOVE_DIRECT.TOP;
            }
            that.inner.position = centePoint;
            that.settings.onJoyStickMove({ angle: currentangle, direct: direct });
            return;
        }

        if (sideY == 0) {//Y轴方向没有移动
            if (sideX > 0) {
                centePoint = {
                    x: (Math.abs(sideX) > that.outerRadius ? that.outerRadius : Math.abs(sideX))
                    , y: 0
                };
                currentAngle = 0;
                direct = that.MOVE_DIRECT.LEFT;
            } else {
                centePoint = {
                    x: -(Math.abs(sideX) > that.outerRadius ? that.outerRadius : Math.abs(sideX))
                    , y: 0
                };
                currentAngle = 180;
                direct = that.MOVE_DIRECT.RIGHT;
            }

            that.inner.position = centePoint;
            that.settings.onJoyStickMove({ angle: currentangle, direct: direct });
            return;
        }

        var tanVal = Math.abs(sideY / sideX);
        var radian = Math.atan(tanVal);
        var angle = radian * 180 / Math.PI;
        currentAngle = angle;

        //计算现在摇杆的中心点主坐标了。
        var centerX = 0;
        var centerY = 0;

        //移动的距离是否超过外圈
        if (sideX * sideX + sideY * sideY >= that.outerRadius * that.outerRadius) {
            centerX = that.outerRadius * Math.cos(radian);
            centerY = that.outerRadius * Math.sin(radian);
        }
        else {
            centerX = Math.abs(sideX) > that.outerRadius ? that.outerRadius : Math.abs(sideX);
            centerY = Math.abs(sideY) > that.outerRadius ? that.outerRadius : Math.abs(sideY);
        }

        if (sideY < 0) {
            centerY = -Math.abs(centerY);
        }
        if (sideX < 0) {
            centerX = -Math.abs(centerX);
        }

        if (sideX > 0 && sideY < 0) {
            //角度小于90度，对应右上角区域
        }
        else if (sideX < 0 && sideY < 0) {
            //90度<角度<180度，对应左下角区域
            currentAngle = 180 - currentAngle;
        }
        else if (sideX < 0 && sideY > 0) {
            //180度<角度<270度，对应左下角区域
            currentAngle = currentAngle + 180;
        }
        else if (sideX > 0 && sideY > 0) {
            //270度<角度<369度，对应右下角区域
            currentAngle = 360 - currentAngle;
        }
        centePoint = {
            x: centerX,
            y: centerY
        };

        direct = getDirection(centePoint);
        that.inner.position = centePoint;
        that.settings.onJoyStickMove({ angle: parseInt(currentAngle), direct: direct });
    };

    this.containerJoystick.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove)

    /**
     * 获得方向
     * @param {*} pos 
     */
    function getDirection(pos) {
        var rad = Math.atan2(pos.y, pos.x);// [-PI, PI]
        if ((rad >= -Math.PI / 8 && rad < 0) || (rad >= 0 && rad < Math.PI / 8)) {
            return that.MOVE_DIRECT.RIGHT;
        } else if (rad >= Math.PI / 8 && rad < 3 * Math.PI / 8) {
            return that.MOVE_DIRECT.BOTTOM_RIGHT;
        } else if (rad >= 3 * Math.PI / 8 && rad < 5 * Math.PI / 8) {
            return that.MOVE_DIRECT.BOTTOM;
        } else if (rad >= 5 * Math.PI / 8 && rad < 7 * Math.PI / 8) {
            return that.MOVE_DIRECT.BOTTOM_LEFT;
        } else if ((rad >= 7 * Math.PI / 8 && rad < Math.PI) || (rad >= -Math.PI && rad < -7 * Math.PI / 8)) {
            return that.MOVE_DIRECT.LEFT;
        } else if (rad >= -7 * Math.PI / 8 && rad < -5 * Math.PI / 8) {
            return that.MOVE_DIRECT.TOP_LEFT;
        } else if (rad >= -5 * Math.PI / 8 && rad < -3 * Math.PI / 8) {
            return that.MOVE_DIRECT.TOP;
        } else {
            return that.MOVE_DIRECT.TOP_RIGHT;
        }
    }
}