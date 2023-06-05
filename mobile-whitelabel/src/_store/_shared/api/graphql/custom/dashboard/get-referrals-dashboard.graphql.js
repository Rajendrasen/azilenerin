import gql from 'graphql-tag';

export const ListDashboardReferrals = gql`
  query ListReferrals($filter: TableReferralFilterInput, $limit: Int, $nextToken: String) {
    listReferrals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        contact {
          lastName
          firstName
        }
        referralDate
      }
      nextToken
    }
  }
`;
