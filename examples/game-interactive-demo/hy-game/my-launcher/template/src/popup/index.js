import React, {
    Component
} from 'react'
import {
    findNodeHandle,
    requireNativeComponent,
    View,
    ActivityIndicator,
    NativeModules,
    StyleSheet,
    Button,
    Text,
    TouchableOpacity,
    ImageBackground,
    Alert,
    AsyncStorage
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HYGame from '../GameView';
import HYExtMiniGame from '../minigame';
import hyRuntimeEngine from '../hyRuntime_release';
import { hygProps } from '../../hygConfig.js';
import PercentageCircle from '../PercentageCircle';
import FrameAnimation from '../FrameAnimation';

import { UI } from '@hyext/hy-ui';
import { pxToDp, setLayout, getExtInfo } from './util';
import images_loading_0 from '../images/status_loading_0.png';
import images_loading_1 from '../images/status_loading_1.png';
import images_loading_2 from '../images/status_loading_2.png';
import images_logo from "../images/rukou.png";

// 本地存储
var customStorage = {
    load: function(param){
        hyExt.logger.info("customStorage load");
        return new Promise((res, rej) => {
            try{
                AsyncStorage.getItem(param.key, function(error, result){
                    if (error){
                        rej(error);
                    }
                    else{
                        res(result);
                    }
                })
            }
            catch(error){
                rej(error);
            }  
        });              
    },
    save: function(param){
        hyExt.logger.info("customStorage save");
        return new Promise((res, rej) => {
            try{
                AsyncStorage.setItem(param.key, param.data, function(error){
                    if (error){
                        rej(error);
                    }
                    else{
                        res("save ok");
                    }
                })
            }
            catch(error){
                rej(error);
            }
        })        
    },
    remove: function(param){
        hyExt.logger.info("customStorage remove");
        return new Promise((res, rej) => {
            try{
                AsyncStorage.removeItem(param.key, function(error){
                    if (error){
                        rej(error);
                    }
                    else{
                        res("remove ok");
                    }
                })
            }
            catch(error){
                rej(error);
            }
        })        
    }
}
// 构建版本
import BuildVersion from '../BuildVersion'
if (window){
    window.LAUNCHER_BUILD_VERSION = BuildVersion;
    window.CustomStorage = customStorage;
}
global.LAUNCHER_BUILD_VERSION = BuildVersion;
global.CustomStorage = customStorage;

const { Modal, Image, Progress } = UI

const SRC_PENDING = 1;
const SRC_LOADING = 2;
const SRC_SUCCESS = 3;
const SRC_FAIL = 4;
const RETRY_COUNT = 3;

export default class App extends Component {
    constructor(props) {
        super(props);
        window.isHengping = false;
        window.layout_x = 0.012;
        window.layout_y = 0.605;
        window.layout_width = 0.23;
        window.layout_height = 0.27;

        this.enterGame = false;
        this.subscription = null;
        this.gameConfig = {};
        this.gameConfig['extVersionType'] = hygProps['extVersionType'];
        this.gameConfig['hygEngineType'] = hygProps['hygEngineType'];
        this.gameConfig['entry'] = hygProps['entry'];
        this.gameConfig['hygFile'] = hygProps['hygFile'];
        this.gameConfig['hygFileType'] = hygProps['hygFileType'];
        this.gameConfig['isTransparent'] = true;

        this.state = {
            layout: {},
            isShowModal: false,
            process: 0,
            status: SRC_PENDING,
            logo: null
        };

        // hyExt.logger.info("hygFileType: ", hygProps.hygFileType);

        // setInterval(() => {
        //     if (this.state.process < 100) {
        //         this.setState({ process: this.state.process + Math.ceil(Math.random() * 10) });
        //     }
        // }, 1000);
        this.nFailCount = 0;
        const self = this;
        hyExt.context.onLayoutChange(layout => {
            hyExt.logger.info("onLayoutChange: " + JSON.stringify(layout));
            window.isHengping = layout.isLandscape;
            self.setState({ layout });
            //if(self.enterGame == false || window['__os']=="android")
            //{
                setLayout(true);
            //}
        });
        //this.autoLoadSrc();
    }

    autoLoadSrc(){
        this.setState({ isShowModal: true }, () => {
                setLayout(true);
            });
        this.loadSrc();
    }

    loadSrc() {
        this.setState({
            status: SRC_LOADING
        });

        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }

        const self = this;

        if (hygProps.hygFileType !== 3) {
            self.gameConfig.hygFileType = 1;
            self.subscription = HYExtMiniGame.requestDownload({
                onCompleted(data) {
                    hyExt.logger.info("onCompleted", data);
                    const fileLocation = data.fileLocation;
                    self.gameConfig.hygFile = [fileLocation];
                    self.setState({ status: SRC_SUCCESS });
                    self.enterGame = true;
                },
                onFailed(data) {
                    hyExt.logger.info("onFailed", data);
                    self.setState({ status: SRC_FAIL });
                },
                onProgress(data) {
                    hyExt.logger.info("onProgress", data);
                    if (data.progress) {
                        let progressInt = data.progress * 100;
                        if (progressInt < 0) {
                            progressInt = 0;
                        }
                        if (progressInt >= 100) {
                            progressInt = 100;
                        }
                        self.setState({ process: parseInt(progressInt) });
                    }
                }
            });
        } else {
            hyExt.logger.info("onDebugger", 'debugger');
            self.setState({ process: 100 }, () => setTimeout(() => self.setState({ status: SRC_SUCCESS }), 300));
        }
    }

    render() {
        if (this.state.status === SRC_SUCCESS) {
            const gameTempConfig = Object.assign({}, this.gameConfig, hyRuntimeEngine);
            return (
                <HYGame style={{ width: '100%', height: '100%' }} src={JSON.stringify(gameTempConfig)} bgColor="#000"></HYGame>
            )
        } 
        else if (this.state.status === SRC_PENDING){
            this.autoLoadSrc();
        }
        else if (this.state.status === SRC_FAIL){
            ++this.nFailCount;
            if (this.nFailCount <= RETRY_COUNT){
                this.autoLoadSrc();
            } 
        }
        else{
            // 游戏还在加载中
            // return (
            //     <View style={styles.container}>
            //         <Image style={{ height: 80, width: 80 }} source={images_logo} />
            //         <Text style={styles.textStyle}>连连看正在努力加载中</Text>
            //     </View>
            // )
            const images = [images_loading_0, images_loading_1, images_loading_2];
            //游戏还在加载中
            return (
                <View 
                style={styles.container}>
                    <PercentageCircle radius={42} percent={this.state.process} color={"#FAC832"} borderWidth={3} >
                        <FrameAnimation images={images}></FrameAnimation>
                    </PercentageCircle>
                    <Text style={styles.textStyle}>程序加载中{this.state.process}% </Text>
                </View>
            )
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: '#FFFFFF',
        fontSize: 14,
        margin: 6,
		textShadowOffset:{width:1, height:1},
		textShadowColor:'grey',
		textShadowRadius:1,
    }
});

/*
<View style={styles.container}>
    <PercentageCircle radius={60} percent={this.state.progress} color={"#FAC832"} borderWidth={3} >
        <FrameAnimation images={images}></FrameAnimation>
    </PercentageCircle>
    <Text style={styles.textStyle}>连连看正在努力加载中 {this.state.progress}% </Text>
</View>
*/