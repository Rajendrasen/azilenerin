import { graphql, compose } from 'react-apollo';
import { ListReferralsDashboard } from '../../graphql/custom/referrals/referralsWithContactAndJob.graphql';
export const  = (Component, variables) => {
  return compose(
    graphql(ListReferralsDashboard, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => {
        return {
          referrals: props.data.listReferrals ? props.data.listReferrals.items : undefined,
        };
      },
    })
  )(Component);
};
