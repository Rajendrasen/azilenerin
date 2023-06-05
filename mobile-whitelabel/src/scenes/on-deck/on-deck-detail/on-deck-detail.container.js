import { connect } from 'react-redux';
import ReferralDetailsComponent from './on-deck-detail.component';
import { withContactDetails } from '../../../_store/_shared/api/components/contacts/with-contact-details.provider';
import { compose } from '../../../_shared/services/utils';

const mapStateToProps = (state, props) => {
  const { currentUser } = state.user;
  return {
    currentUser,
  };
};

export const ReferralDetails = connect(mapStateToProps)(
  compose(withContactDetails)(ReferralDetailsComponent)
);
