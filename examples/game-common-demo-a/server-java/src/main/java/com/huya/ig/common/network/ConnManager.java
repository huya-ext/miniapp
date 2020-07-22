package com.huya.ig.common.network;

import io.netty.channel.Channel;

import java.util.concurrent.ConcurrentHashMap;

/**
 * 服务端连接管理器
 * 绑定连接句柄和连接用户uid映射关系
 */
public class ConnManager {

    private static final ConnManager connManager = new ConnManager();
    public static ConnManager getInstance() {
        return connManager;
    }
    private ConnManager(){}

    // netty channel到key的映射
    private ConcurrentHashMap<Channel, String> Channel2UidMap = new ConcurrentHashMap<>();
    // key到netty channel的映射
    private ConcurrentHashMap<String, Channel> Uid2ChannelMap = new ConcurrentHashMap<>();

    // key生成规则
    private String getKey(String uid, String roomId) {
        return uid + ":" + roomId;
    }

    // 链接成功后注册映射关系
    public void onLogin(String uid, String roomId, Channel channel) {
        String key = getKey(uid, roomId);
        if (this.Uid2ChannelMap.containsKey(key)) {
            this.Uid2ChannelMap.get(key).close();
            this.onLogout(this.Uid2ChannelMap.get(key));
        }
        this.Channel2UidMap.put(channel, key);
        this.Uid2ChannelMap.put(key, channel);
    }

    // 链接断开后注销映射关系
    public void onLogout(Channel channel) {
        String key = this.Channel2UidMap.getOrDefault(channel, null);
        if (key != null) {
            this.Uid2ChannelMap.remove(key);
            this.Channel2UidMap.remove(channel);
        }
    }

    // 根据key获取channel
    public Channel getChannel(String uid, String roomId) {
        String key = getKey(uid, roomId);
        return this.Uid2ChannelMap.getOrDefault(key, null);
    }

    public String getKey(Channel channel){
        return this.Channel2UidMap.getOrDefault(channel, null);
    }

    public String getRoomId(Channel channel){
        return getValue(channel, 1);
    }

    public String getUid(Channel channel){
        return getValue(channel, 0);
    }

    private String getValue(Channel channel, int offset){
        String key = this.Channel2UidMap.getOrDefault(channel, null);
        if(key != null){
            return key.split(":")[offset];
        }
        return null;
    }

}
