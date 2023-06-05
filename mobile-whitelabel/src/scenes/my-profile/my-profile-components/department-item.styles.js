import { StyleSheet } from 'react-native';
import { COLORS } from '../../../_shared/styles/colors';

export const styles = StyleSheet.create({
  departmentContainer: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 4,
    borderColor: COLORS.lightGreen,
    margin: 3,
  },
  closeIcon: {
    fontSize: 12,
    color: COLORS.green,
    marginRight: 5,
  },
  departmentText: {
    color: COLORS.green,
    fontWeight: '400',
    fontSize: 12,
    margin: 5,
  },
  DepartmentsContainer: {
    flexWrap: 'wrap',
    paddingTop: 20,
    paddingRight: 0,
    paddingBottom: 40,
    paddingLeft: 20,
  },
});
