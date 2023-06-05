import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../_shared/styles/colors';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  MyProfileContainer: {
    width,
    height,
    backgroundColor: COLORS.lightGray2,
    marginBottom: 0,
  },
  CardStyles: {
    borderRadius: 2,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  ProfileCardStyles: {
    flex: 1,
  },
  EmployeeName: {
    fontSize: 28,
  },
  EmployeeEmail: {
    fontSize: 16,
    fontWeight: '600',
  },
  Heading: {
    fontWeight: '600',
    color: COLORS.heading,
    padding: 0,
  },
  SubHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.lightGray,
  },
  LinkStyles: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: '600',
  },
  FlexContainer: {
    marginBottom: 10,
    marginRight: 20,
  },
  FlexContainer2: {
    flexDirection: 'row',
    width: '100%',
  },
  AvatarStyles: {
    height: 100,
    width: 100,
    marginRight: 20,
  },
  NoPicture: {
    height: 100,
    width: 100,
    backgroundColor: COLORS.lightGray3,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.borderColor,
    borderWidth: 0.5,
  },
  NoPictureText: {
    fontSize: 38,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  IconStyles: {
    color: COLORS.blue,
  },
  ResendInvite: {
    fontWeight: '600',
  },
  EditProfileContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  EditProfile: {
    fontSize: 14,
  },
  BtnStyles: {
    backgroundColor: COLORS.lightGray2,
    width: 110,
  },
  BtnTextStyles: {
    fontSize: 14,
  },
  StatusContainerStyles: {
    backgroundColor: COLORS.dashboardGreen,
  },
  StatusTextStyles: {
    color: COLORS.white,
  },
  ConnectedAppLogo: {
    width: 50,
    height: 50,
  },
  ConnectedAppName: {
    fontWeight: '500',
  },
  ConnectedAppListItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  ConnectedAppNameContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  ConnectedAppListContainer: {
    flex: 1,
    marginBottom: 40,
  },
  JobInfoContainer: {
    marginBottom: 20,
  },
  JobItemText: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.lightGray,
    marginBottom: 0,
    marginTop: 2,
  },
  JobItemValue: {
    fontWeight: '300',
    color: COLORS.black,
  },
  Flex: {
    flex: 1,
  },
});
