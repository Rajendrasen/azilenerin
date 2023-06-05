import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { listJobMatches } from '../../graphql/custom/jobMatch/list-job-match.graphql';

export const withDashboardMyJobMatches = Component => {
  return graphql(gql(listJobMatches), {
    options: props => ({
      variables: {
        filter: {
          userId: { eq: props.currentUser.id },
        },
        limit: 1000,
        nextToken: null,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      jobMatches: props.data.listJobMatches ? props.data.listJobMatches.items : [],
      jobMatchesLoading: props.data.loading,
    }),
  })(Component);
};
