package com.huya.ig.common.network.util;

import com.google.gson.Gson;
import com.huya.ig.common.network.ConnManager;
import com.huya.ig.common.network.protocol.GamePacket;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import lombok.extern.slf4j.Slf4j;

import java.util.Set;

/**
 * 回包工具类
 * 实现单播、广播、组播等回包接口
 */
@Slf4j
public class ChannelUtil {

    private static Gson gson = new Gson();

    /**
     * data 是Packet封装好的字节数组
     */
    public static void write(ChannelHandlerContext ctx, GamePacket packet) {
        TextWebSocketFrame resp = new TextWebSocketFrame(gson.toJson(packet));
        ctx.executor().execute(new Runnable() {
            @Override
            public void run() {
                ctx.writeAndFlush(resp);
            }
        });
    }

    public static void write(Channel channel, GamePacket packet) {
        if(channel != null && channel.isWritable()) {
            TextWebSocketFrame resp = new TextWebSocketFrame(gson.toJson(packet));
            channel.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    channel.writeAndFlush(resp);
                }
            });
        }
    }

    public static void write(Channel channel, String data) {
        if(channel != null && channel.isWritable()) {
            TextWebSocketFrame resp = new TextWebSocketFrame(data);
            channel.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    channel.writeAndFlush(resp);
                }
            });
        }
    }

    public static void broadcast(String roomId, int uri, String data, Set<String> allUids){
        broadcast(roomId, uri, data, allUids, "");
    }

    public static void broadcast(String roomId, int uri, String data, Set<String> allUids, String exUid){
        GamePacket packet = new GamePacket(uri, data);
        for(String uid : allUids){
            if(!uid.equals(exUid)) {
                ChannelUtil.write(ConnManager.getInstance().getChannel(uid, roomId), packet);
            }
        }
    }

    public static void broadcast(String roomId, int uri, String data, Set<String> allUids, Set<String> exUids){
        GamePacket packet = new GamePacket(uri, data);
        for(String uid : allUids){
            if(exUids == null || !exUids.contains(uid)) {
                ChannelUtil.write(ConnManager.getInstance().getChannel(uid, roomId), packet);
            }
        }
    }

    public static void unicast(String roomId, int uri, String data, String uid){
        GamePacket packet = new GamePacket(uri, data);
        ChannelUtil.write(ConnManager.getInstance().getChannel(uid, roomId), packet);
    }

}
