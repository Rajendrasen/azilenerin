import React, {Component} from 'react';
import {View, Image, ActivityIndicator, ImageBackground} from 'react-native';
import { backgroundImage } from '../WhiteLabelConfig';
import {COLORS} from '../_shared/styles/colors';
export default class CustomSplash extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={backgroundImage()}>
          <ActivityIndicator size="small" color={COLORS.blue} />
        </ImageBackground>
      </View>
    );
  }
}
