import { connect } from 'react-redux';
import { get } from 'lodash';
// import JobCardComponent from './jobCard.component';
import { compose } from '../../../_shared/services/utils';
import JobCard from './job-card.component';
import { withGetTieredBonus } from '../../../_store/_shared/api/components/tiered-bonuses';

// const mapStateToProps = (state, ownProps) => {
//     const { currentUser } = state.user;
//     let tieredBonusId = JSON.parse(ownProps.job.referralBonus).tieredBonusId;
//     return {
//         tieredBonusQuery: {
//             companyId: currentUser.companyId,
//             id: tieredBonusId ? tieredBonusId : 'skip'
//         },
//     };
// };

// const mapDispatchToProps = () => {
//     return {};
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(compose(withGetTieredBonus)(JobCard));

export default JobCard;
