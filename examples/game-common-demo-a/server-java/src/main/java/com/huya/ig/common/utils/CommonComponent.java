package com.huya.ig.common.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.Gson;
import com.huya.ig.common.network.NetworkConfig;
import com.huya.ig.game.logic.GameConfig;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 基础组件
 *
 */
public class CommonComponent {

    private static final CommonComponent instance = new CommonComponent();
    private CommonComponent(){}
    public static CommonComponent getInstance(){
        return instance;
    }
    // jwt校验器
    private JWTVerifier verifier;
    private Gson gson = new Gson();

    /**
     * 组件初始化
     */
    public void init(){
        Algorithm algorithm = Algorithm.HMAC256(NetworkConfig.getInstance().getSecretKey());
        this.verifier = JWT.require(algorithm).build();
    }

    public JWTVerifier getVerifier(){
        return verifier;
    }

    public String toJson(Object obj){
        return gson.toJson(obj);
    }

    private String genHuyaToken(int iat, int exp, String roomId){
        Algorithm algorithm = Algorithm.HMAC256(GameConfig.secretKey);
        Map<String, Object> headerClaims = new HashMap();
        headerClaims.put("alg", "HS256");
        headerClaims.put("typ", "JWT");

        return JWT.create()
                .withHeader(headerClaims)
                .withClaim("iat", iat)
                .withClaim("exp", exp)
                .withClaim("appId", GameConfig.appId)
                .withClaim("roomId", roomId)
                .sign(algorithm);
    }

    public String genHuyaWsUrl(String roomId){
        int iat = (int)(System.currentTimeMillis()/1000);
        //注意不少于当前时间且不超过当前时间60分钟；
        int exp = iat + 60*60 - 1;
        String url = String.format("wss://ws-apiext.huya.com:443/index.html?do=comm&roomId=%s&appId=%s&iat=%s&exp=%s&sToken=%s",
                roomId, GameConfig.appId, iat, exp, genHuyaToken(iat, exp, roomId));
        return url;
    }

    /**
     * 生成开发阶段联调使用的jwt
     * @param args
     */
    public static void main(String[] args) {
        // 私钥，随意字符，注意需要跟game.properties中的secretKey一致
        String secretKey = "test";
        // 主播uid字符串，随意字符
        String profileId = "zhubouid";
        // 观众uid字符串，如果是生成主播端使用的jwt的话 userId跟profileId一致即可，生成观众使用的jwt则随意不同的字符串即可
        String userId = "zhubouid4";

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        Map<String, Object> headerClaims = new HashMap();
        headerClaims.put("alg", "HS256");
        headerClaims.put("typ", "JWT");

        int now = (int)(System.currentTimeMillis()/1000);
        String token = JWT.create()
                .withHeader(headerClaims)
                .withClaim("creator", "DEV")
                .withClaim("role", "P")
                .withClaim("profileId", profileId)
                .withClaim("extId", "")
                .withClaim("roomId", "1000")
                .withClaim("userId", userId)
                .withClaim("iat", now)
                .withClaim("exp", now+30*24*60*60)
                .withClaim("appId", "appId")
                .sign(algorithm);

        System.out.println(token);
    }

}
