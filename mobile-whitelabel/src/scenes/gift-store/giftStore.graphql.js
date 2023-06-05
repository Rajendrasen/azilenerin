import gql from 'graphql-tag';

export const GetCompanyPointsData = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      id
      pointsSettings
      giftCardStoreAPIKeys {
        region
        apiKey
      }
      giftCardStoreBalance
    }
  }
`;

export const getUserPoints = gql`query GetUserPoints($id: ID!) {
    getUserPoints(id: $id) {
      id
      points
    }
  }
  `;

