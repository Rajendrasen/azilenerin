import gql from 'graphql-tag';

export const GetJob = gql`
  query GetJob($id: ID!) {
    getJob(id: $id) {
      id
      jobType
      departmentId
      department {
        id
        name
      }
      companyId
      company {
        id
        name
      }
      title
      description
      publicLink
      salary
      location
      createdById
      createdBy {
        id
        firstName
        lastName
      }
      hiringManagerId
      hiringManager {
        id
        emailAddress
        firstName
        lastName
      }
      referralBonus
      notificationType
      status
      shares
      views
    }
  }
`;
