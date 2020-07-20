package com.huya.ig.game.logic;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.huya.ig.common.huyaapi.MsgListener;
import com.huya.ig.common.huyaapi.MsgSubscriber;
import com.huya.ig.common.network.util.ChannelUtil;
import com.huya.ig.common.utils.CommonComponent;
import io.netty.util.internal.ConcurrentSet;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 游戏房间，一般一个直播间对应一个游戏房间，同一个直播间游戏的玩家都会加入这个游戏房间
 * 核心的游戏玩法逻辑都在这里实现
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 游戏房间，处理游戏逻辑
 *
 */
@Data
@Slf4j
public class Room {

    // 房间号，就是主播直播间房间号
    private String roomId;
    // 主播unionId
    private String presenterUid;
    // 游戏开始时间
    private long gameStartedAt;
    private ERoomState state;
    private Set<String> allUids = new ConcurrentSet<>();
    private Map<String, Player> signedPlayers = new ConcurrentHashMap<>();
    private Gson gson = new Gson();
    private MsgSubscriber subscriber;
    private int reconnTimes = 0;

    /**
     * 玩家连接房间
     * @param uid 玩家unionId
     */
    public void onJoin(String uid){
        allUids.add(uid);
        Map<String, Object> data = new HashMap<>();
        data.put("uid", uid);
        data.put("gaming", state == ERoomState.Gaming);
        data.put("signedUp", signedPlayers.containsKey(uid));
        broadcast(Protocol.S2CPlayerJoin.uri, gson.toJson(data));
    }

    /**
     * 主播开始游戏
     * @param uid
     */
    public void start(String uid){
        if(uid.equals(presenterUid) && state != ERoomState.Gaming && signedPlayers.size() >= GameConfig.minPlayerCnt){
            state = ERoomState.Gaming;
            gameStartedAt = System.currentTimeMillis();
            broadcast(Protocol.S2CGameStart.uri, "");

            // 启动游戏结束定时器
            RoomManager.getInstance().getSchduler().schedule(new Runnable() {
                @Override
                public void run() {
                    gameOver();
                }
            }, GameConfig.gameDuration, TimeUnit.SECONDS);
        }
    }

    /**
     * 玩家报名参加游戏
     * @param uid
     */
    public void signup(String uid, String payload){
        boolean success = true;
        if(signedPlayers.size() >= GameConfig.maxPlayerCnt){
            success = false;
        }else {
            JsonObject data = gson.fromJson(payload, JsonObject.class);
            signedPlayers.putIfAbsent(uid, new Player(uid, 0,
                    data.get("nick").getAsString(),
                    data.get("avatar").getAsString()));
        }
        Map<String, Object> data = new HashMap<>();
        if(success){
            data.put("success", true);
            data.put("player", signedPlayers.get(uid));
            broadcast(Protocol.S2CPlayerSignup.uri, gson.toJson(data));
        }else{
            data.put("success", false);
            unicast(uid, Protocol.S2CPlayerSignup.uri, gson.toJson(data));
        }
    }

    public void playerScore(String uid, String payload){
        if(signedPlayers.containsKey(uid) && state == ERoomState.Gaming){
            JsonObject data = gson.fromJson(payload, JsonObject.class);
            signedPlayers.get(uid).setScore(data.get("score").getAsInt());

            broadcast(Protocol.S2CRealtimeRank.uri, gson.toJson(rankList()));
        }
    }

    private List<Player> rankList(){
        return signedPlayers.values().stream().sorted(new Comparator<Player>() {
            @Override
            public int compare(Player o1, Player o2) {
                return o2.getScore() - o1.getScore();
            }
        }).collect(Collectors.toList());
    }

    /**
     * 主播主动结束游戏
     * @param uid
     */
    public void gameover(String uid){
        if(uid.equals(presenterUid) && state == ERoomState.Gaming){
            gameOver();
        }
    }

    /**
     * 游戏倒计时结束
     */
    private void gameOver(){
        state = ERoomState.GameOver;
        if(subscriber != null){
            subscriber.disconnect();
        }
        RoomManager.getInstance().removeRoom(roomId);
        // 计算排行榜
        broadcast(Protocol.S2CGameOver.uri, gson.toJson(rankList()));
    }

    /**
     * 订阅直播间弹幕消息（如果有需要，在房间初始化时调用此方法即可）
     * 已经封装好订阅虎牙弹幕消息的网络模块
     * 业务上只需要处理onMsg回调即可。
     */
    private void subHuyaMsg(){
        try {
            subscriber = new MsgSubscriber(new URI(CommonComponent.getInstance().genHuyaWsUrl(roomId)),
                    new String[]{"getMessageNotice", "getSendItemNotice"}, new MsgListener() {
                @Override
                public void onMsg(String type, String data) {
                    try {
                        if (type.equals("getSendItemNotice")) {
                            JsonObject json = gson.fromJson(data, JsonObject.class);
                            int giftId = json.get("itemId").getAsInt();
                            int giftCnt = json.get("sendItemCount").getAsInt();
                            int giftValue = json.get("totalPay").getAsInt();
                            String unionId = json.get("unionId").getAsString();
                            log.info("虎牙websocket uid:{} 收到送礼消息:{}", unionId, data);
                            // todo 业务处理逻辑
                            // 比如送礼物才能参与报名游戏，那么这里收到送礼消息后，判断是指定礼物，执行join逻辑即可
                            // onJoin(unionId);
                        } else if (type.equals("getMessageNotice")) {
                            // https://dev.huya.com/docs#/%E5%BC%80%E6%94%BEAPI%E5%8D%8F%E8%AE%AE%E8%AF%B4%E6%98%8E?id=_4%e5%bc%b9%e5%b9%95%e4%ba%8b%e4%bb%b6%e5%af%b9%e5%ba%94%e9%80%9a%e7%94%a8%e5%9b%9e%e5%8c%85%e7%bb%93%e6%9e%84data%e5%ad%97%e6%ae%b5%ef%bc%8c%e5%af%b9%e5%ba%94notice%ef%bc%9agetmessagenotice
                            JsonObject json = gson.fromJson(data, JsonObject.class);
                            String unionId = json.get("unionId").getAsString();
                            log.info("虎牙websocket uid:{} 收到弹幕消息:{}", unionId, data);
                            // todo 业务处理逻辑
                            // 比如发送指定弹幕消息，才能触发某个业务逻辑，那么判断满足消息条件后，执行对应的函数即可
                            // onBizMsg(unionId, msg);
                        }
                    }catch (Exception e){
                        log.error("error@deal huya-danmu", e);
                    }
                }

                @Override
                public void onDisconnect() {
                    if(state != ERoomState.GameOver){
                        // 重连
                        RoomManager.getInstance().getSchduler().schedule(new Runnable() {
                            @Override
                            public void run() {
                                if(state == ERoomState.GameOver){
                                    return;
                                }
                                log.info("虎牙websocket断线重连 roomId:{}", roomId);
                                subHuyaMsg();
                                reconnTimes++;
                                if(reconnTimes >= 10){
                                    reconnTimes = 0;
                                }
                            }
                        }, 2+reconnTimes*2, TimeUnit.SECONDS);
                    }
                }
            }, roomId);
            subscriber.connect();
        } catch (Exception e) {
            log.error("error@connect huya open ws-api", e);
        }
    }

    /**
     * 房间消息广播
     * @param uri 协议号
     * @param data 数据
     */
    private void broadcast(int uri, String data){
        broadcast(uri, data, null);
    }

    /**
     * 房间消息广播
     * @param uri 协议号
     * @param data 数据
     * @param exUids 排除的玩家unionId列表
     */
    private void broadcast(int uri, String data, Set<String> exUids){
        ChannelUtil.broadcast(roomId, uri, data, allUids, exUids);
    }

    /**
     * 按玩家unionId单播
     * @param uid 玩家unionId
     * @param uri 协议号
     * @param data 数据
     */
    private void unicast(String uid, int uri, String data){
        ChannelUtil.unicast(roomId, uri, data, uid);
    }

    enum ERoomState {
        Gaming, GameOver
    }

}
