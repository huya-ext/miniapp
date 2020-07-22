package com.huya.ig.game.logic;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

/**
 * 全局房间管理器，当前服务器上所有的房间都会在这里维护
 * @date 2020/5/21
 * @author wangpeng1@huya.com
 * @description 全局房间管理器
 */
public class RoomManager {

    private static final RoomManager instance = new RoomManager();
    public static RoomManager getInstance(){
        return instance;
    }
    private RoomManager(){}
    // 房间列表
    private Map<String, Room> roomMaps = new ConcurrentHashMap<>();
    // 全局任务调度器
    private ScheduledExecutorService schduler = Executors.newScheduledThreadPool(Runtime.getRuntime().availableProcessors() * 2);

    /**
     * 查询房间
     * @param roomId 房间号
     * @return Room对象
     */
    public Room getRoom(String roomId){
        return roomMaps.getOrDefault(roomId, null);
    }

    /**
     * 创建房间
     * @param roomId 房间号
     * @param presenterUid 主播unionId
     * @return Room对象
     */
    public Room newRoom(String roomId, String presenterUid){
        Room room = new Room();
        room.setRoomId(roomId);
        room.setPresenterUid(presenterUid);

        roomMaps.put(roomId, room);
        return room;
    }

    /**
     * 销毁房间
     * @param roomId 房间号
     */
    public void removeRoom(String roomId){
        roomMaps.remove(roomId);
    }

    public ScheduledExecutorService getSchduler() {
        return schduler;
    }
}
