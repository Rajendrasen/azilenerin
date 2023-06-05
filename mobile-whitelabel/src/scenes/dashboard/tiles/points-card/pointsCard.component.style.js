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
  rank: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  leftcontent: {
    width: '50%',
    height: 73,
    paddingBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightcontent: {
    width: '50%',
    height: 73,
    paddingBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.dashboardLightOrange,
    borderRadius: 10,
  },
  numopen: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  jobs: {
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  numreferrals: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.dashboardDarkOrange,
  },
  recommended: {
    color: COLORS.white,
    textAlign: 'center',
  },
});
