import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { GetUserByIdWithReferrals } from '../../graphql/custom/users/user-by-id-with-referrals.graphql';
import { compose } from 'react-apollo';
import { createUserDepartment, deleteUserDepartment } from '../../graphql/mutations';
import { updateUser } from '../../graphql/custom/users/updateUser.graphql';
import uuid from 'uuid/v4';
import { get } from 'lodash';

export const withUserById = (Component, variables) => {
  return compose(
    graphql(GetUserByIdWithReferrals, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => ({
        user: props.data.getUser ? props.data.getUser : undefined,
      }),
    }),
    graphql(gql(updateUser), {
      props: props => ({
        onUpdate: input => {
          const optimisticResponseData = {
            ...props.ownProps.user,
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
                query: GetUserByIdWithReferrals,
                variables: { id: props.ownProps.user.id },
              });
              proxy.writeQuery({
                query: GetUserByIdWithReferrals,
                data,
                variables: { id: props.ownProps.user.id },
              });
            },
          });
        },
      }),
    }),
    graphql(gql(createUserDepartment), {
      options: {
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        onAddDepartment: input => {
          const optimisticResponseData = {
            ...input,
            id: uuid(),
            user: props.ownProps.user,
            department: get(props, 'ownProps.departments', []).find(
              dept => dept.id === input.departmentId
            ),
          };

          props.mutate({
            variables: { input },
            optimisticResponse: {
              __typename: 'Mutation',
              createUserDepartment: {
                ...optimisticResponseData,
                __typename: 'createUserDepartment',
              },
            },
            update: (proxy, { data: { createUserDepartment } }) => {
              const data = proxy.readQuery({
                query: GetUserByIdWithReferrals,
                variables: { id: input.userId },
              });

              // for some reason this update ran one too many times
              // those causing duplicates so let's check to see if it exists
              if (
                !data.getUser.managedDepartments.find(dept => dept.id === createUserDepartment.id)
              ) {
                data.getUser.managedDepartments.push(createUserDepartment);
              }

              proxy.writeQuery({
                query: GetUserByIdWithReferrals,
                data,
                variables: { id: input.userId },
              });
            },
          });
        },
      }),
    }),
    graphql(gql(deleteUserDepartment), {
      props: props => ({
        onDeleteDepartment: input => {
          const deletedDepartment = props.ownProps.user.managedDepartments.find(
            dept => dept.id === input.input.id
          );
          const optimisticResponseData = {
            ...input,
            ...deletedDepartment,
            user: props.ownProps.user,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              deleteUserDepartment: {
                ...optimisticResponseData,
              },
            },
            update: (proxy, { data: { deleteUserDepartment } }) => {
              const data = proxy.readQuery({
                query: GetUserByIdWithReferrals,
                variables: { id: props.ownProps.user.id },
              });
              data.getUser.managedDepartments = data.getUser.managedDepartments.filter(
                dept => dept.id !== deleteUserDepartment.id
              );
              proxy.writeQuery({
                query: GetUserByIdWithReferrals,
                data,
                variables: { id: props.ownProps.user.id },
              });
            },
          });
        },
      }),
    })
  )(Component);
};
