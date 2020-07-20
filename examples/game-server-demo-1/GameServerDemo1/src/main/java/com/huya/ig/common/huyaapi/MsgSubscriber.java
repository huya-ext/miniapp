package com.huya.ig.common.huyaapi;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.epoll.Epoll;
import io.netty.channel.epoll.EpollEventLoopGroup;
import io.netty.channel.epoll.EpollSocketChannel;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.DefaultHttpHeaders;
import io.netty.handler.codec.http.HttpClientCodec;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.handler.codec.http.websocketx.WebSocketClientHandshakerFactory;
import io.netty.handler.codec.http.websocketx.WebSocketVersion;
import io.netty.handler.codec.http.websocketx.extensions.compression.WebSocketClientCompressionHandler;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.extern.slf4j.Slf4j;

import javax.net.ssl.SSLException;
import java.net.URI;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * 虎牙直播弹幕消息监听组件
 * 本质其实就是一个websocket client，接受虎牙弹幕websocket数据
 */
@Slf4j
public class MsgSubscriber {

    private Channel ch = null;
    private Bootstrap b = new Bootstrap();
    private URI uri;
    private String[] topicList;
    private MsgListener listener;
    private MsgHandler handler;
    private ScheduledFuture hbTimer;
    private String roomId;

    /**
     * 监听器初始化
     * @param uri 虎牙弹幕系统连接url
     * @param topics 订阅的消息主题
     * @param listener 业务回调
     * @param roomId 直播间房间号
     */
    public MsgSubscriber(URI uri, String[] topics, MsgListener listener, String roomId){
        this.uri = uri;
        this.listener = listener;
        this.topicList = topics;
        this.roomId = roomId;

        // 初始化websocket client
        setup();
    }

    /**
     * 断开虎牙弹幕websocket链接
     * 一般在直播间游戏结束时调用
     */
    public void disconnect(){
        if(ch != null){
            ch.close();
        }
        if(hbTimer != null){
            hbTimer.cancel(true);
        }
    }

    /**
     * websocket client初始化
     */
    private void setup(){
        EventLoopGroup group;
        Class<? extends SocketChannel> SocketChannelClass;
        if(Epoll.isAvailable()){
            group = new EpollEventLoopGroup();
            SocketChannelClass = EpollSocketChannel.class;
        }else{
            group = new NioEventLoopGroup();
            SocketChannelClass = NioSocketChannel.class;
        }
        boolean ssl = uri.getScheme().equals("wss");
        handler = new MsgHandler(listener, WebSocketClientHandshakerFactory.newHandshaker(
                uri, WebSocketVersion.V13, null, true, new DefaultHttpHeaders()), roomId);
        b.group(group)
                .channel(SocketChannelClass)
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws SSLException {
                        ChannelPipeline p = ch.pipeline();
                        if(ssl){
                            p.addLast(SslContextBuilder
                                    .forClient()
                                    .trustManager(InsecureTrustManagerFactory.INSTANCE)
                                    .build()
                                    .newHandler(ch.alloc()));
                        }
                        p.addLast(
                                new HttpClientCodec(),
                                new HttpObjectAggregator(8192),
                                WebSocketClientCompressionHandler.INSTANCE,
                                handler
                                );
                    }
                });
    }

    /**
     * 连接虎牙弹幕系统
     * @throws InterruptedException
     */
    public void connect() throws InterruptedException {
        ch = b.connect(uri.getHost(), uri.getPort()).sync().channel();
        handler.handshakeFuture().sync();

        log.info("连接成功，开始订阅虎牙弹幕消息...roomId:{}", roomId);
        // 订阅消息
        JsonObject subNotice = new JsonObject();
        subNotice.addProperty("command", "subscribeNotice");
        subNotice.addProperty("reqId", (int)(System.currentTimeMillis()/1000));
        JsonArray topics = new JsonArray();
        for(String t : topicList){
            topics.add(t);
        }
        subNotice.add("data", topics);
        ch.writeAndFlush(new TextWebSocketFrame(subNotice.toString()));
        log.info("订阅完成，开始启动心跳定时器... roomId:{}", roomId);
        // 定时心跳
        hbTimer = ch.eventLoop().scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                ch.writeAndFlush(new TextWebSocketFrame("ping"));
            }
        }, 3, 15, TimeUnit.SECONDS);
    }

}
