package com.huya.ig.common.huyaapi;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.netty.channel.*;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.websocketx.*;
import io.netty.util.CharsetUtil;
import lombok.extern.slf4j.Slf4j;

/**
 * websocket消息处理器
 */
@Slf4j
public class MsgHandler extends SimpleChannelInboundHandler<Object> {

    private MsgListener listener;
    private WebSocketClientHandshaker handshaker;
    private ChannelPromise handshakeFuture;
    private String roomId;
    private Gson gson = new Gson();

    public MsgHandler(MsgListener listener, WebSocketClientHandshaker handshaker, String roomId){
        this.listener = listener;
        this.handshaker = handshaker;
        this.roomId = roomId;
    }

    public ChannelFuture handshakeFuture() {
        return handshakeFuture;
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        handshakeFuture = ctx.newPromise();
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        handshaker.handshake(ctx.channel());
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Object data) throws Exception {
        Channel ch = ctx.channel();
        if (!handshaker.isHandshakeComplete()) {
            try {
                handshaker.finishHandshake(ch, (FullHttpResponse) data);
                handshakeFuture.setSuccess();
                ch.pipeline().addLast(new WebSocketFrameAggregator(64*1024));
            } catch (WebSocketHandshakeException e) {
                handshakeFuture.setFailure(e);
            }
            return;
        }

        if (data instanceof FullHttpResponse) {
            FullHttpResponse response = (FullHttpResponse) data;
            throw new IllegalStateException(
                    "Unexpected FullHttpResponse (getStatus=" + response.status() +
                            ", content=" + response.content().toString(CharsetUtil.UTF_8) + ')');
        }

        WebSocketFrame frame = (WebSocketFrame) data;
        if (frame instanceof CloseWebSocketFrame) {
            ctx.channel().writeAndFlush(new CloseWebSocketFrame());
            ctx.channel().close();
        } else if (frame instanceof TextWebSocketFrame) {
            // 处理websocket文本类型数据库
            String text = ((TextWebSocketFrame) frame).text();
            JsonObject json = gson.fromJson(text, JsonObject.class);
            int code = json.get("statusCode").getAsInt();
            if(code == 200){
                String notice = json.get("notice").getAsString();
                if(notice.equals("command")){
                    if(json.get("data").getAsJsonObject().get("failedList").getAsJsonArray().size() > 0){
                        log.error("roomId:{} 有订阅失败的topic:{}", roomId, text);
                    }else{
                        log.info("订阅虎牙消息成功！roomId:{}", roomId);
                    }
                }else{
                    // 将弹幕数据回调给注册的业务listener
                    listener.onMsg(notice, json.get("data").getAsJsonObject().toString());
                }
            }else{
                log.error("roomId:{}回包状态码错误：{}", roomId, text);
            }
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause)
            throws Exception {
        log.error("roomId:{}未知异常，断开链接... error: {}", roomId, cause.getMessage());
        if (!handshakeFuture.isDone()) {
            handshakeFuture.setFailure(cause);
        }
        ctx.close();
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        // 回调连接断开事件
        listener.onDisconnect();
    }

}
