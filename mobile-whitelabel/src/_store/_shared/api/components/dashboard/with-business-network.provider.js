import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getBusinessNetwork } from '../../graphql/queries';

export const withBusinessNetwork = Component => {
  return graphql(gql(getBusinessNetwork), {
    options: props => ({
      variables: { companyId: props.currentUser.companyId },
      fetchPolicy: 'cache-and-network',
    }),
    props: props => {
      if (
        !props.data.loading &&
        (props.data.error || props.data.getBusinessNetwork === undefined)
      ) {
        setTimeout(props.data.refetch, 2000);
      }
      return {
        activeEmployees: props.data.getBusinessNetwork
          ? props.data.getBusinessNetwork.activeEmployees
          : 0,
        businessConnections: props.data.getBusinessNetwork
          ? props.data.getBusinessNetwork.businessConnections
          : 0,
        firstConnections: props.data.getBusinessNetwork
          ? props.data.getBusinessNetwork.firstConnections
          : 0,
        inNetworkConnections: props.data.getBusinessNetwork
          ? props.data.getBusinessNetwork.inNetworkConnections
          : 0,
      };
    },
  })(Component);
};
