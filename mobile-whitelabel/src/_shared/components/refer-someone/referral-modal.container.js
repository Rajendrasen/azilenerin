import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { compose } from '../../services/utils';
import ReferSomeone from './referral-modal.component';
import { withCreateReferral } from '../../../_store/_shared/api/components/contacts/create-referral.provider';
import { withMyContacts } from '../../../_store/_shared/api/components/contacts/myContacts.provider';
import { withGetTieredBonus } from '../../../_store/_shared/api/components/tiered-bonuses';

const mapStateToProps = (state, ownProps) => {
    const { currentUser, currencyRate, currencySymbol } = state.user;
    // debugger
    let tieredBonusId;
    if (typeof ownProps.job.referralBonus === 'string') {
        tieredBonusId = JSON.parse(ownProps.job.referralBonus).tieredBonusId;
    } else {
        tieredBonusId = ownProps?.job?.referralBonus?.tieredBonusId;
    }

    // console.log('tieredBonusId new', tieredBonusId);
    // console.log(ownProps.job.referralBonus)
    return {
        currentUser,
        currencyRate,
        currencySymbol,
        filter: { userId: { eq: currentUser.id } },
        limit: 1000,
        currentScene: Actions.currentScene,
        tieredBonusQuery: {
            companyId: currentUser.companyId,
            id: tieredBonusId ? tieredBonusId : 'skip',
            // id: get(ownProps, 'referral.job.referralBonus.tieredBonusId', 'skip'),
        },
        propsJob: ownProps.propsJob
    };
};

const ReferralModalWithApi = compose(
    withCreateReferral,
    //withMyContacts
)(ReferSomeone);

export const ReferralModal = connect(mapStateToProps)(
    compose(withGetTieredBonus)(ReferralModalWithApi)
);
