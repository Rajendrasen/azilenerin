import { connect } from 'react-redux';
import ManageEmployeesComponent from './manageEmployees.component';
import { withListJobs } from '../../_store/_shared/api/components/jobs/with-list-jobs.provider';
import { compose } from '../../_shared/services/utils';
import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import { withListUserGroups } from '../../_store/_shared/api/components/users/with-list-userGroups.provider';
import { userActions } from '../../_store/actions';
import { withCreateReferral } from '../../_store/_shared/api/components/contacts/create-referral.provider';

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser(user) {
      dispatch(userActions.createSetCurrentUserAction(user));
    },
  };
};

const ManageEmployeesContainer = compose(
  withListDepartment,
  withListUserGroups
)(ManageEmployeesComponent);

export const ManageEmployees = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageEmployeesContainer);
