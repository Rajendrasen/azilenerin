import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {getDashboardReferrals} from '../../graphql/queries';
import {ListDashboardReferrals} from '../../graphql/custom/dashboard/get-referrals-dashboard.graphql';
import {get} from 'lodash';
export const withDashboardReferrals = (Component, variables) => {
  return compose(
    graphql(gql(getDashboardReferrals), {
      options: {variables, fetchPolicy: 'cache-and-network'},
      props: (props) => {
        if (
          !props.data.loading &&
          (!props.data.getDashboardReferrals ||
            props.data.getDashboardReferrals.currentReferralCount === undefined)
        ) {
          setTimeout(props.data.refetch, 2000);
          return null;
        }
        return {
          currentReferralCount: props.data.getDashboardReferrals
            ? props.data.getDashboardReferrals.currentReferralCount
            : null,
          previousReferralCount: props.data.getDashboardReferrals
            ? props.data.getDashboardReferrals.previousReferralCount
            : null,
          currentAcceptedReferralCount: props.data.getDashboardReferrals
            ? props.data.getDashboardReferrals.currentReferralCount
            : null,
          previousAcceptedReferralCount: props.data.getDashboardReferrals
            ? props.data.getDashboardReferrals.previousReferralCount
            : null,
          referralsTotal:
            get(props.data, 'getDashboardReferrals.previousReferralCount', 0) +
            get(props.data, 'getDashboardReferrals.currentReferralCount', 0),
          currentReferralLoading: props.data.loading,
        };
      },
    }),
    graphql(ListDashboardReferrals, {
      options: (props) => ({
        variables: {
          filter: {companyId: {eq: props.currentUser.companyId}},
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: (props) => {
        if (!props.data.listReferrals) {
          setTimeout(props.data.refetch, 2000);
          return null;
        }
        return {
          referrals: props.data.listReferrals
            ? props.data.listReferrals.items
            : undefined,
        };
      },
    }),
    graphql(ListDashboardReferrals, {
      options: (props) => ({
        variables: {
          filter: {userId: {eq: props.currentUser.id}},
          limit: 1000,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: (props) => ({
        userReferrals: props.data.listReferrals
          ? props.data.listReferrals.items
          : undefined,
      }),
    }),
  )(Component);
};
