const isHyExt = getIsHyExt();
window.__isAnchor = getIsAnchor();
// window.__isAnchor = true;
window.__isMobile = isHyExt && !!~window.navigator.userAgent.indexOf('Mobile');

class Main {
    constructor() {
        this.readyList = [];
        this.players = [];

        const width = (this.width = window.innerWidth);
        const height = (this.height = window.innerHeight);

        const app = (this.app = new PIXI.Application({
            // backgroundColor: 0xffffff,
            width,
            height,
            antialiasing: true,
            transparent: false,
            resolution: 1
        }));

        document.body.style.margin = 0;
        document.body.style.fontSize = 0;
        document.body.appendChild(app.view);

        app.loader
            .add('create', 'images/create.png')
            .add('join', 'images/join.png')
            .add('start', 'images/start.png')
            .add('default', 'images/default.png')
            .load(() => this.setup());
    }

    setup() {
        this.drawStartPage();
    }

    drawSmallRankModal(list = []) {
        const { app, width, height, startContainer, middleContainer } = this;

        this.rankContainer && middleContainer.removeChild(this.rankContainer);

        const container = (this.rankContainer = new PIXI.Container());
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000);
        rectangle.drawRect(0, 0, width * 0.4, height * 0.3);
        rectangle.endFill();
        // rectangle.alpha = 0.7;
        container.addChild(rectangle);

        container.x = (width - rectangle.width) - 20;
        container.y = 20;
        container.alpha = 0.6;
        middleContainer.addChild(container);

        const title = new PIXI.Text("实时排行榜", {
            fill: 0xffffff,
            fontSize: setWPx(10),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        title.position.set((container.width - title.width) / 2, setHPx(5));
        container.addChild(title);

        const nick = new PIXI.Text("昵称", {
            fill: 0xffffff,
            fontSize: setWPx(10),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        nick.position.set(setWPx(10), setHPx(28));
        container.addChild(nick);

        const score = new PIXI.Text("得分", {
            fill: 0xffffff,
            fontSize: setWPx(10),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        score.position.set(setWPx(110), setHPx(28));
        container.addChild(score);

        const light = new PIXI.Graphics();
        light.beginFill(0x66CCFF);
        light.drawRect(0, 0, container.width * 0.9, setHPx(2));
        light.endFill();
        light.x = (container.width - light.width) / 2;
        light.y = setHPx(45);
        container.addChild(light);

        list.forEach(({ nick, score }, i) => {
            const _nick = new PIXI.Text(nick, {
                fill: 0xffffff,
                fontSize: setWPx(10),
                wordWrapWidth: 600,
                wordWrap: false,
                breakWords: false
            });
            _nick.position.set(setWPx(10), setHPx(54 + 15 * i));
            container.addChild(_nick);

            const _score = new PIXI.Text(score, {
                fill: 0xffffff,
                fontSize: setWPx(10),
                wordWrapWidth: 600,
                wordWrap: false,
                breakWords: false
            });
            _score.position.set(setWPx(110), setHPx(54 + 15 * i));
            container.addChild(_score);
        });
    }

    drawRankModal(list = []) {
        const { app, width, height, startContainer, middleContainer } = this;

        const container = (this.rankContainer = new PIXI.Container());
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0x000000);
        rectangle.drawRect(0, 0, width * 0.8, height * 0.8);
        rectangle.endFill();
        rectangle.alpha = 0.7;
        container.addChild(rectangle);

        container.x = (width - rectangle.width) / 2;
        container.y = (height - rectangle.height) / 2;
        middleContainer.addChild(container);

        const title = new PIXI.Text("排行榜", {
            fill: 0xffffff,
            fontSize: setWPx(20),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        title.position.set((container.width - title.width) / 2, setHPx(30));
        container.addChild(title);

        const nick = new PIXI.Text("昵称", {
            fill: 0xffffff,
            fontSize: setWPx(16),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        nick.position.set(setWPx(30), setHPx(80));
        container.addChild(nick);

        const score = new PIXI.Text("得分", {
            fill: 0xffffff,
            fontSize: setWPx(16),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        score.position.set(setWPx(200), setHPx(80));
        container.addChild(score);

        const light = new PIXI.Graphics();
        light.beginFill(0x66CCFF);
        light.drawRect(0, 0, container.width * 0.9, setHPx(2));
        light.endFill();
        light.x = (container.width - light.width) / 2;
        light.y = setHPx(110);
        container.addChild(light);

        list.forEach(({ nick, score, avatar: img }, i) => {
            const t = img ? PIXI.Texture.from(img) : app.loader.resources['default'].texture;
            const avatar = new PIXI.Sprite(t);
            avatar.width = setWPx(17);
            avatar.height = setWPx(17);
            avatar.x = setWPx(20);
            avatar.y = setHPx(130 + 30 * i);
            container.addChild(avatar);

            const _nick = new PIXI.Text(nick, {
                fill: 0xffffff,
                fontSize: setWPx(14),
                wordWrapWidth: 600,
                wordWrap: false,
                breakWords: false
            });
            _nick.position.set(setWPx(40), setHPx(130 + 30 * i));
            container.addChild(_nick);

            const _score = new PIXI.Text(score, {
                fill: 0xffffff,
                fontSize: setWPx(14),
                wordWrapWidth: 600,
                wordWrap: false,
                breakWords: false
            });
            _score.position.set(setWPx(200), setHPx(130 + 30 * i));
            container.addChild(_score);
        });

        const btn = new PIXI.Text("确定 >", {
            fill: 0xffffff,
            fontSize: setWPx(18),
            wordWrapWidth: 600,
            wordWrap: false,
            breakWords: false
        });
        btn.position.set((container.width - btn.width) / 2, setHPx(480));
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on('pointertap', () => {
            middleContainer.removeChild(container);
        });
        container.addChild(btn);
    }

    drawStartPage() {
        const { app, width, height, wss } = this;
        wss && wss.close();

        app.renderer.backgroundColor = 0x94a7a5;

        const container = (this.startContainer = new PIXI.Container());
        const bg = new PIXI.Graphics();
        bg.beginFill(0x94a7a5);
        bg.drawRect(0, 0, width, height);
        bg.endFill();

        container.addChild(bg);

        const message = new PIXI.Text('GAME NAME', {
            fill: 0xffffff,
            fontSize: setWPx(30),
            wordWrapWidth: 600,
            wordWrap: true,
            breakWords: true
        });
        message.position.set((width - message.width) / 2, setHPx(200));

        container.addChild(message);

        const btn = new PIXI.Sprite(app.loader.resources[__isAnchor ? 'create' : 'join'].texture);
        btn.width = setWPx(142);
        btn.height = setWPx(62);
        btn.anchor.set(0.5, 0.5);
        btn.position.set((width - btn.width) / 2 + btn.width / 2, setHPx(450));
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on('pointertap', () => {
            app.stage.removeChildren();
            this.drawMatchPage();
        });
        btn.on('pointerdown', () => {
            btn.width = setWPx(142 * 0.9);
            btn.height = setWPx(62 * 0.9);
        });
        btn.on('pointerupoutside', () => {
            btn.width = setWPx(142);
            btn.height = setWPx(62);
        });
        container.addChild(btn);

        app.stage.addChild(container);
    }

    drawMiddlePage(text, isShowBtn) {
        const { app, width, height, wss } = this;

        app.renderer.backgroundColor = 0x94a7a5;

        const container = (this.middleContainer = new PIXI.Container());
        const bg = new PIXI.Graphics();
        bg.beginFill(0x94a7a5);
        bg.drawRect(0, 0, width, height);
        bg.endFill();

        container.addChild(bg);

        const message = new PIXI.Text(text, {
            fill: 0xffffff,
            fontSize: setWPx(30),
            wordWrapWidth: 600,
            wordWrap: true,
            breakWords: true
        });
        message.position.set((width - message.width) / 2, setHPx(300));

        container.addChild(message);

        const back = new PIXI.Text('< 返回首页', {
            fill: 0xffffff,
            fontSize: setWPx(20),
            wordWrapWidth: 600,
            wordWrap: true,
            breakWords: true
        });
        back.position.set(setWPx(20), setHPx(20));
        back.interactive = true;
        back.buttonMode = true;
        back.on('pointertap', () => {
            app.stage.removeChildren();
            this.drawStartPage();
        });

        container.addChild(back);

        if (isShowBtn) {
            const btn = new PIXI.Text('点击上报得分+1', {
                fill: 0xffffff,
                fontSize: setWPx(20),
                wordWrapWidth: 600,
                wordWrap: true,
                breakWords: true
            });
            btn.position.set((width - btn.width) / 2, setHPx(500));
            btn.interactive = true;
            btn.buttonMode = true;
            btn.on('pointertap', () => {
                wss.sendScore();
            });

            container.addChild(btn);
        }

        app.stage.addChild(container);
    }

    async drawMatchPage() {
        const { app, width, height } = this;

        const jwt = await getJwt();
        const wss = (this.wss = new Wss({ jwt, type: 'zhubouid', main: this }));
        app.renderer.backgroundColor = 0x6c7878;

        const container = (this.matchContainer = new PIXI.Container());
        const bg = new PIXI.Graphics();
        bg.beginFill(0x6c7878);
        bg.drawRect(0, 0, width, height);
        bg.endFill();

        container.addChild(bg);

        const message = new PIXI.Text("等待开局...", {
            fill: 0xffffff,
            fontSize: setWPx(30),
            wordWrapWidth: 600,
            wordWrap: true,
            breakWords: true
        });
        message.position.set((width - message.width) / 2, setHPx(100));
        container.addChild(message);

        const circle = new PIXI.Graphics();
        circle.drawCircle(0, 0, setWPx(27));
        const { width: w } = circle;
        let num = ~~((width - w / 2) / (w + w / 2));
        num = num > 4 ? 4 : num;
        const margin = (width - (num * w + w / 2 * (num - 1))) / 2;
        const list = (this.list = []);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < num; j++) {
                const c = new PIXI.Graphics();
                c.lineStyle(1, 0x859592, 1);
                c.beginFill(0x8d9d9a);
                c.drawCircle(0, 0, setWPx(27));
                c.endFill();
                c.x = j * w * 1.5 + margin + w / 2;
                c.y = setHPx(250) + i * (w + w / 1.5);
                container.addChild(c);
                list.push(c);
            }
        }

        const btn = (this.btn = new PIXI.Sprite(app.loader.resources['start'].texture));
        btn.anchor.set(0.5, 0.5);
        btn.width = setWPx(142);
        btn.height = setWPx(62);
        btn.position.set((width - btn.width) / 2 + btn.width / 2, setHPx(550));
        btn.interactive = true;
        btn.buttonMode = true;
        btn.on('pointertap', () => {
            wss.sendStart();
        });
        btn.on('pointerdown', () => {
            btn.width = setWPx(142 * 0.9);
            btn.height = setWPx(62 * 0.9);
        });
        btn.on('pointerupoutside', () => {
            btn.width = setWPx(142);
            btn.height = setWPx(62);
        });

        // __isAnchor && this.readyList.length >= 2 && container.addChild(btn);

        app.stage.addChild(container);
    }
}

class Wss {
    constructor({ jwt, type, main }) {
        this.type = type;
        this.main = main;
        this.uid = null;
        this.score = 0;
        this.timer = null;

        const jwtMap = {
            'zhubouid': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTQ3NSwidXNlcklkIjoiemh1Ym91aWQiLCJpYXQiOjE1OTQ3ODM0NzUsInJvb21JZCI6IjEwMDAifQ.ECIai_PT03KLNXj6sPL82RqPd8CZKhiLglvMt-lwipo',
            'zhubouid1': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTQ5MCwidXNlcklkIjoiemh1Ym91aWQxIiwiaWF0IjoxNTk0NzgzNDkwLCJyb29tSWQiOiIxMDAwIn0.SYtTU8YEMQC1JUIjE2TUnvHKpSh5os6PjzZPJ9OlJ9k',
            'zhubouid2': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUwMCwidXNlcklkIjoiemh1Ym91aWQyIiwiaWF0IjoxNTk0NzgzNTAwLCJyb29tSWQiOiIxMDAwIn0.ieYiZVOyw149BIM2QcTVgklSCN0QiTqON5fiBZvsDao',
            'zhubouid3': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUxMCwidXNlcklkIjoiemh1Ym91aWQzIiwiaWF0IjoxNTk0NzgzNTEwLCJyb29tSWQiOiIxMDAwIn0.i3O-dJWTKQeb2Lpwl7kVs1XTRWnAtoXjyww_UMzRSLA',
            'zhubouid4': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdG9yIjoiREVWIiwicm9sZSI6IlAiLCJwcm9maWxlSWQiOiJ6aHVib3VpZCIsImFwcElkIjoiYXBwSWQiLCJleHRJZCI6IiIsImV4cCI6MTU5NzM3NTUyMSwidXNlcklkIjoiemh1Ym91aWQ0IiwiaWF0IjoxNTk0NzgzNTIxLCJyb29tSWQiOiIxMDAwIn0.1vsoyO8ApIZfPuEosohzF6Rhd0iLV5YGQXBNKh--f7U'
        };

        const wssInstance = (this.wssInstance = getWebSocket(
            `ws://127.0.0.1:8081?jwt=${jwt || jwtMap[type]}`
        ));
        wssInstance.binaryType = 'arraybuffer';
        wssInstance.onopen = this.onopen.bind(this);
        wssInstance.onmessage = this.onmessage.bind(this);
        wssInstance.onclose = this.onclose.bind(this);
        wssInstance.onerror = this.onerror.bind(this);
    }

    onopen(event) {
        logger(`${this.type}_onopen`, event);

        this.sendReady();

        this.timer = setInterval(() => {
            this.send({
                "protocol": 100,
                "payload": JSON.stringify({ "timestamp": +new Date() })
            });
        }, 3 * 1000);
    }

    onmessage(event) {
        const { main } = this;
        const { data } = event;
        const { protocol, payload } = JSON.parse(data);
        const _payload = payload ? JSON.parse(payload) : {};
        ~~protocol !== 200 && logger(`${this.type}_onmessage`, data);

        switch (~~protocol) {
            // 房间不存在通知
            case 201:
                this.close();
                main.app.stage.removeChildren();
                main.drawMiddlePage('房间不存在...');
                break;
            // 游戏开始通知
            case 202:
                main.app.stage.removeChildren();
                main.drawMiddlePage('游戏中...', true);
                main.drawSmallRankModal(main.players);
                break;
            // 游戏结束通知
            case 203:
                main.app.stage.removeChildren();
                main.drawMiddlePage('游戏结束...');
                main.drawRankModal(_payload);
                break;
            // 成功进入房间通知
            case 204:
                this.uid = _payload.uid;

                _payload.players.forEach(item => {
                    item.uid === _payload.uid && (this.score = ~~item.score);
                    this.drawPlayer(item);
                });

                if (_payload.gaming) {
                    main.app.stage.removeChildren();
                    main.drawMiddlePage('游戏中...', true);
                    main.drawSmallRankModal(main.players);
                    break;
                }

                break;
            // 报名通知
            case 205:
                if (_payload.success) {
                    this.drawPlayer(_payload.player);
                } else {
                    main.app.stage.removeChildren();
                    main.drawMiddlePage('参与游戏失败...');
                }
                break;
            // 实时排名通知
            case 206:
                main.drawSmallRankModal(_payload);
                break;
            default:
                break;
        }
    }

    drawPlayer(player) {
        const { main } = this;
        if (!~main.readyList.indexOf(player.uid)) {
            const t = player.avatar ? PIXI.Texture.from(player.avatar) : main.app.loader.resources['default'].texture;
            const avatar = new PIXI.Sprite(t);
            avatar.anchor.set(0.5, 0.5);
            avatar.width = setWPx(27 * 2);
            avatar.height = setWPx(27 * 2);
            avatar.x = main.list[main.readyList.length].x;
            avatar.y = main.list[main.readyList.length].y;
            main.matchContainer.addChild(avatar);

            const nick = player.nick.length >= 5 ? player.nick.slice(0, 5) + '...' : player.nick;
            const message = new PIXI.Text(nick, {
                fill: 0xffffff,
                fontSize: setWPx(12),
                wordWrapWidth: setWPx(27 * 2),
                wordWrap: false,
                breakWords: false
            });
            message.anchor.set(0.5, 0.5);
            message.x = main.list[main.readyList.length].x;
            message.y = main.list[main.readyList.length].y + message.height + setHPx(30);
            main.matchContainer.addChild(message);

            main.readyList.push(player.uid);
            main.players.push(player);
        }

        __isAnchor && main.readyList.length >= 2 && main.matchContainer.addChild(main.btn);
    }

    onclose(event) {
        logger(`${this.type}_onclose`, event);
        this.timer && clearInterval(this.timer);
    }

    onerror(event) {
        logger(`${this.type}_onerror`, event);
        this.timer && clearInterval(this.timer);
    }

    send(obj) {
        const { protocol } = obj;
        ~~protocol !== 100 && logger(`${this.type}_send`, JSON.stringify(obj));
        this.wssInstance.send(JSON.stringify(obj));
    }

    close() {
        this.main.readyList = [];
        this.main.players = [];
        this.timer && clearInterval(this.timer);
        this.wssInstance.close();
    }

    async sendReady() {
        const { userNick, userAvatarUrl } = await getUserInfo();
        
        this.send({
            "protocol": 101,
            "payload": JSON.stringify({ "nick": Base64.encode(userNick), "avatar": userAvatarUrl })
        });
    }

    sendStart() {
        this.send({
            "protocol": 102,
            "payload": ""
        });
    }

    sendScore() {
        this.score++;
        this.send({
            "protocol": 104,
            "payload": JSON.stringify({ "score": this.score })
        });
    }
}

function setWPx(value) {
    return value * window.innerWidth / 375;
}

function setHPx(value) {
    return value * window.innerHeight / 667;
}

function getIsHyExt() {
    return !!window.hyExt;
}

function getIsAnchor() {
    return !!~window.__HYEXT_TYPE.indexOf('anchor');
}

function logger(name, log) {
    if (getIsHyExt()) {
        hyExt.logger.info(name, log);
    }
    console.log(name, log)
}

function getWebSocket(url) {
    if (getIsHyExt()) {
        return new hyExt.WebSocket(url);
    } else {
        return new WebSocket(url);
    }
}

function getUserInfo() {
    return new Promise((resolve, reject) => {
        if (getIsHyExt()) {
            hyExt.context
                .getUserInfo()
                .then((resp) => {
                    hyExt.logger.info('获取当前用户（观众/主播）信息成功，返回：' + JSON.stringify(resp));
                    resolve(resp);
                })
                .catch((err) => {
                    hyExt.logger.info('获取当前用户（观众/主播）信息失败，错误信息：' + err.message);
                    reject(err.message);
                });
        } else {
            resolve(false);
        }
    })
}

function getJwt() {
    return new Promise((resolve, reject) => {
        if (getIsHyExt()) {
            hyExt.vip
                .getJWT()
                .then((resp) => {
                    hyExt.logger.info('获取当前用户Token成功，返回：' + JSON.stringify(resp));
                    resolve(resp.jwt);
                })
                .catch((err) => {
                    hyExt.logger.info('获取当前用户Token失败，错误信息：' + err.message);
                    reject(err.message);
                });
        } else {
            resolve(false);
        }
    })
}

new Main();
