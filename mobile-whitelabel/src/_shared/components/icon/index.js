import React from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './selection.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello', 'fontello.ttf');
const comp = props => (
  <Icon name={props.name} size={props.size || 20} color={props.color || 'black'} {...props} />
);
export default comp;
