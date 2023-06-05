import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { queryBonusByReferralIdIndex } from '../../graphql/custom/bonuses/query-bonus-by-referral-id.graphql';

export const withQueryBonusByReferralId = Component => {
  return compose(
    graphql(gql(queryBonusByReferralIdIndex), {
      options: props => {
        return {
          variables: {
            referralId: get(props, 'referral.referralId', get(props, 'referral.id')),
          },
          fetchPolicy: 'cache-and-network',
        };
      },
      props: (response, prev) => {
        let referralBonuses = get(
          response,
          ['data', 'queryBonusByReferralIdIndex', 'items'],
          get(prev, 'referralBonuses', [])
        );

        const referralBonusNextToken = get(
          response,
          ['data', 'queryBonusByReferralIdIndex', 'nextToken'],
          null
        );
        const onFetchMoreReferralBonuses = makeOnFetchMoreReferralBonuses(
          response.data.fetchMore,
          referralBonusNextToken
        );

        return {
          referralBonuses,
          onFetchMoreReferralBonuses,
          referralBonusNextToken,
        };
      },
    })
  )(Component);
};

const makeOnFetchMoreReferralBonuses = (fetchMore, nextToken) => {
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      variables: { nextToken },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          ...prev,
          loading: false,
          queryBonusByReferralIdIndex: {
            ...prev.queryBonusByReferralIdIndex,
            ...fetchMoreResult.queryBonusByReferralIdIndex,
            items: [
              ...prev.queryBonusByReferralIdIndex.items,
              ...fetchMoreResult.queryBonusByReferralIdIndex.items,
            ],
          },
        };
      },
    });
  };
};
