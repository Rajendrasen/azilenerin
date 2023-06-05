import gql from 'graphql-tag';
export const queryUserInvitesByCompanyId = gql`
  query QueryUserInvitesByCompanyId($companyId: ID!, $first: Int, $after: String) {
    queryUserInvitesByCompanyId(companyId: $companyId, first: $first, after: $after) {
      items {
        id
        userId
        emailAddress
        firstName
        lastName
        title
        dateCreated
        departmentId
      }
      nextToken
    }
  }
`;
export const queryUsersByCompanyIdIndex = gql`
  query QueryUsersByCompanyIdIndex($companyId: ID!, $first: Int, $after: String) {
    queryUsersByCompanyIdIndex(companyId: $companyId, first: $first, after: $after) {
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
        incentiveEligible
        totalReferrals
        active
        role
        userGroupId
        dateCreated
      }
      nextToken
    }
  }
`;
