import gql from 'graphql-tag';

export let getTotalUsers = gql`
  query GetTotalUsers($companyId: ID!) {
    getTotalUsers(companyId: $companyId) {
      finalResult
      __typename
    }
  }
`;
export let getTotalReferrals = gql`
  query GetTotalReferrals($companyId: ID!) {
    getTotalReferrals(companyId: $companyId) {
      finalResult
      __typename
    }
  }
`;
