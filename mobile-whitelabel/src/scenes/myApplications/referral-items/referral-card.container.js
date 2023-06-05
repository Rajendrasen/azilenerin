import {connect} from 'react-redux';
import get from 'lodash/get';
import ReferralCard from './referral-card';
import {withGetTieredBonus} from '../../../_store/_shared/api/components/tiered-bonuses';
import {withReferralDetails} from '../../../_store/_shared/api/components/referrals/with-referral-details.provider';
import {withCreateBonus} from '../../../_store/_shared/api/components/bonuses/with-create-bonus-provider';
import {withQueryBonusByReferralId} from '../../../_store/_shared/api/components/bonuses/with-query-bonus-by-referral-id.provider';
import {compose} from '../../../_shared/services/utils';

const mapStateToProps = (state, ownProps) => {
  const {currentUser, currencyRate, currencySymbol} = state.user;
  let tieredBonusId = null;
  if (
    ownProps.referral &&
    ownProps.referral.job &&
    ownProps.referral.job.referralBonus
  ) {
    tieredBonusId = JSON.parse(ownProps.referral.job.referralBonus)
      .tieredBonusId;
  }

  // console.log(tieredBonusId);
  return {
    tieredBonusQuery: {
      companyId: currentUser.companyId,
      id: tieredBonusId ? tieredBonusId : 'skip',
      // id: get(ownProps, 'referral.job.referralBonus.tieredBonusId', 'skip'),
    },
    currencySymbol,
    currencyRate,
    currentUser,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  compose(
    withQueryBonusByReferralId,
    withGetTieredBonus,
    withReferralDetails,
    withCreateBonus,
  )(ReferralCard),
);
