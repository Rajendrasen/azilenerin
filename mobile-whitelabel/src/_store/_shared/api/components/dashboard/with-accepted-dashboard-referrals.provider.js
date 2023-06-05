import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getDashboardReferrals } from '../../graphql/queries';

export const withAcceptedDashboardReferrals = Component => {
  return graphql(gql(getDashboardReferrals), {
    options: props => ({
      variables: { companyId: props.currentUser.companyId, status: 'accepted' },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      currentAcceptedReferralCount: props.data.getDashboardReferrals
        ? props.data.getDashboardReferrals.currentReferralCount
        : [],
      previousAcceptedReferralCount: props.data.getDashboardReferrals
        ? props.data.getDashboardReferrals.previousReferralCount
        : [],
    }),
  })(Component);
};
