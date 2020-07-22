package com.huya.ig.game.logic;

import com.huya.ig.common.network.ConnManager;
import com.huya.ig.common.network.callback.NetworkListener;
import com.huya.ig.common.network.protocol.GamePacket;
import com.huya.ig.common.network.util.ChannelUtil;
import io.netty.channel.Channel;
import lombok.extern.slf4j.Slf4j;

/**
 * 网络回调实现类，游戏服务器无需关注底层websocket连接细节，只需要实现NetworkListener即可。
 * @author wangpeng1@huya.com
 * @date 2020/7/14
 * @description
 */
@Slf4j
public class DemoListener implements NetworkListener {

    /**
     * websocket连接建立成功的回调
     * @param channel 连接句柄
     * @param roomId 连接的主播房间号
     * @param uid 当前连接用户的uid
     * @param isPresenter 当前连接的是否是该直播间的主播
     */
    @Override
    public void onConnected(Channel channel, String roomId, String uid, boolean isPresenter) {
        Room room = RoomManager.getInstance().getRoom(roomId);
        // 房间不存在
        if(room == null){
            // 如果是主播，创建房间
            if(isPresenter){
                ConnManager.getInstance().onLogin(uid, roomId, channel);
                RoomManager.getInstance().newRoom(roomId, uid).onJoin(uid);
            }else{
                // 观众连接，返回房间关闭
                ChannelUtil.write(channel, new GamePacket(Protocol.S2CRoomClosed.uri));
                channel.eventLoop().execute(new Runnable() {
                    @Override
                    public void run() {
                        channel.close();
                    }
                });
            }
        }else{
            // 加入房间
            ConnManager.getInstance().onLogin(uid, roomId, channel);
            room.onJoin(uid);
        }
    }

    /**
     * 接收到websocket数据包的回调
     * @param channel 连接句柄
     * @param packet 数据包
     */
    @Override
    public void onData(Channel channel, GamePacket packet) {
        Protocol protocol = Protocol.valueOf(packet.getProtocol());
        String roomId = ConnManager.getInstance().getRoomId(channel);
        String uid = ConnManager.getInstance().getUid(channel);
        Room room = RoomManager.getInstance().getRoom(roomId);
        log.info("handle uid:{} protocol:{} of room:{}", uid, packet.getProtocol(), room == null ? null : room.getRoomId());
        if(protocol == null || room == null){
            return;
        }

        // 根据协议号进入不同协议处理分支
        switch (protocol){
            case C2SHeartbeat:
                ChannelUtil.write(channel, new GamePacket(Protocol.S2CHeartbeat.uri, packet.getPayload()));
                break;
            case C2SSignup:
                room.signup(uid, packet.getPayload());
                break;
            case C2SStart:
                room.start(uid);
                break;
            case C2SPlayerScore:
                room.playerScore(uid, packet.getPayload());
                break;
            case C2SGameover:
                room.gameover(uid);
                break;
            // 其他游戏协议处理
            default:
                // 未知协议
                channel.close();
                break;
        }
    }

    /**
     * websocket连接断开的回调
     * @param channel 连接句柄
     */
    @Override
    public void onDisconnected(Channel channel) {

    }
}
