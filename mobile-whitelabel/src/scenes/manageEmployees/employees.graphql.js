import gql from 'graphql-tag';

export const listEmployeesQuery = gql`
  query ListReferrals($filter: TableReferralFilterInput, $limit: Int, $nextToken: String) {
    listReferrals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contact {
          id
          lastName
          firstName
        }
        userId
        user {
          id
          firstName
          lastName
          incentiveEligible
        }
        status
        referralDate
      }
      nextToken
    }
  }
`;
