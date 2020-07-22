package com.huya.ig.common.network.handler;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.base.Preconditions;
import com.huya.ig.common.network.NetworkConfig;
import com.huya.ig.common.utils.CommonComponent;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory;
import io.netty.util.ReferenceCountUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;
import static io.netty.handler.codec.rtsp.RtspResponseStatuses.UNAUTHORIZED;

/**
 * http upgrade websocket处理器
 * 主要处理连接鉴权，websocket握手，初始化连接等逻辑
 */
@Slf4j
public class HttpServerHandler extends ChannelInboundHandlerAdapter {

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        try {
            if (msg instanceof FullHttpRequest) {
                FullHttpRequest request = (FullHttpRequest) msg;
                HttpHeaders headers = request.headers();
                // 判断ws upgrade
                if (!StringUtils.isEmpty(headers.get(HttpHeaderNames.SEC_WEBSOCKET_KEY))) {
                    QueryStringDecoder queryStringDecoder = new QueryStringDecoder(request.uri());
                    Map<String, List<String>> params = queryStringDecoder.parameters();
                    Preconditions.checkArgument(params.containsKey("jwt"), "jwt参数为空");
                    String jwt = params.get("jwt").get(0);
                    try {
                        // jwt校验
                        DecodedJWT decodedJWT = CommonComponent.getInstance().getVerifier().verify(jwt);
                        String userId = decodedJWT.getClaim("userId").asString();
                        String roomId = decodedJWT.getClaim("roomId").asString();
                        String profileId = decodedJWT.getClaim("profileId").asString();
                        Preconditions.checkArgument(!StringUtils.isEmpty(userId) && !StringUtils.isEmpty(roomId) && !StringUtils.isEmpty(profileId),
                                "token信息错误，userId:{}, roomId:{}, profileId:{}", userId, roomId, profileId);
                        // ws握手
                        log.info("收到新连接->uid:{}, profileId:{}, isPresenter:{}", userId, profileId, userId.equals(profileId));
                        handleHandshake(ctx, request, userId, roomId, userId.equals(profileId));
                    }catch (JWTVerificationException e){
                        log.error("token校验失败 jwt:"+jwt, e);
                        ctx.close();
                    }
                }else{
                    // 普通http请求
                    FullHttpResponse res = new DefaultFullHttpResponse(HTTP_1_1, UNAUTHORIZED, Unpooled.wrappedBuffer("ok".getBytes()));
                    HttpUtil.setContentLength(res, res.content().readableBytes());
                    ctx.channel().writeAndFlush(res);
                }
            }
        }finally {
            ReferenceCountUtil.release(msg);
        }
    }

    private void handleHandshake(final ChannelHandlerContext ctx, HttpRequest req, String uid, String roomId, boolean isPresenter){
        WebSocketServerHandshakerFactory wsFactory =
                new WebSocketServerHandshakerFactory(getWebSocketURL(req), null, true);
        WebSocketServerHandshaker handshaker = wsFactory.newHandshaker(req);
        if (handshaker == null) {
            WebSocketServerHandshakerFactory.sendUnsupportedVersionResponse(ctx.channel());
        } else {
            ChannelFuture future = handshaker.handshake(ctx.channel(), req);
            future.addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture channelFuture) throws Exception {
                    if (channelFuture.isSuccess()) {
                        ctx.pipeline().replace(ctx.handler(), "websocketHandler", new WebsocketHandler());
                        NetworkConfig.getInstance().getListener().onConnected(ctx.channel(), roomId, uid, isPresenter);
                    }else{
                        ctx.close();
                    }
                }
            });
        }
    }

    private String getWebSocketURL(HttpRequest req) {
        return "ws://" + req.headers().get(HttpHeaderNames.HOST) + req.uri();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("http channel exception. close connection..." + " " + ctx.channel().id(), cause);
        ctx.close();
    }

}
