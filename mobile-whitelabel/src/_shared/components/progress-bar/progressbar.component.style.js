import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/colors';

export default StyleSheet.create({
  progressbar: {
    position: 'relative',
    height: 5,
    width: '85%',
    borderRadius: 50,
    borderColor: COLORS.darkgray,
    marginTop: 8,
    marginRight: 5,
    backgroundColor: '#f7f8f9',
  },
});
