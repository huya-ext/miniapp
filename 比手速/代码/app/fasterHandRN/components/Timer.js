/**
 * @author Kekobin
 */
'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import helper from '../util/helper'
import bus from '../util/bus'
import pxUtil from '../util/px2dp'
const px2dp = pxUtil.px2dp

class Timer extends Component {
  constructor() {
      super();
      this.state={
          timer:-1
      }
  }

  shouldComponentUpdate(nextProps){
      if(this.props.value !== nextProps.value) {
          this.startTimer(nextProps.value)
          return false
      }
      return true;
  }

  componentDidMount () {
      this.startTimer(this.props.value)
  }

  componentWillUnmount(){
      clearInterval(this.timer);
  }

  startTimer(value){
      clearInterval(this.timer);

      this.timer = setInterval(()=>{
          if(this.state.timer===0){
              const {emitTopic} = this.props
              clearInterval(this.timer);
              this.setInterval(-1);
              bus.emit(emitTopic)
          }else{
             this.setInterval(--this.state.timer);
          }

      },1000)

      this.setInterval(value);
  }

  setInterval(timer){
      this.setState({timer});
  }

  render() {
    const {emitTopic} = this.props, {timer} = this.state 

    return (
        emitTopic == 'local-push-start' ? <Text style={styles.txt}>{timer < 0 ? 0 : timer}</Text> :
        <Text style={styles.txt}>{timer < 0 ? '00:00' : helper.formatTime(timer)}</Text>
    )
  }
}
const styles = StyleSheet.create({
    txt:{
      color:'#fff',
      fontSize:px2dp(120),
      fontWeight:'bold'
    }
  })

export default Timer
