import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../_shared/styles/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  ListStyles: {
    width,
  },
  ListTextContainer: {
    paddingRight: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  ListItemStyles: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    width,
  },
  ListItemStylesBlue: {
    backgroundColor: COLORS.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    width,
  },

  BtnStyles: {
    width: 50,
  },

  CountStyles: {
    borderRadius: 8.5,
    backgroundColor: COLORS.red,
    color: COLORS.white,
    width: 17,
    height: 17,
    textAlign: 'center',
    fontSize: 9,
    paddingTop: 1.5,
    right: 22,
    top: 3,
  },

  NotificationsContainer: {
    display: 'flex',
  },

  RemoveMargins: {
    margin: 0,
  },

  Bold: {
    fontWeight: '600',
    color: COLORS.darkGray,
  },

  NotificationPageContainer: {
    width: '100%',
    height: '100%',
    margin: 30,
    paddingRight: 30,
  },

  ListContainer: {
    borderRadius: 2,
    marginRight: 20,
    backgroundColor: COLORS.white,
    paddingBottom: 20,
  },

  ListAvatar: {
    borderRadius: 0,
  },
  Header: {
    padding: 20,
    paddingBottom: 5,
  },

  NameStyles: {
    fontWeight: '600',
    color: COLORS.heading,
    padding: 0,
    fontSize: 28,
    margin: 0,
    top: -8,
  },

  NotificationCount: {
    margin: 0,
    top: -8,
    fontWeight: '400',
    color: COLORS.lightGray,
  },

  InfoContainer: {
    paddingLeft: 16,
  },

  NoPicture: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.lightGray3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  CompanyAvatar: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLORS.borderColor,
  },

  avatarContainer: {
    borderColor: COLORS.borderColor,
    borderWidth: 0.5,
  },

  FlexContainer: {
    width: '100%',
    alignItems: 'center',
  },

  TimeStyles: {
    color: COLORS.lightGray,
    fontSize: 12,
  },
  Avatar: {
    height: '100%',
    width: '100%',
  },
  AvatarContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RowContainer: {
    flexDirection: 'row',
  },
  ReferrerText: {
    fontWeight: '600',
    color: COLORS.blue,
  },
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 18,
  },
  noNotificationsText: {
    color: COLORS.darkGray,
    fontWeight: '600',
    fontSize: 16,
  },
});
