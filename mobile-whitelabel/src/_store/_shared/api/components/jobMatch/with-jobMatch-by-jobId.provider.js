import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { JobMatchesByJobId } from '../../graphql/custom/jobMatch/jobmatch-by-jobId-graphql';
import { updateJobMatch } from '../../graphql/mutations';
import { get } from 'lodash';

export const withJobMatchByJobId = (Component, variables) => {
  return compose(
    graphql(JobMatchesByJobId, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => {
        let matchById = get(props, 'data.queryJobMatchesByJobIdIndex.items', []);
        const filteredMatches = matchById.filter(
          match => match.userId === props.ownProps.currentUser.id
        );
        return {
          jobMatches: filteredMatches,
        };
      },
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
            //start
            update: proxy => {
              const data = proxy.readQuery({
                query: JobMatchesByJobId,
                variables,
              });
              proxy.writeQuery({
                query: JobMatchesByJobId,
                data,
                variables,
              });
            },
            //end
          });
        },
      }),
    })
  )(Component);
};
