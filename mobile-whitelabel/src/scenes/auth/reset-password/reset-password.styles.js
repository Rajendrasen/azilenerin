import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../_shared/styles/colors';
// import ListStyle from 'antd-mobile-rn/lib/list/style/index.native';

const { width } = Dimensions.get('window');

export const ListStyleOverrides = StyleSheet.create({
  // ...ListStyle,
  Body: {
    // ...ListStyle.Body,
    borderTopWidth: 0,
  },
  BodyBottomLine: {
    // ...ListStyle.BodyBottomLine,
    height: 0,
    borderBottomWidth: 0,
  },
  Line: {
    // ...ListStyle.Line,
    borderBottomWidth: 0,
  },
});

export default StyleSheet.create({
  ItemStyle: {
    width: '100%',
  },

  SubmitBtn: {
    backgroundColor: COLORS.red,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
  },

  SubmitBtnText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '300',
    flex: 1,
  },

  SubmitBtnContainer: {
    width: '100%',
    marginTop: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },

  SubmitBtnActive: {
    backgroundColor: COLORS.red,
    opacity: 0.5,
  },

  BtnContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 0,
  },

  CheckIcon: {
    borderColor: COLORS.white,
    borderWidth: 1,
    padding: 2,
  },

  LabelStyles: {
    fontSize: 16,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  InputStyleContainer: {
    fontSize: 16,
  },

  InputStyle: {
    borderColor: COLORS.lightGray,
    borderBottomColor: COLORS.lightGray,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 4,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
  },

  FormStyles: {
    padding: 20,
    backgroundColor: COLORS.white,
    width,
    height: '100%',
  },
});
