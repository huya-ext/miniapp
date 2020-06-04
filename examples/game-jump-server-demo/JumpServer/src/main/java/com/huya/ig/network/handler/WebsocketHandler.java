package com.huya.ig.network.handler;

import com.google.protobuf.InvalidProtocolBufferException;
import com.huya.ig.jump.Room;
import com.huya.ig.jump.RoomManager;
import com.huya.ig.jump.protocol.JumpReq;
import com.huya.ig.jump.protocol.Packet;
import com.huya.ig.jump.protocol.PlayerInfoReq;
import com.huya.ig.jump.protocol.Protocol;
import com.huya.ig.network.ChannelUtil;
import com.huya.ig.network.ConnManager;
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
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description websocket协议处理器
 *
 */
@Slf4j
@ChannelHandler.Sharable
public class WebsocketHandler extends SimpleChannelInboundHandler<WebSocketFrame> {

    // 业务线程池
    private static final ExecutorService bizThreadPool =
            new ThreadPoolExecutor(10, 512, 60L, TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(20000));

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, WebSocketFrame msg) throws Exception {
        if (msg instanceof BinaryWebSocketFrame) {
            BinaryWebSocketFrame data = (BinaryWebSocketFrame) msg;
            handleWSBinaryFrame(ctx, data);
        } else if (msg instanceof CloseWebSocketFrame) {
            handleWSClose(ctx);
        } else if(msg instanceof TextWebSocketFrame) {
            handleWSClose(ctx);
        }
    }

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        if (evt instanceof IdleStateEvent && ((IdleStateEvent)evt).state() == IdleState.READER_IDLE) {
            log.warn("channel read idle. close it... uid:" + ConnManager.getInstance().getKey(ctx.channel()));
            handleWSClose(ctx);
        } else {
            super.userEventTriggered(ctx, evt);
        }
    }

    protected void handleWSBinaryFrame(ChannelHandlerContext ctx, BinaryWebSocketFrame data) throws InvalidProtocolBufferException {
        ByteBuf buf = data.content();
        // 最外层协议为Packet协议
        Packet packet = Packet.parseFrom(ByteBufUtil.getBytes(buf));
        if(packet != null){
            bizThreadPool.submit(new Runnable() {
                @Override
                public void run() {
                    try{
                        // 拿到协议号
                        Protocol protocol = Protocol.forNumber(packet.getUri());
                        String roomId = ConnManager.getInstance().getRoomId(ctx.channel());
                        String uid = ConnManager.getInstance().getUid(ctx.channel());
                        Room room = RoomManager.getInstance().getRoom(roomId);
                        log.info("handle uid:{} protocol:{} of room:{}", uid, packet.getUri(), room == null ? null : room.getRoomId());
                        if(protocol == null || room == null){
                            handleWSClose(ctx.channel());
                            return;
                        }
                        // 根据不同协议，进入部分逻辑分支处理
                        switch (protocol) {
                            // 客户端心跳请求
                            case C2SHeartbeatReq:
                                ChannelUtil.write(ctx, Packet.newBuilder()
                                        .setUri(Protocol.S2CHeartbeatNotice_VALUE)
                                        .setBody(packet.getBody())
                                        .build());
                                break;
                            case C2SPlayerInfoReq:
                                room.onPlayerInfo(uid, PlayerInfoReq.parseFrom(packet.getBody()));
                                break;
                            case C2SStartGameReq:
                                if(room.getPresenterUid().equals(uid)) {
                                    room.start();
                                }
                                break;
                            case C2SJumpReq:
                                room.onJump(uid, JumpReq.parseFrom(packet.getBody()));
                                break;
                            default:
                                // 未知协议
                                handleWSClose(ctx);
                                break;
                        }
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
    }

    public void handleWSClose(ChannelHandlerContext ctx) {
        handleWSClose(ctx.channel());
    }

    public void handleWSClose(Channel channel) {
        channel.writeAndFlush(new CloseWebSocketFrame());
        channel.close();
    }

}
