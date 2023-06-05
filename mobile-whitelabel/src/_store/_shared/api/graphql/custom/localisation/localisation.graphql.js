import gql from 'graphql-tag';
export const listMultiLingual = gql`
  query ListMultiLingual($filter: TableMultiLingualFilterInput, $limit: Int, $nextToken: String) {
    listMultiLingual(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        key
        languageCode
        module
        text
      }
      nextToken
    }
  }
`;
