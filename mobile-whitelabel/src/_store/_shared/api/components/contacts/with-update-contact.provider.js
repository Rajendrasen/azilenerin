import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
//import { updateContact } from '../../graphql/mutations';
import { updateContact } from './contactMutation';
// import { getContact } from '../../graphql/queries';

export const withUpdateContact = Component => {
  return graphql(gql(updateContact), {
    props: props => ({
      onUpdate: input => {
        const optimisticResponseData = {
          ...props.contact,
          ...input.input,
        };
        props.mutate({
          variables: input,
          optimisticResponse: {
            __typename: 'Mutation',
            updateContact: {
              ...optimisticResponseData,
              __typeName: 'updateContact',
            },
          },
        });
      },
      update: props.mutate,
    }),
  })(Component);
};
