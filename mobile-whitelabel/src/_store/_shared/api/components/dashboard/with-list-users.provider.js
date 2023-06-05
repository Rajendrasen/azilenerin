import { graphql } from 'react-apollo';
import { ListUsers } from '../../graphql/custom/dashboard/list-users.graphql';

export const withListUsers = (Component, variables) => {
  return graphql(ListUsers, {
    options: { variables, fetchPolicy: 'cache-and-network' },
    props: props => {
      return {
        users: props.data.listUsers ? props.data.listUsers.items : [],
      };
    },
  })(Component);
};
