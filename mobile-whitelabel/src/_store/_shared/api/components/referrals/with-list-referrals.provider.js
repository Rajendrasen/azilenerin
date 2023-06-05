import { graphql } from 'react-apollo';
import { ListReferralsDashboard } from '../../graphql/custom/referrals/referralsWithContactAndJob.graphql';

export const withListReferrals = (Component, variables) => {
  return graphql(ListReferralsDashboard, {
    options: { variables, fetchPolicy: 'cache-and-network' },
    props: props => {
      return {
        referrals: props.data.listReferrals ? props.data.listReferrals.items : undefined,
        refetchReferrals: (filter, limit) => {
          return props.data.refetch({
            variables: { filter, limit },
          });
        },
      };
    },
  })(Component);
};
