import gql from 'graphql-tag';

export const GetUserByIdWithReferrals = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      cognitoId
      companyId
      company {
        id
        name
        defaultBonusAmount
        allowSelfReferrals
        contactIncentiveBonus
        websiteUrl
        dashboardReferralPolicyText
      }
      emailAddress
      role
      firstName
      lastName
      title
      avatar {
        bucket
        region
        key
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
      }
      managedDepartments {
        id
        userId
        departmentId
        department {
          id
          name
          companyId
          active
          totalUsers
        }
      }
      lastLogin
      lastMobileLogin
      lastNotificationCheck
      referrals {
        id
        status
        companyId
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
        }
        userId
        user {
          id
          firstName
          lastName
        }
        jobId
        job {
          id
          title
          referralBonus
        }
        referralDate
        message
        note
      }
      totalReferrals
      active
    }
  }
`;
