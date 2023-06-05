export const createJobMatch = `mutation CreateJobMatch($input: CreateJobMatchInput!) {
  createJobMatch(input: $input) {
    id
    contactId
    jobId
  }
}
`;

