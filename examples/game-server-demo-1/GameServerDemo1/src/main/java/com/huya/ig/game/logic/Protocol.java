package com.huya.ig.game.logic;

/**
 * 游戏协议定义
 * 根据实际游戏协议自定义即可
 * @author wangpeng1@huya.com
 * @date 2020/7/14
 * @description
 */
public enum Protocol {

    C2SHeartbeat(100, "心跳包"),
    C2SSignup(101, "报名参加游戏"),
    C2SStart(102, "游戏开始"),
    C2SGameover(103, "主播主动结束游戏"),
    C2SPlayerScore(104, "玩家上报得分"),

    S2CHeartbeat(200, "心跳响应包"),
    S2CRoomClosed(201, "游戏房间已经结束关闭"),
    S2CGameStart(202, "游戏开始"),
    S2CGameOver(203, "游戏结束"),
    S2CPlayerJoin(204, "玩家进入"),
    S2CPlayerSignup(205, "玩家报名"),
    S2CRealtimeRank(206, "实时分数排行榜");


    public int uri;
    public String desc;

    Protocol(int uri, String desc){
        this.desc = desc;
        this.uri = uri;
    }

    public static Protocol valueOf(int uri){
        for(Protocol p : Protocol.values()){
            if(p.uri == uri){
                return p;
            }
        }
        return null;
    }

}
