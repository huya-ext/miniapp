package com.huya.ig.network.handler;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.timeout.IdleStateHandler;

import java.util.concurrent.TimeUnit;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 *
 */
public class SocketChannelInitializer extends ChannelInitializer<SocketChannel> {

    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        ChannelPipeline pipeline = socketChannel.pipeline();
        // 链接idle状态检测，服务端10s内没有收到客户端数据判断为非活跃链接并主动断开链接
        pipeline.addLast(new IdleStateHandler(10, 0, 0, TimeUnit.SECONDS));
        pipeline.addLast(new HttpServerCodec());
        pipeline.addLast(new HttpObjectAggregator(65536));
        pipeline.addLast(new HttpServerHandler());
    }
}
