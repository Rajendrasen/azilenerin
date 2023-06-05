import { connect } from 'react-redux';
import EmployeeDetailsComponent from './employee-detail.component';
import { withUserDetails } from '../../../_store/_shared/api/components/users/with-user-details.provider';
import { compose } from '../../../_shared/services/utils';

const mapStateToProps = (state, props) => {
  const { currentUser } = state.user;
  return {
    currentUser,
  };
};

export const EmployeeDetails = connect(mapStateToProps)(
  compose(withUserDetails)(EmployeeDetailsComponent)
);
