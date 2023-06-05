export const updateUser = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      avatar {
        bucket
        region
        key
        __typename
      }
      accountClaimId
      active
      authMethod
      careerProfile
      companyId
      connectedApps
      createdById
      currency
      dateFormat
      defaultDistance
      departmentId
      emailAddress
      employeeId
      firstName
      id
      incentiveEligible
      jobClassId
      jobClassName
      jobFamilyGroupId
      jobFamilyGroupName
      jobFamilyId
      jobFamilyName
      jobProfileId
      jobProfileName
      languageCode 
      lastName
      lastLogin
      lastNotificationCheck
      location      
      managementLevel
      points
      role
      subCompanyId
      title
      totalReferrals
      userGroupId
    }
  }
`;
