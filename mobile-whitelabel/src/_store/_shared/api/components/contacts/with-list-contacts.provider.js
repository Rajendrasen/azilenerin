import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { listContacts } from '../../graphql/queries';

export const withListContacts = (Component, variables) => {
  return graphql(gql(listContacts), {
    options: {
      variables,
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      contacts: props.data.listContacts ? props.data.listContacts.items : [],
    }),
  })(Component);
};
