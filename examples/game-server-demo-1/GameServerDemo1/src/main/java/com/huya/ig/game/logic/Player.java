package com.huya.ig.game.logic;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * @author wangpeng1@huya.com
 * @date 2020/7/20
 * @description
 */
@Data
@AllArgsConstructor
public class Player {

    private String uid;
    private int score;
    private String nick;
    private String avatar;

}
