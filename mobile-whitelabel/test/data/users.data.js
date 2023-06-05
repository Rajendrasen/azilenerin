export const userData = [
  {
    id: '9f756055-237a-4157-8ec0-801b2b38ee8',
    avatar: 'http://placehold.it/50',
    name: { firstname: 'Amanda', lastname: 'Agile' },
    email: 'aagile@bestco.com',
    companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
    company: 'BestCo',
    department: 'Sales Operations',
    role: 'SalesForce Admin', // default, other roles are Manager and Employee
    password: 'password',
    contact: { direct: 0, social: 0 },
    isConnected: false,
    referral: 4,
    lastlogin: '8/27/2018',
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
        dateAdded: new Date(Date.now() - 8640000),
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
  },
  {
    key: 2,
    avatar: 'http://placehold.it/50',
    name: { firstname: 'Chris', lastname: 'Scotts' },
    email: 'cscotts@bestco.com',
    company: 'BestCo',
    department: 'Sales Operations',
    role: 'SalesForce Admin',
    referral: 3,
    lastlogin: '8/30/2018',
  },
  {
    key: 3,
    avatar: 'http://placehold.it/50',
    name: { firstname: 'Stacey', lastname: 'Scotts' },
    email: 'cscotts@bestco.com',
    company: 'BestCo',
    department: 'Sales Operations',
    role: 'SalesForce Admin',
    referral: 2,
    lastlogin: '8/30/2018',
  },
  {
    key: 4,
    avatar: 'http://placehold.it/50',
    name: { firstname: 'Mike', lastname: 'Green' },
    email: 'cscotts@bestco.com',
    company: 'BestCo',
    department: 'Product',
    role: 'SalesForce Admin',
    referral: 1,
    lastlogin: '8/31/2018',
  },
  {
    key: 5,
    avatar: 'http://placehold.it/50',
    name: { firstname: 'Ashley', lastname: 'Barnes' },
    email: 'cscotts@bestco.com',
    company: 'BestCo',
    department: 'Management',
    role: 'SalesForce Admin',
    referral: 5,
    lastlogin: '5/30/2018',
  },
  {
    id: '9f756055-237a-4157-8ec0-801b2b38ee82',
    companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
    company: {
      id: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
      name: 'Company 001',
      defaultBonusAmount: 3000,
      contactIncentiveBonus: 500,
      websiteUrl: 'http://www.bestco.com',
    },
    emailAddress: 'derrick@derrickcurry.com',
    password: 'Password03!',
    role: 'admin',
    firstName: 'Derrick',
    lastName: 'Curry',
    title: 'CEO',
    avatar: null,
    departmentId: '7c4085ff-2631-4ad2-8aea-6f159fded825',
    department: {
      id: '7c4085ff-2631-4ad2-8aea-6f159fded825',
      companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
      name: 'Department 003',
      active: true,
      totalUsers: 0,
    },
    managedDepartments: [
      {
        id: '57af8168-16e2-4ee2-aa82-f8fb04a92717',
        userId: '9f756055-237a-4157-8ec0-801b2b38ee82',
        departmentId: '7c4085ff-2631-4ad2-8aea-6f159fded825',
      },
      {
        id: 'da29fd1d-2039-4efc-848c-5e290122e5b4',
        userId: '9f756055-237a-4157-8ec0-801b2b38ee82',
        departmentId: '15d0e06e-4567-40cc-91bf-da8e97926816',
      },
    ],
    lastLogin: null,
    lastNotificationCheck: null,
    referrals: [
      {
        id: 'a6ce5b7d-288c-4449-acf2-b6b8fda325e2',
        companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
        contactId: 'bb49b710-2f2f-415e-8fa5-47794c84bec8',
        userId: '9f756055-237a-4157-8ec0-801b2b38ee82',
        jobId: '14f0c05a-9e8d-4704-9122-5397a00eab99',
        note:
          'This is only a test, please disregard. Again, this is only a test.',
        message:
          'This is only a test, please disregard. Again, this is only a test.',
        referralDate: '2018-10-03T04:42:18.564Z',
      },
      {
        id: '1e47b0a8-ed5d-4c01-924c-33e12324eb6a',
        companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
        contactId: '2d9df5be-2a92-444c-a568-ac54ea81e94a',
        userId: '9f756055-237a-4157-8ec0-801b2b38ee82',
        jobId: 'ae295962-f944-4c20-b8d3-af1f03e3b514',
        note:
          'This is only a test, please disregard. Again, this is only a test.',
        message:
          'This is only a test, please disregard. Again, this is only a test.',
        referralDate: '2018-10-03T06:13:58.117Z',
      },
      {
        id: 'c674aabd-6a3d-4081-afd4-a6bddf39b506',
        companyId: '5cb0bc6b-397c-41ca-bb8e-ad9d2e9c39f5',
        contactId: '13d3c8d6-a167-4bc3-accd-cbe84cc3bdae',
        userId: '9f756055-237a-4157-8ec0-801b2b38ee82',
        jobId: '50590650-f79c-4471-a7b3-dcbb100e90d9',
        note:
          'This is only a test, please disregard. Again, this is only a test.',
        message:
          'This is only a test, please disregard. Again, this is only a test.',
        referralDate: '2018-10-03T04:39:41.299Z',
      },
    ],
  },
];