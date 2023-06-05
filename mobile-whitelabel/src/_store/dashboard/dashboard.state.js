// TODO: remove mock data when api is ready

// just initial setup, will probably change
export const state = {
  businessNetwork: [],
  businessNetWorkTotal: 0,
  activeJobs: [],
  selectJob: {
    title: '',
    department: {
      name: '',
    },
    location: {
      city: '',
      state: '',
    },
    referralBonus: {
      hasBonus: false,
      amount: null,
    },
  },
  departments: [],
  jobShares: 0,
  jobViews: 0,
  jobMatches: 0,
  jobOpenPositions: 0,
  referralTotal: 0,
  prevReferralTotal: 0,
  referralAcceptedTotal: 0,
  prevReferralAcceptedTotal: 0,
  referralPolicy: ''
};
