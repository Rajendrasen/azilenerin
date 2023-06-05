import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { updateReferral } from '../../graphql/mutations';
import { updateJobBrowseJobs } from '../../graphql/custom/jobs/update-job-browseJobs.graphql';
import { GetJob } from '../../graphql/custom/jobs/job-by-id-browse-jobs.graphql';
import { listDepartments } from '../../graphql/queries';
import { get } from 'lodash';
import { parseJsonFields } from '../../../services/parse-api.service';

export const withJobByIdBrowseJobs = (Component, variables) => {
  return compose(
    graphql(GetJob, {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => {
        let job = get(props, 'data.getJob', undefined);
        if (job) {
          job = Object.assign(job, parseJsonFields(['location', 'salary', 'referralBonus'], job));
        }
        return {
          currentJob: job,
        };
      },
    }),
    graphql(gql(listDepartments), {
      options: { variables, fetchPolicy: 'cache-and-network' },
      props: props => ({
        departments: props.data.listDepartments ? props.data.listDepartments.items : [],
      }),
    }),

    graphql(gql(updateJobBrowseJobs), {
      options: {
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        onUpdateJob: input => {
          const optimisticResponseData = {
            ...input,
          };
          return props.mutate({
            variables: { input },
            optimisticResponse: {
              __typename: 'Mutation',
              updateJob: {
                ...optimisticResponseData,
                __typename: 'updateJob',
              },
            },
          });
        },
      }),
    }),
    graphql(gql(updateReferral), {
      props: props => ({
        onUpdateReferral: input => {
          const optimisticResponseData = {
            ...input.input,
          };
          props.mutate({
            variables: input,
            optimisticResponse: {
              __typename: 'Mutation',
              updateReferral: {
                ...optimisticResponseData,
                __typename: 'updateReferral',
              },
            },
          });
        },
      }),
    })
  )(Component);
};
