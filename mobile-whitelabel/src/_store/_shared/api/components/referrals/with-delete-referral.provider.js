import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { deleteReferral } from '../../graphql/mutations';

export const withDeleteReferral = Component => {
  return graphql(gql(deleteReferral), {
    props: props => ({
      onDeleteReferral: input => {
        const optimisticResponseData = {
          ...props.referral,
          ...input.input,
        };
        props.mutate({
          variables: input,
          optimisticResponse: {
            __typeName: 'Mutation',
            deleteContact: {
              ...optimisticResponseData,
              __typeName: 'deleteReferral',
            },
          },
        });
      },
    }),
  })(Component);
};
