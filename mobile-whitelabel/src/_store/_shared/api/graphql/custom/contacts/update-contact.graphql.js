export const updateContact = `mutation UpdateContact($input: UpdateContactInput!) {
  updateContact(input: $input) {
    id
    firstName
    lastName
    emailAddress
    socialMediaAccounts
    phoneNumber
    jobHistory
    importMethod
    fullContactData
    dateCreated
  }
}
`;
