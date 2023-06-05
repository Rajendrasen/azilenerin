import { graphql } from 'react-apollo';
import { ListUsersWithRole } from '../../graphql/custom/users/list-users-with-role.graphql';

export const withListUsersAndRole = Component => {
  return graphql(ListUsersWithRole, {
    options: props => ({
      variables: {
        filter: {
          companyId: { eq: props.currentUser.companyId },
          role: { ne: 'superAdmin' },
        },
        limit: 1000,
      },

      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      users: props.data.listUsers ? props.data.listUsers.items : [],
    }),
  })(Component);
};
