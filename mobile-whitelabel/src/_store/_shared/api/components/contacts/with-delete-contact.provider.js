import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { deleteContact } from '../../graphql/mutations';
import { listContacts } from '../../graphql/queries';

export const withDeleteContact = Component => {
  return graphql(gql(deleteContact), {
    props: props => ({
      onDeleteContact: input => {
        const optimisticResponseData = {
          ...props.contact,
          ...input.input,
        };
        props.mutate({
          variables: input,
          optimisticResponse: {
            __typeName: 'Mutation',
            deleteContact: {
              ...optimisticResponseData,
              __typeName: 'deleteContact',
            },
          },
          update: (proxy, { data: { deleteContact } }) => {
            const data = proxy.readQuery({
              query: gql(listContacts),
              variables: {
                filter: {
                  userId: { eq: props.ownProps.currentUser.id },
                },
                limit: 1000,
                nextToken: null,
              },
            });

            data.listContacts.items = data.listContacts.items.filter(
              contact => contact.id !== deleteContact.id
            );

            proxy.writeQuery({
              query: gql(listContacts),
              variables: {
                filter: {
                  userId: { eq: props.ownProps.currentUser.id },
                },
                limit: 1000,
                nextToken: null,
              },
              data,
            });
          },
        });
      },
    }),
  })(Component);
};
