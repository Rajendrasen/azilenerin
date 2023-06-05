import { connect } from 'react-redux';
import NotificationsComponent from './notifications.component';
import { withGetUserNotifications } from '../../_store/_shared/api/components/users/with-get-user-notifications.provider';
import { compose } from '../../_shared/services/utils';

const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser,
    id: currentUser.id,
  };
};

export const NotificationsWithApi = compose(withGetUserNotifications)(NotificationsComponent);
export const Notifications = connect(mapStateToProps)(NotificationsWithApi);
