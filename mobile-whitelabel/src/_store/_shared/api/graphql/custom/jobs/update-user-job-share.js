export const updateUserJobShare = `mutation UpdateUserJobShare($input: UpdateUserJobShareInput!) {
    updateUserJobShare(input: $input) {
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
