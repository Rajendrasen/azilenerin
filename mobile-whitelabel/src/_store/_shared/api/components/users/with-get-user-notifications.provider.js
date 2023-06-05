import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { queryWebNotificationsByUserIdIndex } from '../../graphql/custom/users/query-webnotifications-by-userid.graphql';
import { updateUser } from '../../graphql/custom/users/updateUser.graphql';
import { GetUserByCognitoId } from '../../graphql/custom/users/getUserByCognitoId';

export const withGetUserNotifications = Component => {
  return compose(
    graphql(gql(queryWebNotificationsByUserIdIndex), {
      options: props => ({
        variables: {
          userId: props.currentUser ? props.currentUser.id : props.user.currentUser.id,
          first: 1000,
          nextToken: null,
        },
        pollInterval: 5000,
        fetchPolicy: 'cache-and-network',
      }),
      props: props => ({
        userNotifications: props.data.queryWebNotificationsByUserIdIndex
          ? props.data.queryWebNotificationsByUserIdIndex.items
          : undefined,
          loading: props.data.loading
      }),
    }),
    graphql(GetUserByCognitoId, {
      options: props => ({
        variables: {
          cognitoId: props.currentUser
            ? props.currentUser.cognitoId
            : props.user.currentUser.cognitoId,
        },
      }),
      props: props => {
        return {
          lastNotificationCheck: props.data.getUserByCognitoId
            ? props.data.getUserByCognitoId.lastNotificationCheck
            : null,
        };
      },
    }),
    graphql(gql(updateUser), {
      props: props => ({
        onUpdate: input => {
          const optimisticResponseData = {
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              updateUser: {
                ...optimisticResponseData,
                __typename: 'updateUser',
              },
            },
            update: proxy => {
              const data = proxy.readQuery({
                query: gql(queryWebNotificationsByUserIdIndex),
                variables: {
                  userId: props.ownProps.currentUser
                    ? props.ownProps.currentUser.id
                    : props.ownProps.user.currentUser.id,
                  first: 1000,
                  nextToken: null,
                },
              });
              proxy.writeQuery({
                query: gql(queryWebNotificationsByUserIdIndex),
                data,
                variables: {
                  userId: props.ownProps.currentUser
                    ? props.ownProps.currentUser.id
                    : props.ownProps.user.currentUser.id,
                  first: 1000,
                  nextToken: null,
                },
              });
            },
          });
        },
        updateUser: props.mutate,
      }),
    })
  )(Component);
};
