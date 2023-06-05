import gql from 'graphql-tag';

export const queryCustomPage = gql`
  query QueryCustomPageByCompanyIdIndex(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryCustomPageByCompanyIdIndex(
      companyId: $companyId
      first: $first
      after: $after
    ) {
      items {
        id
        companyId
        content
        dateCreated
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
