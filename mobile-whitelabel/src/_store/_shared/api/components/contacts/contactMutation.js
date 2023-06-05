export const updateContact = `mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      firstName
      lastName
      emailAddress
      phoneNumber
      socialMediaAccounts
      fullContactData
    }
  }
  `;
