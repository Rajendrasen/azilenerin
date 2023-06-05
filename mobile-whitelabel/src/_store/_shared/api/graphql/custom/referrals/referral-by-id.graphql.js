// import gql from 'graphql-tag';

export const GetReferral = `
  query GetReferral($id: ID!) {
    getReferral(id: $id) {
      id
      companyId
      company {
        id
        name
        websiteUrl
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        fullContactData
        dateCreated
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
      }
      user {
        id
        companyId
        emailAddress
        firstName
        lastName
        title
      }
      jobId
      job {
        id
        companyId
        departmentId
        department {
          name
        }
        title
        description
        publicLink
        salary
        location
        jobType
        hiringManagerId
        hiringManager {
          emailAddress
        }
        createdById
        referralBonus
        shares
        views
        dateCreated
      }
      status
      note
      message
      referralDate
      referralType
      hireDate
    }
  }
`;
