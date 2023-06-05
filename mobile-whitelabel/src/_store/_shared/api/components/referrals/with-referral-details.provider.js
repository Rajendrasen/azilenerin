import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {getReferral} from '../../graphql/queries';
import get from 'lodash/get';

import {updateReferral} from '../../graphql/mutations';
import {updateJob} from '../../graphql/custom/jobs/update-job.graphql';
import {queryBonusByReferralIdIndex} from '../../graphql/custom/bonuses/query-bonus-by-referral-id.graphql';

export const withReferralDetails = (Component, variables) => {
  return compose(
    graphql(gql(getReferral), {
      options: (props) => ({
        variables: {
          id: props.referral ? props.referral.id : props.referralId,
        },
        fetchPolicy: 'network-only',
      }),
      props: (props) => ({
        referralDetails: props.data.getReferral
          ? props.data.getReferral
          : undefined,
        loading: props.data.loading,
      }),
    }),
    graphql(gql(queryBonusByReferralIdIndex), {
      options: (props) => {
        return {
          variables: {
            referralId: props.referral ? props.referral.id : props.referralId,
          },
          fetchPolicy: 'network-only',
        };
      },
      props: (response, prev) => {
        let referralBonuses = get(
          response,
          ['data', 'queryBonusByReferralIdIndex', 'items'],
          get(prev, 'referralBonuses', []),
        );
        return {
          referralBonuses,
          refetchReferralBonuses: (filter, limit) => {
            return response.data.refetch({
              variables: {
                id: response.ownProps.referral
                  ? response.ownProps.referral.id
                  : response.ownProps.referralId,
              },
            });
          },
        };
      },
    }),
    graphql(gql(updateReferral), {
      props: (props) => ({
        onUpdateReferral: (input) => {
          return props
            .mutate({
              variables: {
                input: {...input.input, id: props.ownProps.referral.id},
              },
            })
            .then((res) => res);
        },
      }),
    }),
    graphql(gql(updateJob), {
      props: (props) => ({
        onUpdateJob: (input) => {
          const optimisticResponseData = {
            ...input,
          };
          return props.mutate({
            variables: {input},
            optimisticResponse: {
              __typename: 'Mutation',
              updateJob: {
                ...optimisticResponseData,
                __typename: 'updateJob',
              },
            },
          });
        },
      }),
    }),
  )(Component);
};
