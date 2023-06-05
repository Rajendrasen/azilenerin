import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getDashboardJobs } from '../../graphql/queries';
import { ListJobs } from '../../graphql/custom/dashboard/jobs-by-companyId.graphql';
import { get } from 'lodash';

export const withDashboardJobs = (Component, variables) => {
  return compose(
    graphql(gql(getDashboardJobs), {
      options: {
        variables,
        fetchPolicy: 'cache-and-network',
      },
      props: props => {
        if (!props.data.loading && (!props.data.getDashboardJobs || props.data.error)) {
          setTimeout(props.data.refetch, 2000);
          return null;
        }
        return {
          openPositions: props.data.getDashboardJobs
            ? props.data.getDashboardJobs.openPositions
            : [],
          inNetworkMatches: props.data.getDashboardJobs
            ? props.data.getDashboardJobs.inNetworkMatches
            : [],
          jobShares: props.data.getDashboardJobs ? props.data.getDashboardJobs.jobShares : [],
          totalJobViews: props.data.getDashboardJobs
            ? props.data.getDashboardJobs.totalJobViews
            : [],
        };
      },
    }),
    graphql(ListJobs, {
      options: {
        variables,
        fetchPolicy: 'cache-and-network',
      },
      props: props => {
        if (!props.data.loading && (!props.data.listJobs || props.data.error)) {
          setTimeout(props.data.refetch, 2000);
          return null;
        }
        //new
        const nextToken = get(props, ['data', 'listJobs', 'nextToken'], null);
        const onFetchMore = makeOnFetchMore(props.data.fetchMore, nextToken);

        return {
          jobs: props.data.listJobs ? props.data.listJobs.items : undefined,
          onFetchMore,
          nextToken,
          jobsLoading: props.data.loading,
        };
      },
    })
  )(Component);
};

const makeOnFetchMore = (fetchMore, nextToken) => {
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
          listJobs: {
            ...prev.listJobs,
            ...fetchMoreResult.listJobs,
            items: [...prev.listJobs.items, ...fetchMoreResult.listJobs.items],
          },
        };
      },
    });
  };
};
