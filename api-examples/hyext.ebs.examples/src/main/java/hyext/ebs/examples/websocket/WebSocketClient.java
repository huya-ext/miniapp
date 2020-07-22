package hyext.ebs.examples.websocket;

import com.alibaba.fastjson.JSONObject;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import hyext.ebs.examples.utils.ParamsUtil;

import org.java_websocket.enums.ReadyState;
import org.java_websocket.handshake.ServerHandshake;

import java.net.URI;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * 开放API websocket 接入实现样例
 *
 */
public class WebSocketClient extends org.java_websocket.client.WebSocketClient {
    
    public WebSocketClient(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake arg0) {
    	System.out.println("------ WebSocketClient onOpen ------");
    }

    @Override
    public void onClose(int arg0, String arg1, boolean arg2) {
    	System.out.println("------ WebSocketClient onClose ------");
    }

    @Override
    public void onError(Exception arg0) {
    	System.out.println("------ WebSocketClient onError ------");
    }

    @Override
    public void onMessage(String arg0) {
    	System.out.println("-------- 接收到服务端数据： " + arg0 + "--------");
    	try {
        	JSONObject res = JSONObject.parseObject(arg0);
        	if("command".equals(res.getString("notice"))) {//监听成功回包
        		System.out.println("-------- 监听事件： " + res.getJSONObject("data").getJSONArray("data") + " 成功--------");
        	}
        	
        	if("getSendItemNotice".equals(res.getString("notice"))) {
                JSONObject data = JSONObject.parseObject(arg0).getJSONObject("data");
                //粉丝徽章名称
                String badgeName = data.getString("badgeName");
                //粉丝等级
                Integer fansLevel = data.getInteger("fansLevel");
                //礼物id
                Integer giftId = data.getInteger("itemId");
                //贵族等级
                Integer nobleLevel = data.getInteger("nobleLevel");
                //房间号
                Long roomId = data.getLong("roomId");
                //送礼连击数
                Long sendItemCount = data.getLong("sendItemCount");
                //送礼者昵称
                String sendNick = data.getString("sendNick");
                //用户等级
                Long senderLevel = data.getLong("senderLevel");
                
                System.out.println(String.format("-------- 粉丝勋章：%s,粉丝等级:%s,礼物id:%s,贵族等级:%s,房间号:%s,送礼连击数:%s,送礼者昵称:%s,用户等级:%s --------"
                		,badgeName,fansLevel,giftId,nobleLevel,roomId,sendItemCount,sendNick,senderLevel));
        	}
    		
		} catch (Exception e) {
			System.out.println("-------- 数据处理异常 --------");
		}
    }
    
    /**
     * 生成开放API Websocket连接参数
     * @param appId  开发者ID（https://ext.huya.com成为开发者后自动生成）
     * @param secret 开发者密钥（https://ext.huya.com成为开发者后自动生成）
     * @param roomId 要监听主播的房间号
     * @return
     */
    public static Map<String, Object> getWebSocketJwtParamsMap(String appId, String secret, long roomId){
        //获取时间戳（毫秒）
        long currentTimeMillis = System.currentTimeMillis();
        long expireTimeMillis = System.currentTimeMillis() + 10 * 60 * 1000;  //超时时间:通常设置10分钟有效，即exp=iat+600，注意不少于当前时间且不超过当前时间60分钟
        Date iat = new Date(currentTimeMillis);
        Date exp = new Date(expireTimeMillis);

        try {
        	
            Map<String, Object> header = new HashMap<String, Object>();
            header.put("alg", "HS256");
            header.put("typ", "JWT");
            
            //生成JWT凭证
            Algorithm algorithm = Algorithm.HMAC256(secret);   //开发者密钥
            String sToken = JWT.create()
                    .withHeader(header)                    //JWT声明
                    .withIssuedAt(iat)                     //jwt凭证生成时间
                    .withExpiresAt(exp)                    //jwt凭证超时时间
                    .withClaim("appId", appId)             //开发者ID
                    .sign(algorithm);


            Map<String, Object> authMap = new HashMap<String, Object>();
            authMap.put("iat", currentTimeMillis / 1000);    //jwt凭证生成时间戳（秒）
            authMap.put("exp", expireTimeMillis / 1000);     //jwt凭证超时时间戳（秒）
            authMap.put("sToken", sToken);                   //jwt签名串
            authMap.put("appId",appId);                      //开发者ID
            authMap.put("do", "comm");                       //接口默认参数
            authMap.put("roomId", roomId);                   //需要监听主播的房间号

            return authMap;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public static void main(String[] args) {
    	
    	try {
    		
    		int ExecuteSecond = 60; //监听时间秒
    		
    		String appId = "";      //小程序开发者ID（成为开发者后，https://ext.huya.com可查）
    		String secret = "";     //小程序开发者密钥（成为开发者后，https://ext.huya.com可查）
    		long roomId = ;        //监听主播的房间号
    		
            Map<String, Object> map = new HashMap<String, Object>(16);
            map = WebSocketClient.getWebSocketJwtParamsMap(appId,secret,roomId);

            StringBuffer urlBuffer = new StringBuffer();
            urlBuffer.append("ws://ws-apiext.huya.com/index.html").append(ParamsUtil.MapToUrlString(map));

            WebSocketClient client = new WebSocketClient(URI.create(urlBuffer.toString()));
            client.setConnectionLostTimeout(3600);
            client.connect();
            while (!client.getReadyState().equals(ReadyState.OPEN)) {
            }
            Long reqId = System.currentTimeMillis();
            String sendMsg = "{\"command\":\"subscribeNotice\",\"data\":[\"getSendItemNotice\"],\"reqId\":\"" + reqId + "\"}";
            client.send(sendMsg);
            int count = 1;
            while (count < ExecuteSecond) {
                Thread.sleep(1000);
                System.out.println("connect time:" + count);
                client.send("ping");
                count++;
            }
            client.closeConnection(0,"bye");
        } catch (Exception e) {
            e.printStackTrace();
        }
	}


}

