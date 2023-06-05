export const createBonus = `mutation CreateBonus($input: CreateBonusInput!) {
    createBonus(input: $input) {
      id
      jobId
      referralId
      companyId
      contactId
      userId
      bonusStatus
      hireDate
      startDate
      amountDue
      earnedDate
      recipientType
      payment
      notes
    }
  }
  `;
