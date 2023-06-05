import { connect } from 'react-redux';
import MessageCenterComponent from './message-center.component';
import { compose } from '../../_shared/services/utils';
import { withListDepartment } from '../../_store/_shared/api/components/departments/with-list-departments.provider';
import { userActions } from '../../_store/actions';
import { withCreateReferral } from '../../_store/_shared/api/components/contacts/create-referral.provider';

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

const MessageCenterContainer = compose(
  withListDepartment,
  withCreateReferral
)(MessageCenterComponent);

export const MessageCenter = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageCenterContainer);
