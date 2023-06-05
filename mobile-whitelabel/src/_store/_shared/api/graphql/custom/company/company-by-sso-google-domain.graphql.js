import gql from 'graphql-tag';

export const GetCompanyBySSOGoogleDomain = gql`
  query GetCompanyBySSOGoogleDomain($ssoGoogleDomain: String!) {
    getCompanyBySSOGoogleDomain(ssoGoogleDomain: $ssoGoogleDomain) {
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
      disableSmartReferrals
      disableSAMLLogin
      disableClaimYourAccountLogin
      confirmCompliance
      confirmContactEmails
      whiteLabel
      theme
      ssoGoogleDomain
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
    }
  }
`;
