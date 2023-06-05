import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { listUserGroups } from '../../graphql/custom/users/list-users-with-all.graphql';
import { createUser, createCompany } from '../../graphql/mutations';

export const withListUserGroups = (Component, variables) => {
  return compose(
    graphql(listUserGroups, {
      options: props => {
        return {
          variables: { limit: 1000, filter: { companyId: { eq: props.currentUser.companyId } } },
          fetchPolicy: 'network-only',
        };
      },
      props: props => {
        return {
          usersGroups: props.data.listUserGroups ? props.data.listUserGroups.items : [],
          userGroupsLoading: props.data.loading,
        };
      },
    })
  )(Component);
};
