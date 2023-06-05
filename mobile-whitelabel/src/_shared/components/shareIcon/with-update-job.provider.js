import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { updateJob } from '../../../_store/_shared/api/graphql/custom/jobs/update-job.graphql';
// import { parseJsonFields } from '../../../services/parse-api.service';


export const withUpdateJob = (Component) => {
    return compose(
        graphql(gql(updateJob), {
            props: (props) => ({
                onUpdateJob: (input) => {
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
        })
    )(Component);
};
