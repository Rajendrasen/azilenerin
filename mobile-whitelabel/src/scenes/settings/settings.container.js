import { connect } from 'react-redux';
import SettingsComponent from './settings.component';
import { compose } from '../../_shared/services/utils';
//import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import { withGetCompany } from '../../_store/_shared/api/components/settings/with-get-company.provider';
import { userActions } from '../../_store/actions';
//import { withCreateReferral } from '../../_store/_shared/api/components/contacts/create-referral.provider';

const mapStateToProps = state => {
  const { currentUser } = state.user;
  return {
    currentUser: state.user.currentUser,
    currencyRate: state.user.currencyRate,
    currencySymbol: state.user.currencySymbol,
    filter: { companyId: { eq: currentUser.companyId } },
    limit: 10000,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser(user) {
      dispatch(userActions.createSetCurrentUserAction(user));
    },
  };
};

// const SettingsContainer = compose(
//   withListDepartment,
//   withCreateReferral
// )(SettingsComponent);
const SettingsContainer = compose(withGetCompany)(SettingsComponent);

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer);
