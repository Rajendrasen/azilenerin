import gql from 'graphql-tag';

export const getContactDetails = gql`
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
  }
`;
