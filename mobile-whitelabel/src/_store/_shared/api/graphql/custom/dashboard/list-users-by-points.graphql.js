import gql from 'graphql-tag';

export const listUsersByPoints = gql`
  query QueryUsersByCompanyIdPointsIndex($companyId: ID!) {
    queryUsersByCompanyIdPointsIndex(companyId: $companyId) {
      items {
        id
        firstName
        lastName
        role
        userGroupId
        points
        pointsRanking
        dateCreated
        subCompanyId
        __typename
      }
      __typename
    }
  }
`;
