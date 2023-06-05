import { createUserJobShare } from "../../graphql/custom/jobs/create-user-job-share";
import { updateUserJobShare } from "../../graphql/custom/jobs/update-user-job-share";
import { queryUserJobShareByUserIdIndex } from "../../graphql/custom/jobs/user-jobshare-by-user-id.graphql";
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import get from 'lodash/get';


export const withCreateUserJobShare = (Component) => {
    return compose(
        graphql(gql(queryUserJobShareByUserIdIndex), {
            options: (props) => {
                return {
                    context: {
                        headers: {
                            'x-frame-options': 'deny', // this header will reach the server
                        },
                    },
                    variables: {
                        userId: props.currentUser.id,
                    },
                    fetchPolicy: 'cache-and-network',
                };
            },
            props: (response, prev) => {
                let userJobShares = get(
                    response,
                    ['data', 'queryUserJobShareByUserIdIndex', 'items'],
                    get(prev, 'userJobShares', [])
                );
                const userJobSharesNextToken = get(
                    response,
                    ['data', 'queryUserJobShareByUserIdIndex', 'nextToken'],
                    null
                );
                const onFetchMoreUserJobShares = makeOnFetchMoreUserJobShares(
                    response.data.fetchMore,
                    userJobSharesNextToken
                );

                if (onFetchMoreUserJobShares) {
                    onFetchMoreUserJobShares();
                }

                return {
                    userJobShares,
                    onFetchMoreUserJobShares,
                    userJobSharesNextToken,
                };
            },
        }),
        graphql(gql(createUserJobShare), {
            props: (props) => ({
                onCreateUserJobShare: (input) => {
                    const optimisticResponseData = {
                        ...input,
                    };
                    return props.mutate({
                        variables: { input },
                        optimisticResponse: {
                            __typename: 'Mutation',
                            createUserJobShare: {
                                ...optimisticResponseData,
                                __typename: 'UserJobShare',
                            },
                        },
                        refetchQueries: [
                            {
                                query: gql(queryUserJobShareByUserIdIndex),
                                variables: { userId: props.ownProps.currentUser.id },
                            },
                        ],
                        // update: (proxy, { data: { createUserJobShare } }) => {
                        //   const data = proxy.readQuery({
                        //     query: gql(queryUserJobShareByUserIdIndex),
                        //     variables: {
                        //         userId: props.ownProps.currentUser.id
                        //     },
                        //   });

                        // if (
                        //   !data.queryUserJobShareByUserIdIndex.items.find(
                        //     (userJobShare) => userJobShare.id === createUserJobShare.id
                        //   )
                        // ) {
                        //   console.log('createUserJobShare ',createUserJobShare);
                        //   data.queryUserJobShareByUserIdIndex.items.push(createUserJobShare);
                        // }
                        // proxy.writeQuery({
                        //   query: gql(queryUserJobShareByUserIdIndex),
                        //   variables: {
                        //       userId: props.ownProps.currentUser.id,
                        //   },
                        //   data,
                        // });
                        //},
                    });
                },
            }),
        }),
        graphql(gql(updateUserJobShare), {
            props: (props) => ({
                onUpdateUserJobShare: (input) => {
                    const optimisticResponseData = {
                        ...input,
                    };
                    return props.mutate({
                        variables: { input },
                        optimisticResponse: {
                            __typename: 'Mutation',
                            updateUserJobShare: {
                                ...optimisticResponseData,
                                __typename: 'UserJobShare',
                            },
                        },
                        refetchQueries: [
                            {
                                query: gql(queryUserJobShareByUserIdIndex),
                                variables: { userId: props.ownProps.currentUser.id },
                            },
                        ],
                    });
                },
            }),
        })
    )(Component);
};


const makeOnFetchMoreUserJobShares = (fetchMore, nextToken) => {
    if (!nextToken) {
        return null;
    }
    return () => {
        fetchMore({
            variables: { after: nextToken },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    return prev;
                }
                return {
                    ...prev,
                    loading: false,
                    queryUserJobShareByUserIdIndex: {
                        ...prev.queryUserJobShareByUserIdIndex,
                        ...fetchMoreResult.queryUserJobShareByUserIdIndex,
                        items: [
                            ...prev.queryUserJobShareByUserIdIndex.items,
                            ...fetchMoreResult.queryUserJobShareByUserIdIndex.items,
                        ],
                    },
                };
            },
        });
    };
};