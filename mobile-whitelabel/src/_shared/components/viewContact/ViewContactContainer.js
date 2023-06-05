import { connect } from 'react-redux';
import ViewContactComponent from './ViewContact';
import { withContactDetails } from '../../../_store/_shared/api/components/contacts/with-contact-details.provider';
import { withUpdateContact } from '../../../_store/_shared/api/components/contacts/with-update-contact.provider';
//import { withUpdateContact } from 'erin-app-state-mgmt/src/_shared/api/components/contacts/with-update-contact.provider';

import { compose } from '../../../_shared/services/utils';

const mapStateToProps = (state, props) => {
  const { currentUser } = state.user;
  return {
    currentUser,
    filter: { userId: { eq: currentUser.id } },
    limit: 1000,
  };
};

const ContactDetailsWithAPI = compose(
  withContactDetails,
  withUpdateContact
)(ViewContactComponent);

export const ContactDetails = connect(mapStateToProps)(ContactDetailsWithAPI);
