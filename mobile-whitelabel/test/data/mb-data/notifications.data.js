export const notificationData = [
  {
    id: 1,
    createdBy: {
      userId: 2,
      firstName: 'Troy',
      lastName: 'Fairbanks',
      email: 'tfairbanks@test.com',
      password: 'password',
      avatar: 'http://via.placeholder.com/50x50',
      companyId: 1,
      referrals: [{ referralId: 1 }, { referralId: 2 }],
    },
    created: new Date(Date.now() - 3864000000),
    type: 'New Referral',
    referral: {
      id: 1,
      referralBonus: 3000,
      name: {
        first: 'Bob',
        last: 'Marley',
      },
      email: 'bobmarley@test.com',
      socialMedia: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
      department: 'Marketing',
      job: 'Marketing Director',
      dateReferred: new Date(Date.now() - 864000000),
      referredBy: {
        firstName: 'Ziggy',
        lastName: 'Marley',
      },
      status: 'Referred',
    },
    job: null,
    recipient: { userId: '1' },
  },
  {
    id: 2,
    createdBy: {
      id: 1,
      name: 'Parsed',
      avatar: 'http://via.placeholder.com/50x50',
    },
    created: new Date(),
    type: 'New Job',
    referral: null,
    job: {
      companyId: 3332121,
      jobId: 14352346654,
      jobType: 'Full-Time',
      title: 'Sales Director',
      department: 'Sales',
      description: '',
      salaryMinimum: '1233',
      salaryMaximum: '5552',
      salaryType: 'Monthly',
      publicLink: '',
      jobLocation: 'Pittsburgh, PA',
      hiringManager: 'Jeff Holcomb',
      referralBonusAmount: 3000,
      referralBonusAvailable: true,
      notificationType: '',
      locationCoords: '',
      jobCity: '___New York',
      jobState: '___NY',
      isRemoteJob: false,
      location: {
        isRemote: false,
        city: 'New York',
        state: 'NY',
      },
      referralBonus: {
        active: true,
        amount: 3000,
      },
      salary: {
        from: 1233,
        to: 5552,
        duration: 'String',
      },
      shares: 16,
      views: 125,
      _accepted: 1,
      _referrals: 5,
      _matches: 2,
      isOpen: true,
    },
    recipient: { userId: '1' },
  },
  {
    id: 3,
    createdBy: {
      userId: 2,
      firstName: 'Troy',
      lastName: 'Fairbanks',
      email: 'tfairbanks@test.com',
      password: 'password',
      avatar: null,
      companyId: 1,
      referrals: [{ referralId: 1 }, { referralId: 2 }],
    },
    created: new Date(Date.now() - 2864000000),
    type: 'Accepted Referral',
    referral: {
      id: 1,
      referralBonus: 3000,
      name: {
        first: 'Bob',
        last: 'Marley',
      },
      email: 'bobmarley@test.com',
      socialMedia: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
      department: 'Marketing',
      job: 'Marketing Director',
      dateReferred: new Date(),
      referredBy: {
        firstName: 'Ziggy',
        lastName: 'Marley',
      },
      status: 'Referred',
    },
    job: null,
    recipient: { userId: '1' },
  },
  {
    id: 4,
    createdBy: {
      id: 1,
      name: 'Parsed',
      avatar: 'http://via.placeholder.com/50x50',
    },
    created: new Date(),
    type: 'Hired Referral',
    referral: {
      id: 1,
      referralBonus: 3000,
      name: {
        first: 'Bob',
        last: 'Marley',
      },
      email: 'bobmarley@test.com',
      socialMedia: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
      department: 'Marketing',
      job: 'Marketing Director',
      dateReferred: new Date(),
      referredBy: {
        firstName: 'Ziggy',
        lastName: 'Marley',
      },
      status: 'Referred',
    },
    job: null,
    recipient: { userId: '1' },
  },
  {
    id: 5,
    createdBy: {
      userId: 2,
      firstName: 'Troy',
      lastName: 'Fairbanks',
      email: 'tfairbanks@test.com',
      password: 'password',
      avatar: 'http://via.placeholder.com/50x50',
      companyId: 1,
      referrals: [{ referralId: 1 }, { referralId: 2 }],
    },
    created: new Date(Date.now() - 84000000),
    type: 'Requested Referral',
    status: 0,
    referral: null,
    contact: {
      id: 1,
      firstName: 'Lionel',
      lastName: 'Higgins',
      email: 'JohnLennon@test.com',
      socialMedia: null,
    },
    job: {
      companyId: 3332121,
      jobId: 14352346654,
      jobType: 'Full-Time',
      title: 'Sales Director',
      department: 'Sales',
      description: '',
      salaryMinimum: '1233',
      salaryMaximum: '5552',
      salaryType: 'Monthly',
      publicLink: '',
      jobLocation: 'Pittsburgh, PA',
      hiringManager: 'Jeff Holcomb',
      referralBonusAmount: 3000,
      referralBonusAvailable: true,
      notificationType: '',
      locationCoords: '',
      jobCity: '___New York',
      jobState: '___NY',
      isRemoteJob: false,
      location: {
        isRemote: false,
        city: 'New York',
        state: 'NY',
      },
      referralBonus: {
        active: true,
        amount: 3000,
      },
      salary: {
        from: 1233,
        to: 5552,
        duration: 'String',
      },
      shares: 16,
      views: 125,
      _accepted: 1,
      _referrals: 5,
      _matches: 2,
      isOpen: true,
    },
    recipient: { userId: '1' },
  },
  {
    id: 6,
    createdBy: {
      userId: 2,
      firstName: 'Troy',
      lastName: 'Fairbanks',
      email: 'tfairbanks@test.com',
      password: 'password',
      avatar: null,
      companyId: 1,
      referrals: [{ referralId: 1 }, { referralId: 2 }],
    },
    created: new Date(Date.now() - 4000000),
    type: 'New Referral',
    referral: {
      id: 2,
      name: {
        first: 'Janie',
        last: 'Laura',
      },
      email: 'JohnLennon@test.com',
      socialMedia: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
      department: 'Sales Management',
      job: 'Sales Director',
      dateReferred: new Date(Date.now() - 864000000),
      referredBy: {
        firstName: 'Korryn',
        lastName: 'Mozisec',
      },
      status: 'Referred',
    },
    job: null,
    recipient: { userId: '1' },
  },
  {
    createdBy: {
      name: 'Erin-App',
    },
    created: new Date(Date.now() - 4000000),
    type: 'Contact Matches',
    matchedContacts: [
      {
        id: 1,
        firstName: 'Lionel',
        lastName: 'Higgins',
      },
      {
        id: 2,
        firstName: 'Joelle',
        lastName: 'Brooks',
      },
    ],
    job: {
      companyId: 3332121,
      jobId: 14352346654,
      jobType: 'Full-Time',
      title: 'Sales Director',
      department: 'Sales',
      description: '',
      salaryMinimum: '1233',
      salaryMaximum: '5552',
      salaryType: 'Monthly',
      publicLink: '',
      jobLocation: 'Pittsburgh, PA',
      hiringManager: 'Jeff Holcomb',
      referralBonusAmount: 3000,
      referralBonusAvailable: true,
      notificationType: '',
      locationCoords: '',
      jobCity: '___New York',
      jobState: '___NY',
      isRemoteJob: false,
      location: {
        isRemote: false,
        city: 'New York',
        state: 'NY',
      },
      referralBonus: {
        active: true,
        amount: 3000,
      },
      salary: {
        from: 1233,
        to: 5552,
        duration: 'String',
      },
      shares: 16,
      views: 125,
      _accepted: 1,
      _referrals: 5,
      _matches: 2,
      isOpen: true,
    },
    recipient: { userId: '1' },
  },
];
