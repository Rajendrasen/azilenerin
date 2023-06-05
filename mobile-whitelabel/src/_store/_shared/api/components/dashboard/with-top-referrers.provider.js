import { graphql } from 'react-apollo';
import { GetTopReferrers } from '../../graphql/custom/dashboard/get-top-referrers.graphql';

export const withTopReferrers = Component => {
  return graphql(GetTopReferrers, {
    options: props => ({
      variables: { companyId: props.currentUser.companyId },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => {
      if (!props.data.loading && (!props.data.getTopReferrers || props.data.error)) {
        props.data.refetch();
        return { topReferrers: [] };
      }
      return { topReferrers: props.data.getTopReferrers || [] };
    },
  })(Component);
};
