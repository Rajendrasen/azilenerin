export const createDepartment = `mutation CreateDepartment($input: CreateDepartmentInput!) {
  createDepartment(input: $input) {
    id
    companyId
    name
    active
    totalUsers
  }
}
`;
