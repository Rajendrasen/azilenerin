import gql from 'graphql-tag';
export const queryUserGroupsByCompanyIdIndex = gql`
  query QueryUserGroupsByCompanyIdIndex($companyId: ID!, $first: Int, $after: String) {
    queryUserGroupsByCompanyIdIndex(companyId: $companyId, first: $first, after: $after) {
      items {
        id
        companyId
        name
        active
      }
      nextToken
    }
  }
`;
