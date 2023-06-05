import gql from 'graphql-tag';

export const GetAccountClaimByEmployeeId = gql`
  query GetAccountClaimByEmployeeIdDOB(
    $employeeId: String!
    $dateOfBirth: String
  ) {
    getAccountClaimByEmployeeIdDOB(
      employeeId: $employeeId
      dateOfBirth: $dateOfBirth
    ) {
      id
      active
      claimed
      eligible
      companyId
      company {
        id
        theme
        symbol {
          bucket
          region
          key
          __typename
        }
        background {
          bucket
          region
          key
          __typename
        }
        errorImage {
          bucket
          region
          key
          __typename
        }
        logo {
          bucket
          region
          key
          __typename
        }
       userSignupSettings
        whiteLabel
        brandColor
        __typename
      }
      dateOfBirth
      employeeId
      firstName
      subCompanyId
      lastName
     
      title
      userId
      department
      group
      __typename
    }
  }
`;
