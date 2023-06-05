import gql from 'graphql-tag';

// export const getCompanyByHost = gql`
//   query GetCompanyByHost($host: String!) {
//     getCompanyByHost(host: $host) {
//       id
//       name
//       defaultBonusAmount
//       labelEmployeeID
//       contactIncentiveBonus
//       websiteUrl
//       dashboardReferralPolicyText
//       bonusEarnedNote
//       allowSelfReferrals
//       dateCreated
//       brandColor
//       logo {
//         bucket
//         region
//         key
//         __typename
//       }
//       disableSmartReferrals
//       disableSAMLLogin
//       disableClaimYourAccountLogin
//       confirmCompliance
//       ssoGoogleDomain
//       confirmContactEmails
//       whiteLabel
//       theme
//       symbol {
//         bucket
//         region
//         key
//         __typename
//       }
//       background {
//         bucket
//         region
//         key
//         __typename
//       }
//       errorImage {
//         bucket
//         region
//         key
//         __typename
//       }
//       host
//       allowSelfReferralsInternalLink
//       accountType
//       bonusReportSetting
//       referralBonusNotificationRecipients
//       jobNotificationSetting
//       externalUserSignUp
//       __typename
//     }
//   }
// `;

export const getCompanyByHost = gql`
  query GetCompanyByHost($host: String!) {
    getCompanyByHost(host: $host) {
      id
      name
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      dashboardReferralPolicyText
      bonusEarnedNote
      allowSelfReferrals
      dateCreated
      brandColor
      logo {
        bucket
        region
        key
      }
      shareLogo {
        bucket
        region
        key
      }
      disableSmartReferrals
      disableSAMLLogin
      disableClaimYourAccountLogin
      confirmCompliance
      ssoGoogleDomain
      sftpFolderName
      confirmContactEmails
      whiteLabel
      theme
      symbol {
        bucket
        region
        key
      }
      background {
        bucket
        region
        key
      }
      errorImage {
        bucket
        region
        key
      }
      host
      allowSelfReferralsInternalLink
      accountType
      automationSettings
      ownershipSettings
      bonusReportSetting
      referralBonusNotificationRecipients
      jobNotificationSetting
      externalUserSignUp
      hideLoginForm
    showPoweredByErin
      appStoreUrls {
        ios
        android
      }
      disableSite
      hideInterestedForGroup
      senderEmailAddress
      whiteLabelServiceName
      hideShareLinkForDepartment
      hideShareLinkNoPublicUrl
      hideDateCreatedJobDetails
      subCompanyLabel
      defaultLocation
      enableAppReview
      labelEmployeeID
      favicon {
        bucket
        region
        key
      }
      faviconTitle
    }
  }
`;
