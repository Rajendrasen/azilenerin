import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { ListUsers } from '../../graphql/custom/users/list-users-with-all.graphql';
import { createUser, createCompany } from '../../graphql/mutations';

export const withListUsers = (Component, variables) => {
  return compose(
    graphql(ListUsers, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => {
        return {
          users: props.data.listUsers ? props.data.listUsers.items : [],
        };
      },
    }),
    graphql(gql(createUser), {
      props: props => ({
        onCreateUser: input => {
          props.mutate({
            variables: input,
          });
        },
      }),
    }),
    graphql(gql(createCompany), {
      props: props => ({
        onCreateCompany: input => {
          return props.mutate({
            variables: input,
          });
        },
      }),
    })
  )(Component);
};
