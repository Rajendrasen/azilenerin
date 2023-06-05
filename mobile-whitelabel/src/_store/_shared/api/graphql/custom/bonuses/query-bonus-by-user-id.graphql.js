import gql from 'graphql-tag';
export const queryBonusByUserIdIndex = gql`
  query QueryBonusByUserIdIndex($userId: ID!, $first: Int, $after: String) {
    queryBonusByUserIdIndex(userId: $userId, first: $first, after: $after) {
      items {
        id
        amountDue
        companyId
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          __typename
        }
        userId
        user {
          id
          firstName
          lastName
          title
          userGroupId
          userGroup {
            id
            measurement
            name
            currency
            __typename
          }
          currency
          languageCode
          __typename
        }
        jobId
        job {
          title
          __typename
        }
        referralId
        referral {
          id
          referralDate
          __typename
        }
        hireDate
        startDate
        earnedDate
        payment
        recipientType
        bonusStatus
        notes
        __typename
      }
      nextToken
      __typename
    }
  }
`;
