export const queryContactsByUserIdIndex = `query QueryContactsByUserIdIndex(
  $userId: ID!
  $first: Int
  $after: String
) {
  queryContactsByUserIdIndex(
    userId: $userId
    first: $first
    after: $after
  ) {
    items {
      id
      firstName
      lastName
      emailAddress
      phoneNumber
      extendedUserId
      inviteStatus
      referrals {
        id
        contactId
      }
      importMethod
      fullContactData
      dateCreated
    }
    nextToken
  }
}
`;
