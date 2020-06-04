package com.huya.ig;

import com.huya.ig.util.CommonComponent;
import com.huya.ig.config.ServerConfig;
import com.huya.ig.network.WebsocketServer;
import com.huya.ig.util.PropertiesUtil;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 服务器入口
 */
@Slf4j
public class JumpServerMain {

    public static void main(String[] args) {
        // 加载配置
        Properties properties = new Properties();
        try (InputStream in = JumpServerMain.class.getClassLoader().getResourceAsStream("game.properties")){
            properties.load(in);
        }catch (IOException e){
            log.error("加载配置文件失败", e);
            System.exit(-1);
        }
        ServerConfig.port = PropertiesUtil.getInt(properties, "port", 8080);
        ServerConfig.gameDuration = PropertiesUtil.getInt(properties, "gameDuration", 180);
        ServerConfig.maxPlatformCnt = PropertiesUtil.getInt(properties, "maxPlatformCnt", 200);
        ServerConfig.minPlayerCnt = PropertiesUtil.getInt(properties, "minPlayerCnt", 2);
        ServerConfig.maxPlayerCnt = PropertiesUtil.getInt(properties, "maxPlayerCnt", 8);
        ServerConfig.secretKey = PropertiesUtil.getStringNotNull(properties, "secretKey");
        // 初始化基础组件
        CommonComponent.getInstance().init();
        // 启动websocket服务器
        WebsocketServer.startup();
    }

}
