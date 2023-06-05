import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../_shared/styles/colors';

export default StyleSheet.create({
  container: {
    height: 135,
  },
  title: {
    letterSpacing: 1,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobtitle: {
    color: COLORS.blue,
    letterSpacing: 1,


  },
  department: {
    flexDirection: 'row',
    marginRight: 10,
    marginTop: 5,
    color: COLORS.darkGray,
  },
  deptext: {
    fontSize: 13,
    marginLeft: 3,
  },
  network: {
    color: COLORS.blue,
    fontSize: 11,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  match: {
    color: COLORS.lightGray,
    fontSize: 11,
    marginLeft: 2,
    textAlign: 'center',
  },
  noReferralsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReferralsText: {
    color: COLORS.lightGray,
    fontSize: 13,
    marginLeft: 2,
    textAlign: 'center',
  },
  location: {
    width: 15,
    height: 15,
    tintColor: COLORS.lightGray,
  },
  tick: {
    width: 15,
    height: 15,
    tintColor: COLORS.green,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  amount: {
    alignItems: 'center',
    marginBottom: 15,
  },
  total: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.green,
  },
  referral: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
