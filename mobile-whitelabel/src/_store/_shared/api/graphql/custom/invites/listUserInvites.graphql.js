import gql from 'graphql-tag';

export const ListUserInvites = gql`
  query ListUserInvites($filter: TableUserInviteFilterInput, $limit: Int, $nextToken: String) {
    listUserInvites(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        emailAddress
        firstName
        lastName
        title
        dateCreated
      }
      nextToken
    }
  }
`;
