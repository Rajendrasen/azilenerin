import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { GetUserInvite } from '../../graphql/custom/users/invited-user-with-depts.graphql';
import { createUser, updateUserInvite } from '../../graphql/mutations';

export const withGetUserInvite = (Component, variables) => {
  return compose(
    graphql(GetUserInvite, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => ({
        userInvite: props.data.getUserInvite ? props.data.getUserInvite : undefined,
      }),
    }),
    graphql(gql(createUser), {
      props: props => ({
        onCreate: input => {
          return props.mutate({
            variables: input,
          });
        },
      }),
    }),
    graphql(gql(updateUserInvite), {
      props: props => ({
        onUpdateInvite: input => {
          props.mutate({
            variables: input,
          });
        },
      }),
    })
  )(Component);
};
