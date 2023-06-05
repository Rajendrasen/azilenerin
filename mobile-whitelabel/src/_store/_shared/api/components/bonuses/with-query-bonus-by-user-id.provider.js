import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import get from 'lodash/get';
import uuid from 'uuid/v4';
import {createBonus} from '../../graphql/custom/bonuses/create-bonus.graphql';
import {deleteBonus} from '../../graphql/custom/bonuses/delete-bonus.graphql';
import {updateBonus} from '../../graphql/custom/bonuses/update-bonus.graphql';
import {queryBonusByUserIdIndex} from '../../graphql/custom/bonuses/query-bonus-by-user-id.graphql';

export const withQueryBonusByUserId = (Component) => {
  return compose(
    graphql(queryBonusByUserIdIndex, {
      options: (props) => {
        return {
          variables: {
            userId: get(props, 'id', get(props, 'currentUser.id')),
            //get(props, 'referralId')
            //),
          },
          fetchPolicy: 'cache-and-network',
        };
      },
      props: (response, prev) => {
        let referralBonuses = get(
          response,
          ['data', 'queryBonusByUserIdIndex', 'items'],
          get(prev, 'referralBonuses', []),
        );

        const referralBonusNextToken = get(
          response,
          ['data', 'queryBonusByUserIdIndex', 'nextToken'],
          null,
        );
        const onFetchMoreReferralBonuses = makeOnFetchMoreReferralBonuses(
          response.data.fetchMore,
          referralBonusNextToken,
        );

        return {
          referralBonuses,
          onFetchMoreReferralBonuses,
          referralBonusNextToken,
        };
      },
    }),
    graphql(gql(createBonus), {
      props: (props) => ({
        onCreateBonus: (input) => {
          const variables = {
            ...input,
            id: uuid(),
          };
          props.mutate({
            variables,
            // refetchQueries: [
            //   {
            //     query: gql(queryBonusByUserIdIndex),
            //     variables: {
            //       referralId: get(props, 'ownProps.referral.referralId'),
            //     },
            //   },
            // ],
          });
        },
      }),
    }),
    graphql(gql(updateBonus), {
      props: (props) => ({
        onUpdateBonus: (input) => {
          const optimisticResponseData = {
            ...input.input,
            __typename: 'Bonus',
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typeName: 'Mutation',
              updateBonus: {
                __typeName: 'updateBonus',
                ...optimisticResponseData,
              },
            },
            update: (proxy, query) => {
              try {
                const data = proxy.readQuery({
                  query: queryBonusByUserIdIndex,
                  variables: {
                    companyId: get(
                      props,
                      ['ownProps', 'currentUser', 'companyId'],
                      [],
                    ),
                  },
                });
                const bonuses = get(data, 'queryBonusByUserIdIndex.items');

                proxy.writeQuery({
                  query: queryBonusByUserIdIndex,
                  variables: {
                    companyId: get(
                      props,
                      ['ownProps', 'currentUser', 'companyId'],
                      [],
                    ),
                  },
                  bonuses,
                  data,
                });
              } catch (error) {
                console.log(error);
              }
            },
          });
        },
      }),
    }),

    graphql(gql(deleteBonus), {
      props: (props) => ({
        onDeleteBonus: (input) => {
          const variables = {
            ...input,
          };
          props.mutate({
            variables,
            refetchQueries: [
              {
                query: queryBonusByUserIdIndex,
                variables: {
                  referralId: get(props, 'ownProps.referral.referralId'),
                },
              },
            ],
          });
        },
        // refetchQueries: [
        //   {
        //     query: gql(queryBonusByUserIdIndex),
        //     variables: {
        //       referralId: get(props, 'ownProps.referral.referralId'),
        //     },
        //   },
        // ],
      }),
    }),
  )(Component);
};

const makeOnFetchMoreReferralBonuses = (fetchMore, nextToken) => {
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      variables: {nextToken},
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          ...prev,
          loading: false,
          queryBonusByUserIdIndex: {
            ...prev.queryBonusByUserIdIndex,
            ...fetchMoreResult.queryBonusByUserIdIndex,
            items: [
              ...prev.queryBonusByUserIdIndex.items,
              ...fetchMoreResult.queryBonusByUserIdIndex.items,
            ],
          },
        };
      },
    });
  };
};
