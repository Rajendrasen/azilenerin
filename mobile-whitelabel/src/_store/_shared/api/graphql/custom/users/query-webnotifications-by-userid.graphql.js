import gql from 'graphql-tag';
export const queryWebNotificationsByUserIdIndex = `query QueryWebNotificationsByUserIdIndex(
  $userId: ID!
  $first: Int
  $after: String
) {
  queryWebNotificationsByUserIdIndex(
    userId: $userId
    first: $first
    after: $after
  ) {
    items {
      id
      type
      matches
      message
      user {
        id
        company {
          id
          name
        }
        avatar {
          bucket
          region
          key
        }
        firstName
        lastName
      }
      referralId
      referral {
        id
        user {
          id
          firstName
          lastName
        }
        contact {
          id
          firstName
          lastName
        }
      }
      jobId
      job {
        id
        title
        createdBy {
          id
          firstName
          lastName
        }
        referrals {
          id
          contactId
        }
        referralBonus
      }
      dateCreated
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
      }
      referralRequestedStatus
      requestingUserId
      requestingUser {
        id
        firstName
        lastName
        avatar {
          bucket
          region
          key
        }
      }
    }
    nextToken
  }
}
`;

export const queryWebNotificationsReferrals = gql`
  query QueryWebNotificationsByUserIdIndex(
    $userId: ID!
    $first: Int
    $after: String
  ) {
    queryWebNotificationsByUserIdIndex(
      userId: $userId
      first: $first
      after: $after
    ) {
      items {
        id
        type
        status
        user {
          id
          userGroupId
          company {
            id
            name
            __typename
          }
          subCompany {
            id
            name
            __typename
          }
          avatar {
            bucket
            region
            key
            __typename
          }
          firstName
          lastName
          __typename
        }
        referralId
        referral {
          id
          user {
            id
            firstName
            lastName
            incentiveEligible
            __typename
          }
          contact {
            id
            firstName
            lastName
            __typename
          }
          __typename
        }
        jobId
        matches
        message
        job {
          id
          title
          createdBy {
            id
            firstName
            lastName
            __typename
          }
          departmentId
          department {
            id
            name
            __typename
          }
          location
          referrals {
            id
            contactId
            __typename
          }
          referralBonus
          tieredBonus {
            id
            name
            tiers
            __typename
          }
          subCompany {
            id
            name
            __typename
          }
          __typename
        }
        dateCreated
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          __typename
        }
        referralRequestedStatus
        requestingUserId
        requestingUser {
          id
          firstName
          lastName
          avatar {
            bucket
            region
            key
            __typename
          }
          __typename
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;
