import gql from 'graphql-tag';

export const queryAnnouncementsByCompanyIdIndex = gql`
  query QueryAnnouncementsByCompanyIdIndex(
    $companyId: ID!
    $first: Int
    $after: String
  ) {
    queryAnnouncementsByCompanyIdIndex(
      companyId: $companyId
      first: $first
      after: $after
    ) {
        items {
            id
            companyId
            title
            content
            dateCreated
          }
          nextToken
    }
  }
  `;
