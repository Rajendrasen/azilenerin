export const updateCompany = `mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    id
    name
    defaultBonusAmount
    allowSelfReferrals
    contactIncentiveBonus
    websiteUrl
  }
}
`;
