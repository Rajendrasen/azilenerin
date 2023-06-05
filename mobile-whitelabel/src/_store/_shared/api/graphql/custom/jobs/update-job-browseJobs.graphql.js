export const updateJobBrowseJobs = `mutation UpdateJob($input: UpdateJobInput!) {
  updateJob(input: $input) {
    id
    jobType
    departmentId
    department {
      id
      name
    }
    companyId
    company {
      id
      name
    }
    title
    description
    publicLink
    salary
    location
    createdById
    createdBy {
      id
      firstName
      lastName
    }
    hiringManagerId
    hiringManager {
      id
      emailAddress
      firstName
      lastName
    }
    referralBonus
    notificationType
    status
    shares
    views
  }
}
`;
