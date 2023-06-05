import {connect} from 'react-redux';
import MyApplicationsComponent from './myApplications.component';
const mapStateToProps = (state) => {
  const {currentUser, currencySymbol, currencyRate} = state.user;
  return {
    currentUser,
    currencyRate,
    currencySymbol,
    companyId: currentUser.companyId,
  };
};

export const MyApplications = connect(mapStateToProps)(MyApplicationsComponent);
