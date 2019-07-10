/**
 * @author Kekobin
 */
'use strict';

import React, {Component} from 'react'
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import List from './List'
import pxUtil from '../util/px2dp'
const px2dp = pxUtil.px2dp

export default class EndPanel extends Component {
  constructor(initialProps) {
      super();
      this.state = {
        navActive: 0
      }
  }

  handleNavTab (type) {
    this.setState({
      navActive: type
    })
  }

  render() {
    const {list, chooseList, countdownEnd} = this.props, {options} = list, { navActive} = this.state 
    let countSelf = 0, newOptions = [];
    //计算自己总共点击的次数
    for(let i=0;i<chooseList.length;i++) {
      const item = chooseList[i];
      const key = Object.keys(item)[0]

      if(key) {
        countSelf += parseInt(item[key])
      }
    }

    if(options.length === 3) {
      newOptions.push(options[1])
      newOptions.push(options[0])
      newOptions.push(options[2])
    } else {
      newOptions = options;
    }
    return (
      <View style={styles.endPanel}>
        <View style={styles.listUl}>
          {
            newOptions.map((item,index, arr) => {
              const oname = item.optionName.length > 4 ? (item.optionName.slice(0,4) + '...') : item.optionName
              let source, waitStyle = `liWait${index}${index}`, txtStyle = null, voteCntStyle = `vcnt${index}`, avatarStyle = 'avatarOther',
              crownStyle, crown,rank = index+1;

              if(arr.length >= 3) {
                if(index === 0) {
                  waitStyle = 'liWait11'
                  crownStyle = 'crown1'
                  crown = require('../assets/img/crown1.png')
                  source = require('../assets/img/w11.png')
                  voteCntStyle = 'vcnt1'
                  rank = 2
                } else if(index === 1) {
                  waitStyle = 'liWait00'
                  txtStyle = 'txtMid1'
                  crownStyle = 'crown0'
                  crown = require('../assets/img/crown0.png')
                  source = require('../assets/img/w00.png')
                  voteCntStyle = 'vcnt0'
                  avatarStyle = 'avatar0'
                  rank = 1
                } else if(index === 2) {
                  crownStyle = 'crown2'
                  crown = require('../assets/img/crown2.png')
                  source = require('../assets/img/w22.png')
                }
              } else {
                if(index === 0) {
                  txtStyle = 'txtMid1'
                  avatarStyle = 'avatar0'
                  crownStyle = 'crown0'
                  crown = require('../assets/img/crown0.png')
                  source = require('../assets/img/w00.png')
                } else if(index === 1) {
                  crownStyle = 'crown1'
                  crown = require('../assets/img/crown1.png')
                  source = require('../assets/img/w11.png')
                }
              }

              return (
                <View style={styles.listLi} key={item.optionId}>
                  <Image
                    style={[styles.liWait, styles[waitStyle]]} 
                    source={source}
                    resizeMode='cover'
                  >
                  </Image>
                  <View style={[styles.waitWrap1, txtStyle && styles[txtStyle]]}>
                    <Text style={styles.waitTxt}>{oname}</Text>
                    <View style={[styles.voteCnt, styles[voteCntStyle]]}>
                      <Text style={styles.waitTxt}>{item.voteCnt}次</Text>
                    </View>
                  </View>
                  <Image
                    style={[styles.avatar, styles[avatarStyle]]} 
                    source={item.optionLogo ? {uri:item.optionLogo} : require('../assets/img/default.png')}
                    resizeMode='cover'
                  >
                  </Image>
                  <ImageBackground
                    style={[styles.crownWrap, styles[crownStyle]]} 
                    source={crown}
                    resizeMode='cover'
                  >
                    <Text style={styles.crownTxt}>{rank}</Text>
                  </ImageBackground>
                </View>
              )
            })
          }
          {
            options && options.length === 0 &&
            [1,2,3].map((item,index, arr) => {
              let source, waitStyle = `liWait${index}`, txtStyle = null;

              if(arr.length >= 3) {
                if(index === 0) {
                  waitStyle = 'liWait1'
                  source = require('../assets/img/w1.png')
                } else if(index === 1) {
                  waitStyle = 'liWait0'
                  txtStyle = 'txtMid'
                  source = require('../assets/img/w0.png')
                } else if(index === 2) {
                  source = require('../assets/img/w2.png')
                }
              } else {
                if(index === 0) {
                  txtStyle = 'txtMid'
                  source = require('../assets/img/w0.png')
                } else if(index === 1) {
                  source = require('../assets/img/w1.png')
                }
              }

              return (
                <View style={styles.listLi} key={index}>
                  <Image
                    style={[styles.liWait, styles[waitStyle]]} 
                    source={source}
                    resizeMode='cover'
                  >
                  </Image>
                  <View style={[styles.waitWrap, txtStyle && styles[txtStyle]]}>
                    <Text style={styles.waitTxt}>虚位以待</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
        {
          options && options.length === 0 &&
          <View style={styles.blank}>
            <Image
              style={styles.blankImg} 
              source={require('../assets/img/blank.png')}
              resizeMode='cover'
            >
            </Image>
            <Text style={styles.blankTxt}>稍作等候，马上开始哦~</Text>
          </View>
        }
        {
          countdownEnd && options && options.length > 0 && 
          <View style={styles.speedWrap}>
            <Text style={styles.speed}>您的手速惊人，一共点击了</Text>
            <Text style={styles.speedInner}>{countSelf}</Text>
            <Text style={styles.speed}>次</Text>
          </View>
        }
        {
          options && options.length > 0 && 
          <View style={styles.topTitle}>
            <Text style={styles.topTitleTxt}>TOP5手速榜</Text>
          </View>
        }
        
        <View style={styles.navWrap}>
          {
             options && options.map((item,index) => {
              const name = item.optionName.length > 4 ? item.optionName.slice(0,4) : item.optionName
              return (
                <TouchableWithoutFeedback onPress={()=>this.handleNavTab(index)} key={item.optionId}>
                  <View style={styles.navItemContainer}>
                    <View style={[styles.navItemSelection,navActive === index ? styles.navItemSelectionActive : '']}>
                      <Text style={[styles.navItemTxt,navActive === index ? styles.navActive : '']}>{name}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
             })
          }
        </View>
        {
          options && options.length > 0 && <List data={options[navActive] && options[navActive].userRank || []}/>
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  endPanel:{
    paddingTop:px2dp(40),
    flexDirection:'column',
    alignItems:'center'
  },
  listUl:{
    flexDirection:'row'
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
    top:px2dp(250),
    width:px2dp(136),
    height:px2dp(48),
  },
  waitWrap1:{
    position:'absolute',
    top:px2dp(220),
    alignItems:'center'
  },
  waitTxt:{
    textAlign:'center',
    color:'#fff',
    fontSize:px2dp(34)
  },
  txtMid:{
    top:px2dp(210)
  },
  txtMid1:{
    top:px2dp(200)
  },
  blank:{
    marginTop:px2dp(100),
    flexDirection:'column',
    alignItems:'center'
  },  
  blankImg:{
    marginBottom:px2dp(30),
    width:px2dp(150),
    height:px2dp(156),
  },
  blankTxt:{
    color:'#666',
    fontSize:px2dp(32)
  },
  voteCnt:{
    marginTop:px2dp(15),
    width:px2dp(154),
    height:px2dp(54),
    borderRadius:px2dp(27),
    alignItems:'center',
    justifyContent:'center'
  },
  vcnt0:{
    backgroundColor:'#FF8F00'
  },
  vcnt1:{
    backgroundColor:'#3E8EF9'
  },
  vcnt2:{
    backgroundColor:'#E15E2C'
  },
  avatar:{
    position:'absolute',
    width:px2dp(134),
    height:px2dp(134),
    borderRadius:px2dp(67)
  },
  avatarOther:{
    top:px2dp(60),
  },
  avatar0:{
    top:px2dp(25),
  },
  crownWrap:{
    position:'absolute',
    width:px2dp(60),
    height:px2dp(51),
    alignItems:'center',
  },
  crown0:{
    top:px2dp(-10),
  },
  crown1:{
    top:px2dp(20),
  },
  crown2:{
    top:px2dp(20),
  },
  crownTxt:{
    paddingTop:px2dp(16),
    color:'#fff',
    fontSize:px2dp(26)
  },
  speedWrap:{
    marginTop:px2dp(30),
    height:px2dp(100),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  speed:{
    color:'#222',
    fontSize:px2dp(32)
  },
  speedInner:{
    paddingLeft:px2dp(5),
    paddingRight:px2dp(5),
    color:'#FFA200',
    fontSize:px2dp(50)
  },
  topTitleTxt:{
    marginTop:px2dp(70),
    marginBottom:px2dp(30),
    color:'#666',
    fontSize:px2dp(32)
  },
  navWrap: {
    marginBottom:px2dp(40),
    flexDirection:'row',
    height:px2dp(65),
    borderBottomWidth:1,
    borderBottomColor: '#eee'
  },
  navItemContainer:{
    width:px2dp(140),
    height:px2dp(65),
    marginRight:px2dp(20),
    alignItems:'center',
    justifyContent:'center',
  },
  navItemTxt:{
    textAlignVertical:'center',
    color:'#9A9A9A',
    fontSize: px2dp(30),
  },
  navActive: {
    color:'#222'
  },
  navItemSelection:{
    width:px2dp(140),
    height:px2dp(65),
    alignItems:'center',
    justifyContent:'center',
  },
  navItemSelectionActive:{
    borderBottomColor:'#FFA200',
    borderBottomWidth:px2dp(6)
  }
})

