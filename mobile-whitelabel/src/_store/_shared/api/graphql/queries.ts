// tslint:disable
// this is an auto generated file. This will be overwritten

export const getDepartment = `query GetDepartment($id: ID!) {
  getDepartment(id: $id) {
    id
    companyId
    name
    active
    totalUsers
    userDepartments {
      id
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
    }
  }
}
`
export const listDepartments = `query ListDepartments(
  $filter: TableDepartmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        departmentId
        department {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
      }
    }
    nextToken
  }
}
`
export const queryDepartmentsByCompanyIdIndex = `query QueryDepartmentsByCompanyIdIndex(
  $companyId: ID!
  $first: Int
  $after: String
) {
  queryDepartmentsByCompanyIdIndex(
    companyId: $companyId
    first: $first
    after: $after
  ) {
    items {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        departmentId
        department {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
      }
    }
    nextToken
  }
}
`
export const getCompany = `query GetCompany($id: ID!) {
  getCompany(id: $id) {
    id
    name
    departments {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        departmentId
        department {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
      }
    }
    defaultBonusAmount
    contactIncentiveBonus
    websiteUrl
    users {
      id
      cognitoId
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      emailAddress
      role
      firstName
      lastName
      title
      avatar {
        bucket
        region
        key
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      managedDepartments {
        id
        userId
        departmentId
      }
      lastLogin
      lastNotificationCheck
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        type
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        referralRequestedStatus
        requestingUserId
        requestingUser {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        referralId
        referral {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    dateCreated
  }
}
`
export const listCompanies = `query ListCompanies(
  $filter: TableCompanyFilterInput
  $limit: Int
  $nextToken: String
) {
  listCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          user {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          departmentId
          department {
            id
            companyId
            name
            active
            totalUsers
            userDepartments {
              id
              userId
              departmentId
            }
          }
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        company {
          id
          name
          departments {
            id
            companyId
            name
            active
            totalUsers
            userDepartments {
              id
              userId
              departmentId
            }
          }
          defaultBonusAmount
          contactIncentiveBonus
          websiteUrl
          users {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          dateCreated
        }
        emailAddress
        role
        firstName
        lastName
        title
        avatar {
          bucket
          region
          key
        }
        departmentId
        department {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        managedDepartments {
          id
          userId
          departmentId
        }
        lastLogin
        lastNotificationCheck
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          userId
          user {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          phoneNumber
          jobHistory
          importMethod
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          type
          userId
          user {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          referralRequestedStatus
          requestingUserId
          requestingUser {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          contactId
          contact {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          referralId
          referral {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          jobId
          job {
            id
            companyId
            departmentId
            title
            description
            publicLink
            salary
            location
            hiringManagerId
            createdById
            referralBonus
            shares
            views
            referrals {
              id
              companyId
              contactId
              userId
              jobId
              note
              message
              referralDate
              hireDate
            }
            matches {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            dateCreated
          }
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        createdBy {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    cognitoId
    companyId
    company {
      id
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    emailAddress
    role
    firstName
    lastName
    title
    avatar {
      bucket
      region
      key
    }
    departmentId
    department {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        departmentId
      }
    }
    managedDepartments {
      id
      userId
      departmentId
    }
    lastLogin
    lastNotificationCheck
    referrals {
      id
      companyId
      contactId
      userId
      jobId
      note
      message
      referralDate
      hireDate
    }
    contacts {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    totalReferrals
    webNotifications {
      id
      type
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralRequestedStatus
      requestingUserId
      requestingUser {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      referralId
      referral {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      matches
      message
      dateCreated
    }
    connectedApps
    active
    createdById
    createdBy {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    dateCreated
  }
}
`
export const getUserByCognitoId = `query GetUserByCognitoId($cognitoId: ID!) {
  getUserByCognitoId(cognitoId: $cognitoId) {
    id
    cognitoId
    companyId
    subCompany {
      companyId
      id
      name
      logo {
        bucket
        key
        region
      }
    }
    company {
      id
      enableCustomPage
      customPageTitle
      enableCareerProfile
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    emailAddress
    role
    firstName
    lastName
    title
    avatar {
      bucket
      region
      key
    }
    departmentId
    department {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        departmentId
      }
    }
    managedDepartments {
      id
      userId
      departmentId
    }
    lastLogin
    lastNotificationCheck
    referrals {
      id
      companyId
      contactId
      userId
      jobId
      note
      message
      referralDate
      hireDate
    }
    contacts {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    totalReferrals
    webNotifications {
      id
      type
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralRequestedStatus
      requestingUserId
      requestingUser {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      referralId
      referral {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      matches
      message
      dateCreated
    }
    connectedApps
    active
    createdById
    createdBy {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    dateCreated
    openToNewRole
  }
}
`
export const listUsers = `query ListUsers(
  $filter: TableUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      cognitoId
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      emailAddress
      role
      firstName
      lastName
      title
      avatar {
        bucket
        region
        key
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      managedDepartments {
        id
        userId
        departmentId
      }
      lastLogin
      lastNotificationCheck
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        type
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        referralRequestedStatus
        requestingUserId
        requestingUser {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        referralId
        referral {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const queryUsersByEmailAddressPasswordIndex = `query QueryUsersByEmailAddressPasswordIndex(
  $emailAddress: String!
  $first: Int
  $after: String
) {
  queryUsersByEmailAddressPasswordIndex(
    emailAddress: $emailAddress
    first: $first
    after: $after
  ) {
    items {
      id
      cognitoId
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      emailAddress
      role
      firstName
      lastName
      title
      avatar {
        bucket
        region
        key
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      managedDepartments {
        id
        userId
        departmentId
      }
      lastLogin
      lastNotificationCheck
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        type
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        referralRequestedStatus
        requestingUserId
        requestingUser {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        referralId
        referral {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const getJob = `query GetJob($id: ID!) {
  getJob(id: $id) {
    id
    companyId
    company {
      id
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    jobType
    departmentId
    department {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        departmentId
      }
    }
    title
    description
    publicLink
    salary
    location
    hiringManagerId
    hiringManager {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    createdById
    createdBy {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    referralBonus
    notificationType
    status
    shares
    views
    referrals {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      status
      note
      message
      referralDate
      hireDate
    }
    matches {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    dateCreated
  }
}
`
export const listJobs = `query ListJobs($filter: TableJobFilterInput, $limit: Int, $nextToken: String) {
  listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      jobType
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      title
      description
      publicLink
      salary
      location
      hiringManagerId
      hiringManager {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralBonus
      notificationType
      status
      shares
      views
      referrals {
        id
        companyId
        company {
          id
          name
          departments {
            id
            companyId
            name
            active
            totalUsers
            userDepartments {
              id
              userId
              departmentId
            }
          }
          defaultBonusAmount
          contactIncentiveBonus
          websiteUrl
          users {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        status
        note
        message
        referralDate
        hireDate
      }
      matches {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const queryJobsByCompanyIdTitleIndex = `query QueryJobsByCompanyIdTitleIndex(
  $companyId: ID!
  $title: String!
  $first: Int
  $after: String
) {
  queryJobsByCompanyIdTitleIndex(
    companyId: $companyId
    title: $title
    first: $first
    after: $after
  ) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      jobType
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      title
      description
      publicLink
      salary
      location
      hiringManagerId
      hiringManager {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralBonus
      notificationType
      status
      shares
      views
      referrals {
        id
        companyId
        company {
          id
          name
          departments {
            id
            companyId
            name
            active
            totalUsers
            userDepartments {
              id
              userId
              departmentId
            }
          }
          defaultBonusAmount
          contactIncentiveBonus
          websiteUrl
          users {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        status
        note
        message
        referralDate
        hireDate
      }
      matches {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const queryJobsByDescriptionIndex = `query QueryJobsByDescriptionIndex(
  $description: String!
  $first: Int
  $after: String
) {
  queryJobsByDescriptionIndex(
    description: $description
    first: $first
    after: $after
  ) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      jobType
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      title
      description
      publicLink
      salary
      location
      hiringManagerId
      hiringManager {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralBonus
      notificationType
      status
      shares
      views
      referrals {
        id
        companyId
        company {
          id
          name
          departments {
            id
            companyId
            name
            active
            totalUsers
            userDepartments {
              id
              userId
              departmentId
            }
          }
          defaultBonusAmount
          contactIncentiveBonus
          websiteUrl
          users {
            id
            cognitoId
            companyId
            emailAddress
            firstName
            lastName
            title
            departmentId
            lastLogin
            lastNotificationCheck
            contacts {
              id
              firstName
              lastName
              emailAddress
              socialMediaAccounts
              userId
              phoneNumber
              jobHistory
              fullContactData
              dateCreated
            }
            totalReferrals
            webNotifications {
              id
              userId
              requestingUserId
              contactId
              referralId
              jobId
              matches
              message
              dateCreated
            }
            connectedApps
            active
            createdById
            dateCreated
          }
          dateCreated
        }
        contactId
        contact {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        jobId
        job {
          id
          companyId
          departmentId
          title
          description
          publicLink
          salary
          location
          hiringManagerId
          createdById
          referralBonus
          shares
          views
          referrals {
            id
            companyId
            contactId
            userId
            jobId
            note
            message
            referralDate
            hireDate
          }
          matches {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          dateCreated
        }
        status
        note
        message
        referralDate
        hireDate
      }
      matches {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        userId
        user {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        phoneNumber
        jobHistory
        importMethod
        fullContactData
        dateCreated
      }
      dateCreated
    }
    nextToken
  }
}
`
export const getContact = `query GetContact($id: ID!) {
  getContact(id: $id) {
    id
    firstName
    lastName
    emailAddress
    socialMediaAccounts
    referrals {
      id
      companyId
      contactId
      userId
      jobId
      note
      message
      referralDate
      hireDate
    }
    userId
    user {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    phoneNumber
    jobHistory
    importMethod
    fullContactData
    dateCreated
  }
}
`
export const listContacts = `query ListContacts(
  $filter: TableContactFilterInput
  $limit: Int
  $nextToken: String
) {
  listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    nextToken
  }
}
`
export const queryContactsByEmailAddressIndex = `query QueryContactsByEmailAddressIndex(
  $emailAddress: AWSEmail!
  $first: Int
  $after: String
) {
  queryContactsByEmailAddressIndex(
    emailAddress: $emailAddress
    first: $first
    after: $after
  ) {
    items {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    nextToken
  }
}
`
export const getReferral = `query GetReferral($id: ID!) {
  getReferral(id: $id) {
    id
    companyId
    company {
      id
      name
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      dateCreated
    }
    bonusStatus
    contactId
    contact {
      id
      onDeckStatus
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      userId
      user{
        id
        firstName
        lastName
      }
      companyId
      phoneNumber
      jobHistory
      fullContactData
      dateCreated
      referrals {
        id
        job {
          id
          referralBonus
        }
        company{
          id
          contactIncentiveBonus
        }
      }
    }
    userId
    user {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      totalReferrals
      connectedApps
      active
      createdById
      dateCreated
      ranking
      previousRanking
      ytdReferralCount
      userGroupId
      incentiveEligible
    }
    jobId
    job {
      id
      companyId
      company {
        id
        referralBonusWaitingPeriod
      }
      departmentId
      title
      description
      publicLink
      salary
      location
      hiringManagerId
      createdById
      referralBonus
      shares
      views
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        referralType
        hireDate
      }
      matches {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        companyId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      dateCreated
    }
    status
    contactResume{
      key
      region
      bucket
    }
    note
    message
    referralDate
    referralType
    hireDate
  }
}
`
export const listReferrals = `query ListReferrals(
  $filter: TableReferralFilterInput
  $limit: Int
  $nextToken: String
) {
  listReferrals(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          referralType
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      status
      note
      message
      referralDate
      referralType
      hireDate
    }
    nextToken
  }
}
`
export const queryReferralsByJobIdIndex = `query QueryReferralsByJobIdIndex($jobId: ID!, $first: Int, $after: String) {
  queryReferralsByJobIdIndex(jobId: $jobId, first: $first, after: $after) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      status
      note
      message
      referralDate
      hireDate
    }
    nextToken
  }
}
`
export const getTopReferrers = `query GetTopReferrers($companyId: ID!) {
  getTopReferrers(companyId: $companyId) {
    id
    cognitoId
    companyId
    company {
      id
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    emailAddress
    role
    firstName
    lastName
    title
    avatar {
      bucket
      region
      key
    }
    departmentId
    department {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        departmentId
      }
    }
    managedDepartments {
      id
      userId
      departmentId
    }
    lastLogin
    lastNotificationCheck
    referrals {
      id
      companyId
      contactId
      userId
      jobId
      note
      message
      referralDate
      hireDate
    }
    contacts {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      phoneNumber
      jobHistory
      importMethod
      fullContactData
      dateCreated
    }
    totalReferrals
    webNotifications {
      id
      type
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralRequestedStatus
      requestingUserId
      requestingUser {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      referralId
      referral {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      matches
      message
      dateCreated
    }
    connectedApps
    active
    createdById
    createdBy {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    dateCreated
  }
}
`
export const getBusinessNetwork = `query GetBusinessNetwork($companyId: ID!) {
  getBusinessNetwork(companyId: $companyId) {
    activeEmployees
    businessConnections
    firstConnections
  }
}
`
export const getDashboardJobs = `query GetDashboardJobs($companyId: ID!) {
  getDashboardJobs(companyId: $companyId) {
    openPositions
    inNetworkMatches
    jobShares
    totalJobViews
  }
}
`
export const getDashboardReferrals = `query GetDashboardReferrals($companyId: ID!, $status: ReferralStatus) {
  getDashboardReferrals(companyId: $companyId, status: $status) {
    currentReferralCount
    previousReferralCount
  }
}
`
export const getUserDepartment = `query GetUserDepartment($userId: ID!, $departmentId: ID!) {
  getUserDepartment(userId: $userId, departmentId: $departmentId) {
    id
    userId
    user {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    departmentId
    department {
      id
      companyId
      name
      active
      totalUsers
      userDepartments {
        id
        userId
        departmentId
      }
    }
  }
}
`
export const listUserDepartments = `query ListUserDepartments(
  $filter: TableUserDepartmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserDepartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      departmentId
      department {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
    }
    nextToken
  }
}
`
export const getWebNotification = `query GetWebNotification($id: ID!) {
  getWebNotification(id: $id) {
    id
    type
    userId
    user {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    referralRequestedStatus
    requestingUserId
    requestingUser {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    contactId
    contact {
      id
      firstName
      lastName
      emailAddress
      socialMediaAccounts
      userId
      phoneNumber
      jobHistory
      fullContactData
      dateCreated
    }
    referralId
    referral {
      id
      companyId
      contactId
      userId
      jobId
      note
      message
      referralDate
      hireDate
    }
    jobId
    job {
      id
      companyId
      departmentId
      title
      description
      publicLink
      salary
      location
      hiringManagerId
      createdById
      referralBonus
      shares
      views
      referrals {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      matches {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      dateCreated
    }
    matches
    message
    dateCreated
  }
}
`
export const listWebNotifications = `query ListWebNotifications(
  $filter: TableWebNotificationFilterInput
  $limit: Int
  $nextToken: String
) {
  listWebNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      type
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      referralRequestedStatus
      requestingUserId
      requestingUser {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      contactId
      contact {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      referralId
      referral {
        id
        companyId
        contactId
        userId
        jobId
        note
        message
        referralDate
        hireDate
      }
      jobId
      job {
        id
        companyId
        departmentId
        title
        description
        publicLink
        salary
        location
        hiringManagerId
        createdById
        referralBonus
        shares
        views
        referrals {
          id
          companyId
          contactId
          userId
          jobId
          note
          message
          referralDate
          hireDate
        }
        matches {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        dateCreated
      }
      matches
      message
      dateCreated
    }
    nextToken
  }
}
`
export const getUserInvite = `query GetUserInvite($id: ID!) {
  getUserInvite(id: $id) {
    id
    companyId
    company {
      id
      name
      departments {
        id
        companyId
        name
        active
        totalUsers
        userDepartments {
          id
          userId
          departmentId
        }
      }
      defaultBonusAmount
      contactIncentiveBonus
      websiteUrl
      users {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      dateCreated
    }
    userId
    user {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    createdById
    createdBy {
      id
      cognitoId
      companyId
      emailAddress
      firstName
      lastName
      title
      departmentId
      lastLogin
      lastNotificationCheck
      contacts {
        id
        firstName
        lastName
        emailAddress
        socialMediaAccounts
        userId
        phoneNumber
        jobHistory
        fullContactData
        dateCreated
      }
      totalReferrals
      webNotifications {
        id
        userId
        requestingUserId
        contactId
        referralId
        jobId
        matches
        message
        dateCreated
      }
      connectedApps
      active
      createdById
      dateCreated
    }
    emailAddress
    firstName
    lastName
    title
    dateCreated
  }
}
`
export const listUserInvites = `query ListUserInvites(
  $filter: TableUserInviteFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserInvites(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      companyId
      company {
        id
        name
        departments {
          id
          companyId
          name
          active
          totalUsers
          userDepartments {
            id
            userId
            departmentId
          }
        }
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        users {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          lastLogin
          lastNotificationCheck
          contacts {
            id
            firstName
            lastName
            emailAddress
            socialMediaAccounts
            userId
            phoneNumber
            jobHistory
            fullContactData
            dateCreated
          }
          totalReferrals
          webNotifications {
            id
            userId
            requestingUserId
            contactId
            referralId
            jobId
            matches
            message
            dateCreated
          }
          connectedApps
          active
          createdById
          dateCreated
        }
        dateCreated
      }
      userId
      user {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      createdById
      createdBy {
        id
        cognitoId
        companyId
        emailAddress
        firstName
        lastName
        title
        departmentId
        lastLogin
        lastNotificationCheck
        contacts {
          id
          firstName
          lastName
          emailAddress
          socialMediaAccounts
          userId
          phoneNumber
          jobHistory
          fullContactData
          dateCreated
        }
        totalReferrals
        webNotifications {
          id
          userId
          requestingUserId
          contactId
          referralId
          jobId
          matches
          message
          dateCreated
        }
        connectedApps
        active
        createdById
        dateCreated
      }
      emailAddress
      firstName
      lastName
      title
      dateCreated
    }
    nextToken
  }
}
`
