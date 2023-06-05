import {StyleSheet} from 'react-native';
import {getPrimaryColor} from '../../WhiteLabelConfig';

export const COLORS = {
  heading: '#444444',
  subHeading: '#8d99a3',
  hyperLink: '#018dd3',
  white: '#ffffff',
  black: '#000000',
  red: '#ef3c3f',
  blue: '#018dd3',
  lightBlue: '#e4f7fe',
  darkBlue: '#242e3f',
  green: '#1d861d',
  lightGreen: '#bdf9bd',
  darkGray: '#404447',
  lightGray: '#8d99a3',
  lightGray2: '#f7f8f9',
  lightGray3: '#cfcfcf',
  dashboardGreen: '#19bb4b',
  dashboardBlue: '#62a7ff',
  dashboardDarkOrange: '#8e4b01',
  dashboardLightOrange: '#ffb461',
  transparent: 'transparent',
  borderColor: '#999999',
  sceneBackground: '#EFEFF2',
  blackTransparent: 'rgba(0,0,0,.4)',
  whiteTransparent: 'rgba(255, 255, 255, 0.77)',
  grayMedium: 'rgba(89,89,89,1)',
  sidebarGray: '#262e3e',
  buttonGrayOutline: '#8d99a3',
  buttonGrayText: '#404447',
  primary: getPrimaryColor(),
};

export const globalStyle = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#e8e8e8',
    borderWidth: 0,
  },
  disabledButtonText: {
    color: '#b0b0b0',
  },
});
