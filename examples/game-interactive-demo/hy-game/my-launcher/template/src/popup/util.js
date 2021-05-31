import {
    Dimensions
} from 'react-native';

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;
const uiWidthPx = 1920;
const uiHeightPx = 1080;
const minWidthPx = 240;
const minHeightx = 200;

export const pxToDp = uiElementPx => uiElementPx * Dimensions.get('window').width / uiWidthPx;

const conf = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    visible: true,
    animate: false,
    duration: 0,
    alpha: 1
};

const miniStateConf = {
    x: window.layout_x,
    y: window.layout_y,
    width: window.layout_width,
    height: window.layout_height,
    visible: true,
    animate: false,
    duration: 0,
    alpha: 1
};

const minConf = {
    x: 0,
    y: (1 - minHeightx / uiHeightPx) * 0.2,
    width: minWidthPx / uiWidthPx,
    height: minHeightx / uiHeightPx,
    visible: true,
    animate: false,
    duration: 0,
    alpha: 1
};

export const setLayout = isShowModal => {
    hyExt.panel
        .setLayout(isShowModal ? (window.isMiniState==true ? miniStateConf : conf) : minConf)
        .then(() => {
            hyExt.logger.info('setLayout 成功');
        })
        .catch((err) => {
            hyExt.logger.info('setLayout 失败', err);
        });
}

export const getExtInfo = () =>
    new Promise((resolve, reject) => {
        hyExt.env
            .getExtInfo()
            .then((extInfo) => {
                hyExt.logger.info('获取当前小程序信息成功，返回：' + JSON.stringify(extInfo));
                resolve(extInfo);
            })
            .catch((err) => {
                hyExt.logger.info('获取当前小程序信息失败，错误信息：' + err.message)
                reject(err.message);
            });
    });