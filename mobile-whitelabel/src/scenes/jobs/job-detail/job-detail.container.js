import { connect } from 'react-redux';
import JobDetailsComponent from './job-detail.component';
import { browseJobsActions } from '../../../_store/actions';
import { withJobByIdBrowseJobs } from '../../../_store/_shared/api/components/jobs/with-job-by-id-browse-jobs.provider';
import { compose } from '../../../_shared/services/utils';
import { withJobMatchByJobId } from '../../../_store/_shared/api/components/jobMatch/with-jobMatch-by-jobId.provider';
import { withGetTieredBonus } from '../../../_store/_shared/api/components/tiered-bonuses';

const mapStateToProps = (state, props) => {
    const { currentUser, currencySymbol, currencyRate } = state.user;
    let referralBonus = props.job.referralBonus;
    let tieredBonusId =
        typeof referralBonus === 'string'
            ? JSON.parse(referralBonus)?.tieredBonusId
            : referralBonus?.tieredBonusId;
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

const JobDetailsContainer = compose(
    withJobByIdBrowseJobs,
    withJobMatchByJobId,
    withGetTieredBonus
)(JobDetailsComponent);

export const JobDetails = connect(
    mapStateToProps,
    mapDispatchToProps
)(JobDetailsContainer);
