import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { createJob } from '../../graphql/custom/jobs/create-job.graphql';
import { updateJob } from '../../graphql/custom/jobs/update-job.graphql';
import { ListJobs } from '../../graphql/custom/jobs/jobs-by-companyId.graphql.js';
import { get } from 'lodash';
import { parseJsonFields } from '../../../services/parse-api.service';

export const withListJobs = Component => {
  return compose(
    graphql(ListJobs, {
      options: props => ({
        variables: {
          filter: {
            companyId: { eq: props.currentUser.companyId },
          },
          limit: 10000,
          nextToken: props.nextToken ? props.nextToken : null,
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => {
        let jobs = get(props, 'data.listJobs.items');
        if (jobs) {
          for (let job of jobs) {
            job = Object.assign(job, parseJsonFields(['location', 'salary'], job));
          }
        }
        //new
        const nextToken = get(props, ['data', 'listJobs', 'nextToken'], null);
        const onFetchMore = makeOnFetchMore(props.data.fetchMore, nextToken);

        return {
          jobs,
          refetchJobs: (filter, limit) => {
            return props.data.refetch({
              variables: { filter, limit },
            });
          },
          onFetchMore: props.data.listJobs
            ? props.data.listJobs.nextToken
              ? onFetchMore
              : null
            : null,
          nextToken,

          //fetch more maybe
        };
      },
    }),
    graphql(gql(updateJob), {
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
    graphql(gql(createJob), {
      options: {
        fetchPolicy: 'cache-and-network',
      },
      props: props => ({
        onAddJob: input => {
          const optimisticResponseData = {
            ...input,
          };
          props.mutate({
            variables: { input },
            optimisticResponse: {
              __typename: 'Mutation',
              createJob: {
                ...optimisticResponseData,
                __typename: 'createJob',
              },
            },
            update: (proxy, { data: { createJob } }) => {
              const data = proxy.readQuery({
                query: ListJobs,
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                  },
                  limit: 1000,
                  nextToken: null,
                },
              });
              if (!data.listJobs.items.find(job => job.id === createJob.id)) {
                data.listJobs.items.push(createJob);
              }
              proxy.writeQuery({
                query: ListJobs,
                data,
                variables: {
                  filter: {
                    companyId: { eq: props.ownProps.currentUser.companyId },
                    active: { eq: true },
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

const makeOnFetchMore = (fetchMore, nextToken) => {
  if (!nextToken) {
    return null;
  }
  return () => {
    fetchMore({
      variables: { nextToken },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        if (Object.keys(prev).length > 0) {
          if (prev.listJobs.nextToken === fetchMoreResult.listJobs.nextToken) {
            return {
              ...prev,
              loading: false,
              listJobs: {
                ...prev.listJobs,
                items: [...prev.listJobs.items],
              },
            };
          }
          return {
            ...prev,
            loading: false,
            listJobs: {
              ...prev.listJobs,
              ...fetchMoreResult.listJobs,
              items: [...prev.listJobs.items, ...fetchMoreResult.listJobs.items],
            },
          };
        }
        if (Object.keys(fetchMoreResult).length > 0) {
          return {
            loading: false,
            listJobs: {
              ...fetchMoreResult.listJobs,
              items: [...fetchMoreResult.listJobs.items],
            },
          };
        }
      },
    });
  };
};
