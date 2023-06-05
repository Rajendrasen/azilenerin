import gql from 'graphql-tag';

export const GetUserByEmailAddress = gql`
  query GetUserByEmailAddress($emailAddress: AWSEmail) {
    getUserByEmailAddress(emailAddress: $emailAddress) {
      id
      active
      companyId
      firstName
      lastName
      emailAddress
    }
  }
`;
