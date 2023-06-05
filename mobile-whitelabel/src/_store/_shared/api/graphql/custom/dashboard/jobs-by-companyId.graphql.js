import gql from 'graphql-tag';

export const ListJobs = gql`
  query ListJobs($filter: TableJobFilterInput, $limit: Int, $nextToken: String) {
    listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        title
        status
        dateCreated
        id
        referralBonus
        location
      }
      nextToken
    }
  }
`;
