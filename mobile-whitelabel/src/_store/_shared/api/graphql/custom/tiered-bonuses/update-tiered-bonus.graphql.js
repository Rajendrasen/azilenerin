export const updateTieredBonus = `mutation UpdateTieredBonus($input: UpdateTieredBonusInput!) {
  updateTieredBonus(input: $input) {
    id
    companyId
    name
    archived
    tiers
  }
}
`;
