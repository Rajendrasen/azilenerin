export const getContact = `query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      userId
      phoneNumber
      jobHistory
      fullContactData
      dateCreated
      referrals {
        id
        job {
          id
          referralBonus
        }
        company{
          id
          contactIncentiveBonus
        }
      }
    }
  }
  `;
