import gql from 'graphql-tag';

export const ListUsers = gql`
  query ListUsers(
    $filter: TableUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        avatar {
          bucket
          region
          key
        }
        cognitoId
        companyId
        company {
          id
          name
        }
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
        dateCreated
        role
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
      }
      nextToken
    }
  }
`;

export const listUserGroups = gql`
  query ListUserGroups(
    $filter: TableUserGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
        name
        active
        currency
      }
      nextToken
    }
  }
`;

export const queryUsersByCompanyIdRoleIndex = gql`
  query QueryUsersByCompanyIdRoleIndex(
    $companyId: ID!
    $role: String
    $first: Int
    $after: String
  ) {
    queryUsersByCompanyIdRoleIndex(
      companyId: $companyId
      role: $role
      first: $first
      after: $after
    ) {
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
          __typename
        }
        lastLogin
        lastNotificationCheck
        incentiveEligible
        totalReferrals
        active
        role
        userGroupId
        dateCreated
        __typename
      }
      nextToken
      __typename
    }
  }
`;
