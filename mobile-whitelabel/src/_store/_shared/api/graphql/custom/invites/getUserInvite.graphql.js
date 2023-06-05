import gql from 'graphql-tag';

export const GetUserInvite = gql`
  query GetUserInvite($id: ID!) {
    getUserInvite(id: $id) {
      id
      companyId
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        totalReferrals
        connectedApps
        active
        createdById
        dateCreated
      }
      emailAddress
      firstName
      lastName
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
      }
      title
      role
      dateCreated
    }
  }
`;
