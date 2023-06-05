import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { createTieredBonus } from '../../graphql/custom/tiered-bonuses/create-tiered-bonus.graphql';
import { updateTieredBonus } from '../../graphql/custom/tiered-bonuses/update-tiered-bonus.graphql';
import { listTieredBonuses } from '../../graphql/custom/tiered-bonuses/list-tiered-bonuses.graphql';

export const withModifyTieredBonus = Component => {
  return compose(
    graphql(gql(updateTieredBonus), {
      props: props => ({
        onUpdateTieredBonus: input => {
          const optimisticResponseData = {
            ...input,
          };
          return props.mutate({
            variables: { input },
            optimisticResponse: {
              __typename: 'Mutation',
              updateTieredBonus: {
                ...optimisticResponseData,
                __typename: 'updateTieredBonus',
              },
            },
          });
        },
      }),
    }),

    graphql(gql(createTieredBonus), {
      props: props => ({
        onAddTieredBonus: input => {
          const optimisticResponseData = {
            ...input,
          };
          props.mutate({
            variables: { input },
            optimisticResponse: {
              __typename: 'Mutation',
              createTieredBonus: {
                ...optimisticResponseData,
                __typename: 'createTieredBonus',
              },
            },
            update: (proxy, { data: { createTieredBonus } }) => {
              const data = proxy.readQuery({
                query: gql(listTieredBonuses),
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                  },
                  limit: 1000,
                  nextToken: null,
                },
              });
              if (
                data.listTieredBonuses &&
                data.listTieredBonuses.items &&
                !data.listTieredBonuses.items.find(
                  bonus => bonus.id === createTieredBonus.id
                )
              ) {
                data.listTieredBonuses.items.push(createTieredBonus);
              }
              proxy.writeQuery({
                query: gql(listTieredBonuses),
                data,
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                  },
                  limit: 1000,
                  nextToken: null,
                },
              });
            },
          });
        },
      }),
    })
  )(Component);
};
