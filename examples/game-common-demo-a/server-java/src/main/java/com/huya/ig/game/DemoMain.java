package com.huya.ig.game;

import com.huya.ig.common.network.NetworkConfig;
import com.huya.ig.common.network.WebsocketServer;
import com.huya.ig.common.utils.CommonComponent;
import com.huya.ig.common.utils.PropertiesUtil;
import com.huya.ig.game.logic.DemoListener;
import com.huya.ig.game.logic.GameConfig;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 游戏服务器入口类
 * @author wangpeng1@huya.com
 * @date 2020/7/14
 * @description
 */
@Slf4j
public class DemoMain {

    public static void main(String[] args) {
        // 1. 加载配置
        Properties properties = new Properties();
        try (InputStream in = DemoMain.class.getClassLoader().getResourceAsStream("game.properties")){
            properties.load(in);
        }catch (IOException e){
            log.error("加载配置文件失败", e);
            System.exit(-1);
        }
        GameConfig.port = PropertiesUtil.getInt(properties, "port", 8080);
        GameConfig.gameDuration = PropertiesUtil.getInt(properties, "gameDuration", 60);
        GameConfig.minPlayerCnt = PropertiesUtil.getInt(properties, "minPlayerCnt", 2);
        GameConfig.maxPlayerCnt = PropertiesUtil.getInt(properties, "maxPlayerCnt", 8);
        GameConfig.appId = PropertiesUtil.getStringNotNull(properties, "appId");
        GameConfig.secretKey = PropertiesUtil.getStringNotNull(properties, "secretKey");
        // 2. 服务网络参数初始化
        NetworkConfig.getInstance().init(
                GameConfig.port,
                GameConfig.secretKey, new DemoListener());
        // 3. 基础组件初始化
        CommonComponent.getInstance().init();
        // 4. 启动游戏服务器
        WebsocketServer.startup();
    }

}
