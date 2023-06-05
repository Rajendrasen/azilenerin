import {connect} from 'react-redux';
import Bonuses from './my-bonuses.component';
import {compose} from '../../_shared/services/utils';
const mapStateToProps = (state) => {
  const {currentUser, currencySymbol, currencyRate} = state.user;
  return {
    currentUser,
    id: currentUser.id,
    filter: {userId: {eq: currentUser.id}},
    limit: 1000,
    currencySymbol,
    currencyRate,
  };
};

export const MyBonusesWithApi = compose()(Bonuses);

export const MyBonuses = connect(mapStateToProps)(MyBonusesWithApi);
