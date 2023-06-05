import gql from 'graphql-tag';

export const listDepartments = `query ListDepartments(
  $filter: TableDepartmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      companyId
      name
      active
      totalUsers
    }
    nextToken
  }
}
`;

export const queryDepartmentsByCompanyIdIndex = `query QueryDepartmentsByCompanyIdIndex(

$companyId: ID!

$first: Int

$after: String

) {

queryDepartmentsByCompanyIdIndex(

companyId: $companyId

first: $first

after: $after

) {

items {

id

companyId

name

keywords

active

totalUsers

}

nextToken

}

}

`;
