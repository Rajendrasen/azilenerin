export const referralData = [
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
    company: 'TestCo',
    department: 'Marketing',
    job: { title: 'Marketing Director' },
    dateReferred: new Date().getTime(),
    user: {
      firstName: 'Ziggy',
      lastName: 'Marley',
    },
    status: 'Accepted',
    referralBonusAmount: 3000,
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
    company: 'TestCo',
    department: 'Sales Management',
    job: { title: 'Sales Director' },
    dateReferred: new Date(Date.now() - 864000000).getTime(),
    user: {
      firstName: 'Korryn',
      lastName: 'Mozisec',
    },
    status: 'Referred',
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
    company: 'TestCo',
    department: 'Finance',
    job: { title: 'Finance Director' },
    dateReferred: new Date(Date.now() - 2864000000).getTime(),
    user: {
      firstName: 'Keith',
      lastName: 'Richards',
    },
    status: 'Hired',
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
    company: 'TestCo',
    department: 'Sales',
    job: { title: 'Sales Associate' },
    dateReferred: new Date(Date.now() - 464000000).getTime(),
    user: {
      firstName: 'Ringo',
      lastName: 'Starr',
    },
    status: 'Interviewing',
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
    company: 'TestCo',
    department: 'Sales',
    job: { title: 'Project Manager' },
    dateReferred: new Date(Date.now() - 1864000000).getTime(),
    user: {
      firstName: 'Ringo',
      lastName: 'Starr',
    },
    status: 'Not Hired',
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
    company: 'TestCo',
    department: 'Marketing',
    job: { title: 'Marketing Director' },
    dateReferred: new Date().getTime(),
    user: {
      firstName: 'Bob',
      lastName: 'Marley',
    },
    status: 'Accepted',
  },
];
