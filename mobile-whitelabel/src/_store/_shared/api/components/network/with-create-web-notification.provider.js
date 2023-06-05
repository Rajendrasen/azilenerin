import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { createWebNotification } from '../../graphql/mutations';

export const withCreateWebNotification = Component => {
  return compose(
    graphql(gql(createWebNotification), {
      options: {
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        onCreateWebNotification: input => {
          return props
            .mutate({
              variables: input,
            })
            .then(resp => resp.data.createWebNotification);
        },
      }),
    })
  )(Component);
};
