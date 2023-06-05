export const myReferralsData = [
  {
    id: 1,
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
      referralBonus: 3000,
      department: { name: 'Marketing' },
    },
    referralDate: new Date(),
    user: {
      firstName: 'Ziggy',
      lastName: 'Marley',
      userId: 6,
    },
    status: 'accepted',
  },
  {
    id: 2,
    contact: {
      firstName: 'Janie',
      lastName: 'Laura',
      emailAddress: 'JohnLennon@test.com',
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
      referralBonus: null,
      department: { name: 'Sales Management' },
    },
    referralDate: new Date(Date.now() - 864000000),
    user: {
      firstName: 'Korryn',
      lastName: 'Mozisec',
      userId: 2,
    },
    status: 'referred',
  },
  {
    id: 3,
    contact: {
      firstName: 'Mick',
      lastName: 'Jagger',
      emailAddress: 'JohnLennon@test.com',
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
      title: 'Finance Director',
      referralBonus: 6000,
      department: { name: 'Finance' },
    },
    referralDate: new Date(Date.now() - 2864000000),
    user: {
      firstName: 'Keith',
      lastName: 'Richards',
      userId: 3,
    },
    status: 'hired',
  },
  {
    id: 4,
    contact: {
      firstName: 'John',
      lastName: 'Lenon',
      emailAddress: 'JohnLennon@test.com',
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
      referralBonus: null,
      department: {
        name: 'Sales',
      },
    },
    referralDate: new Date(Date.now() - 464000000),
    user: {
      firstName: 'Samantha',
      lastName: 'White',
      userId: 1,
    },
    status: 'interviewing',
  },
  {
    id: 5,
    contact: {
      firstName: 'Paul',
      lastName: 'McCartney',
      emailAddress: 'JohnLennon@test.com',
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
      title: 'Project Manager',
      referralBonus: 3000,
      department: {
        name: 'Sales',
      },
    },
    referralDate: new Date(Date.now() - 1864000000),
    user: {
      firstName: 'Samantha',
      lastName: 'White',
      userId: 1,
    },
    status: 'notHired',
  },
  {
    id: 6,
    contact: {
      firstName: 'Ziggy',
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
      referralBonus: 5000,
      department: {
        name: 'Marketing',
      },
    },
    referralDate: new Date(),
    user: {
      firstName: 'Bob',
      lastName: 'Marley',
      userId: 5,
    },
    status: 'accepted',
  },
];
