export const listTieredBonuses = `
  query ListTieredBonuses(
    $filter: TableTieredBonusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTieredBonuses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        companyId
        name
        archived
        tiers
      }
      nextToken
    }
  }
`;
