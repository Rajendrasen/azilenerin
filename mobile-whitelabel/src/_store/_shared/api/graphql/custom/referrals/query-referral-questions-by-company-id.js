import gql from 'graphql-tag';

export const queryReferralQuestionsByCompanyId = gql`
  query QueryReferralQuestionsByCompanyId(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryReferralQuestionsByCompanyId(
      companyId: $companyId
      first: $first
      after: $after
    ) {
      items {
        id
        companyId
        questions
        active
        isCandidate
        sortOrder
        isInterested
        __typename
      }
      nextToken
      __typename
    }
  }
`;
