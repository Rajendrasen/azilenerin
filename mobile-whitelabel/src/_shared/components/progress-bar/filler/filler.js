import React from 'react';
import { View, StyleSheet } from 'react-native';

const Filler = props => {
  const percentage = `${props.percentage}%`;
  return (
    <View
      style={[
        {
          backgroundColor: props.color,
          width: percentage,
        },
        styles.filler,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  filler: {
    height: '100%',
    borderRadius: 50,
  },
});
export default Filler;
