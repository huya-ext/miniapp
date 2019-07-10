/**
 * @author Kekobin
 */
'use strict';

import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import bus from '../util/bus';
import Timer from './Timer';
import pxUtil from '../util/px2dp';
const px2dp = pxUtil.px2dp;

export default class StartPanel extends Component {
  constructor(initialProps) {
      super();
      this.state = {
        showPlus:[false,false,false] //设置一个显示+1的状态数组
      }

      this.handleClick = this.handleClick.bind(this)
  }

  handleClick (item, index) {
    const {gameLaunch, countdownEnd, localCountdownEnd} = this.props

    if(!gameLaunch || !localCountdownEnd || countdownEnd) return;
    
    let timeout = null, {showPlus} = this.state
    bus.emit('choose', item);

    showPlus = showPlus.map((item,i) => {
      return i === index;
    });

    this.setState({
      showPlus: showPlus
    })

    //显示1秒后隐藏
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      this.setState({
        showPlus: [false,false,false]
      })
    }, 1000)
  }

  render() {
    const {list, raceTime, choose,gameLaunch, localCountdownEnd, countdownEnd} = this.props, {showPlus} = this.state
    return (
      <View style={styles.startPanel}>
        <ImageBackground 
          style={styles.countDown} 
          source={require('../assets/img/vote-bg.png')}
          resizeMode='cover'
        >
          { gameLaunch && !localCountdownEnd && <Text style={styles.countDownTxt2}>即将开始:</Text>}
          { gameLaunch && !localCountdownEnd && <Text style={styles.countDownTxt1}><Timer value={3} emitTopic="local-push-start"/></Text>}
          { gameLaunch && localCountdownEnd && !countdownEnd && <Text style={styles.countDownTxt1}><Timer value={raceTime} emitTopic="countdown"/></Text>}
          { gameLaunch && localCountdownEnd && !countdownEnd && <Text style={styles.countDownTxt2}>结束倒计时</Text>}
          { !gameLaunch && <Text style={styles.countDownTxt3}>马上开始，请稍作等候</Text>}
          { countdownEnd && <Text style={styles.countDownTxt3}>结果统计中，请稍后！</Text> }
        </ImageBackground>
        <View style={styles.listUl}>
          {
            list && list.options && list.options.map((item, index) => {
              const name = item.optionName.length > 4 ? (item.optionName.slice(0,4) + '...') : item.optionName
              return (
                <View style={styles.listLi} key={item.optionId}>
                  <Text style={styles.liTxt}>{name}</Text>
                  <Image
                    style={styles.liImg} 
                    source={ item.optionLogo ? {uri:item.optionLogo} : require('../assets/img/default.png')}
                    resizeMode='cover'
                  ></Image>
                  {
                    showPlus[index] &&
                    <Image
                      style={styles.liPlus} 
                      source={require('../assets/img/plus.png')}
                      resizeMode='cover'
                    ></Image>
                  }
                  
                  <TouchableHighlight 
                    onPress={()=>this.handleClick(item,index)}
                    // onPress={()=>bus.emit('choose',{item,index})}
                    activeOpacity={0.6}
                    underlayColor="transparent"
                  >
                    <View style={[styles.liBtnWrap, (!localCountdownEnd || countdownEnd) ? styles.liBtnWrapD : styles.liBtnWrapN ]}>
                      <Text style={styles.liBtn}>点击投票</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              )
            })
          }
        </View>
        <View style={styles.moreInfo}>
          <Text style={styles.moreInfoTxt}>点击投票，替主播做出选择吧！</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  countDown:{
    paddingTop:px2dp(90),
    width:px2dp(750),
    height:px2dp(510),
    flexDirection:'column',
    alignItems:'center',
    // justifyContent:'center'
  },
  countDownTxt1:{
    marginBottom:px2dp(20)
  },
  countDownTxt2:{
    color:'#fff',
    fontSize:px2dp(30)
  },
  countDownTxt3:{
    marginTop:px2dp(100),
    color:'#fff',
    fontSize:px2dp(40)
  },
  listUl:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:px2dp(-120)
  },
  listLi:{
    position:'relative',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:px2dp(220),
    height:px2dp(354),
    borderRadius:px2dp(16),
    backgroundColor:'#fff'
  },
  liImg:{
    width:px2dp(134),
    height:px2dp(134),
    borderRadius:px2dp(67.5),
    marginTop:px2dp(24),
    marginBottom:px2dp(24),
  },
  liTxt:{
    color:'#222',
    fontSize:px2dp(30)
  },
  liBtnWrap:{
    width:px2dp(175),
    height:px2dp(68),
    // backgroundColor:'#FFA200',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:px2dp(68)
  },
  liBtnWrapN:{
    backgroundColor:'#FFA200',
  },
  liBtnWrapD:{
    backgroundColor:'#d3d3d3',
  },
  liBtn:{
    color:'#fff',
    fontSize:px2dp(28)
  },
  moreInfo:{
    height:px2dp(140),
    alignItems:'center',
    justifyContent:'center',
  },
  moreInfoTxt:{
    color:'#999',
    fontSize:px2dp(30)
  },
  liPlus:{
    position:'absolute',
    left:'50%',
    top:px2dp(137),
    marginLeft:px2dp(-34),
    width:px2dp(68),
    height:px2dp(47),
  }
})





