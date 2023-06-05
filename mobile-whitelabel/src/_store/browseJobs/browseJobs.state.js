export const state = {
  jobs: [],
  currentJob: {
    jobType: '',
    title: '',
    department: '',
    description: '',
    salary: {
      from: '',
      to: '',
      duration: '',
    },
    publicLink: '',
    hiringManager: '',
    referralBonus: {
      active: true,
      amount: '',
    },
    notificationType: 'Notify All Employees',
    location: {
      city: '',
      state: '',
      isRemote: false,
    },
  },
};
