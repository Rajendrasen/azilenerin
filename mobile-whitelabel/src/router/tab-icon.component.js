import React from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../_shared/styles/colors';
let {width} = Dimensions.get('window');

export class TabIcon extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={[
            styles.IconStyle,
            {tintColor: this.props.focused ? COLORS.white : COLORS.lightGray},
            this.props.iconStyle,
          ]}
          source={this.props.iconName}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  IconStyle: {
    width: 25,
    height: 25,
  },
  container: {
    paddingTop: width > 450 ? 0 : 10,
    paddingRight: width > 450 ? 10 : 0,
  },
});
