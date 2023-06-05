export const listContacts = `query ListContacts(
  $filter: TableContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      importMethod
      userId
    }
    nextToken
  }
}
`;
