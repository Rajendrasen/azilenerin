import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getUser } from '../../graphql/custom/dashboard/get-dashboard-user.graphql';

export const withUserDashboard = Component => {
  return graphql(gql(getUser), {
    options: props => ({
      variables: { id: props.currentUser.id },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      userDashboard: props.data.getUser || 0,
    }),
  })(Component);
};
