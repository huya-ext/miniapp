import { AppRegistry, NativeModules, Platform } from 'react-native';

import App from './src/Game'
//import hyExt from '@hyext/hyext-rn-sdk'
import hyExt from '@hyext/ext-sdk-hy'

if (NativeModules.HyGameViewModule) {
  NativeModules.HyGameViewModule.initModel();
}

if (window) {
	// console.error("inject hyExt 1");
	window.hyExt = hyExt;
}

global.hyExt = hyExt
global.__os = Platform.OS
global.__HYEXT_TYPE = 'zs_anchor_panel'
global.__HYEXT_PLATFORM = 'app'
global.__HYEXT_DESIGN_WIDTH = ''

AppRegistry.registerComponent('App', () => App);
