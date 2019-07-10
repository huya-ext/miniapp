 const isDebug = false;

 var config = {
    minSettingActionTime: 3,
    maxSettingActionTime: 50,
    defaultActionTime: 3,
    extUuid: 'sx6g47qz',
    baseUrl: isDebug ? '14.116.174.40' : 'handspeed.web.huya.com',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        end: 2
    }
}

export default config;