import gql from 'graphql-tag';

export const GetCompanySettings = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      id
      name
      defaultBonusAmount
      allowSelfReferrals
      contactIncentiveBonus
      websiteUrl
      theme
    }
  }
`;
