export const queryUserJobShareByUserIdIndex = `query QueryUserJobShareByUserIdIndex(
    $userId: ID!
    $first: Int
    $after: String
  ) {
    queryUserJobShareByUserIdIndex(
      userId: $userId
      first: $first
      after: $after
    ) {
        items {
            id
            userId
            user {
              id
              firstName
              lastName
            }
            jobId
            job {
              id
              title
            }
            facebookSharesCount
            twitterSharesCount
            linkedinSharesCount
            whatsAppSharesCount
            companyId
            facebookShareLastDate
            twitterShareLastDate
            linkedinShareLastDate
            whatsAppShareLastDate
            shareCountByMobile
            shareDateByMobile
          }
          nextToken
    }
  }
  `;
