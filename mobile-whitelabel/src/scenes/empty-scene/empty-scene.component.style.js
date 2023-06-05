import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../_shared/styles/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    padding: 20,
    paddingTop: height / 8,
  },
  image: {
    height: width / 2,
    width: width / 2,
    marginBottom: 30,
  },
  text: {
    color: COLORS.lightGray,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  link: {
    color: COLORS.dashboardBlue,
  },
});
