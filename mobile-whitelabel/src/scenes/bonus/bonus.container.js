import { connect } from 'react-redux';
import { withListReferrals } from '../../_store/_shared/api/components/referrals/with-list-referrals.provider';
import { withBonuses } from '../../_store/_shared/api/components/bonuses/with-list-bonuses.provider';
import { compose } from '../../_shared/services/utils';
import BonusComponent from './bonus.component';
import { referralActions } from '../../_store/actions';
import { withDashboardJobs } from '../../_store/_shared/api/components/dashboard/with-dashboard-jobs.provider';
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

export const BonusWithApi = compose(
  withListReferrals,
  // withGetTieredBonus,
  withDashboardJobs,
  withDashboardJobsManager,
  withBonuses
)(BonusComponent);

export const AllBonuses = connect(
  mapStateToProps,
  mapDispatchToProps
)(BonusWithApi);
