import { graphql, compose } from 'react-apollo';
import get from 'lodash/get';
import gql from 'graphql-tag';
//import get from 'lodash/get';
import { createBonus } from '../../graphql/custom/bonuses/create-bonus.graphql';
import { deleteBonus } from '../../graphql/custom/bonuses/delete-bonus.graphql';
import { updateBonus } from '../../graphql/custom/bonuses/update-bonus.graphql';
import { queryBonusByCompanyIdIndex } from '../../graphql/custom/bonuses/query-bonus-by-company-id.graphql';
//import { queryBonusByCompanyIdIndex } from '../../graphql/custom/bonuses/query-bonus-by-company-id.graphql';
import uuid from 'uuid/v4';

export const withCreateBonus = Component => {
  return compose(
    graphql(gql(createBonus), {
      props: props => ({
        onCreateBonus: input => {
          const variables = {
            ...input,
            id: uuid(),
          };
          props.mutate({
            variables,
          });
        },
      }),
    }),
    graphql(gql(updateBonus), {
      props: props => ({
        onUpdateBonus: input => {
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
              // console.log(proxy, query, props);
              try {
                const data = proxy.readQuery({
                  query: gql(queryBonusByCompanyIdIndex),
                  variables: {
                    companyId: get(props, ['ownProps', 'currentUser', 'companyId'], []),
                  },
                });
                const bonuses = get(data, 'queryBonusByCompanyIdIndex.items');

                proxy.writeQuery({
                  query: gql(queryBonusByCompanyIdIndex),
                  variables: {
                    companyId: get(props, ['ownProps', 'currentUser', 'companyId'], []),
                  },
                  bonuses,
                  data,
                });
              } catch (error) {
                //console.log(error);
              }
            },
          });
        },
      }),
    }),

    graphql(gql(deleteBonus), {
      props: props => ({
        onDeleteBonus: input => {
          const variables = {
            ...input,
          };
          props.mutate({
            variables,
          });
        },
      }),
    })
  )(Component);
};

// const makeOnFetchMoreBonuses = (fetchMore, nextToken) => {
//   if (!nextToken) {
//     return null;
//   }
//   return () => {
//     fetchMore({
//       variables: { nextToken },
//       updateQuery: (prev, { fetchMoreResult }) => {
//         if (!fetchMoreResult) {
//           return prev;
//         }
//         return {
//           ...prev,
//           loading: false,
//           queryBonusByCompanyIdIndex: {
//             ...prev.queryBonusByCompanyIdIndex,
//             ...fetchMoreResult.queryBonusByCompanyIdIndex,
//             items: [
//               ...prev.queryBonusByCompanyIdIndex.items,
//               ...fetchMoreResult.queryBonusByCompanyIdIndex.items,
//             ],
//           },
//         };
//       },
//     });
//   };
// };
