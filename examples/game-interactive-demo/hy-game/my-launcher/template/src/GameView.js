import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { findNodeHandle, requireNativeComponent, View } from 'react-native'

const HYGameView = requireNativeComponent("HYGameView",{
  propTypes: {
    src: PropTypes.string,
    ...View.propTypes // 包含默认的View的属性
  },
});

export default class HYGame extends Component {

	static propTypes = {
		src: PropTypes.string, // 这里传过来的是string
		...View.propTypes // 包含默认的View的属性
	}

	_ref(ref){
		if(!ref) {
			return;
		}
	}

  render() {
    const { style, src } = this.props;

    return (
      <HYGameView
        style={style}
		ref={this._ref.bind(this)}
        src={src}
      />
    );
  }
}