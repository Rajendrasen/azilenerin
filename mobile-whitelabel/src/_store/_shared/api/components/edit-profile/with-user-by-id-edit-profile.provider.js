import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { listDepartments } from '../../graphql/queries';
import { updateUser } from '../../graphql/custom/users/updateUser.graphql';
import { GetEmployeeById } from '../../graphql/custom/users/employee-by-id.graphql';

export const withUserByIdEditProfile = (Component, variables) => {
  return compose(
    graphql(GetEmployeeById, {
      options: {
        variables,
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        user: props.data.getUser ? props.data.getUser : undefined,
      }),
    }),
    graphql(gql(listDepartments), {
      options: { variables },
      props: props => ({
        departments: props.data.listDepartments ? props.data.listDepartments.items : [],
      }),
    }),
    graphql(gql(updateUser), {
      props: props => ({
        onUpdate: input =>
          props.mutate({
            variables: input,
          }),
      }),
    })
  )(Component);
};
