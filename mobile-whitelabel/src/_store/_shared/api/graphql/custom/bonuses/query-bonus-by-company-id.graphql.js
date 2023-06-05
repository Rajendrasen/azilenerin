import gql from 'graphql-tag';

export const queryBonusByCompanyIdIndex = gql`
  query QueryBonusByCompanyIdIndex($companyId: ID!, $first: Int, $after: String) {
    queryBonusByCompanyIdIndex(companyId: $companyId, first: $first, after: $after) {
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
