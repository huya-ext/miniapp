import React, {
    Component
} from 'react'
import PropTypes from 'prop-types';
import {
    findNodeHandle,
    requireNativeComponent,
    View,
    ActivityIndicator,
    NativeModules,
    StyleSheet,
    Button,
    Text,
    Image
} from 'react-native';
import HYGame from './GameView';
import GameLoadApi from './GameLoadApi';
import PercentageCircle from './PercentageCircle';
import FrameAnimation from './FrameAnimation';
import HYExtMiniGame from './minigame/index';
import {
    hygProps
} from '../hygConfig.js';
//import hyExt from '@hyext/hyext-rn-sdk';
import hyExt from '@hyext/ext-sdk-hy'
import hyRuntimeEngine from './hyRuntime_release';

import images_loading_0 from './images/status_loading_0.png';
import images_loading_1 from './images/status_loading_1.png';
import images_loading_2 from './images/status_loading_2.png';

if (NativeModules.ContainerGesture) {
    if (NativeModules.ContainerGesture.disableContainerGesture) {
        NativeModules.ContainerGesture.disableContainerGesture(true);
        console.log("GNativeModules.ContainerGesture.disableContainerGesture===>true");
    }else {
        console.log("GNativeModules.ContainerGesture.disableContainerGesture===>nil");
    }
}

const Src_LoadState_loading = 1;
const Src_LoadState_fail = 2;
const Src_LoadState_success = 3;

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log("GameView=============== init");

        var _setTimeout = setTimeout;
        var _clearTimeout =clearTimeout;
        var self = this;

        this.gameConfig = {};
		this.gameConfig['extVersionType'] = hygProps['extVersionType'];
		this.gameConfig['hygEngineType'] = hygProps['hygEngineType'];
		this.gameConfig['entry'] = hygProps['entry'];
		this.gameConfig['hygFile'] = hygProps['hygFile'];
		this.gameConfig['hygFileType'] = hygProps['hygFileType'];
        //Object.assign(this.gameConfig, hygProps);
        this.state = {
            loadState: Src_LoadState_loading,
            progress: 0,
            canInit: false
        };


        this.autoClose = null;
        this.hasInit = false;
        if (hyExt && hyExt.onAppear && hyExt.onDisappear) {
            hyExt.onAppear(function() {
                console.log("GameView=============== onAppear");
                if (self.autoClose) {
                    _clearTimeout(self.autoClose);
                    self.autoClose = null;
                }
                if (!self.hasInit) {
                    self.hasInit = true;
                    self.setState({
                        canInit: true
                    });
                }
            });
            hyExt.onDisappear(function(){
                console.log("GameView=============== onDisappear");
                if (self.autoClose) {
                    _clearTimeout(self.autoClose);
                    self.autoClose = null;
                }
                self.autoClose = _setTimeout(function() {
                    //
                    //
                    //
                }, 15000);
            });
        }


        this.reloadSrc();

    }

    reloadSrc() {
        this.setState({
            loadState: Src_LoadState_loading
        });

        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
        }
        
        var self = this;

        if (hygProps.hygFileType !== 3) {
            self.gameConfig.hygFileType = 1;
            this.subscription = HYExtMiniGame.requestDownload({
                onCompleted(data) {
                    console.log("GameView=============== onCompleted", data);
                    var fileLocation = data.fileLocation;
                    self.gameConfig.hygFile = [fileLocation];
                    self.setState({
                        loadState: Src_LoadState_success
                    });
                },
                onFailed(data) {
                    //console.log("GameView=============== onFailed",data);
                    self.setState({
                        loadState: Src_LoadState_fail
                    });     
                },
                onProgress(data) {
                    //console.log("GameView=============== onProgress",data);
                    if (data.progress) {
                        var progressInt = data.progress * 100;
                        if (progressInt < 0) {
                            progressInt = 0;
                        }
                        if (progressInt >= 100) {
                            progressInt = 100;
                        }
                        self.setState({
                            progress: parseInt(progressInt)
                        });
                    }
                }
            });
        } else {
            console.log("GameView=============== debug");
            setTimeout(() => {
                self.setState({
                    loadState: Src_LoadState_success
                })
            }, 100);
        }         
    }

    render() {
        
        if (!this.state.canInit) {
            return (
                <View style={styles.container}>
                    <Text style={styles.textStyle}> 初始化... </Text>
                </View>
            )        
        } else {
            if (this.state.loadState === Src_LoadState_fail) {
                var self = this;
                return (
                    <View style={styles.container}>  
                        <Button title="Reload" color="#ffd433" onPress={() => self.reloadSrc()}/>
                    </View>
                    ) 
            } else if (this.state.loadState === Src_LoadState_success) {
                //游戏已经加载完成
                var gameTempConfig = {};
                Object.assign(gameTempConfig,this.gameConfig,hyRuntimeEngine);
                console.log("runtimeCode===============>",gameTempConfig.codeVersion);
                return ( <
                    HYGame style = {
                        {
                            postion: 'absolute',
                            flex: 1
                        }
                    }
                    src = {
                        JSON.stringify(gameTempConfig)
                    }
                    />
                )
            } else {
                const images = [images_loading_0, images_loading_1, images_loading_2];
                //游戏还在加载中
                return (
                    <View style={styles.container}>
                        <PercentageCircle radius={60} percent={this.state.progress} color={"#FAC832"} borderWidth={3} >
                            <FrameAnimation images={images}></FrameAnimation>
                        </PercentageCircle>
                        <Text style={styles.textStyle}>小程序正在努力加载中 {this.state.progress}% </Text>
                    </View>
                )            
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: '#969696',
        fontSize: 14,
        margin: 10,
    }
});