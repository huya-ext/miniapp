import protobuf from '@hygame/protobufjs';
import { compare, getUserInfo, getJwt, getIsHyExt } from '../jump/utils';

class WSS {
  constructor({ stage, world }) {
    const jsonDescriptor = require('../pb/jump.json');
    this.root = protobuf.Root.fromJSON(jsonDescriptor);

    this.stage = stage;
    this.world = world;

    this.init();
  }

  async init() {
    this.uid = null;
    this.jwt = await getJwt();
    this.players = [];
    this.playerMap = {};
    this.playerInfo = [];
    this.gameDuration = 180;
    this.timeLeft = 0;
    this.platforms = [];
    this.onReady = false;
    this.isEnd = false;
    this.cTimer = null;
    this.hTimer = null;
    this.tTimer = null;
    this.timer = 3 * 1000;
    this.timeoutNum = 0;

    const url = `ws://127.0.0.1:8081?jwt=${this.jwt}`;
    const wssInstance = (this.wssInstance = getIsHyExt() ? new hyExt.WebSocket(url) : new WebSocket(url));
    wssInstance.binaryType = 'arraybuffer';
    wssInstance.onopen = this.onopen.bind(this);
    wssInstance.onmessage = this.onmessage.bind(this);
    wssInstance.onclose = this.onclose.bind(this);
    wssInstance.onerror = this.onerror.bind(this);
  }

  close() {
    this.isEnd = true;
    this.cTimer && clearInterval(this.cTimer);
    this.hTimer && clearInterval(this.hTimer);
    this.tTimer && clearTimeout(this.tTimer);
    this.wssInstance && this.wssInstance.close();
  }

  onopen(event) {
    console.log('onopen');
  }

  onmessage(event) {
    // console.log('onmessage', event);
    const u8view = new Uint8Array(event.data);
    const msgObj = this.lookup('Packet').decode(u8view);
    // console.log('onmessage_decode', msgObj);
    const { uri = '', body } = msgObj;

    switch (~~uri) {
      case 3000:
        this.handleJumpNotice(body);
        break;
      // 心跳
      case 3001:
        this.handleHeartbeet();
        break;
      // 游戏结束
      case 3002:
        this.handleGameEnd(body);
        break;
      // 游戏开始
      case 3003:
        this.handleGameStart(body);
        break;
      // 同步数据
      case 3004:
        this.handleSyncGameData(body);
        break;
      // 玩家加入
      case 3005:
        this.handlePlayerJoin(body);
        break;
      // 连接房间信息
      case 3006:
        this.handleRoomConnectedNotice(body);
        break;
      default:
        break;
    }
  }

  onclose(event) {
    console.log('onclose');
    if (!this.isEnd) {
      this.stage.changeMiddleHud('请联系主播创建房间', true);
    }
  }

  onerror(event) {
    console.log('onerror');
  }

  lookup(key) {
    return this.root.lookup(key);
  }

  send(buffer) {
    // const sendMsg = this.lookup('Packet').decode(buffer);
    // console.log('send', sendMsg);
    !this.isEnd && this.wssInstance.send(buffer);
  }

  create(key, data = {}) {
    const found = this.lookup(key);
    return found.encode(found.create(data)).finish();
  }

  sendHeartbeet() {
    // 心跳超时大于等于3次，主动断开连接并重连
    if (this.timeoutNum >= 3) {
      this.close();
      this.init();
      return;
    }

    !this.tTimer && (this.tTimer = setTimeout(() => {
      this.tTimer = null;
      this.timeoutNum++;
    }, this.timer - 1000));

    const buffer = this.create('Packet', {
      uri: 2001,
      body: this.create('Heartbeat', { timestamp: +new Date() }),
    });

    this.send(buffer);
  }

  sendStartGame() {
    const buffer = this.create('Packet', {
      uri: 2003,
    });

    this.send(buffer);
  }

  async sendPlayerInfo() {
    const userInfo = await getUserInfo();
    const buffer = this.create('Packet', {
      uri: 2002,
      body: this.create('PlayerInfoReq', {
        player: {
          uid: this.uid,
          nick: userInfo && userInfo.userNick ? userInfo.userNick : __userName,
          deviceWidth: this.world.width,
        },
      }),
    });

    this.send(buffer);
  }

  sendJumpCmd(from = {}, to = {}) {
    const buffer = this.create('Packet', {
      uri: 2000,
      body: this.create('JumpReq', {
        cmd: {
          from,
          to,
        },
      }),
    });

    this.send(buffer);
  }

  handleHeartbeet() {
    if (this.tTimer) {
      clearTimeout(this.tTimer);
      this.tTimer = null;
      this.timeoutNum = 0;
    }
  }

  handlePlayerJoin(body) {
    const data = this.lookup('PlayerJoinNotice').decode(body);
    // console.log('3005', data);
    const {
      player,
    } = data;
    if (!~this.players.indexOf(player.uid)) {
      this.players.push(player.uid);
      this.playerInfo.push(player);
    }

    this.playerMap[player.uid] = 0;
    this.stage.changeMatchHud();
  }

  handleSyncGameData(body) {
    const data = this.lookup('SyncGameDataNotice').decode(body);
    // console.log('3004', data);
    const { players, platforms, timeLeft } = data;

    players.forEach(({ uid, score }) => (this.playerMap[uid] = ~~score));
    this.playerInfo = players;

    if (platforms && platforms.length > 0) {
      this.timeLeft = ~~timeLeft;
      this.platforms = platforms;
      this.world.reset();

      !this.cTimer &&
        (this.cTimer = setInterval(() => {
          this.timeLeft++;
          this.stage.changeGoHud();
        }, 1000));
    } else {
      players.forEach(({ uid }) => !~this.players.indexOf(uid) && this.players.push(uid));
      this.stage.changeMatchHud();
    }
  }

  handleGameStart(body) {
    const data = this.lookup('GameStartNotice').decode(body);
    // console.log('3003', data);
    const { gameDuration, platforms } = data;
    this.gameDuration = gameDuration;
    this.platforms = platforms;
    this.stage.hudScene.remove(this.stage.scorePlane);
    this.world.reset();

    !this.cTimer &&
      (this.cTimer = setInterval(() => {
        this.timeLeft++;
        this.stage.changeGoHud();
      }, 1000));
  }

  handleGameEnd(body) {
    const data = this.lookup('GameOverNotice').decode(body);
    // console.log('3002', data);
    this.isEnd = true;
    this.cTimer && clearInterval(this.cTimer);
    this.timeLeft = this.gameDuration;
    this.stage.changeGoHud();

    let rank = 0;
    data.rank.sort(compare('score')).forEach((item, index) => {
      if (item.uid === this.uid) {
        rank = index + 1;
      }
    });

    setTimeout(() => {
      this.world.littleMans.forEach((littleMan) => littleMan.unbindFunc());
      this.stage.changeEndHud(rank);
    }, 1000);
  }

  handleJumpNotice(body) {
    const data = this.lookup('JumpNotice').decode(body);
    // console.log('3000', data);
    const {
      cmd: {
        to: { id },
      },
      player: { uid },
    } = data;
    id && (this.playerMap[uid] = ~~this.playerMap[uid] + 1);
    this.stage.changeGoHud();
  }

  handleRoomConnectedNotice(body) {
    const data = this.lookup('RoomConnectedNotice').decode(body);
    // console.log('3006', data);
    const { uid } = data;
    this.uid = uid;
    this.sendPlayerInfo();
    this.onReady = true;
    !this.hTimer && (this.hTimer = setInterval(() => {
      this.sendHeartbeet();
    }, this.timer));
  }
}

export default WSS;
