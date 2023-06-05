import moment from 'moment';

export const userData = [
  {
    userId: '1',
    disabled: false,
    password: 'password',
    firstName: 'Samantha',
    lastName: 'White',
    checkedNotifications: moment(),
    department: {
      name: 'Sales Operations',
    },
    departmentId: '1',
    managedDepartments: [
      { department: 'Sales', departmentId: 1 },
      { department: 'Sales Operations', departmentId: 2 },
      { department: 'Marketing', departmentId: 3 },
    ],
    title: 'Salesforce Admin',
    role: 'admin',
    emailAddress: 'samanthawhite@test.com',
    avatar: null,
    lastLogin: '',
    companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
    connectedApps: [
      {
        id: '1',
        type: 'linked-in',
        account: 'in/samanthawhite',
        dateSynced: moment().format(),
        synced: true,
      },
      {
        id: '2',
        type: 'gmail',
        account: 'samanthawhite@bestco.com',
        dateSynced: moment().format(),
        synced: true,
      },
      {
        id: '3',
        type: 'outlook',
        account: null,
        dateSynced: null,
        synced: false,
      },
      {
        id: '4',
        type: 'twitter',
        account: null,
        dateSynced: null,
        synced: false,
      },
    ],
    contacts: [
      {
        id: 1,
        firstName: 'Lionel',
        lastName: 'Higgins',
        emailAddress: 'lhiggins@test.com',
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
        avatar: null,
        dateAdded: moment().format(),
        addedFrom: 'LinkedIn',
      },
      {
        id: 2,
        firstName: 'Joelle',
        lastName: 'Brooks',
        emailAddress: 'jbrooks@test.com',
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
        avatar: null,
        dateAdded: new Date(Date.now() - 86400004),
        addedFrom: 'Facebook',
      },
      {
        id: 3,
        firstName: 'Bill',
        lastName: 'Murray',
        emailAddress: 'bmurray@test.com',
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
        avatar: 'https://fillmurray.com/50/50',
        dateAdded: new Date(Date.now() - 186400004),
        addedFrom: 'Contacts',
      },
      {
        id: 4,
        firstName: 'Dan',
        lastName: 'Akroyd',
        emailAddress: 'dakroyd@test.com',
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
        avatar: null,
        dateAdded: new Date(Date.now() - 864023),
        addedFrom: 'Google Contacts',
      },
      {
        id: 5,
        firstName: 'Nicholas',
        lastName: 'Cage',
        emailAddress: 'ccage@test.com',
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
        avatar: 'https://placecage.com/50/50',
        dateAdded: new Date(),
        addedFrom: 'Manually Added',
      },
      {
        id: 6,
        firstName: 'Steve',
        lastName: 'Martin',
        emailAddress: 'smartin@test.com',
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
        avatar: null,
        dateAdded: new Date(Date.now() - 38640000),
        addedFrom: 'LinkedIn',
      },
    ],
    referrals: [
      {
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
        dateReferred: new Date().getTime(),
        referredBy: {
          firstName: 'Ziggy',
          lastName: 'Marley',
        },
        status: 'Accepted',
      },
      {
        id: 2,
        name: {
          first: 'Janie',
          last: 'Laura',
        },
        referralBonus: 3000,
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
        dateReferred: new Date(Date.now() - 864000000).getTime(),
        referredBy: {
          firstName: 'Korryn',
          lastName: 'Mozisec',
        },
        status: 'Referred',
      },
    ],
  },
  {
    userId: 2,
    firstName: 'Troy',
    lastName: 'Fairbanks',
    email: 'tfairbanks@test.com',
    password: 'password',
    companyId: 1,
    checkedNotifications: new Date(Date.now() - 864000000).getTime(),
    referrals: [{ referralId: 1 }, { referralId: 2 }],
  },
];
