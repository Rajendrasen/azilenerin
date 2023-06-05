import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { listDepartments } from '../../graphql/custom/departments/list-departments.graphql';
import { createDepartment } from '../../graphql/custom/departments/create-department.graphql';
import { updateDepartment } from '../../graphql/custom/departments/update-department.graphql';
import uuid from 'uuid/v4';

export const withListDepartment = Component => {
  return compose(
    graphql(gql(listDepartments), {
      options: props => ({
        variables: {
          filter: {
            companyId: { eq: props.currentUser.companyId },
            active: { eq: true },
          },
          limit: 10000,
          nextToken: null,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => ({
        departments: props.data.listDepartments ? props.data.listDepartments.items : undefined,
      }),
    }),
    graphql(gql(createDepartment), {
      props: props => ({
        onCreateDepartment: input => {
          const optimisticResponseData = {
            ...input.input,
            id: uuid(),
            totalUsers: 0,
            __typename: 'Department',
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typeName: 'Mutation',
              createDepartment: {
                __typename: 'createDepartment',
                ...optimisticResponseData,
              },
            },
            update: (proxy, { data: { createDepartment } }) => {
              const data = proxy.readQuery({
                query: gql(listDepartments),
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.company.id },
                    active: { eq: true },
                  },
                  limit: 200,
                  nextToken: null,
                },
              });
              if (!data.listDepartments.items.find(dept => dept.id === createDepartment.id)) {
                data.listDepartments.items.push(createDepartment);
              }
              proxy.writeQuery({
                query: gql(listDepartments),
                data,
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.company.id },
                    active: { eq: true },
                  },
                  limit: 200,
                  nextToken: null,
                },
              });
            },
          });
        },
      }),
    }),
    graphql(gql(updateDepartment), {
      props: props => ({
        onUpdateDepartment: input => {
          const optimisticResponseData = {
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typeName: 'Mutation',
              updateDepartment: {
                ...optimisticResponseData,
                __typename: 'updateDepartment',
              },
            },
            update: (proxy, { data: { updateDepartment } }) => {
              const data = proxy.readQuery({
                query: gql(listDepartments),
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                    active: { eq: true },
                  },
                  limit: 200,
                  nextToken: null,
                },
              });

              data.listDepartments.items = data.listDepartments.items.filter(
                department => department.id !== updateDepartment.id
              );
              proxy.writeQuery({
                query: gql(listDepartments),
                data,
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                    active: { eq: true },
                  },
                  limit: 200,
                  nextToken: null,
                },
              });
            },
          });
        },
      }),
    })
  )(Component);
};
