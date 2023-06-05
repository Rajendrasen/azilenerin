import gql from 'graphql-tag';
export const createReferral = `mutation CreateReferral($input: CreateReferralInput!) {
  createReferral(input: $input) {
    id
    companyId
    contactId
    contact {
      id
      emailAddress
      lastName
      firstName
      socialMediaAccounts
    }
    userId
    user {
      id
      firstName
      lastName
      emailAddress
    }
    jobId
    job {
      id
      title
      departmentId
      externalSource
      externalJobId
      department {
        id
        name
      }
      referralBonus
    }
    note
    message
    referralDate
    status
    referralType
  }
}
`;

export const createWebNotification = gql`
  mutation CreateWebNotification($input: CreateWebNotificationInput!) {
    createWebNotification(input: $input) {
      id
      type
      userId
      referralRequestedStatus
      requestingUserId
      contactId
      referralId
      jobId
      matches
      message
      dateCreated
      __typename
    }
  }
`;
