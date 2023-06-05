import gql from 'graphql-tag';

export const getTopReferrers = gql`
  query GetTopReferrers($companyId: ID!) {
    getTopReferrers(companyId: $companyId) {
      id
      firstName
      lastName
      role
      userGroupId
      totalReferrals
      dateCreated
      __typename
    }
  }
`;

export const getDashboardDepartments = gql`
  query ListDepartments(
    $filter: TableDepartmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
        name
        active
        totalUsers
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const listDashboardReferrals = gql`
  query ListReferrals(
    $filter: TableReferralFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReferrals(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        contact {
          lastName
          firstName
          __typename
        }
        hireDate
        referralDate
        referralType
        status
        bonusStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getDbReferrals = gql`
  query GetDbReferrals($companyId: ID!, $userId: ID) {
    getDbReferrals(companyId: $companyId, userId: $userId) {
      acceptedReferrals
      referrals
      __typename
    }
  }
`;

export const getOpenJobsCountByCompany = gql`
  query getOpenJobsCountByCompany($companyId: ID!) {
    getOpenJobsCountByCompany(companyId: $companyId) {
      bonusJobs
      bonusReferral
      bonuses
      dashboardLastUpdated
      employees
      openJobs
      __typename
    }
  }
`;

export const getDashboardUser = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      accountClaimId
      cognitoId
      companyId
      firstName
      lastName
      role
      userGroupId
      emailAddress
      avatar {
        key
        region
        bucket
      }
      managedDepartments {
        id
        userId
        departmentId
        department {
          id
          name
        }
      }
      lastNotificationCheck
      incentiveEligible
      lastLogin
      totalReferrals
      ranking
      previousRanking
      createdById
      connectedApps
      active
      departmentId
      points
      pointsRanking
    }
  }
`;
