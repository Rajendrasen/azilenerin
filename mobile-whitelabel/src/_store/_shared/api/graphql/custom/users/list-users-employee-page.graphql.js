import gql from 'graphql-tag';

export const ListUsers = gql`
  query ListUsers($filter: TableUserFilterInput, $limit: Int, $nextToken: String) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        avatar {
          bucket
          region
          key
        }
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        department {
          name
        }
        lastLogin
        lastNotificationCheck
        dateCreated
      }
      nextToken
    }
  }
`;
