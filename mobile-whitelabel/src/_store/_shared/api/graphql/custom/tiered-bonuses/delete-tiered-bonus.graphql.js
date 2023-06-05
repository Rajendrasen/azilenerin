export const deleteTieredBonus = `mutation DeleteTieredBonus($input: DeleteTieredBonusInput!) {
  deleteTieredBonus(input: $input) {
    id
    companyId
    name
    archived
    tiers
  }
}`;
