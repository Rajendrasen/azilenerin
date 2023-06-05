import { graphql } from 'react-apollo';
import get from 'lodash/get';
import gql from 'graphql-tag';
import { queryContactsByAtsIdIndex } from '../../graphql/custom/contacts/contacts-by-ats-id.graphql';

export const withListContactsByAtsId = (Component, variables) => {
  return graphql(gql(queryContactsByAtsIdIndex), {
    options: (props) => {
      return {
        variables: {
          atsId: get(props, 'currentUser.accountClaim.atsId'),
        },
        fetchPolicy: 'cache-and-network',
      };
    },
    props: (props) => {
      return {
        matchingAtsIdContacts: get(
          props,
          'data.queryContactsByAtsIdIndex.items',
          []
        ),
        atsLoading: props.data.loading
      };
    },
  })(Component);
};
