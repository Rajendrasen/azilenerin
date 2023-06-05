import gql from 'graphql-tag';

export const listSamlAuths = gql`
  query ListSAMLAuths(
    $filter: TableSAMLAuthFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSAMLAuths(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        autoCreateUsers
        clientId
        companyId
        departmentHeader
        domain
        loginButtonText
        provider
        path
        __typename
      }
      nextToken
      __typename
    }
  }
`;
