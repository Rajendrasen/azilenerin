import gql from 'graphql-tag';

export const listWebNotifications = gql`
  query ListWebNotifications(
    $filter: TableWebNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWebNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
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
          user {
            firstName
            lastName
          }
          contact {
            firstName
            lastName
          }
        }
        jobId
        job {
          title
          createdBy {
            firstName
            lastName
          }
        }
        matches
        dateCreated
      }
      nextToken
    }
  }
`;
