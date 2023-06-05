export const queryContactsByAtsIdIndex = `query QueryContactsByAtsIdIndex(
    $atsId: String
    $first: Int
    $after: String
  ) {
    queryContactsByAtsIdIndex(
      atsId: $atsId
      first: $first
      after: $after
    ) {
      items {
        id
        atsId
        firstName
        lastName
        accountClaimId
        accountClaim {
            id
            atsId
        }
        emailAddress
        phoneNumber
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
