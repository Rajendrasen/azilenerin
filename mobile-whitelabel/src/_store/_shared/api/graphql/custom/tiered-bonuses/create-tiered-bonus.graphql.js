export const createTieredBonus = `mutation CreateTieredBonus($input: CreateTieredBonusInput!) {
  createTieredBonus(input: $input) {
    id
    companyId
    name
    tiers
  }
}`;
