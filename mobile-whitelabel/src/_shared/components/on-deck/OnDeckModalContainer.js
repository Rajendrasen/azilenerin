import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { compose } from '../../services/utils';
import ReferSomeone from './OnDeckModal';
import { withCreateReferral } from '../../../_store/_shared/api/components/contacts/create-referral.provider';
import { withMyContacts } from '../../../_store/_shared/api/components/contacts/myContacts.provider';
import GeneralReferralModal from './submit-general-referral-modal';

const mapStateToProps = (state, ownProps) => {
    const { currentUser } = state.user;
    // debugger

    // console.log('tieredBonusId', tieredBonusId);
    // console.log(ownProps.job.referralBonus)
    return {
        currentUser,
        filter: { userId: { eq: currentUser.id } },
        limit: 1000,
        currentScene: Actions.currentScene,
        ...ownProps,
    };
};

const ReferralModalWithApi = compose(
    withCreateReferral,
    withMyContacts,
)(ReferSomeone);
const GeneralReferralWithApi = compose(
    withCreateReferral,
    withMyContacts,
)(GeneralReferralModal)

export const ReferralModal = connect(mapStateToProps)(ReferralModalWithApi);
export const GeneralReferal = connect(mapStateToProps)(GeneralReferralWithApi);