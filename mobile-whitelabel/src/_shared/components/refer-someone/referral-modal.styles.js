import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../styles/colors';
//import Dimensions from 'Dimensions';
const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
  ModalTitle: {
    width: '100%',
    textAlign: 'center',
    color: COLORS.red,
    fontSize: 28,
    marginBottom: 0,
    fontWeight: '600',
    marginTop: 25,
  },

  SmallText: {
    fontSize: 14,
    fontWeight: '300',
    width: '100%',
    textAlign: 'center',
    marginVertical: 5,
  },

  AddContactsHere: {
    color: COLORS.lightGray,
    // zfontWeight: '400',
  },

  Row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  RowMarginRight: {
    marginRight: 10,
  },

  JobInfoContainer: {
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: COLORS.lightGreen,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
  },

  JobInfo: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },

  JobTitle: {
    fontSize: 18,
    color: COLORS.blue,
    fontWeight: '600',
    marginBottom: 5,
  },

  Currency: {
    color: COLORS.green,
    fontSize: 20,
    marginBottom: 0,
    textAlign: 'right',
    padding: 0,
    fontWeight: 'bold',
  },

  LocationTextMargin: {
    marginLeft: 5,
  },

  DeptTextMargin: {
    marginLeft: 5,
  },

  JobIcon: {
    fontSize: 20,
    color: COLORS.darkGray,
    paddingRight: 3,
  },

  Flex: {
    flex: 1,
  },

  FullHeight: {
    flex: 1,
    height: '96%',
    width: '94%',
    marginHorizontal: '3%',
    backgroundColor: COLORS.white,
    paddingBottom: 24,
  },
  ReferralBonus: {
    marginBottom: 0,
  },

  addPaddingRight: {
    paddingRight: 15,
  },

  ToggleNewContactBtn: {
    padding: 0,
    fontSize: 11,
    color: COLORS.blue,
    fontWeight: '600',
  },

  SubmitBtn: {
    backgroundColor: COLORS.primary,
    marginBottom: 0,
  },

  SubmitBtnText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '300',
  },

  SubmitBtnContainer: {
    marginHorizontal: '2%',
    width: '96%',
    justifyContent: 'center',
  },

  CheckIcon: {
    borderRadius: 100,
    padding: 2,
  },

  FormTitle: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 0,
    color: COLORS.darkGray,
    fontSize: 24,
  },

  LabelStyles: {
    fontWeight: 'bold',
  },

  TextAreaStyles: {
    marginBottom: 10,
  },

  InputStyles: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    marginVertical: 5,
    padding: 1,
  },

  AutoCompleteStyles: {},

  AutoCompleteListItemStyles: {
    padding: 10,
  },

  AutoCompleteListStyles: {
    flex: 1,
    maxHeight: 100,
  },

  AutoCompleteZIndex: {
    zIndex: 10,
  },

  FormItemStyles: {
    width: '100%',
    backgroundColor: COLORS.white,
    flex:1
  },

  SubmitError: {
    marginBottom: 24,
  },

  LinkContainerStyles: {
    marginVertical: 10,
  },

  LinkStyles: {
    color: COLORS.blue,
  },

  ReferralFormStyle: {
    // marginBottom: 5,
    flex: 1,
    backgroundColor: COLORS.white,
  },

  GifStyle: {
    width: '100%',
  },
  gifContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: COLORS.white,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingLeft: 20,
    paddingRight: 23,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttontext: {
    fontSize: 12,
    color: COLORS.white,
    marginLeft: 5,
  },
  location: {
    width: 15,
    height: 15,
    tintColor: COLORS.lightGray,
  },
});
