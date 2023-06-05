import { connect } from 'react-redux';
import { withListReferrals } from '../../_store/_shared/api/components/referrals/with-list-referrals.provider';
import { compose } from '../../_shared/services/utils';
import ReferralsComponent from './referrals.component';
import { referralActions } from '../../_store/actions';
import { withDashboardJobs } from '../../_store/_shared/api/components/dashboard/with-dashboard-jobs.provider';
import { withQueryBonusByUserId } from '../../_store/_shared/api/components/bonuses/with-query-bonus-by-user-id.provider';
import { withDashboardJobsManager } from '../../_store/_shared/api/components/dashboard/with-dashboard-jobs-managers.provider';
// import { withGetTieredBonus } from '../../_store/_shared/api/components/tiered-bonuses';
const mapStateToProps = state => {
  const { currentUser, currencySymbol, currencyRate } = state.user;

  return {
    currentUser,
    currencyRate,
    currencySymbol,
    companyId: currentUser.companyId,
    filter: { userId: { eq: currentUser.id } },
    limit: 50000,
    //   tieredBonusQuery: {
    //     companyId: currentUser.companyId,
    //     id: state.referral.referrals[2].referralBonusAmount || 'skip',
    //   },
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateNotification(updatedNotification, notificationId) {
      dispatch(
        referralActions.createUpdateUserNotificationAction(updatedNotification, notificationId)
      );
    },
    createReferral(newReferral) {
      dispatch(referralActions.createCreateReferralAction(newReferral));
    },
  };
};

export const MyReferralsWithApi = compose(
  //withListReferrals,
  // withGetTieredBonus,
  withDashboardJobs,
  withDashboardJobsManager,
  withQueryBonusByUserId
)(ReferralsComponent);

export const Referrals = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReferralsWithApi);
