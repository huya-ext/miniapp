from enum import Enum
import json


class PROTOCOL(Enum):
    """ 
    游戏协议定义 
    根据实际游戏协议扩展
    """

    C2SHeartbeat = 100  # 心跳包
    C2SSignup = 101  # 报名参加游戏
    C2SStart = 102  # 游戏开始
    C2SGameover = 103  # 主播主动结束游戏
    C2SPlayerScore = 104  # 玩家上报得分

    S2CHeartbeat = 200  # 心跳响应包
    S2CRoomClosed = 201  # 游戏房间已经结束关闭
    S2CGameStart = 202  # 游戏开始
    S2CGameOver = 203  # 游戏结束
    S2CPlayerJoin = 204  # 玩家进入
    S2CPlayerSignup = 205  # 玩家报名
    S2CRealtimeRank = 206  # 实时分数排行榜
