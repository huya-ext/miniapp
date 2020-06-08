package com.huya.ig.jump.model;

import com.google.protobuf.util.JsonFormat;
import com.huya.ig.util.CommonComponent;
import com.huya.ig.jump.protocol.Player;
import com.huya.ig.jump.protocol.Position;
import lombok.Data;

/**
 *
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 玩家对象
 *
 */
@Data
public class PlayerInfo {

    private String uid;         // 玩家unionId
    private String nick;        // 玩家昵称
    private String avatar;      // 玩家头像url
    private int score;          // 玩家游戏得分
    private float deviceWidth;  // 玩家设备宽度，前端适配用
    private Position position;  // 玩家当前位置

    /**
     * 转换为protobuf对象
     * @return Player
     */
    public Player tran2Pb(){
        try {
            Player.Builder builder = Player.newBuilder();
            JsonFormat.parser().ignoringUnknownFields().merge(
                    CommonComponent.getInstance().toJson(this), builder);
            if(position != null) {
                builder.setPosition(position);
            }
            return builder.build();
        }catch (Exception e){
            return null;
        }
    }

}
