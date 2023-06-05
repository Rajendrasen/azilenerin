import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getDashboardJobs } from '../../graphql/queries';

export const withDashboardJobsManager = Component => {
  return compose(
    graphql(gql(getDashboardJobs), {
      options: props => ({
        variables: {
          userId: props.currentUser.id,
          companyId: props.currentUser.companyId,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => ({
        openPositionsManager: props.data.getDashboardJobs
          ? props.data.getDashboardJobs.openPositions
          : [],
        inNetworkMatchesManager: props.data.getDashboardJobs
          ? props.data.getDashboardJobs.inNetworkMatches
          : [],
        jobSharesManager: props.data.getDashboardJobs ? props.data.getDashboardJobs.jobShares : [],
        totalJobViewsManager: props.data.getDashboardJobs
          ? props.data.getDashboardJobs.totalJobViews
          : [],
      }),
    })
  )(Component);
};
