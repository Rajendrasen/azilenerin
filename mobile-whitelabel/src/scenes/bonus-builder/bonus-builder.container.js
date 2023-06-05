import { connect } from 'react-redux';
import BonusBuilderComponent from './bonus-builder.component';
import { withListTieredBonus } from '../../_store/_shared/api/components/tiered-bonuses/with-list-tiered-bonus.provider';
import { withListUserGroups } from '../../_store/_shared/api/components/users/with-list-userGroups.provider';
import { compose } from '../../_shared/services/utils';

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

const BonusBuilderContainer = compose(
  withListTieredBonus,
  withListUserGroups
)(BonusBuilderComponent);

export const BonusBuilder = connect(mapStateToProps)(BonusBuilderContainer);
