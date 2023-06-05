import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { GetCompanySettings } from '../../graphql/custom/company/company-with-userDepartments.graphql';
import { compose } from 'react-apollo';
import { updateCompany } from '../../graphql/custom/company/updateCompany.graphql';

export const withGetCompany = (Component, variables) => {
  return compose(
    graphql(GetCompanySettings, {
      options: {
        variables,
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        company: props.data.getCompany ? props.data.getCompany : undefined,
      }),
    }),
    graphql(gql(updateCompany), {
      props: props => ({
        onUpdateCompany: input => {
          const optimisticResponseData = {
            ...props.ownProps.company,
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typeName: 'Mutation',
              updateCompany: {
                ...optimisticResponseData,
                __typeName: 'updateCompany',
              },
            },
            update: proxy => {
              const data = proxy.readQuery({
                query: GetCompanySettings,
                variables: { id: props.ownProps.currentUser.companyId },
              });
              proxy.writeQuery({
                query: GetCompanySettings,
                data,
                variables: { id: props.ownProps.currentUser.companyId },
              });
            },
          });
        },
      }),
    })
  )(Component);
};
