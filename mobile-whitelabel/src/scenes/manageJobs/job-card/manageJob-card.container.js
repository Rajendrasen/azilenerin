import {connect} from 'react-redux';
import {get} from 'lodash';
// import JobCardComponent from './jobCard.component';
import {compose} from '../../../_shared/services/utils';
import ManageJobCard from './manageJob-card.component';
import {withGetTieredBonus} from '../../../_store/_shared/api/components/tiered-bonuses';

const mapStateToProps = (state, ownProps) => {
  const {currentUser, currencySymbol, currencyRate} = state.user;
  // debugger
  let tieredBonusId = null;
  if (ownProps.job && ownProps.job.referralBonus) {
    tieredBonusId = JSON.parse(ownProps.job.referralBonus).tieredBonusId;
  } // console.log(tieredBonusId);
  return {
    tieredBonusQuery: {
      companyId: currentUser.companyId,
      id: tieredBonusId ? tieredBonusId : 'skip',
      // id: get(ownProps, 'referral.job.referralBonus.tieredBonusId', 'skip'),
    },
    currencySymbol,
    currencyRate,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(compose(withGetTieredBonus)(ManageJobCard));
