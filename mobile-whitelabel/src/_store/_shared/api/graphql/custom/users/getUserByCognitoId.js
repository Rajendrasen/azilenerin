import gql from 'graphql-tag';

export const GetUserByCognitoId = gql`
  query GetUserByCognitoId($cognitoId: ID!) {
    getUserByCognitoId(cognitoId: $cognitoId) {
      id
      authMethod
      accountClaimId
      accountClaim {
        id
        active
        eligible
        employeeId
        firstName
        lastName
        dateOfBirth
        title
        department
        atsId
        middleName
        isRehire
      }
      careerProfile
      cognitoId
      jobMatches {
        id
        active
        contactId
        userId
        jobId
        job {
          id
          companyId
          company {
            id
            name
          }
          subCompanyId
          subCompany {
            companyId
            id
            logo {
              bucket
              key
              region
            }
            name
          }
          title
          internalJobLink
          location
          departmentId
          department {
            id
            name
          }
          hideImInterested
          isGeneralReferral
          status
          referrals {
            id
            companyId
            company {
              id
              name
            }
            contactId
            userId
            jobId
            status
          }
        }
        matchStatus
        relevance
        dateCreated
      }
      companyId
      company {
          employeeDashboard
        id
        admins {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          department {
            id
            name
          }
          lastLogin
          lastNotificationCheck
          incentiveEligible
          totalReferrals
          active
          role
          userGroupId
          dateCreated
        }
        managers {
          id
          cognitoId
          companyId
          emailAddress
          firstName
          lastName
          title
          departmentId
          department {
            id
            name
          }
          lastLogin
          lastNotificationCheck
          incentiveEligible
          totalReferrals
          active
          role
          userGroupId
          dateCreated
        }
        name
        defaultBonusAmount
        contactIncentiveBonus
        websiteUrl
        dashboardReferralPolicyText
        referralBonusWaitingPeriod
        bonusEarnedNote
        allowSelfReferrals
        allowInternalMobility
        internalMobilityImage {
          bucket
          region
          key
        }
        dateCreated
        brandColor
        accountType
        logo {
          bucket
          region
          key
        }
        atsIntegration
        disableSmartReferrals
         sendReferralColor
	      applyInternallyColor
        disableSAMLLogin
        disableClaimYourAccountLogin
        confirmCompliance
        ssoGoogleDomain
        confirmContactEmails
        whiteLabel
        showPoweredByErin
        stages
        API {
          googleClientId
          microsoftClientId
        }
        theme
        symbol {
          bucket
          region
          key
        }
        background {
          bucket
          region
          key
        }
        errorImage {
          bucket
          region
          key
        }
        socialImage {
          bucket
          region
          key
        }
        subCompanies {
          companyId
          id
          name
          keywords
        }
        departments {
          active
          companyId
          id
          name
          keywords
        }
        userGroups {
          companyId
          id
          name
          keywords
        }
        enableGeneralReferrals
        disableNewReferralSMSNotification
        referralStatus
        disableManagerPermissions
        hideJobsPage
        disableShareLink
        helpUrl
        privacyUrl
        termsUrl
        linkUrl
        linkName
        enableProspectCreation
        allowSelfReferralsInternalLink
        sendAdminNotificationsOnReferral
        enableAcceptedReferralReminder
        disableExtendedUserJobsView
        enableExtendedNetwork
        enableCareerProfile
        enableJobMatching
        externalUserSignUp
        hideLoginForm
        disableReferrals
        hideBonus
        includeAdminInRanking
        disableSite
        hideInterestedForGroup
        senderEmailAddress
        whiteLabelServiceName
        host
        hideShareLinkForDepartment
        hideShareLinkNoPublicUrl
        hideDateCreatedJobDetails
        hideBonusFilterOnBrowseJobs
        subCompanyLabel
        labelDepartment
        sftpFolderName
        defaultLocation
        labelEmployeeID
        giftCardStoreAPIKeys {
          apiKey
          region
        }
        giftCardStoreBalance
        enableCustomPage
        publicLeaderboard
        hideReferralsRanking
        customPageTitle
        pointsSettings
        popupTitle
        popupTitleContent
        hideWhatsApp
        hideRecruiterInfo
        hideRecruiterInfoJobDetails
        resetPopup
        defaultToSubcompany
        appStoreUrls {
          ios
          android
        }
      }
      contacts {
        id
        firstName
        lastName
        importMethod
        emailAddress
        phoneNumber
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
        name
      }
      extendedCompanies
      extendedCompaniesData {
        id
        name
        disableExtendedUserJobsView
        enableExtendedNetwork
        enableCareerProfile
        enableJobMatching
      }
      extendedContactIds
      extendedContactData {
        id
        firstName
        lastName
        importMethod
        emailAddress
        phoneNumber
        extendedUserId
        userId
        user {
          id
          cognitoId
          firstName
          lastName
          emailAddress
          companyId
        }
        jobMatches {
          id
          contactId
          userId
          jobId
          job {
            id
            companyId
            company {
              id
              name
            }
            subCompanyId
            title
            location
            departmentId
            department {
              id
              name
            }
            hideImInterested
            isGeneralReferral
            status
            referrals {
              id
              companyId
              company {
                id
                name
              }
              contactId
              userId
              jobId
              status
            }
          }
          matchStatus
          relevance
          dateCreated
        }
        referrals {
          id
          bonuses {
            id
            amountDue
            bonusStatus
            companyId
            contactId
            earnedDate
            hireDate
            jobId
            payment
            recipientType
            referralId
            startDate
            userId
            notes
          }
          companyId
          company {
            id
            name
          }
          contactId
          contact {
            id
            emailAddress
            lastName
            firstName
            socialMediaAccounts
            phoneNumber
          }
          userId
          user {
            id
            cognitoId
            firstName
            lastName
            incentiveEligible
            userGroupId
            userGroup {
              id
              measurement
              name
              currency
            }
          }
          jobId
          job {
            id
            title
            createdById
            createdBy {
              id
              firstName
              lastName
            }
            location
            departmentId
            department {
              id
              name
            }
            referralBonus
          }
          note
          message
          hireDate
          referralDate
          referralType
          status
          questionsData
          bonusStatus
          contactResume {
            bucket
            region
            key
          }
        }
      }
      userGroupId
      userGroup {
        id
        measurement
        name
        currency
        languageCode
      }
      lastLogin
      lastNotificationCheck
      incentiveEligible
      inviteStatus
      totalReferrals
      active
      managedDepartments {
        departmentId
        department {
          id
          name
        }
      }
      connectedApps
      location
      currency
      createdById
      languageCode
      dateFormat
      isAllowJobNotification
      defaultDistance
      subCompanyId
      subCompany {
        companyId
        id
        logo {
          bucket
          key
          region
        }
        name
      }
      accessToken
      expires
      expirationDoneByToken
        openToNewRole
      jobNotificationSetting
    }
  }
`;
