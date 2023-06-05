import MyProfileComponent from './my-profile.component';
import { connect } from 'react-redux';
import { withUpdateUser } from '../../_store/_shared/api/components/my-profile/with-update-user.provider';
import { compose } from '../../_shared/services/utils';

const mapStateToProps = state => {
  const { currentUser } = state.user;

  return {
    currentUser: currentUser,
  };
};

const MyProfileWithApi = compose(withUpdateUser)(MyProfileComponent);

export const MyProfile = connect(mapStateToProps)(MyProfileWithApi);
