package com.huya.ig.network;

import com.huya.ig.jump.protocol.Packet;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 服务端回包工具类，封装回包逻辑
 */
@Slf4j
public class ChannelUtil {

    public static void write(ChannelHandlerContext ctx, Packet packet) {
        log.info("响应数据包->"+packet.getUri());
        ByteBuf buf = ctx.alloc().directBuffer();
        BinaryWebSocketFrame resp = new BinaryWebSocketFrame(buf.writeBytes(packet.toByteArray()));
        ctx.executor().execute(new Runnable() {
            @Override
            public void run() {
                ctx.writeAndFlush(resp);
            }
        });
    }

    public static void write(Channel channel, Packet packet) {
        log.info("响应数据包->"+packet.getUri());
        if(channel != null && channel.isWritable()) {
            ByteBuf buf = channel.alloc().directBuffer();
            BinaryWebSocketFrame resp = new BinaryWebSocketFrame(buf.writeBytes(packet.toByteArray()));
            channel.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    channel.writeAndFlush(resp);
                }
            });
        }
    }

    /**
     *
     * @param channel
     * @param data 是Packet封装好的字节数组
     */
    public static void write(Channel channel, byte[] data) {
        if(channel != null && channel.isWritable()) {
            ByteBuf buf = channel.alloc().directBuffer();
            BinaryWebSocketFrame resp = new BinaryWebSocketFrame(buf.writeBytes(data));
            channel.eventLoop().execute(new Runnable() {
                @Override
                public void run() {
                    channel.writeAndFlush(resp);
                }
            });
        }
    }

}
