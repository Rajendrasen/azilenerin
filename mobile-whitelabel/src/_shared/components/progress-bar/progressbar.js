import React from 'react';
import { View } from 'react-native';
import styles from './progressbar.component.style';
import Filler from './filler/filler';

const ProgressBar = props => {
  return (
    <View style={styles.progressbar}>
      <Filler percentage={props.percentage} color={props.color} />
    </View>
  );
};
export default ProgressBar;
