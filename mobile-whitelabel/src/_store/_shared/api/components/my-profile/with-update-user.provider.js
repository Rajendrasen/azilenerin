import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { updateUser } from '../../graphql/custom/users/updateUser.graphql';
import { getUser } from '../../graphql/queries';

export const withUpdateUser = Component => {
  return graphql(gql(updateUser), {
    props: props => ({
      onUpdate: input => {
        const optimisticResponseData = {
          ...props.currentUser,
          ...input.input,
        };
        props.mutate({
          variables: input,
          optimisticResponse: {
            __typename: 'Mutation',
            updateUser: {
              ...optimisticResponseData,
              __typeName: 'updateUser',
            },
          },
          update: proxy => {
            const data = proxy.readQuery({
              query: gql(getUser),
              variables: { id: props.currentUser.id },
            });
            proxy.writeQuery({
              query: gql(getUser),
              data,
              variables: { id: props.currentUser.id },
            });
          },
        });
      },
    }),
  })(Component);
};
