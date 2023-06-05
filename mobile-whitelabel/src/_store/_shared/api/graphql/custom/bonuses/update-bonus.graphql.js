export const updateBonus = `mutation UpdateBonus($input: UpdateBonusInput!) {
    updateBonus(input: $input) {
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
