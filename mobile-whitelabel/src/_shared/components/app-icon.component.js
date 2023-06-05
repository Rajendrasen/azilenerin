import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ICONS } from '../assets/icons';

const AppIcon = props => {
  return (
    <Svg viewBox="-15 0 1030 1030" width={`${props.size}`} height={`${props.size}`}>
      <Path
        d={ICONS[props.name]}
        fill={props.fill || 'none'}
        stroke={props.color}
        strokeWidth={props.strokeWidth}
      />
    </Svg>
  );
};

AppIcon.defaultProps = {
  size: 16,
  color: 'black',
  strokeWidth: 30,
};

export default AppIcon;
