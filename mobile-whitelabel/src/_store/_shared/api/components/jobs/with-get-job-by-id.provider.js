import { graphql, compose } from 'react-apollo';
import { GetJob } from '../../graphql/custom/jobs/job-by-id.graphql.js';
import get from 'lodash/get';
import { parseJsonFields } from '../../../services/parse-api.service';

export const withJobById = (Component, variables) => {
  return compose(
    graphql(GetJob, {
      options: (props) => {
        return {
          variables: { id: get(props, 'jobId', 'skip') },
          fetchPolicy: 'cache-and-network',
        };
      },
      props: (response, props) => {
        let job = get(response, 'data.getJob');
        if (job) {
          job = Object.assign(
            job,
            parseJsonFields(['location', 'salary', 'referralBonus'], job)
          );
        }
        return {
          job: job,
        };
      },
    })
  )(Component);
};
