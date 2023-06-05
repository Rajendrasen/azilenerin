import gql from 'graphql-tag';

export const GetEmployeeById = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      companyId
      departmentId
      department {
        id
        name
      }
      emailAddress
      role
      firstName
      lastName
      title
      avatar {
        bucket
        key
        region
      }
      active
    }
  }
`;
