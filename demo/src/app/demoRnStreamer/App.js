import React, { Component } from 'react';
import { Text, View, Image,SectionList,TextInput,PixelRatio,FlatList,Keyboard } from 'react-native';
import hyExt from 'hyliveext-rn-sdk';

import ObserverTestItem from './TestItems/ObserverTestItem'
import BarrageTestItem from './TestItems/BarrageTestItem'
import EbsTestItem from './TestItems/EbsTestItem'
import GiftTestItem from './TestItems/GiftTestItem'
import LiveInfoTestItem from './TestItems/LiveInfoTestItem'
import StorageTestItem from './TestItems/StorageTestItem'
import SubscribeTestItem from './TestItems/SubscribeTestItem'
import ToastTestItem from './TestItems/ToastTestItem'
import UserInfoTestItem from './TestItems/UserInfoTestItem'

export default class liveRnDemoStreamer extends Component {
    constructor(initialProps) {
        super(initialProps);

        this.state = {
            unflod:false,
            count:0,
            showingKeyboard:false
        };
        this._textData = [];
        this._addTestItems();
        hyExt.onLeaveForeground(this._enterBackgroundCallback.bind(this));
        hyExt.onEnterForeground(this._enterForegroundCallback.bind(this));
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            this.setState({
                showingKeyboard: true
            });
        });

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', (event) => {
            this.setState({
                showingKeyboard: false
            });
        });
    }

    componentDidMount() {
    }

    componentWillUnmount(){
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _renderItem({item, index, section}) {
        let fn = item;
        let secIndex = this._testItems.indexOf(section);
        let unfold = !this._unfold?false:index==this._unfoldIndex && secIndex==this._unfoldSection;
        return fn.call(this,index,secIndex,unfold);
    }

    _enterForegroundCallback() {
        hyExt.logger.info('app 进入前台');
        this._showText('app 进入前台');
    }

    _enterBackgroundCallback() {
        hyExt.logger.info('app 进入后台');
        this._showText('app 进入后台');
    }

    _unfoldCallBack(index,section,unfold) {
        this._unfold = unfold;
        this._unfoldIndex = index;
        this._unfoldSection = section;
        this.setState(()=>{
            return {unflod:unfold};
        });
    }

    _showText(text){
        if(this._textData.length > 100) {
            this._textData = [];
        }
        this._textData.push({text:text,index:this.state.count+1});
        this.setState((previousState)=>{
            this._flatlist && this._flatlist.scrollToEnd();
            return {count:previousState.count+1};
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor:'#FFFFFF'}}>
                <SectionList
                    style = {{flex:1}}
                    renderItem={this._renderItem.bind(this)}
                    renderSectionHeader={({section: {title}}) => (
                        <View style = {{flex:1,height:40,backgroundColor:'#d9d9d9',justifyContent:'center'}}>
                            <Text style={{left:15,fontWeight: 'bold'}}>{title}</Text>
                        </View>
                    )}
                    ItemSeparatorComponent = {()=>(
                        <View style = {{left:15,flex:1,height:1/PixelRatio.get(),backgroundColor:'#979797'}}/>
                    )}
                    sections={this._testItems}
                    keyExtractor={(item, index) => item + index}
                />
                {
                    this.state.showingKeyboard?(<View></View>):
                (<View style = {{height:120,borderTopWidth:1/PixelRatio.get(),borderTopColor:'#979797'}}>
                     <FlatList 
                        ref = {(ref)=>{this._flatlist=ref}}
                        style = {{height:120}}
                        renderItem = {({item}) => <Text numberOfLines = {0}
                        >{item.text}</Text>}
                        data = {this._textData}
                        keyExtractor = {(item, index) => item.index}
                />
                </View>)
                }
            </View>
        )
    }

    _addTestItems() {
        this._testItems = [];
        this._unfold = false;
        this._unfoldSection = 0;
        this._unfoldIndex = 0;

        //observer
        let observerItems = {};
        observerItems.title = "observer";
        observerItems.data = []
        observerItems.data.push((index,section,unfold)=>{return (<ObserverTestItem
              unfold={unfold}
              unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
              showText={this._showText.bind(this)}
              />)
            });
        this._testItems.push(observerItems);

        //    ebs
        let ebsItems = {};
        ebsItems.title = "ebs";
        ebsItems.data = []
        ebsItems.data.push((index,section,unfold)=>{return (<EbsTestItem
              unfold={unfold}
              unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
              showText={this._showText.bind(this)}
              />)
            });
        this._testItems.push(ebsItems);

        //context
        let contextItems = {};
        contextItems.title = "context";
        contextItems.data = []
        contextItems.data.push((index,section,unfold)=>{return (<BarrageTestItem
              unfold={unfold}
              unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
              showText={this._showText.bind(this)}
              />)
        });
        contextItems.data.push((index,section,unfold)=>{return (<GiftTestItem
                unfold={unfold}
                unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
                showText={this._showText.bind(this)}
                />)
        });
        contextItems.data.push((index,section,unfold)=>{return (<SubscribeTestItem
            unfold={unfold}
            unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
            showText={this._showText.bind(this)}
            />)
        });
        contextItems.data.push((index,section,unfold)=>{return (<ToastTestItem
            unfold={unfold}
            unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
            showText={this._showText.bind(this)}
            />)
        });
        contextItems.data.push((index,section,unfold)=>{return (<UserInfoTestItem
            unfold={unfold}
            unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
            showText={this._showText.bind(this)}
            />)
        });
        this._testItems.push(contextItems);

        //  ebs
        let storageItems = {};
        storageItems.title = "storage";
        storageItems.data = []
        storageItems.data.push((index,section,unfold)=>{return (<StorageTestItem
              unfold={unfold}
              unfoldCallBack = {this._unfoldCallBack.bind(this,index,section)}
              showText={this._showText.bind(this)}
              />)
            });
        this._testItems.push(storageItems);
    }
}