import gql from 'graphql-tag';

export const updateContactQuery = gql`
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      onDeckStatus
    }
  }
`;
