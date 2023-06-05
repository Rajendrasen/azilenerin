import { connect } from 'react-redux';
import CareerProfileComponent from './careerProfile.component';
import { withListJobs } from '../../_store/_shared/api/components/jobs/with-list-jobs.provider';
import { compose } from '../../_shared/services/utils';
import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import { userActions } from '../../_store/actions';
import { withCreateReferral } from '../../_store/_shared/api/components/contacts/create-referral.provider';

const mapStateToProps = state => {
    const { currentUser } = state.user;
    return {
        currentUser: state.user.currentUser,
        filter: { companyId: { eq: currentUser.companyId } },
        limit: 10000,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCurrentUser(user) {
            dispatch(userActions.createSetCurrentUserAction(user));
        },
        updateCurrentUser(user) {
            dispatch(userActions.updateCurrentUser(user))
        }

    };
};

const CareerProfileContainer = compose(withListDepartment)(CareerProfileComponent);

export const CareerProfile = connect(
    mapStateToProps,
    mapDispatchToProps
)(CareerProfileContainer);
