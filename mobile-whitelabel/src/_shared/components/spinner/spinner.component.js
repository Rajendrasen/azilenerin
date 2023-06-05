import React, {Component} from 'react';
import {Animated, Easing} from 'react-native';
import {connect} from 'react-redux';
import {getErinSquare} from '../../../WhiteLabelConfig';
import {downloadFromS3} from '../../../common';

class Spinner extends Component {
  state = {
    spinAnim: new Animated.Value(0),
  };
  componentDidMount() {
    this.spin();
  }
  spin = () => {
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.back(),
        useNativeDriver: true,
      }),
    ).start(() => this.spin());
  };
  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let {
      currentUser: {
        company: {enableGeneralReferrals, symbol, theme},
      },
    } = this.props;
    theme = theme ? JSON.parse(theme) : {};
    return (
      <Animated.Image
        style={{height: 60, width: 60, transform: [{rotate: spin}]}}
        source={
          theme.enabled && symbol && symbol.key
            ? {
                uri: downloadFromS3(symbol.key),
              }
            : getErinSquare()
        }
      />
    );
  }
}

const mapDispatchToProps = (state) => {
  let {currentUser} = state.user;
  return {currentUser: currentUser};
};

export default connect(mapDispatchToProps)(Spinner);
