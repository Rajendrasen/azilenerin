import { graphql } from 'react-apollo';
import { ListUserInvites } from '../../graphql/custom/invites/listUserInvites.graphql';

//TODO add variables when Derrick adds companyID to invites
export const withListUserInvites = (Component, variables) => {
  return graphql(ListUserInvites, {
    options: {
      fetchPolicy: 'cache-and-network',
      variables,
    },
    props: props => ({
      invites: props.data.listUserInvites ? props.data.listUserInvites.items : undefined,
      refetchInvites: (filter, limit) => {
        return props.data.refetch({
          variables: { filter, limit },
        });
      },
    }),
  })(Component);
};
