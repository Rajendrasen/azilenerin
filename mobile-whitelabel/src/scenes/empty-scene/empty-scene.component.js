import React, {Component} from 'react';
import {View, Text, Image, Linking} from 'react-native';
import {getLightGrayLogo} from '../../WhiteLabelConfig';
import {styles} from './empty-scene.component.style';

export default class EmptyScene extends Component {
  handleOpenUrl(url) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          return;
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={getLightGrayLogo()} style={styles.image} />
        {this.props.children}
      </View>
    );
  }
}
