import gql from 'graphql-tag';

export const ListJobs = gql`
  query ListJobs(
    $filter: TableJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
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
        referralBonus
        description
        publicLink
        location
        shares
        views
        status
        dateCreated
      }
      nextToken
    }
  }
`;

export const queryJobsByCompanyIdDateIndex = gql`
  query QueryJobsByCompanyIdDateIndex(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryJobsByCompanyIdDateIndex(
      companyId: $companyId
      first: $first
      after: $after
    ) {
      items {
        id
        companyId
        externalJobId
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
        referralBonus
        description
        publicLink
        location
        shares
        views
        status
        dateCreated
      }
      nextToken
    }
  }
`;

export const queryJobsByCompanyIdDateIndexOnlyIds = gql`
  query QueryJobsByCompanyIdDateIndex(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryJobsByCompanyIdDateIndex(
      companyId: $companyId
      first: $first
      after: $after
    ) {
      items {
        id
      }
      nextToken
    }
  }
`;

export const listSubCompanies = gql`
  query ListSubCompanies(
    $filter: TableSubCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
        keywords
        name
        logo {
          bucket
          region
          key
          __typename
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;


// export const listSubCompanies = gql`
//   query QuerySubCompanyByCompanyIdIndex($companyId: ID!
//     $first: Int
//     $after: String) {
//     querySubCompanyByCompanyIdIndex(
//       companyId: $companyId
//       first: $first
//       after: $after
//     ) {
//       items {
//         id
//         companyId
//         keywords
//         logo {
//           bucket
//           region
//           key
//         }
//         name
//       }
//     }
//   }
// `;

