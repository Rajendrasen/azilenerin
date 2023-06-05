import { graphql } from 'react-apollo';
import { queryBonusByCompanyIdIndex } from '../../graphql/custom/bonuses/query-bonus-by-company-id.graphql';

export const withBonuses = (Component, variables) => {
  return graphql(queryBonusByCompanyIdIndex, {
    options: { variables, fetchPolicy: 'cache-and-network' },
    props: props => {
      return {
        bonuses: props.data.QueryBonusByCompanyIdIndex
          ? props.data.QueryBonusByCompanyIdIndex.items
          : undefined,
        refetchReferrals: (filter, limit) => {
          return props.data.refetch({
            variables: { filter, limit },
          });
        },
      };
    },
  })(Component);
};
