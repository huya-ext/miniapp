import React, { Component } from 'react';
import { Image,} from 'react-native';


export default class FrameAnimation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSource: 1,
        }
        console.log("frame images count:", this.props.images.length)
    }

    render() {
        let index = this.state.imageSource - 1
        //console.log("frame images index:", index)
        let img = this.props.images[index];
        return (
            <Image style={{ height: 80, width: 80 }} source={img} />
        );
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            let frame = this.state.imageSource;

            frame++;

            if (frame > this.props.images.length) {
                frame = 1;
            }

            this.setState({imageSource:frame});
        }, 1000 / 10);
    }

    componentWillUnmount() {
        console.log("frame image componentWillUnmount")
        clearInterval( this.timer )
    }
}