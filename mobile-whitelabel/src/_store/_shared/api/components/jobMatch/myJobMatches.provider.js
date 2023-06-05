import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { listJobMatches } from '../../graphql/custom/jobMatch/list-job-match.graphql';
import { updateJobMatch } from '../../graphql/mutations';

export const withMyJobMatches = Component => {
  return compose(
    graphql(gql(listJobMatches), {
      options: props => ({
        variables: {
          filter: {
            userId: { eq: props.currentUser.id },
          },
          limit: 1000,
          nextToken: null,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => ({
        jobMatches: props.data.listJobMatches ? props.data.listJobMatches.items : undefined,
      }),
    }),
    graphql(gql(updateJobMatch), {
      props: props => ({
        onUpdateMatch: input => {
          const optimisticResponseData = {
            ...props.jobMatch,
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              updateJobMatch: {
                ...optimisticResponseData,
                __typeName: 'updateJobMatch',
              },
            },
            update: proxy => {
              const data = proxy.readQuery({
                query: gql(listJobMatches),
                variables: {
                  filter: {
                    userId: { eq: props.ownProps.currentUser.id },
                  },
                  limit: 1000,
                  nextToken: null,
                },
              });
              proxy.writeQuery({
                query: gql(listJobMatches),
                data,
                variables: {
                  filter: {
                    userId: { eq: props.ownProps.currentUser.id },
                  },
                  limit: 1000,
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
