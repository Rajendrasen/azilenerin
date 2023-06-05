import { graphql, compose } from 'react-apollo';
import { getContact } from './getContact';
import gql from 'graphql-tag';

export const withContactDetails = (Component, variables) => {
  return compose(
    graphql(gql(getContact), {
      options: props => {
        return {
          variables: { id: props.details ? props.details.id : null },
          fetchPolicy: 'cache-and-network',
        };
      },
      props: props => {
        return {
          contact: props.data.getContact ? props.data.getContact : undefined,
          apiFetching: props.data.loading,
        };
      },
    })
  )(Component);
};
