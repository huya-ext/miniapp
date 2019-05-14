import React, { Component } from 'react'
import { Text, View,TouchableWithoutFeedback,Image } from 'react-native'

export default class TestItemBase extends Component {
  constructor(props) {
      super(props);
      this._unfold = props.unfold;
      this._unfoldCallBack = props.unfoldCallBack;
      this._headerViewPress = this.headerViewPress.bind(this);
      this._showText = props.showText;
  }
  
  componentWillReceiveProps(newProps) {
      this.props = newProps;
      this._unfold = newProps.unfold;
  }

  headerViewPress() {
      this._unfoldCallBack(!this._unfold);
  }

  showText(text) {
      this._showText(text);
  }

  headerView() {
      return (
      <TouchableWithoutFeedback
      onPress={this._headerViewPress}
      >
         <View style = {{height:40,alignItems:'center',flexDirection: 'row'}}>
             <Text style={{left:15}}>{this._title}</Text>
             <View style={{width:18}} />
             {!this._unfold&&<Image style = {{width:9,height:9}} source={require('../assets/right_arrow.png')} />}
         </View>
      </TouchableWithoutFeedback>);
  }

  contentView() {

  }

  contentViewHeight() {

  }

  viewHeight() {
      if(this._unfold) {
        return 40 + this.contentViewHeight();
      } else {
          return 40;
      }
  }

  render() {
    return (
      <View style = {{height:this.viewHeight()}}>
        {this.headerView()}
        {this._unfold&&this.contentView()}
      </View>
    )
  }
}
