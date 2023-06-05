import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

export default StyleSheet.create({
  container: {
    margin: 20,
    paddingTop: '10%',
    height: 200,
  },
  close: {
    textAlign: 'right',
    fontSize: 20,
    color: COLORS.lightGray,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 7,
    paddingBottom: 7,
  },
  buttontext: {
    fontSize: 11,
    color: COLORS.white,
    marginLeft: 5,
  },
});
