package com.huya.ig.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.gson.Gson;
import com.huya.ig.config.ServerConfig;
import com.huya.ig.jump.protocol.Platform;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

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
    // 方块颜色，由客户端定义
    private int[] colors = new int[]{0x67C23A, 0xE6A23C, 0xF56C6C, 0x909399, 0x409EFF, 0xffffff};

    /**
     * 组件初始化
     */
    public void init(){
        Algorithm algorithm = Algorithm.HMAC256(ServerConfig.secretKey);
        this.verifier = JWT.require(algorithm).build();
    }

    public JWTVerifier getVerifier(){
        return verifier;
    }

    public String toJson(Object obj){
        return gson.toJson(obj);
    }

    /**
     * 地图生成，具体生成算法由客户端定义
     * @param size 地图方块数量
     * @return 方块列表
     */
    public List<Platform> genMap(int size){
        List<Platform> platforms = new ArrayList<>();
        for(int i=1;i<=size;i++){
            Platform pt = Platform.newBuilder()
                    .setId(i)
                    .setColor(colors[ThreadLocalRandom.current().nextInt(0, colors.length)])
                    .setSize(ThreadLocalRandom.current().nextInt(750/6, (int) (750/3.5)))
                    .setShape(ThreadLocalRandom.current().nextInt(0, 2))
                    .setDistance(ThreadLocalRandom.current().nextInt(750/6/2, (int) (750*2/3.5)))
                    .setDirection(ThreadLocalRandom.current().nextInt(0, 2))
                    .build();
            platforms.add(pt);
        }
        return platforms;
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
        String userId = "zhubouid";

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
