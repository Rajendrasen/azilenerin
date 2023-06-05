import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../_shared/styles/colors';

export default StyleSheet.create({
  container: {
    height: 285,
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
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.green,
  },
  referral: {
    marginTop: 10,
    color: COLORS.lightGray,
    fontSize: 11,
  },
  bold: {
    fontWeight: 'bold',
  },
  bonus: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: COLORS.lightGreen,
    width: '100%',
    padding: 5,
    borderRadius: 3,
  },
  buttonview: {
    flexDirection: 'row',
    marginTop: 5,
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
