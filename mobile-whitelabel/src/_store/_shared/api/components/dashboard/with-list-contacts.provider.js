import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { listContacts } from '../../graphql/custom/dashboard/list-contacts.graphql';

export const withListContacts = Component => {
  return graphql(gql(listContacts), {
    options: props => ({
      variables: {
        filter: { userId: { eq: props.currentUser.id } },
        limit: 1000,
        nextToken: null,
      },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => ({
      contacts: props.data.listContacts ? props.data.listContacts.items : [],
    }),
  })(Component);
};
