export const referralData = [
  {
    id: '1',
    contact: {
      firstName: 'Bob',
      lastName: 'Marley',
      emailAddress: 'bobmarley@test.com',
      socialMediaAccounts: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
    },
    job: {
      title: 'Marketing Director',
      department: {
        name: 'Department 001',
      },
    },
    referralDate: new Date(),
    user: {
      firstName: 'Ziggy',
      lastName: 'Marley',
      userId: 6,
    },
    status: 'accepted',
    referralBonusAmount: 3000,
  },
  {
    id: '2',
    contact: {
      firstName: 'John',
      lastName: 'Lennon',
      emailAddress: 'jlennon@test.com',
      socialMediaAccounts: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
    },
    job: {
      title: 'Sales Director',
      department: {
        name: 'Department 002',
      },
    },
    referralDate: new Date().getTime(),
    user: {
      firstName: 'Paul',
      lastName: 'McCartney',
    },
    status: 'hired',
    referralBonusAmount: 3000,
  },
  {
    id: '3',
    contact: {
      firstName: 'Ringo',
      lastName: 'Starr',
      emailAddress: 'bobmarley@test.com',
      socialMediaAccounts: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
    },
    job: {
      title: 'Sales Associate',
      department: {
        name: 'Department 003',
      },
    },
    referralDate: new Date(),
    user: {
      firstName: 'Paul',
      lastName: 'McCartney',
    },
    status: 'interviewing',
    referralBonusAmount: 3000,
  },
  {
    id: '4',
    contact: {
      firstName: 'George',
      lastName: 'Harrison',
      emailAddress: 'bobmarley@test.com',
      socialMediaAccounts: [
        {
          value: 'https://linkedin.com/in/test/',
          type: 'linkedin',
        },
        {
          value: 'https://www.facebook.com/profile.php?id=xxxxxxxxx',
          type: 'facebook',
        },
      ],
    },
    job: {
      title: 'Marketing Associate',
      department: {
        name: 'Department 004',
      },
    },
    referralDate: new Date(),
    user: {
      firstName: 'Ziggy',
      lastName: 'Marley',
      userId: 5,
    },
    status: 'notHired',
    referralBonusAmount: 3000,
  },
];
