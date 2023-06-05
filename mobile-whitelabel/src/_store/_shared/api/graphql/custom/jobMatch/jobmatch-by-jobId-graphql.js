import gql from 'graphql-tag';

export const JobMatchesByJobId = gql`
  query QueryJobMatchesByJobIdIndex($jobId: ID!, $first: Int, $after: String) {
    queryJobMatchesByJobIdIndex(jobId: $jobId, first: $first, after: $after) {
      items {
        id
        contactId
        jobId
        dateCreated
        relevance
        matchStatus
        userId
      }
      nextToken
    }
  }
`;
