import gql from 'graphql-tag';

export const GetUserInvite = gql`
  query GetUserInvite($id: ID!) {
    getUserInvite(id: $id) {
      id
      userId
      createdById
      companyId
      emailAddress
      firstName
      lastName
      title
      role
      dateCreated
    }
  }
`;
