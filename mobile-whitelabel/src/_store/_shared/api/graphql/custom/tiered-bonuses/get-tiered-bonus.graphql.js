export const getTieredBonus = `query GetTieredBonus($id: ID!, $companyId: ID!) {
  getTieredBonus(id: $id, companyId: $companyId) {
    id
    companyId
    name
    archived
    tiers
  }
}`;
