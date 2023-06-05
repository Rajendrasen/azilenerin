import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { createUser, updateUserInvite } from '../../graphql/mutations';

export const withGetUserInvite = (Component, variables) => {
  return compose(
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
