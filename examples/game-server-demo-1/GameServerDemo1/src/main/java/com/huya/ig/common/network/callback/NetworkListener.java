package com.huya.ig.common.network.callback;

import com.huya.ig.common.network.protocol.GamePacket;
import io.netty.channel.Channel;

/**
 * 服务器网络回调，实现网络逻辑和业务逻辑的解耦
 * @author wangpeng1@huya.com
 * @date 2020/6/4
 * @description
 */
public interface NetworkListener {

    /**
     * 新用户连接事件
     * @param channel 当前用户连接句柄
     * @param roomId 直播间房间号
     * @param uid 当前用户uid
     * @param isPresenter 当前用户是否是主播
     */
    void onConnected(Channel channel, String roomId, String uid, boolean isPresenter);

    /**
     * 收到用户数据包
     * @param channel 当前连接句柄
     * @param packet 数据包
     */
    void onData(Channel channel, GamePacket packet);

    /**
     * 用户网络断开事件
     * @param channel 当前连接句柄
     */
    void onDisconnected(Channel channel);

}
