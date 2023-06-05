import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { GetReferral } from '../../graphql/custom/referrals/referral-by-id.graphql';
import { updateReferral } from '../../graphql/mutations';

export const withReferralLandingDetails = (Component, variables) => {
  return compose(
    graphql(gql(GetReferral), {
      options: {
        variables,
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        referral: props.data.getReferral ? props.data.getReferral : undefined,
      }),
    }),
    graphql(gql(updateReferral), {
      props: props => ({
        onUpdateReferral: input => {
          const optimisticResponseData = {
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              updateReferral: {
                ...optimisticResponseData,
                __typename: 'updateReferral',
              },
            },
          });
        },
      }),
    })
  )(Component);
};
