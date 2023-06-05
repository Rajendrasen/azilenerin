import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../styles/colors';
let width = Dimensions.get('window').width;
export default StyleSheet.create({
  tile: {
    width: '98%',
    marginVertical: 8,
    backgroundColor: COLORS.white,
    // shadowColor: COLORS.lightGray,
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 1,
    // },
    padding: 15,
    borderRadius: 10,
  },
});
