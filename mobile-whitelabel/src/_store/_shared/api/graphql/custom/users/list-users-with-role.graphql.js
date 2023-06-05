import gql from 'graphql-tag';

export const ListUsersWithRole = gql`
  query ListUsers($filter: TableUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        department {
          id
          name
        }
        lastLogin
        lastNotificationCheck
        totalReferrals
        active
        role
      }
      nextToken
    }
  }
`;
