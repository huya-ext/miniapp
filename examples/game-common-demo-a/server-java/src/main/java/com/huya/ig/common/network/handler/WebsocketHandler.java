package com.huya.ig.common.network.handler;

import com.google.gson.Gson;
import com.huya.ig.common.network.ConnManager;
import com.huya.ig.common.network.NetworkConfig;
import com.huya.ig.common.network.protocol.GamePacket;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufUtil;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.handler.codec.http.websocketx.CloseWebSocketFrame;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketFrame;
import io.netty.handler.timeout.IdleState;
import io.netty.handler.timeout.IdleStateEvent;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * websocket数据处理器
 */
@Slf4j
@ChannelHandler.Sharable
public class WebsocketHandler extends SimpleChannelInboundHandler<WebSocketFrame> {

    private Gson gson = new Gson();

    // 业务任务线程池，处理耗时业务操作，避免阻塞netty io线程
    private static final ExecutorService bizThreadPool =
            new ThreadPoolExecutor(10, 512, 60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<Runnable>(20000));

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame msg) throws Exception {
        if (msg instanceof BinaryWebSocketFrame) {
            handleWSClose(ctx);
        } else if (msg instanceof CloseWebSocketFrame) {
            handleWSClose(ctx);
        } else if(msg instanceof TextWebSocketFrame) {
            TextWebSocketFrame data = (TextWebSocketFrame) msg;
            handleWSTextFrame(ctx, data);
        }
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent && ((IdleStateEvent)evt).state() == IdleState.READER_IDLE) {
            log.warn("channel read idle. close it... uid:" + ConnManager.getInstance().getUid(ctx.channel()));
            handleWSClose(ctx);
        } else {
            super.userEventTriggered(ctx, evt);
        }
    }

    protected void handleWSTextFrame(ChannelHandlerContext ctx, TextWebSocketFrame data) {
        String json = data.text();
        GamePacket packet = gson.fromJson(json, GamePacket.class);
        if(packet != null){
            bizThreadPool.submit(new Runnable() {
                @Override
                public void run() {
                    try{
                        // 将数据回调给业务注册的监听器，实现网络逻辑和业务逻辑的分离
                        NetworkConfig.getInstance().getListener().onData(ctx.channel(), packet);
                    }catch (Exception e){
                        log.error("handle binaryframe failed.", e);
                    }
                }
            });
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("websocket unhandle exception. close connection... cause:" + cause.getLocalizedMessage() + " " + ctx.channel().id(), cause);
        handleWSClose(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        log.info("channel inactive. logout..."+ctx.channel().id());
        ConnManager.getInstance().onLogout(ctx.channel());
        NetworkConfig.getInstance().getListener().onDisconnected(ctx.channel());
    }

    public void handleWSClose(ChannelHandlerContext ctx) {
        handleWSClose(ctx.channel());
    }

    public void handleWSClose(Channel channel) {
        channel.writeAndFlush(new CloseWebSocketFrame());
        channel.close();
    }

}
