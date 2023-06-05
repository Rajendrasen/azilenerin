import { graphql, compose } from 'react-apollo';
import { getUser } from '../../graphql/custom/dashboard/get-dashboard-user.graphql';
import gql from 'graphql-tag';

export const withUserDetails = (Component, variables) => {
  return compose(
    graphql(gql(getUser), {
      options: props => {
        return {
          variables: { id: props.userId ? props.userId : null },
          fetchPolicy: 'cache-and-network',
        };
      },
      props: props => {
        return {
          user: props.data.getUser ? props.data.getUser : undefined,
          apiFetching: props.data.loading,
        };
      },
    })
  )(Component);
};
