import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../_shared/styles/colors';

export default StyleSheet.create({
  container: {
    height: 240,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    alignItems: 'center',
  },
  referral: {
    marginTop: 10,
    color: COLORS.lightGray,
    fontSize: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonview: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: COLORS.dashboardBlue,
    padding: 10,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
    paddingTop: 5,
  },
  contact: {
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.lightGray,
    marginTop: 10,
  },
  contactlink: {
    color: COLORS.dashboardBlue,
  },
  image: {
    width: 70,
    height: 70,
  },
});
