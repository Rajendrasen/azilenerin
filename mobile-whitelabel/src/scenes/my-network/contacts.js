import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import {downloadFromS3} from '../../common';
import {getErinSquare} from '../../WhiteLabelConfig';
import MyContactsComponent from './my-contacts.component';
export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      spinAnim: new Animated.Value(0),
    };
  }
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
      company: {symbol, theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    if (!this.props.contacts) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
        </View>
      );
    }
    return (
      <View style={{flex: 1}}>
        <MyContactsComponent network={this.props} />
      </View>
    );
  }
}
