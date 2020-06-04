package com.huya.ig.network.handler;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.base.Preconditions;
import com.huya.ig.util.CommonComponent;
import com.huya.ig.jump.Room;
import com.huya.ig.jump.RoomManager;
import com.huya.ig.jump.protocol.EJoinRet;
import com.huya.ig.jump.protocol.Packet;
import com.huya.ig.jump.protocol.Protocol;
import com.huya.ig.jump.protocol.RoomConnectedNotice;
import com.huya.ig.network.ChannelUtil;
import com.huya.ig.network.ConnManager;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshaker;
import io.netty.handler.codec.http.websocketx.WebSocketServerHandshakerFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Map;

import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;
import static io.netty.handler.codec.rtsp.RtspResponseStatuses.UNAUTHORIZED;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description http协议处理
 */
@Slf4j
public class HttpServerHandler extends ChannelInboundHandlerAdapter {

    private static final WebsocketHandler websocketHandler = new WebsocketHandler();

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof FullHttpRequest) {
            HttpRequest request = (HttpRequest) msg;
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
                    log.error("token校验失败", e);
                    ctx.close();
                }
            }else{
                // 普通http请求
                FullHttpResponse res = new DefaultFullHttpResponse(HTTP_1_1, UNAUTHORIZED, Unpooled.wrappedBuffer("ok".getBytes()));
                HttpUtil.setContentLength(res, res.content().readableBytes());
                ctx.channel().writeAndFlush(res);
            }
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
                public void operationComplete(ChannelFuture channelFuture) throws Exception {
                    if (channelFuture.isSuccess()) {
                        // 握手成功，升级到websocket协议
                        ctx.pipeline().replace(ctx.handler(), "websocketHandler", websocketHandler);
                        Room room = RoomManager.getInstance().getRoom(roomId);
                        // 房间不存在
                        if(room == null){
                            // 如果是主播，创建房间
                            if(isPresenter){
                                ConnManager.getInstance().onLogin(uid, roomId, ctx.channel());
                                RoomManager.getInstance().newRoom(roomId, uid).onJoin(uid);
                            }else{
                                // 观众连接，返回房间关闭
                                RoomConnectedNotice notice = RoomConnectedNotice.newBuilder()
                                        .setRet(EJoinRet.ROOM_CLOSED)
                                        .setUid(uid)
                                        .build();
                                ChannelUtil.write(ctx.channel(), Packet.newBuilder()
                                        .setUri(Protocol.S2CRoomConnectedNotice_VALUE)
                                        .setBody(notice.toByteString())
                                        .build()
                                );
                                ctx.close();
                            }
                        }else{
                            // 加入房间
                            ConnManager.getInstance().onLogin(uid, roomId, ctx.channel());
                            room.onJoin(uid);
                        }
                    }else{
                        // 握手失败
                        ctx.close();
                    }
                }
            });
        }
    }

    private String getWebSocketURL(HttpRequest req) {
        return "ws://" + req.headers().get(HttpHeaderNames.HOST) + req.getUri();
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("http channel exception. close connection..." + " " + ctx.channel().id(), cause);
        ctx.close();
    }

}
