import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { createDepartment } from '../../graphql/mutations';

export const withCreateDepartment = Component => {
  return graphql(gql(createDepartment), {
    props: props => ({
      onCreateDepartment: input => {
        return props
          .mutate({
            variables: input,
          })
          .then(resp => resp.data.createDepartment);
      },
    }),
  })(Component);
};
