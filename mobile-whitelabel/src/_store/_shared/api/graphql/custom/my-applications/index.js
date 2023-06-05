import gql from 'graphql-tag';

export const queryReferralsByUserIdReferralTypeIndex = gql`
  query QueryReferralsByUserIdReferralTypeIndex(
    $userId: String!
    $referralType: String!
    $limit: Int
    $nextToken: String
  ) {
    queryReferralsByUserIdReferralTypeIndex(
      userId: $userId
      referralType: $referralType
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        job {
          id
          internalJobLink
          title
          __typename
        }
        id
        referralDate
        referralType
        status
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getCompanyData=gql`query GetCompanyData($companyId: ID!) {
  getCompanyData(companyId: $companyId) {
    id
    name
    defaultBonusAmount
    contactIncentiveBonus
    brandColor
    websiteUrl
    sendAdminNotificationsOnReferral
    referralBonusWaitingPeriod
    referralBonusNotificationRecipients
    dashboardReferralPolicyText
    bonusEarnedNote
    allowSelfReferrals
    allowInternalMobility
    internalMobilityImage {
      bucket
      region
      key
      __typename
    }
    dateCreated
    atsIntegration
    disableSmartReferrals
    disableSAMLLogin
    disableClaimYourAccountLogin
    disableShareLink
    disableNewReferralSMSNotification
    confirmCompliance
    ssoGoogleDomain
    confirmContactEmails
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
    whiteLabel
    enableGeneralReferrals
    enableExtendedNetwork
    enableCareerProfile
    referralStatus
    referralCustomStatuses
    referralQuestions {
      id
      companyId
      questions
      active
      isCandidate
      sortOrder
      isInterested
      isGeneral
      __typename
    }
    allowSelfReferralsInternalLink
    disableReferrals
    pointsSettings
    hideShareLinkForDepartment
    hideShareLinkNoPublicUrl
    hideDateCreatedJobDetails
    subCompanyLabel
    hideBonusFilterOnBrowseJobs
    labelDepartment
    defaultLocation
    onboarding
    labelSocialShare
    showPoweredByErin
    ownershipSettings
    __typename
  }
}
`;

export const getJob=gql`query GetJob($id: ID!) {
  getJob(id: $id) {
    id
    jobType
    dateCreated
    departmentId
    department {
      id
      name
      __typename
    }
    companyId
    company {
      id
      name
      referralBonusWaitingPeriod
      logo {
        bucket
        region
        key
        __typename
      }
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
      socialImage {
        bucket
        region
        key
        __typename
      }
      websiteUrl
      brandColor
      atsIntegration
      whiteLabel
      __typename
    }
    title
    description
    publicLink
    internalJobLink
    hideImInterested
    isGeneralReferral
    salary
    jobLevelIds
    jobLevels {
      id
      active
      name
      companyId
      __typename
    }
    location
    locations
    createdById
    createdBy {
      id
      firstName
      lastName
      __typename
    }
    hiringManagerId
    hiringManager {
      id
      emailAddress
      firstName
      lastName
      __typename
    }
    referralBonus
    notificationType
    status
    shares
    views
    externalJobId
    externalSource
    isHotJob
    subCompanyId
    subCompany {
      id
      name
      logo {
        bucket
        key
        region
        __typename
      }
      __typename
    }
    campaignId
    campaign {
      id
      name
      startDate
      endDate
      archived
      tieredBonusId
      __typename
    }
    __typename
  }
}
`;