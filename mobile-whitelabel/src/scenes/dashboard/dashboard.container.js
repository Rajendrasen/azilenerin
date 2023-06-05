import {connect} from 'react-redux';
import DashboardComponent from './dashboard.component';
import {withListDepartment} from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import {withListUsers} from '../../_store/_shared/api/components/dashboard/with-list-users.provider';
import {withDashboardReferrals} from '../../_store/_shared/api/components/dashboard/with-dashboard-referrals.provider';
import {withDashboardJobs} from '../../_store/_shared/api/components/dashboard/with-dashboard-jobs.provider';
import {withBusinessNetwork} from '../../_store/_shared/api/components/dashboard/with-business-network.provider';
import {withListContactsByAtsId} from '../../_store/_shared/api/components/contacts/with-list-contacts-by-ats-id.provider';
import {withTopReferrers} from '../../_store/_shared/api/components/dashboard/with-top-referrers.provider';
import {withQueryBonusByUserId} from '../../_store/_shared/api/components/bonuses/with-query-bonus-by-user-id.provider';
import {withListContacts} from '../../_store/_shared/api/components/dashboard/with-list-contacts.provider';
import {withUserDashboard} from '../../_store/_shared/api/components/dashboard/with-user-dashboard.provider';
import {withDashboardMyJobMatches} from '../../_store/_shared/api/components/dashboard/with-dashboard-jobmatch.provider';
import {userActions} from '../../_store/actions';
import {compose} from '../../_shared/services/utils';
import {withDashboardJobsManager} from '../../_store/_shared/api/components/dashboard/with-dashboard-jobs-managers.provider';

const mapStateToProps = (state) => {
  const {currentUser, currencyRate, currencySymbol} = state.user;
  return {
    currentUser,
    currencyRate,
    currencySymbol,
    companyId: currentUser.companyId,
    filter: {companyId: {eq: currentUser.companyId}},
    limit: 1000,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrencyData(currencyRate, currencySymbol) {
      dispatch(userActions.setCurrencyData(currencyRate, currencySymbol));
    },
    setCurrentUser(user) {
      dispatch(userActions.createSetCurrentUserAction(user));
    },
  };
};

const DashboardContainer = compose(
  withUserDashboard,

  withQueryBonusByUserId,
  withDashboardReferrals,
)(DashboardComponent);

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);
