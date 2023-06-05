export const getUser = `query GetUser($id: ID!) {
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
        disableSmartReferrals
        websiteUrl
        dateCreated
        dashboardReferralPolicyText
        logo {
          key
          bucket
          region
        }
        symbol {
          key
          bucket
          region
        }
      }
      contacts {
        id
        firstName
        lastName
        importMethod
        emailAddress
        fullContactData
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
        name
      }
      lastLogin
      lastNotificationCheck
      totalReferrals
      active
      managedDepartments {
        departmentId
        department {
          id
          name
        }
      }
      connectedApps
      createdById
      ranking
      previousRanking
      incentiveEligible
      currency
      location
      userGroup{
        id
        name
      }
      referrals {
        id
        status
        referralType
        job {
          id
          referralBonus
        }
        company{
          id
          contactIncentiveBonus
        }
      }
  }
}
`;
