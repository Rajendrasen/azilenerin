import { connect } from 'react-redux';
import BrowseJobsComponent from './jobs.component';
import { withListJobs } from '../../_store/_shared/api/components/jobs/with-list-jobs.provider';
import { compose } from '../../_shared/services/utils';
import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import { userActions } from '../../_store/actions';
import { withCreateReferral } from '../../_store/_shared/api/components/contacts/create-referral.provider';
import { withUpdateJob } from '../../_shared/components/shareIcon/with-update-job.provider';
import { withCreateUserJobShare } from '../../_store/_shared/api/components/jobs/with-create-job-share';

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

const BrowseJobsContainer = compose(
    withListDepartment,
    withCreateReferral,
    withUpdateJob,
    withCreateUserJobShare
)(BrowseJobsComponent);

export const BrowseJobs = connect(
    mapStateToProps,
    mapDispatchToProps
)(BrowseJobsContainer);
