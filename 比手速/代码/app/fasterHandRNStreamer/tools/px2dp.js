'use strict';

import {
	Dimensions,
	Platform
} from 'react-native'

const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

const portialDeviceWidth  = Math.min(deviceH , deviceW)
const portialDeviceHeight = Math.max(deviceH , deviceW)

const base375Px = 375
const base750Px = 750

export default {
	portialDeviceWidth    : portialDeviceWidth,
	portialDeviceHeight   : portialDeviceHeight,
	landscapeDeviceWidth  : portialDeviceHeight,
	landscapeDeviceHeight : portialDeviceWidth,
	    /**
     * 750像素屏幕像素px转虚拟像素dp
     *
     * @function px2dp
	 * @memberof HYRNUIUtils
     * @param {number} px - 像素大小 
     */
	px2dp: (px) => {
		return Math.ceil(px *  portialDeviceWidth / base750Px);
	},
	 /**
     * 375像素屏幕像素px转虚拟像素dp
     * 
     * @function px2dp_375
	 * @memberof HYRNUIUtils
     * @param {number} px - 像素大小 
     */
	px2dp_375: (px) => {
		if (Platform.OS == "ios" && HYRNDeviceInfo.isIPad) {
			return px;
		} else {
			return Math.ceil(px *  portialDeviceWidth / base375Px);
		}
		
	},
	
	isLandscape: () => {
		if (Platform.OS == "ios") {
			return Dimensions.get('window').width > Dimensions.get('window').height;
		} else {
			return !this.isPortrait;
		}
	},
	 /**
     * 整个屏幕的rect
     * 
     * @function fullScreenRect
     * @return {object} rect - 屏幕的rect{x,y,width,height}
     */
	fullScreenRect: () => {
		return {x:0, y:0, width:Dimensions.get('window').width, height:Dimensions.get('window').height};
	},

	isPortrait: true
}


