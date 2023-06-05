import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getCompany } from '../../graphql/queries';

export const withGetCompany = (Component, variables) => {
  return graphql(gql(getCompany), {
    options: {
      variables,
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      company: props.data.getCompany ? props.data.getCompany : undefined,
    }),
  })(Component);
};
