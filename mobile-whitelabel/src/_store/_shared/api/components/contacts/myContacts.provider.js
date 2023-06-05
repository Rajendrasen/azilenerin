import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { createContact } from '../../graphql/custom/contacts/create-contact.graphql';
import { deleteContact } from '../../graphql/custom/contacts/delete-contact.graphql';
import { queryContactsByUserIdIndex } from '../../graphql/custom/contacts/contacts-by-userId-graphql';
import uuid from 'uuid/v4';

export const withMyContacts = Component => {
  return compose(
    graphql(gql(queryContactsByUserIdIndex), {
      options: props => ({
        variables: {
          userId: props.currentUser.id,
          first: 2000,
          after: '',
          // nextToken: null,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => ({
        contacts: props.data.queryContactsByUserIdIndex
          ? props.data.queryContactsByUserIdIndex.items
          : undefined,
        refetchContacts: props.data.refetch,
        loadMore: () =>
          props.data.fetchMore({
            variables: {
              first: 2000,
              after: props.data.queryContactsByUserIdIndex.nextToken,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              // console.log(fetchMoreResult);
              if (!fetchMoreResult) return prev;
              return Object.assign({}, prev, {
                moreContacts: [
                  ...prev.queryContactsByUserIdIndex,
                  ...fetchMoreResult.queryContactsByUserIdIndex,
                ],
              });
            },
          }),
      }),
    }),
    graphql(gql(createContact), {
      props: props => ({
        ImportedCreateContact: input => {
          const optimisticResponseData = {
            id: uuid(),
            ...input.input,
            referrals: null,
            __typename: 'Contact',
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              createContact: {
                __typename: 'createContact',
                ...optimisticResponseData,
              },
            },
            update: (proxy, { data: { createContact } }) => {
              const data = proxy.readQuery({
                query: gql(queryContactsByUserIdIndex),
                variables: {
                  userId: props.ownProps.currentUser.id,
                  first: 2000,
                  after: '',
                },
              });

              if (
                !data.queryContactsByUserIdIndex.items.find(
                  contact => contact.id === createContact.id
                )
              ) {
                data.queryContactsByUserIdIndex.items.push(createContact);
              }
              proxy.writeQuery({
                query: gql(queryContactsByUserIdIndex),
                variables: {
                  userId: props.ownProps.currentUser.id,
                  first: 2000,
                  after: '',
                },
                data,
              });
            },
          });
        },
      }),
    }),
    graphql(gql(deleteContact), {
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
                query: gql(queryContactsByUserIdIndex),
                variables: {
                  userId: props.ownProps.currentUser.id,
                  first: 2000,
                  after: '',
                },
              });
              data.queryContactsByUserIdIndex.items = data.queryContactsByUserIdIndex.items.filter(
                contact => contact.id !== deleteContact.id
              );
              proxy.writeQuery({
                query: gql(queryContactsByUserIdIndex),
                data,
                variables: {
                  userId: props.ownProps.currentUser.id,
                  first: 2000,
                  after: '',
                },
              });
            },
          });
        },
      }),
    })
  )(Component);
};
