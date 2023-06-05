import { connect } from 'react-redux';
import ManageReferralDetailsComponent from './manageReferral-detail.component';
import { withReferralDetails } from '../../../_store/_shared/api/components/referrals/with-referral-details.provider';
import { compose } from '../../../_shared/services/utils';

const mapStateToProps = (state, props) => {
  const { currentUser } = state.user;
  return {
    currentUser,
  };
};

export const ManageReferralDetails = connect(mapStateToProps)(
  compose(withReferralDetails)(ManageReferralDetailsComponent)
);
