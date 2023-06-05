export const updateDepartment = `mutation UpdateDepartment($input: UpdateDepartmentInput!) {
  updateDepartment(input: $input) {
    id
    companyId
    name
    active
    totalUsers
  }
}
`;
