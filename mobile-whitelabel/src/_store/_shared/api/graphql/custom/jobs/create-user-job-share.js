export const createUserJobShare = `mutation CreateUserJobShare($input: CreateUserJobShareInput!) {
    createUserJobShare(input: $input) {
      id
      userId
      jobId
      facebookSharesCount
      twitterSharesCount
      linkedinSharesCount
      whatsAppSharesCount
      companyId
      facebookShareLastDate
      twitterShareLastDate
      linkedinShareLastDate
      whatsAppShareLastDate
      shareCountByMobile
      shareDateByMobile
    }
  }
  `;