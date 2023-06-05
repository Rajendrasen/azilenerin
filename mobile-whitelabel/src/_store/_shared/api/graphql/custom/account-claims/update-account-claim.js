export const updateAccountClaim = `mutation UpdateAccountClaim($input: UpdateAccountClaimInput!) {
    updateAccountClaim(input: $input) {
        id
        active
        claimed
        companyId
        employeeId
        firstName
        lastName
        dateOfBirth
        userId
    }
  }
  `;
