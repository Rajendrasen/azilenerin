import gql from 'graphql-tag';
export const queryOnDeckContactsByCompanyIdIndex = gql`
  query QueryOnDeckContactsByCompanyIdIndex($companyId: ID!, $first: Int, $after: String) {
    queryOnDeckContactsByCompanyIdIndex(companyId: $companyId, first: $first, after: $after) {
      items {
        id
        firstName
        lastName
        onDeckDate
        userId
        user {
          id
          firstName
          lastName
        }
        referrals {
          id
          job {
            id
          }
        }
      }
      nextToken
    }
  }
`;

export const listOnDeckContacts = gql`
  query ListOnDeckContacts($filter: TableContactFilterInput, $limit: Int, $nextToken: String) {
    listOnDeckContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
        firstName
        lastName
        emailAddress
        phoneNumber
        userId
        user {
          id
          firstName
          lastName
          title
          userGroupId
          currency
        }
        referrals {
          id
          contactId
        }
        importMethod
        fullContactData
        dateCreated
        onDeckDate
        onDeckStatus
        onDeckNote
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

export const updateContactQuery = gql`
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      onDeckStatus
    }
  }
`;
