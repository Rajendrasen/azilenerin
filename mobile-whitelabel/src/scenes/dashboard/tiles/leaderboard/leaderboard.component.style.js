import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../_shared/styles/colors';

export default StyleSheet.create({
  container: {},
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
    flexDirection: 'row',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 2,
  },

  cell: {
    flex: 1,
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 5,
    alignItems: 'center',
    borderColor: COLORS.buttonGrayOutline,
    backgroundColor: COLORS.white,
  },
  activeCell: {
    backgroundColor: COLORS.buttonGrayOutline,
  },
  cellText: {color: COLORS.buttonGrayOutline, fontWeight: '600'},
  activeCellText: {color: COLORS.white},
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
