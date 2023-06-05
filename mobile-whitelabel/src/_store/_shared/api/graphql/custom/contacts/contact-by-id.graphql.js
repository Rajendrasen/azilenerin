import gql from 'graphql-tag';

export const getContact = gql`
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      fullContactData
    }
  }
`;
