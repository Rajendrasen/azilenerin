export const listContacts = `query ListContacts(
  $filter: TableContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      importMethod
      fullContactData
      dateCreated
      referrals {
        id
      }
    }
    nextToken
  }
}
`;
