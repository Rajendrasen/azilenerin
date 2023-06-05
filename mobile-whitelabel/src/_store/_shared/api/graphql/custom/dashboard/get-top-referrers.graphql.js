import gql from 'graphql-tag';

export const GetTopReferrers = gql`
  query GetTopReferrers($companyId: ID!) {
    getTopReferrers(companyId: $companyId) {
      id
      firstName
      lastName
      role
      totalReferrals
      __typename
    }
  }
`;
