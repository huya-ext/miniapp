package com.huya.ig.common.network;

import com.huya.ig.common.network.callback.NetworkListener;
import lombok.Getter;
import lombok.Setter;

/**
 * 服务器基本配置
 * @author wangpeng1@huya.com
 * @date 2020/6/4
 * @description
 */
@Getter
@Setter
public class NetworkConfig {

    private static final NetworkConfig instance = new NetworkConfig();
    private NetworkConfig(){}
    public static NetworkConfig getInstance(){
        return instance;
    }

    private int port;
    private String secretKey;
    private NetworkListener listener;

    public void init(int port, String secretKey, NetworkListener listener){
        this.port = port;
        this.secretKey = secretKey;
        this.listener = listener;
    }

}
