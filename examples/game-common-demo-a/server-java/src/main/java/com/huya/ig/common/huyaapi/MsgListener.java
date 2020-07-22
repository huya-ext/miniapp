package com.huya.ig.common.huyaapi;

/**
 * 虎牙弹幕监听器回调，实现网络逻辑和业务逻辑的解耦
 */
public interface MsgListener {

    /**
     * 收到虎牙弹幕系统消息事件
     * @param type 消息topic
     * @param data 消息数据
     */
    void onMsg(String type, String data);

    /**
     * 连接断开事件
     */
    void onDisconnect();

}
