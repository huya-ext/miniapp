import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, Button } from 'react-native';

import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp;


export default class CoutingDownPanel extends Component {
    constructor(initialProps) {
      super();
    }

    componentDidMount() {
       
    }

    render() {
        const {readyCountDownNum, pickCountDownNum, isReadyCountDown} = this.props;


        return(
            <View style={styles.coutingDownPanel}>
                <View style={styles.listUl}>
                    {
                        [1,2,3].map((item,index, arr) => {
                            let source, waitStyle = `liWait${index}`, txtStyle = null;
                            let rank;

                            if(index === 0) {
                                waitStyle = 'liWait1';
                                source = require('../assets/img/w1.png');
                                rank = 2;
                            } else if(index === 1) {
                                waitStyle = 'liWait0';
                                txtStyle = 'txtMid';
                                source = require('../assets/img/w0.png');
                                rank = 1;
                            } else if(index === 2) {
                                source = require('../assets/img/w2.png');
                                rank = 3;
                            }
                       
                            return (
                                <View style={styles.listLi} key={index}>
                                    

                                    <Image
                                        style={[styles.liWait, styles[waitStyle]]} 
                                        source={source}
                                        resizeMode='cover'
                                    >
                                    </Image>
                                    <Text style={[styles.rankText, styles[`rankText${rank}`]]}>{rank}</Text>
                                    <View style={[styles.waitWrap, txtStyle && styles[txtStyle]]}>
                                        <Text style={styles.waitTxt}>虚位以待</Text>
                                    </View>

                                </View>
                            )
                        })
                    }

                </View>

                    {
                        isReadyCountDown ?
                        <View>
                            <Text  style={[styles.tip, styles.ready]}>即将开始 </Text>
                            {
                                readyCountDownNum > 0 &&
                                <Text style={styles.time}>{readyCountDownNum}</Text>
                            }
                        </View>
                        :
                        <View>
                            {
                                pickCountDownNum > 0 &&
                                <Text  style={styles.countDowntime}>00:{pickCountDownNum < 10 ? `0${pickCountDownNum}` : pickCountDownNum}</Text>
                            }
                            {
                                pickCountDownNum > 0 &&
                                <Text style={styles.tip}>倒计时进行中</Text>
                            }

                            {
                                !(pickCountDownNum > 0) &&
                                <Text  style={styles.tip}>结果统计中，请稍后</Text>
                            }

                        </View>
                    }
            </View>
        )
    }
}

const styles = StyleSheet.create({
  coutingDownPanel:{
    flexDirection:'column',
    // alignItems: 'center',
    justifyContent: "center",
    marginTop: px2dp(36)
  },
  listUl:{
    flexDirection:'row',
    // borderWidth: px2dp(4),
    // borderStyle: "solid",
    // borderColor: "#123",
    width: "100%"
  },
  listLi:{
    position:'relative',
    flex:1,
    flexDirection:'column',
    alignItems:'center'
  },
  lists:{
    alignItems:'center'
  },
  listsLi:{
    flexDirection:'column',
    alignItems:'center'
  },
  liWait:{
    width:px2dp(210)
  },
  liWait0:{
    height:px2dp(367)
  },
  liWait1:{
    marginTop:px2dp(30),
    height:px2dp(336)
  },
  liWait2:{
    marginTop:px2dp(30),
    height:px2dp(336)
  },
  liWait00:{
    marginTop:px2dp(100),
    height:px2dp(260)
  },
  liWait11:{
    marginTop:px2dp(129),
    height:px2dp(230)
  },
  liWait22:{
    marginTop:px2dp(129),
    height:px2dp(230)
  },
  waitWrap:{
    position:'absolute',
    top: px2dp(250),
    //width: px2dp(136),
    height: px2dp(48),
  },
  waitWrap1:{
    position:'absolute',
    top:px2dp(220),
    alignItems:'center'
  },
  waitTxt:{
    textAlign:'center',
    color:'#fff',
    fontSize:px2dp(34),
    fontWeight: "bold"
  },
  txtMid:{
    top:px2dp(210)
  },
  txtMid1:{
    top:px2dp(200)
  },
  rankText: {
    position: 'absolute',
    color:'#fff',
    top: px2dp(10),
    fontSize: px2dp(26)
  },
  rankText2: {
    top: px2dp(40)
  },
  rankText3: {
    top: px2dp(40)
  },
  rankText1: {

  },
  tip: {
    textAlign: 'center',
    fontSize: px2dp(30),
    color: '#999999',
    marginTop: px2dp(33)
  },
  ready: {
    fontSize: px2dp(40),
    marginTop: px2dp(70),
    marginBottom: px2dp(10)
  },
  time: {
    fontSize: px2dp(120),
    color: '#101010',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: px2dp(50)
  },
  countDowntime: {
    fontSize: px2dp(120),
    color: '#101010',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: px2dp(20)
  },
  countDown: {
    marginTop: px2dp(300)
  }
})