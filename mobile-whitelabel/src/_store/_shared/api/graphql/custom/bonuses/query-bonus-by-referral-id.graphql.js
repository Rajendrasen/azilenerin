export const queryBonusByReferralIdIndex = `query QueryBonusByReferralIdIndex(
    $referralId: ID!
    $first: Int
    $after: String
  ) {
    queryBonusByReferralIdIndex(
      referralId: $referralId
      first: $first
      after: $after
    ) {
        items {
            id
            amountDue
            companyId
            contactId
            userId
            jobId
            referralId
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
