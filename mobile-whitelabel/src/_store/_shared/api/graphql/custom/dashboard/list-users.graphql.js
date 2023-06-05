import gql from 'graphql-tag';

export const ListUsers = gql`
  query ListUsers($filter: TableUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        emailAddress
        departmentId
        department {
          id
          name
        }
        ytdReferralCount
        totalReferrals
        role
      }
      nextToken
    }
  }
`;
