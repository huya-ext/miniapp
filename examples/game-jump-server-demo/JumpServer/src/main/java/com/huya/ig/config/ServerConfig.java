package com.huya.ig.config;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 服务配置，具体配置项含义参考game.properties
 */
public class ServerConfig {

    public static int port = 8081;
    public static String secretKey = "test";
    public static int minPlayerCnt = 2;
    public static int maxPlayerCnt = 8;
    public static int gameDuration = 180;
    public static int maxPlatformCnt = 200;

}
