 const isDebug = false;

 var config = {
    minSettingActionTime: 3,
    maxSettingActionTime: 50,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? '' : '',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        end: 2
    }
}

export default config;