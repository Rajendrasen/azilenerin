export const queryBonusByContactIdIndex = `query QueryBonusByContactIdIndex(
    $contactId: ID!
    $first: Int
    $after: String
  ) {
    queryBonusByContactIdIndex(
      contactId: $contactId
      first: $first
      after: $after
    ) {
        items {
            id
            amountDue
            companyId
            contactId
            contact {
              id
              firstName
              lastName
            }
            userId
            user {
              id
              firstName
              lastName
              userGroupId
              userGroup {
                id
                name
                currency
              }
            }
            jobId
            job {
              id
              title
              referralBonus
            }
            referralId
            referral {
              id
              jobId
              referralType
              status
              bonusStatus
            }
            hireDate
            startDate
            earnedDate
            payment
            recipientType
            bonusStatus
            notes
          }
          nextToken
    }
  }
  `;
