import {connect} from 'react-redux';
import LoginComponent from './login.component';
import {userActions} from '../../../_store/actions';
import {withGetUserInvite} from '../../../_store/_shared/api/components/users/new-user-landing-page.provider';
import {withCreateDepartment} from '../../../_store/_shared/api/components/departments/with-create-department.provider';
import {compose} from '../../../_shared/services/utils';

const mapStateToProps = (state) => {
  const {currentUser} = state.user;
  return {
    currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser(user) {
      dispatch(userActions.createSetCurrentUserAction(user));
    },
  };
};

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps,
)(compose(withGetUserInvite, withCreateDepartment)(LoginComponent));
