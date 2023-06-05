import gql from 'graphql-tag';

export const ListReferralsDashboard = gql`
query ListReferrals(
  $filter: TableReferralFilterInput
  $limit: Int
  $nextToken: String
) {
  listReferrals(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      bonuses {
        id
        amountDue
        bonusStatus
        companyId
        contactId
        earnedDate
        hireDate
        jobId
        payment
        recipientType
        referralId
        startDate
        userId
        notes
        __typename
      }
      company {
        id
        defaultBonusAmount
        contactIncentiveBonus
      }
      companyId
      contactId
      contact {
        id
        emailAddress
        lastName
        firstName
        socialMediaAccounts
        phoneNumber
        jobHistory
        fullContactData
      }
      questionsData
      bonusStatus
      contactResume {
        bucket
        region
        key
        __typename
      }
      userId
      user {
        id
        firstName
        lastName
        incentiveEligible
        userGroupId
      }
      jobId
      job {
        id
        companyId
        company {
          id
          referralBonusWaitingPeriod
        }
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          referralType
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          companyId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      note
      message
      referralDate
      referralType
      status
      customStatus
      hireDate
    }
    nextToken
  }
}
`;