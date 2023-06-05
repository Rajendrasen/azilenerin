import gql from 'graphql-tag';

export const listDepartmentQuery = gql`
  query ListDepartments($filter: TableDepartmentFilterInput, $limit: Int, $nextToken: String) {
    listDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;
export const updateUserQuery = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      lastMobileLogin
      points
      pointsRanking
      languageCode
      accountClaimId
      accountClaim {
        id
        active
        eligible
        employeeId
        firstName
        lastName
        dateOfBirth
        title
        department
        atsId
        middleName
        isRehire
      }
      cognitoId
      companyId
      userGroupId
      company {
        id
        enableCustomPage
        customPageTitle
        enableCareerProfile
        hideShareLinkForDepartment
        disableReferrals
        enableExtendedNetwork
        hideBonus
        disableShareLink
        pointsSettings
        hideJobsPage
        accountType
        disableSmartReferrals
        allowSelfReferralsInternalLink
        disableManagerPermissions
        name
        enableProspectCreation
        theme
        referralStatus
        defaultBonusAmount
        enableGeneralReferrals
        allowSelfReferrals
        contactIncentiveBonus
        websiteUrl
        dateCreated
        dashboardReferralPolicyText
        confirmCompliance
        brandColor
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
      userGroup {
        id
        currency
        name
      }
    }
  }
`;
