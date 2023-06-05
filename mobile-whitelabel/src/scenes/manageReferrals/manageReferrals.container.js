import { connect } from 'react-redux';
import ManageReferralsComponent from './manageReferrals.component';
import { withListJobs } from '../../_store/_shared/api/components/jobs/with-list-jobs.provider';
import { compose } from '../../_shared/services/utils';
import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
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

const ManageReferralsContainer = compose(withListDepartment)(ManageReferralsComponent);

export const ManageReferrals = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageReferralsContainer);
