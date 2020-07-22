package com.huya.ig.common.network.protocol;

import lombok.Data;

/**
 * 协议封装
 * @author wangpeng1@huya.com
 * @date 2020/7/14
 * @description
 */
@Data
public class GamePacket {

    private int protocol;   // 协议号
    private String payload; // 协议数据

    public GamePacket(){

    }

    public GamePacket(int protocol){
        this.protocol = protocol;
    }

    public GamePacket(int protocol, String payload){
        this.protocol = protocol;
        this.payload = payload;
    }

}
