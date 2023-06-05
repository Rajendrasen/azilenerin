import { StyleSheet } from 'react-native';
// import SearchBarStyle from 'antd-mobile-rn/lib/search-bar/style/index.native';
import { COLORS } from '../../_shared/styles/colors';

export const SearchBarOverrides = StyleSheet.create({
  // ...SearchBarStyle,
  cancelTextContainer: {
    // ...SearchBarStyle.cancelTextContainer,
    display: 'none',
  },
  wrapper: {
    // ...SearchBarStyle.wrapper,
    marginHorizontal: 0,
    width: '100%',
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: COLORS.sceneBackground,
  },
  inputWrapper: {
    // ...SearchBarStyle.inputWrapper,
    marginLeft: '5%',
    marginRight: '5%',
  },
  search: {
    // ...SearchBarStyle.search,
    left: '7%',
  },
  container: {
    alignItems: 'center',
  },
  noReferralsText: {
    color: COLORS.darkGray,
    fontWeight: '600',
    fontSize: 16,
  },
});

export const styles = StyleSheet.create({
  // ListStyle: { marginBottom: 50, width: '100%', backgroundColor: COLORS.sceneBackground },
});
