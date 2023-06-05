import { connect } from 'react-redux';
import ManageJobDetailsComponent from './manageJob-detail.component';
import { browseJobsActions } from '../../../_store/actions';
import { withJobByIdBrowseJobs } from '../../../_store/_shared/api/components/jobs/with-job-by-id-browse-jobs.provider';
import { compose } from '../../../_shared/services/utils';
import { withJobMatchByJobId } from '../../../_store/_shared/api/components/jobMatch/with-jobMatch-by-jobId.provider';
import { withGetTieredBonus } from '../../../_store/_shared/api/components/tiered-bonuses';

const mapStateToProps = (state, props) => {
  const { currentUser, currencyRate, currencySymbol } = state.user;
  let tieredBonusId = props.job.referralBonus.tieredBonusId;
  return {
    currentUser,
    currencyRate,
    currencySymbol,
    currentJob: state.browseJobs.currentJob,
    id: props.job.id,
    jobId: props.job.id,
    // console.log(tieredBonusId);
    tieredBonusQuery: {
      companyId: currentUser.companyId,
      id: tieredBonusId ? tieredBonusId : 'skip',
      // id: get(ownProps, 'referral.job.referralBonus.tieredBonusId', 'skip'),
    },
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deselectCurrentJob() {
      dispatch(browseJobsActions.resetAddJobForm());
    },
  };
};

const ManageJobDetailsContainer = compose(
  withJobByIdBrowseJobs,
  withJobMatchByJobId,
  withGetTieredBonus
)(ManageJobDetailsComponent);

export const ManageJobDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageJobDetailsContainer);
