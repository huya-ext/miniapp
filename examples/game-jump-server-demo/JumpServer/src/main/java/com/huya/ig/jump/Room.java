package com.huya.ig.jump;

import com.google.protobuf.ByteString;
import com.huya.ig.util.CommonComponent;
import com.huya.ig.config.ServerConfig;
import com.huya.ig.jump.model.PlayerInfo;
import com.huya.ig.jump.protocol.*;
import com.huya.ig.network.ChannelUtil;
import com.huya.ig.network.ConnManager;
import lombok.Data;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 游戏房间，处理游戏逻辑
 *
 */
@Data
public class Room {

    // 房间号，就是主播直播间房间号
    private String roomId;
    // 主播unionId
    private String presenterUid;
    // 房间状态
    private ERoomState state = ERoomState.Preparing;
    // 游戏开始时间
    private long gameStartedAt;
    // 游戏玩家列表
    private Map<String, PlayerInfo> players = new ConcurrentHashMap<>();
    // 地图
    private List<Platform> platforms = new ArrayList<>();
    // 玩家排行榜
    private List<Player> playerRank = new ArrayList<>();

    /**
     * 玩家连接房间
     * @param uid 玩家unionId
     */
    public void onJoin(String uid){
        EJoinRet ret = EJoinRet.SUCCESS;
        if(players.size() >= ServerConfig.maxPlayerCnt){
            ret = EJoinRet.ROOM_FULL;
        }
        RoomConnectedNotice notice = RoomConnectedNotice.newBuilder()
                .setRet(ret)
                .setUid(uid)
                .build();
        unicast(uid, Protocol.S2CRoomConnectedNotice_VALUE, notice.toByteString());
    }

    /**
     * 玩家上报基本资料，包括头像昵称等
     * @param uid 玩家unionId
     * @param req 基本资料
     */
    public void onPlayerInfo(String uid, PlayerInfoReq req){
        if(!players.containsKey(uid)){
            PlayerInfo playerInfo = new PlayerInfo();
            playerInfo.setUid(uid);
            playerInfo.setAvatar(req.getPlayer().getAvatar());
            playerInfo.setNick(req.getPlayer().getNick());
            playerInfo.setDeviceWidth(req.getPlayer().getDeviceWidth());

            players.put(uid, playerInfo);

            PlayerJoinNotice notice = PlayerJoinNotice.newBuilder()
                    .setPlayer(playerInfo.tran2Pb())
                    .build();
            broadcast(Protocol.S2CPlayerJoinNotice_VALUE, notice.toByteString());
        }

        List<Player> playerList = new ArrayList<>();
        players.values().forEach(p -> playerList.add(p.tran2Pb()));
        // 同步房间状态
        SyncGameDataNotice notice = SyncGameDataNotice.newBuilder()
                .setState(state)
                .setTimeLeft(state == ERoomState.Gaming ? (int)((System.currentTimeMillis() - gameStartedAt)/1000) : 0)
                .addAllPlatforms(platforms)
                .addAllPlayers(playerList)
                .addAllRank(playerRank)
                .build();

        unicast(uid, Protocol.S2CSyncGameDataNotice_VALUE, notice.toByteString());
    }

    /**
     * 接受玩家跳跃指令&结果
     * @param uid 玩家unionId
     * @param req 跳跃指令
     */
    public void onJump(String uid, JumpReq req){
        PlayerInfo playerInfo = players.getOrDefault(uid, null);
        if(state == ERoomState.Gaming && playerInfo != null){
            JumpNotice notice = JumpNotice.newBuilder()
                    .setCmd(req.getCmd())
                    .setPlayer(playerInfo.tran2Pb())
                    .build();
            // 广播玩家跳跃指令
            broadcast(Protocol.S2CJumpNotice_VALUE, notice.toByteString());
            // 如果成功跳跃，记录玩家位置并积分
            if(req.getCmd().getTo().getId() > 0){
                playerInfo.setScore(playerInfo.getScore() + 1);
                playerInfo.setPosition(req.getCmd().getTo());
            }
        }
    }

    /**
     * 主播开始游戏
     */
    public void start(){
        if(state != ERoomState.Gaming && players.size() >= ServerConfig.minPlayerCnt){
            state = ERoomState.Gaming;
            gameStartedAt = System.currentTimeMillis();
            // 生成地图
            platforms = CommonComponent.getInstance().genMap(ServerConfig.maxPlatformCnt);
            GameStartNotice notice = GameStartNotice.newBuilder()
                    .setGameDuration(ServerConfig.gameDuration)
                    .addAllPlatforms(platforms)
                    .build();

            broadcast(Protocol.S2CGameStartNotice_VALUE, notice.toByteString());

            // 启动游戏结束定时器
            RoomManager.getInstance().getSchduler().schedule(new Runnable() {
                @Override
                public void run() {
                    gameOver();
                }
            }, ServerConfig.gameDuration, TimeUnit.SECONDS);
        }
    }

    /**
     * 游戏倒计时结束
     */
    private void gameOver(){
        state = ERoomState.GameOver;
        RoomManager.getInstance().removeRoom(roomId);
        // 计算排行榜
        playerRank = new ArrayList<>();
        players.values().stream().sorted(new Comparator<PlayerInfo>() {
            @Override
            public int compare(PlayerInfo o1, PlayerInfo o2) {
                return o2.getScore() - o1.getScore();
            }
        }).collect(Collectors.toList()).forEach(p -> playerRank.add(p.tran2Pb()));
        GameOverNotice notice = GameOverNotice.newBuilder()
                .addAllRank(playerRank)
                .build();
        broadcast(Protocol.S2CGameOverNotice_VALUE, notice.toByteString());
    }

    /**
     * 房间消息广播
     * @param uri 协议号
     * @param data 数据
     */
    private void broadcast(int uri, ByteString data){
        broadcast(uri, data, null);
    }

    /**
     * 房间消息广播
     * @param uri 协议号
     * @param data 数据
     * @param exUids 排除的玩家unionId列表
     */
    private void broadcast(int uri, ByteString data, List<Long> exUids){
        Packet packet = Packet.newBuilder()
                .setUri(uri)
                .setBody(data).build();
        for(String uid : players.keySet()){
            if(exUids == null || !exUids.contains(uid)) {
                ChannelUtil.write(ConnManager.getInstance().getChannel(uid, roomId), packet);
            }
        }
    }

    /**
     * 按玩家unionId单播
     * @param uid 玩家unionId
     * @param uri 协议号
     * @param data 数据
     */
    private void unicast(String uid, int uri, ByteString data){
        Packet packet = Packet.newBuilder()
                .setUri(uri)
                .setBody(data).build();
        ChannelUtil.write(ConnManager.getInstance().getChannel(uid, roomId), packet);
    }

}
