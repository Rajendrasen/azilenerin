import gql from 'graphql-tag';

export const GetJob = gql`
  query GetJob($id: ID!) {
    getJob(id: $id) {
      id
      companyId
      externalJobId
      internalJobLink
      lat
      lng
      company {
        id
        name
        defaultBonusAmount
        contactIncentiveBonus
      }
      departmentId
      department {
        id
        name
      }
      referrals {
        id
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
        userId
        user {
          id
          firstName
          lastName
          incentiveEligible
        }
        jobId
        job {
          id
          title
          departmentId
          referralBonus
          department {
            id
            name
          }
        }
        note
        message
        referralDate
        referralType
        status
        hireDate
      }
      title
      hideImInterested
      referralBonus
      description
      publicLink
      location
      shares
      views
      status
      dateCreated
    }
  }
`;
