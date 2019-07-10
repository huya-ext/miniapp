/**
 * @author Kekobin
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native'

import pxUtil from '../tools/px2dp'
const px2dp = pxUtil.px2dp

const List = ({data}) => {
    return (
      <View style={styles.tableList}>
        {
            data && data.length === 0 &&
            <View style={styles.blank}>
                <Image
                    style={styles.blankImg} 
                    source={require('../assets/img/blank.png')}
                    resizeMode='cover'
                >
                </Image>
                <Text style={styles.blankTxt}>暂无人上榜~</Text>
            </View>
        }

        {
           data && data.map((item,index)=>{
                const nick = item.nick.length > 10 ? (item.nick.slice(0,10) + '...') : item.nick
                let rank;

                if(index === 0) {
                    rank = require('../assets/img/rank1.png')
                } else if(index === 1) {
                    rank = require('../assets/img/rank2.png')
                } else if(index === 2) {
                    rank = require('../assets/img/rank3.png')
                } else {
                    rank = index + 1;
                }

                return (
                    <View style={styles.listLi} key={index}>
                        <View style={styles.itemRank}>
                            {
                                index < 3 ? 
                                <Image
                                    style={styles.itemRankInner} 
                                    source={rank}
                                    resizeMode='cover'
                                >
                                </Image>
                                :
                                <Text style={styles.itemRankInner}>{rank}</Text>
                            }
                        </View>
                        <View style={styles.itemInfo}>
                            <Image
                                style={styles.itemLogo} 
                                source={item.logo ? {uri: item.logo} : require('../assets/img/default.png')}
                                resizeMode='cover'
                            >
                            </Image>
                            <Text style={styles.itemNick}>{nick}</Text>
                        </View>
                        <View style={styles.itemCnt}>
                            <Text style={styles.itemCntTxt}>{item.voteCnt}</Text>
                            <Text style={styles.itemCntTxtUnit}>次</Text>
                        </View>
                    </View>
                )
            })
        }
      </View>
    )
}

const styles = StyleSheet.create({
    listLi:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:px2dp(40),
    },  
    blank:{
        marginTop:px2dp(100),
        paddingBottom:px2dp(100),
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
    itemRank:{
        width:px2dp(110),
        justifyContent:'center',
        alignItems:'center',
        marginRight:px2dp(20)
    },
    itemRankInner:{
        width:px2dp(40),
        height:px2dp(54),
        justifyContent:'center',
        alignItems:'center',
        color:'#8D8D8D',
        fontSize:px2dp(34)
    },
    itemCnt:{
        paddingRight:px2dp(30),
        flexDirection:'row',
        width:px2dp(200),
        justifyContent:'flex-end',
        alignItems:'center',
        textAlignVertical:'center'
    },
    itemInfo:{
        position:'relative',
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    itemLogo:{
        width:px2dp(100),
        height:px2dp(100),
        borderRadius:px2dp(50),
        marginRight:px2dp(20)
    },
    itemNick:{
        color:'#222',
        fontSize:px2dp(30)
    },
    itemCntTxt:{
        color:'#222',
        fontWeight:'bold',
        fontSize:px2dp(50),
        paddingRight:px2dp(10)
    },
    itemCntTxtUnit:{
        color:'#2A2A2A',
        fontSize:px2dp(30)
    }
})

export default List;