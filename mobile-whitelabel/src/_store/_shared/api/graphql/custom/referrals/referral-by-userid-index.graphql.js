import gql from "graphql-tag";

export const queryReferralsByUserIdIndex = gql`query QueryReferralsByUserIdIndex(
    $userId: ID!
    $first: Int
    $after: String
  ) {
    queryReferralsByUserIdIndex(
      userId: $userId
      first: $first
      after: $after
    ) {
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
            }
            companyId
            company {
              id
              name
              whiteLabel
              host
              senderEmailAddress
              whiteLabelServiceName
            }
            contactId
            contact {
              id
              emailAddress
              lastName
              firstName
              socialMediaAccounts
              phoneNumber
            }
            userId
            user {
              id
              firstName
              lastName
              incentiveEligible
              userGroupId
              userGroup {
                id
                measurement
                name
                currency
              }
              avatar {
                bucket
                region
                key
              }
              languageCode
            }
            campaignId
            campaign {
            id
            name
            startDate
            endDate
            archived
            tieredBonusId
          }
            jobId
            job {
              id
              title
              createdById
              companyId
              company {
                  id
                  contactIncentiveBonus
              }
              createdBy {
              id
              firstName
              lastName
              }
              location
              departmentId
              department {
                id
                name
              }
              referralBonus
              campaignId
              campaign {
              id
              name
              startDate
              endDate
              archived
              tieredBonusId
            }
            }
            note
            message
            hireDate
            referralDate
            referralType
            status
            adminNote
            questionsData
            bonusStatus
            customStatus
            contactResume {
              bucket
              region
              key
            }
          }
          nextToken
    }
  }
  `;
