import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import { deleteJobMatch } from '../../graphql/custom/jobMatch/delete-job-match-graphql';
import { deleteJobMatch } from '../../graphql/mutations';

export const withDeleteJobMatch = Component => {
  return graphql(gql(deleteJobMatch), {
    props: props => ({
      onDeleteJobMatch: input => {
        const optimisticResponseData = {
          ...props.jobMatch,
          ...input.input,
        };
        props.mutate({
          variables: input,
          optimisticResponse: {
            __typeName: 'Mutation',
            deleteContact: {
              ...optimisticResponseData,
              __typeName: 'deleteJobMatch',
            },
          },
        });
      },
    }),
  })(Component);
};
