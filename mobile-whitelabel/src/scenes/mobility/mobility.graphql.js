import gql from 'graphql-tag';

export const queryInternalMobilityByCompanyIdIndex = gql`
  query QueryInternalMobilityByCompanyIdIndex(
$companyId: ID!
$first: Int
$after: String
) {
queryInternalMobilityByCompanyIdIndex(
companyId: $companyId
first: $first
after: $after
){
items {
id
companyId
contentFirst
contentMiddle
contentLast
dateCreated
}
nextToken
}
}
  `;


export const JobMatchesByCompanyId = gql`
  query QueryJobMatchesByCompanyIdIndex(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryJobMatchesByCompanyIdIndex(
      companyId: $companyId
      first: $first
      after: $after
    ) {
      items {
        id
        contactId
        jobId
        companyId
        dateCreated
        relevance
        matchStatus
      }
      nextToken
    }
  }
`;


