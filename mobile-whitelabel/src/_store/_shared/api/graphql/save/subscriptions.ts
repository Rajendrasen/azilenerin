// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateDepartment = `subscription OnCreateDepartment(
  $id: ID
  $companyId: ID
  $name: String
  $active: Boolean
) {
  onCreateDepartment(
    id: $id
    companyId: $companyId
    name: $name
    active: $active
  ) {
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
`;
export const onUpdateDepartment = `subscription OnUpdateDepartment(
  $id: ID
  $companyId: ID
  $name: String
  $active: Boolean
) {
  onUpdateDepartment(
    id: $id
    companyId: $companyId
    name: $name
    active: $active
  ) {
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
`;
export const onDeleteDepartment = `subscription OnDeleteDepartment(
  $id: ID
  $companyId: ID
  $name: String
  $active: Boolean
) {
  onDeleteDepartment(
    id: $id
    companyId: $companyId
    name: $name
    active: $active
  ) {
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
`;
export const onCreateCompany = `subscription OnCreateCompany($id: ID, $name: String) {
  onCreateCompany(id: $id, name: $name) {
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
`;
export const onUpdateCompany = `subscription OnUpdateCompany($id: ID, $name: String) {
  onUpdateCompany(id: $id, name: $name) {
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
`;
export const onDeleteCompany = `subscription OnDeleteCompany($id: ID, $name: String) {
  onDeleteCompany(id: $id, name: $name) {
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
`;
export const onCreateUser = `subscription OnCreateUser(
  $id: ID
  $companyId: ID
  $emailAddress: String
  $password: String
  $firstName: String
) {
  onCreateUser(
    id: $id
    companyId: $companyId
    emailAddress: $emailAddress
    password: $password
    firstName: $firstName
  ) {
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
`;
export const onUpdateUser = `subscription OnUpdateUser(
  $id: ID
  $companyId: ID
  $emailAddress: String
  $password: String
  $firstName: String
) {
  onUpdateUser(
    id: $id
    companyId: $companyId
    emailAddress: $emailAddress
    password: $password
    firstName: $firstName
  ) {
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
`;
export const onDeleteUser = `subscription OnDeleteUser(
  $id: ID
  $companyId: ID
  $emailAddress: String
  $password: String
  $firstName: String
) {
  onDeleteUser(
    id: $id
    companyId: $companyId
    emailAddress: $emailAddress
    password: $password
    firstName: $firstName
  ) {
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
`;
export const onCreateJob = `subscription OnCreateJob(
  $id: ID
  $companyId: ID
  $departmentId: ID
  $title: String
  $description: String
) {
  onCreateJob(
    id: $id
    companyId: $companyId
    departmentId: $departmentId
    title: $title
    description: $description
  ) {
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
`;
export const onUpdateJob = `subscription OnUpdateJob(
  $id: ID
  $companyId: ID
  $departmentId: ID
  $title: String
  $description: String
) {
  onUpdateJob(
    id: $id
    companyId: $companyId
    departmentId: $departmentId
    title: $title
    description: $description
  ) {
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
`;
export const onDeleteJob = `subscription OnDeleteJob(
  $id: ID
  $companyId: ID
  $departmentId: ID
  $title: String
  $description: String
) {
  onDeleteJob(
    id: $id
    companyId: $companyId
    departmentId: $departmentId
    title: $title
    description: $description
  ) {
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
`;
export const onCreateContact = `subscription OnCreateContact(
  $id: ID
  $firstName: String
  $lastName: String
  $emailAddress: AWSEmail
  $socialMediaAccounts: AWSJSON
) {
  onCreateContact(
    id: $id
    firstName: $firstName
    lastName: $lastName
    emailAddress: $emailAddress
    socialMediaAccounts: $socialMediaAccounts
  ) {
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
`;
export const onUpdateContact = `subscription OnUpdateContact(
  $id: ID
  $firstName: String
  $lastName: String
  $emailAddress: AWSEmail
  $socialMediaAccounts: AWSJSON
) {
  onUpdateContact(
    id: $id
    firstName: $firstName
    lastName: $lastName
    emailAddress: $emailAddress
    socialMediaAccounts: $socialMediaAccounts
  ) {
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
`;
export const onDeleteContact = `subscription OnDeleteContact(
  $id: ID
  $firstName: String
  $lastName: String
  $emailAddress: AWSEmail
  $socialMediaAccounts: AWSJSON
) {
  onDeleteContact(
    id: $id
    firstName: $firstName
    lastName: $lastName
    emailAddress: $emailAddress
    socialMediaAccounts: $socialMediaAccounts
  ) {
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
`;
export const onCreateReferral = `subscription OnCreateReferral(
  $id: ID
  $contactId: ID
  $userId: ID
  $jobId: ID
) {
  onCreateReferral(
    id: $id
    contactId: $contactId
    userId: $userId
    jobId: $jobId
  ) {
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
}
`;
export const onUpdateReferral = `subscription OnUpdateReferral(
  $id: ID
  $contactId: ID
  $userId: ID
  $jobId: ID
) {
  onUpdateReferral(
    id: $id
    contactId: $contactId
    userId: $userId
    jobId: $jobId
  ) {
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
}
`;
export const onDeleteReferral = `subscription OnDeleteReferral(
  $id: ID
  $contactId: ID
  $userId: ID
  $jobId: ID
) {
  onDeleteReferral(
    id: $id
    contactId: $contactId
    userId: $userId
    jobId: $jobId
  ) {
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
}
`;
export const onCreateUserDepartment = `subscription OnCreateUserDepartment($userId: ID, $departmentId: ID) {
  onCreateUserDepartment(userId: $userId, departmentId: $departmentId) {
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
`;
export const onDeleteUserDepartment = `subscription OnDeleteUserDepartment($userId: ID, $departmentId: ID) {
  onDeleteUserDepartment(userId: $userId, departmentId: $departmentId) {
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
`;
export const onCreateWebNotification = `subscription OnCreateWebNotification(
  $id: ID
  $userId: ID
  $referralId: ID
  $jobId: ID
  $matches: Int
) {
  onCreateWebNotification(
    id: $id
    userId: $userId
    referralId: $referralId
    jobId: $jobId
    matches: $matches
  ) {
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
`;
export const onUpdateWebNotification = `subscription OnUpdateWebNotification(
  $id: ID
  $userId: ID
  $referralId: ID
  $jobId: ID
  $matches: Int
) {
  onUpdateWebNotification(
    id: $id
    userId: $userId
    referralId: $referralId
    jobId: $jobId
    matches: $matches
  ) {
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
`;
export const onDeleteWebNotification = `subscription OnDeleteWebNotification(
  $id: ID
  $userId: ID
  $referralId: ID
  $jobId: ID
  $matches: Int
) {
  onDeleteWebNotification(
    id: $id
    userId: $userId
    referralId: $referralId
    jobId: $jobId
    matches: $matches
  ) {
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
`;
export const onCreateUserInvite = `subscription OnCreateUserInvite(
  $id: ID
  $userId: ID
  $emailAddress: String
  $firstName: String
  $lastName: String
) {
  onCreateUserInvite(
    id: $id
    userId: $userId
    emailAddress: $emailAddress
    firstName: $firstName
    lastName: $lastName
  ) {
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
`;
export const onUpdateUserInvite = `subscription OnUpdateUserInvite(
  $id: ID
  $userId: ID
  $emailAddress: String
  $firstName: String
  $lastName: String
) {
  onUpdateUserInvite(
    id: $id
    userId: $userId
    emailAddress: $emailAddress
    firstName: $firstName
    lastName: $lastName
  ) {
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
`;
export const onDeleteUserInvite = `subscription OnDeleteUserInvite(
  $id: ID
  $userId: ID
  $emailAddress: String
  $firstName: String
  $lastName: String
) {
  onDeleteUserInvite(
    id: $id
    userId: $userId
    emailAddress: $emailAddress
    firstName: $firstName
    lastName: $lastName
  ) {
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
`;
