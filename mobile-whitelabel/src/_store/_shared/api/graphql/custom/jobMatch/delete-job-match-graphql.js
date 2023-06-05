export const deleteJobMatch = `mutation DeleteJobMatch($input: DeleteJobMatchInput!) {
  deleteJobMatch(input: $input) {
    contactId
    jobId
  }
}
`;
