import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../_shared/styles/colors';

export default StyleSheet.create({
  container: {
    height: 100,
  },
  title: {
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    alignItems: 'center',
  },
  total: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  referral: {
    marginTop: 10,
    color: COLORS.lightGray,
  },
});
