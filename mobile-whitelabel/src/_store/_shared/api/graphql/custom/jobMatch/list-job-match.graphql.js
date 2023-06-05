export const listJobMatches = `query ListJobMatches(
  $filter: TableJobMatchFilterInput
  $limit: Int
  $nextToken: String
) {
  listJobMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      contactId
      userId
      jobId
      relevance
      dateCreated
      matchStatus
    }
    nextToken
  }
}
`;
