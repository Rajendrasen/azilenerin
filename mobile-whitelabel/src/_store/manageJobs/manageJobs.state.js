export const state = {
  jobs: [],
  currentJob: {
    jobType: '',
    title: null,
    department: {
      id: null,
      name: null,
    },
    description: null,
    salary: {
      from: null,
      to: null,
      duration: null,
    },
    publicLink: null,
    hiringManager: null,
    referralBonus: {
      active: true,
      amount: null,
    },
    notificationType: 'ALL',
    location: {
      city: null,
      state: null,
      isRemote: false,
    },
  },
};
