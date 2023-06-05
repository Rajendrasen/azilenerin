import React from 'react';
import styles from './bordered-tile.component.style';
import { View } from 'react-native';

export function borderedTile(WrappedComponent) {
  return class BorderedTile extends React.Component {
    render() {
      return (
        <View elevation={0} style={styles.tile}>
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
}
