import { connect } from 'react-redux';
import Contacts from './contacts';
import { compose } from '../../_shared/services/utils';
import { withMyContacts } from '../../_store/_shared/api/components/contacts/myContacts.provider';
import { withUserByIdEditProfile } from '../../_store/_shared/api/components/edit-profile/with-user-by-id-edit-profile.provider'
const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser,
    id: currentUser.id,
    filter: { userId: { eq: currentUser.id } },
    limit: 1000,
  };
};

export const MyContactsWithApi = compose(withMyContacts, withUserByIdEditProfile)(Contacts);

export const MyContacts = connect(mapStateToProps)(MyContactsWithApi);
