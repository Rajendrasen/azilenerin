import React from 'react';
import {
    Text,
    Alert,
    StyleSheet,
    View,
    Platform,
    Linking,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
    Image,
    ImageBackground,
    Picker,
    StatusBar,
    Dimensions,
    AsyncStorage,
    KeyboardAvoidingView,
    SafeAreaView,
    PermissionsAndroid,
} from 'react-native';
import {
    getTrackingStatus,
    requestTrackingPermission,
} from 'react-native-tracking-transparency';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';
import { WebView } from 'react-native-webview';
import {
    List,
    InputItem,
    Button,
    ActivityIndicator,
} from '@ant-design/react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { listSamlAuths } from '../../../../_store/_shared/api/graphql/custom/users/list-saml';

import CountryPicker from 'react-native-country-picker-modal';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import { wpx, hpx, nf } from '../../../../_shared/constants/responsive';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import Toast from 'react-native-toast-native';
import get from 'lodash/get';
import { createForm } from 'rc-form';
import AWS from 'aws-sdk';

import { Auth } from 'aws-amplify';
import OneSignal from 'react-native-onesignal';
import { GetUserByCognitoId } from '../../../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
import { GetCompanyBySSOGoogleDomain } from '../../../../_store/_shared/api/graphql/custom/company/company-by-sso-google-domain.graphql';
import { GetUserByEmailAddress } from '../../../../_store/_shared/api/graphql/custom/users/get-user-by-email-address.graphql';
import { updateAccountClaim } from '../../../../_store/_shared/api/graphql/custom/account-claims/update-account-claim';
import { queryUserGroupsByCompanyIdIndex } from '../../../../_store/_shared/api/graphql/custom/user-groups/query-user-groups-by-companyId.graphql';
import { GetUserInvite } from '../../../../_store/_shared/api/graphql/custom/users/invited-user-with-depts.graphql';
import styles, { ListStyleOverrides } from './login-card.styles';
import { COLORS } from '../../../../_shared/styles/colors';
import Dialog from 'react-native-dialog';
import SafariView from 'react-native-safari-view';
//import {createUser} from '../../../../_store/_shared/api/graphql/mutations';
import gql from 'graphql-tag';
import { Dropdown } from 'react-native-material-dropdown';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import uuid from 'uuid/v4';
import { GetAccountClaimByEmployeeId } from '../../../../_store/_shared/api/graphql/custom/account-claims/get-account-claim-by-employee-id';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { showMessage, hideMessage } from 'react-native-flash-message';

import Geolocation from 'react-native-geolocation-service';
const CreateUser = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
        id
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
        disableSAMLLogin
        disableClaimYourAccountLogin
        confirmCompliance
        ssoGoogleDomain
        confirmContactEmails
        whiteLabel
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
        referralStatus
        referralCustomStatuses
        disableManagerPermissions
        hideJobsPage
        disableShareLink
        disableNewReferralSMSNotification
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
        giftCardStorePendingBalance
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
        internalMobilityCustomTitle
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
      employeeType
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
      jobClassId
      jobClassName
      jobFamilyGroupId
      jobFamilyGroupName
      jobFamilyId
      jobFamilyName
      jobProfileId
      jobProfileName
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
      enableAppReview
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
    }
  }
`;

// const CreateUser = gql`
//   mutation CreateUser($input: CreateUserInput!) {
//     createUser(input: $input) {
//       id
//       accountClaimId
//       active
//       avatar {
//         bucket
//         region
//         key
//       }
//       cognitoId
//       companyId
//       createdById
//       currency
//       departmentId
//       emailAddress
//       firstName
//       lastLogin
//       lastName
//       location
//       role
//       title
//       userGroupId
//       lastNotificationCheck
//       connectedApps
//       languageCode
//     }
//   }
// `;
const {
    ItemStyle,
    SubmitBtn,
    SubmitBtnContainer,
    SubmitBtnText,
    SubmitBtnActive,
    BtnContainer,
    CheckIcon,
    InputStyle,
    InputStyleContainer,
    LabelStyles,
    FormStyles,
    ForgotPasswordBtn,
    ForgotPasswordBtnText,
    ForgotPasswordBtnActive,
} = styles;
const CLIENT_ID = '6ivf9cfanmrmfikl8pdffj1oqm';
import { decryptUsingAES256, settingsData } from '../../../../settings';
import { queryDepartmentsByCompanyIdIndex } from '../../../../_store/_shared/api/graphql/save/queries';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    getAppName,
    getDomain,
    getResponse,
    getExternalLoginUrl,
    getAppFullName,
} from '../../../../WhiteLabelConfig';
import { getCompanyByHost } from '../login.graphql';
const pinterestLoginUrl =
    'https://pinterest.okta.com/login/login.htm?fromURI=%2Fapp%2Fpinterest_pinteresttalenthub_1%2Fexkdxxlcmk1IsE1Fe2p7%2Fsso%2Fsaml%3FSAMLRequest%3DfVLLTsMwELzzFZHvTmI3VRurCaqAShVw4XXgUrmOS60mtvFuUOHrcVOeQuK2Xs3srGd2drrv2uRF%250ABzDOVoSlOUm0Va4x9qki93cLOiWn9ckMZNdyL%252BY9bu2Nfu41YDIH0AEj78xZ6DsdbnV4MUrf31xV%250AZIvoQWSZNxZ1iPBURm7aA9USkPJUdvLNRaUna9ClynXZoJGZxke4jyM1Sc4j0ViJw3J%252FR7odyoEq%250Avf9ur74qlK22uO3XK5bp%252Fa7Z71vV7dgSLthCcz%252FJANwgS5LleUVW46LIp%252BvNmuZsImkhlaJlMSpp%250Audk0DS%252BZmqpRhAL0emkBpcWK8JwzyjjlkzvGBctFMUnHRf5IkodPV%252FnB1eizBXH0sSJ9sMJJMCCs%250A7DQIVOJ2fn0lIlT44NAp15L6aLsYBEOycKGT%252BD%252F30DEN3QxQET9v8PWX9v90%252BRkpqQ%252BwY0biIyQB%250AXnzltypGbG3G5ePlLPu5Zf3x%252FH0r9Ts%253D%26RelayState%3DZXlKMWMyVnlVRzl2YkVsa0lqb2lkWE10WldGemRDMHlYelF6TVdKcE5UbGFTeUlzSW5CeWIzWnBaR1Z5VG1GdFpTSTZJbEJwYm5SbGNtVnpkQ0lzSW1Oc2FXVnVkRWxrSWpvaU1YRmhhR05vTTJjNWMyTXlPREZxT1RkdlltVmhkSFp5WW1VaUxDSnlaV1JwY21WamRGVlNTU0k2SW1oMGRIQnpPaTh2Y0dsdWRHVnlaWE4wZEdGc1pXNTBhSFZpTG1OdmJTOXpZVzFzTFdGMWRHZ3ZiRzluYVc0aUxDSnlaWE53YjI1elpWUjVjR1VpT2lKMGIydGxiaUlzSW5CeWIzWnBaR1Z5Vkhsd1pTSTZJbE5CVFV3aUxDSnpZMjl3WlhNaU9sc2lZWGR6TG1OdloyNXBkRzh1YzJsbmJtbHVMblZ6WlhJdVlXUnRhVzRpTENKbGJXRnBiQ0lzSW05d1pXNXBaQ0lzSW5Cb2IyNWxJaXdpY0hKdlptbHNaU0pkTENKemRHRjBaU0k2Ym5Wc2JDd2lZMjlrWlVOb1lXeHNaVzVuWlNJNmJuVnNiQ3dpWTI5a1pVTm9ZV3hzWlc1blpVMWxkR2h2WkNJNmJuVnNiQ3dpYm05dVkyVWlPaUo2Tm5aWlREUTVaamd0TUZWeWVuTkVNSEZsWm1SNFZuZ3djVVJRTUd0V2VrWjNjVzFTVm05TmJqTnhhVXQyWmpCbVNFcGxXRTlmTjBoNk5rWkpjVEJhVFRGZmJsZzRkRlJpY2s1dlpVWkdURzQzT1VKdlVUUnVVVkZPTkZGWk4yRmhSbnBhWW14bk5IQlpjRlpCVFVSelF5MVJVVmh3VW5oQ1NVZHRhV1Y1ZVhkMlprMW5OemRyVWpJMlIyRmFja1ZLWTBWcGFETkhVamxVU1hKcFdWODBTV0ZwZDBaVVQxbGZVemdpTENKelpYSjJaWEpJYjNOMFVHOXlkQ0k2SW5CcGJuUmxjbVZ6ZEM1aGRYUm9MblZ6TFdWaGMzUXRNaTVoYldGNmIyNWpiMmR1YVhSdkxtTnZiU0lzSW1OeVpXRjBhVzl1VkdsdFpWTmxZMjl1WkhNaU9qRTJOREEyTURjd05EY3NJbk5sYzNOcGIyNGlPbTUxYkd3c0luVnpaWEpCZEhSeWFXSjFkR1Z6SWpwdWRXeHNMQ0p6ZEdGMFpVWnZja3hwYm10cGJtZFRaWE56YVc5dUlqcG1ZV3h6WlgwPTptRDNNbVIwRHc0cERPM2dWWHUvZFRVNk5DR0lTekpoNGhrZFRuUXVyM0o0PToy';
const seaworldLoginUrl =
    'https://seaworld.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=SeaWorld&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=2enbfa6a4ecst8r0eik8u4s5vv';
const resolvitLoginUrl = `https://resolvit.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Resolvit&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=150umhd4ik8at9t2gl2c8noequ`;
const kknaLoginUrl = `https://kkna.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=KKNA&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=191u954ijj63mumjl56dhin26o`;
const gfLoginURL = `https://gf.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=GannettFleming&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=25n0cuv6oen308hd81e4hdv616`;
const loginURL = `https://steelpartners.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=SteelPartners&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=6ivf9cfanmrmfikl8pdffj1oqm`;
const ztLoginUrl = `https://ztsystems.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=ZTSystems&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=4inersncal9olf147h57hhnv69`;
const kkiLoginUrl = `https://kki.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=KKI&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=1hfsooqagafkglgsgmturffb1g`;
const rushLoginUrl = `https://rush.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Rush&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&client_id=2e0ia53mrle5aonsnkjl8ah491`;
// const loginURL = `https://steelpartners.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=https://app.erinapp.com/saml/login`;
const TOKEN =
    'eyJraWQiOiJPcEtBRlZZTjhoOTAwXC83Sm9IUDQ1NGtyV2I2VXNUQlJqWmNpcVdIQlRYZz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkYTQyYzFlNC0xZDUwLTQxOWUtYjkwNC0zMzk1MDY0NDU4YzAiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNTY3Njg0OTAxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl8wbnllb2UwTW0iLCJleHAiOjE1Njc2ODg1MDEsImlhdCI6MTU2NzY4NDkwMSwidmVyc2lvbiI6MiwianRpIjoiMDQ0NzM1ZDYtMGY2ZS00M2M5LTlmODktMDI1YTJhODViM2E5IiwiY2xpZW50X2lkIjoiNml2ZjljZmFubXJtZmlrbDhwZGZmajFvcW0iLCJ1c2VybmFtZSI6IlN0ZWVsUGFydG5lcnNfZXJpbmFwcF9ob3RtYWlsLmNvbSNFWFQjQFN0ZWVsUGFydG5lcnMxLm9ubWljcm9zb2Z0LmNvbSJ9.OuqqfFzr2CR7nCNc4vQCfSbrqgj7gUTECmHjJa_QRrTK3pMWNNnQF7Lv9EZvODZKS9oolzY7CchzcsGxcKeinEHVs5CYgvV6mfyeeEdc8bTTtWlhyPXetoPiGMZIKIBWLYNDFA-cgFiWbOKWgMA1-KEKPCfrtNq2XUdD5aMrcGCyQydLhp60ZUxHSIONmrQiBygOeGYrsyF9HUgP8w3wJ13EnyzzGasmZVJW1gBcDFzqDCnMQxv4ljrwjwF72qpQBiaEaRWQdS9HzmhmBkUgyiRpRLiMY-b7OllpNskFj-E1I6Zql8DQeWqW_XOVLyQisVyAgsaJzT78H8MahqKz7w&id_token=eyJraWQiOiJ6ZXNTaTBXYWRpN2ZnK0k4RGI5NlJvcllDRUZUSDhSVjJZQmZyUlNLZW9jPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiZE9CaFlZa3JpNEs0RHFSYUhQcTU1QSIsInN1YiI6ImRhNDJjMWU0LTFkNTAtNDE5ZS1iOTA0LTMzOTUwNjQ0NThjMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfMG55ZW9lME1tIiwiY29nbml0bzp1c2VybmFtZSI6IlN0ZWVsUGFydG5lcnNfZXJpbmFwcF9ob3RtYWlsLmNvbSNFWFQjQFN0ZWVsUGFydG5lcnMxLm9ubWljcm9zb2Z0LmNvbSIsImdpdmVuX25hbWUiOiJFUklOIiwiYXVkIjoiNml2ZjljZmFubXJtZmlrbDhwZGZmajFvcW0iLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiJlcmluYXBwX2hvdG1haWwuY29tI0VYVCNAU3RlZWxQYXJ0bmVyczEub25taWNyb3NvZnQuY29tIiwicHJvdmlkZXJOYW1lIjoiU3RlZWxQYXJ0bmVycyIsInByb3ZpZGVyVHlwZSI6IlNBTUwiLCJpc3N1ZXIiOiJodHRwczpcL1wvc3RzLndpbmRvd3MubmV0XC9kYTMwYmY1ZS01OTRlLTRhMTgtOWRlOS02MDM4ZDRjN2Y5OTRcLyIsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNTY3MDI3ODQyNzM3In1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTU2NzY4NDkwMSwiZXhwIjoxNTY3Njg4NTAxLCJpYXQiOjE1Njc2ODQ5MDEsImZhbWlseV9uYW1lIjoiU3VwcG9ydCIsImVtYWlsIjoiZXJpbmFwcEBob3RtYWlsLmNvbSJ9.ImLNc83gBU2nlLGvDi1h4WaHJb5D_TnQpKz3eWE6f0URTV7iynH4B_3qPEYgLe0U6YKhIJiDyq53JUnYNCUklpp-Jk78XKeIMAt0UluVOe5JUCWnu_y3jdP_j3ZcMvLiGJWgGsd5ivB2uaVy371MiU3tConwRTNN04fE7Hov7qOkeBpNOM4_iT954dpuTyybEk8PSufAh9TtU30js2b0LfWYZTUOag1210sg0oQ8FwmyMVs_cFYnmD6qaWcdCRihWgGUhWtsgDZGSFm_brXmRYOGV1AIDk27S3EOpBNck6uqBYIb15onp9dWjRMoS22cdks_ipA4t3QbnXFo1RBpLQ&token_type=Bearer&expires_in=3600';
const logoutURL = `https://ehealth.auth.us-east-2.amazoncognito.com/logout?client_id=${CLIENT_ID}&logout_uri=https://app.erinapp.com/saml/login`;

var compId = '';
class LoginCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            externalUserCompanyId: '',
            samlAuths: [],
            invalidCredentials: false,
            resetPasswordValue: '',
            resetConfirmPasswordValue: '',
            resetPassDialog: false,
            serverError: false,
            dialogVisible: false,
            codedialogVisible: false,
            code: '',
            FirstName: '',
            LastName: '',
            email: '',
            company: '',
            Job: '',
            companyName: [],
            loading: false, //for the organization code modal
            pageLoading: false, //for the page loader,
            registerModalError: false,
            emailRegex: false,
            loginLoader: false,
            departmentHeader: 'Department',
            provider: '',
            currency: 'USD',
            currencyModal: false,
            resetPassLoader: false,
            location: {},
            locationModal: false,
            accountClaim: false,
            dob: null,
            employeeId: '',
            password: '',
            departments: [],
            userInvite: null,
            accountClaimData: '',
            defaultUserGroupId: '',
            noBonusUserGroupId: '',
            claimEligible: '',
            googleModal: false,
            googleLoader: false,
            externalSignup: false,
            adModal: false,
            hideLoginForm: false,
            externalSignupforheartland: false,
            tempHide: false,
            activeStatus: true,
            disableClaimYourAccountLogin: false,
            enableAppReview: false,

            // api driven signup key
            externalUserSignup: false,
        };
    }

    parseJwt = (inputToken) => {
        const token = inputToken;
        if (!token) {
            return;
        }
        const parts = token
            .split('.')
            .map((part) =>
                Buffer.from(
                    part.replace(/-/g, '+').replace(/_/g, '/'),
                    'base64',
                ).toString(),
            );

        let payload = JSON.parse(parts[1]);
        return payload;
    };

    componentDidMount() {
        this.setState({ loginLoader: true });
        this.listSamlAuths();
        // this.queryDepartmentsByCompanyId(externalUserCompanyId);
        this.getCompanyByHost();
        console.log('account claim', this.state.accountClaim);
        Linking.addEventListener('url', this.eventHandler);
        setTimeout(() => {
            this.setState({ loginLoader: false });
        }, 2000);
    }

    listSamlAuths = () => {
        this.props.client
            .query({
                query: listSamlAuths,
                variables: {
                    filter: {
                        active: { eq: true },
                    },
                },
            })
            .then((res) => {
                console.log('saml res', res);
                this.setState({ samlAuths: res.data.listSAMLAuths.items });
            });
    };

    getCompanyByHost = () => {
        console.log('called the host');
        this.props.client
            .query({
                query: getCompanyByHost,
                variables: {
                    host: getDomain(),
                },
            })
            .then(async (res) => {
                console.log('result', res);
                console.log('company by host', getAppName());
                var comp = res.data.getCompanyByHost;
                console.log('>>>>>>>', comp?.hideLoginForm);
                this.queryDepartmentsByCompanyId(comp.id);
                compId = comp.id;
                this.setState({ externalUserCompanyId: comp.id });
                console.log('com id', comp?.disableClaimYourAccountLogin);
                console.log('comp.externalUserSignUp', comp.externalUserSignUp);
                if (comp.externalUserSignUp && comp.whiteLabel) {
                    if (
                        getAppName() == 'VILIVING' ||
                        getAppName() == 'northWestReferrals'
                    ) {
                        if (!comp?.active) {
                            console.log('comp?.active', comp?.active);
                            this.setState({
                                activeStatus: false,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                            //alert("account has been deleted")
                            // AsyncStorage.clear();
                            // this.props.client.cache.reset();
                            // await Auth.signOut();
                            // this.props.signOut();
                        }
                        if (this.state.externalSignup) {
                            this.setState({
                                externalSignup: false,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        } else {
                            this.setState({
                                externalSignup: true,
                                disableClaimYourAccountLogin:
                                    comp?.disableClaimYourAccountLogin,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        }
                    } else {
                        console.log(
                            'for the heartland affiliate ',
                            comp.externalUserSignUp,
                        );
                        if (getAppName() == 'heartlandAffiliation') {
                            this.setState({
                                externalSignup: false,
                                externalSignupforheartland: true,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        } else {
                            this.setState({
                                externalSignup: true,
                                externalSignupforheartland: true,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        }
                    }
                } else {
                    if (
                        getAppName() == 'VILIVING' ||
                        getAppName() == 'northWestReferrals'
                    ) {
                        if (this.state.externalSignup) {
                            this.setState({
                                externalSignup: false,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        } else {
                            console.log('inside external sin u');
                            this.setState({
                                externalSignup: true,
                                externalUserSignup: comp?.externalUserSignUp,
                                enableAppReview: comp?.enableAppReview
                            });
                        }
                    } else if (getAppName() == 'gannettFleming') {
                        this.setState({
                            externalUserSignup: comp?.externalUserSignUp,
                            disableClaimYourAccountLogin: comp?.disableClaimYourAccountLogin,
                            enableAppReview: comp?.enableAppReview
                        });
                    }
                }
                if (comp?.hideLoginForm) {
                    this.setState({
                        hideLoginForm: true,
                        externalUserSignup: comp?.externalUserSignUp,
                        disableClaimYourAccountLogin: comp?.disableClaimYourAccountLogin,
                        enableAppReview: comp?.enableAppReview
                    });
                }
            })
            .catch((err) => {
                console.log('Error Company By Host : ', err);
            });
    };

    updateNewPassword = () => {
        if (this.state.resetPasswordValue.length != 8) {
            alert('New password must be at least 8 characters long.');
            return false;
        }
        if (this.state.resetPasswordValue != this.state.resetConfirmPasswordValue) {
            alert('Passwords do not match. Please try again.');
            return false;
        }
        this.setState({ resetPassLoader: true });
        let user = this.state.authUser;
        let newPassword = this.state.resetConfirmPasswordValue;
        var params = {
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ClientId: get(user, 'pool.clientId'),
            ChallengeResponses: {
                USERNAME: get(user, 'username'),
                NEW_PASSWORD: newPassword,
            },
            Session: get(user, 'Session'),
        };
        let url = `https://i81om4wybf.execute-api.us-east-2.amazonaws.com/default/settings`;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((res) => {
                AWS.config.update({
                    region: decryptUsingAES256(
                        settingsData.region,
                        res.AesSecretKey,
                        res.AesSecretIVKey,
                    ),
                    accessKeyId: decryptUsingAES256(
                        settingsData.accessKeyId2,
                        res.AesSecretKey,
                        res.AesSecretIVKey,
                    ),
                    secretAccessKey: decryptUsingAES256(
                        settingsData.secretAccessKey2,
                        res.AesSecretKey,
                        res.AesSecretIVKey,
                    ),
                });
                var cognitoidentityserviceprovider =
                    new AWS.CognitoIdentityServiceProvider();
                cognitoidentityserviceprovider.respondToAuthChallenge(
                    params,
                    (err, data) => {
                        if (err) {
                            console.log(err, err.stack);
                            showMessage({
                                message: 'Something went wrong, Please try again later',
                                type: 'danger',
                            });
                            this.setState({ resetPassLoader: false });
                        } else {
                            console.log('date', data);
                            showMessage({
                                message: 'Password updated successfully',
                                type: 'success',
                            });
                            this.setState({ resetPassDialog: false, resetPassLoader: false });
                        }
                    },
                );
            });
    };
    fetchReverseGeo = (lat, lng) => {
        const key = 'AIzaSyDA9bz4iuSAItrIUdJI8KiASKgLHGcUkjg';

        fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            lat +
            ',' +
            lng +
            '&key=' +
            key,
        )
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'OK') {
                    if (responseJson.results[1]) {
                        for (var i = 0; i < responseJson.results.length; i++) {
                            if (responseJson.results[i].types[0] === 'locality') {
                                let city = get(
                                    responseJson.results[i].address_components[0],
                                    'long_name',
                                );
                                //  updateCityProfile(city);
                                let state = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 2
                                    ],
                                    'long_name',
                                );
                                //   updateStateProfile(state);
                                let country = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 1
                                    ],
                                    'long_name',
                                );
                                //  updateCountryProfile(country);
                                this.setState({
                                    location: {
                                        city,
                                        state,
                                        country,
                                    },
                                });
                            }
                        }
                    } else {
                        console.log('No reverse geocode results.');
                    }
                }
                // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            });
    };
    queryDepartmentsByCompanyId = (companyId) => {
        this.props.client
            .query({
                query: gql(queryDepartmentsByCompanyIdIndex),
                variables: {
                    companyId:
                        this.mapProviderToCompanyId(this.state.provider) || companyId,
                    first: 200,
                },
            })
            .then((data) => {
                // console.log("companyid", data.data.queryDepartmentsByCompanyIdIndex.items)
                console.log('dept res', data);
                let arr = [];
                data.data.queryDepartmentsByCompanyIdIndex.items.map(
                    (company, index) => {
                        var obj = {
                            value: company.name,
                            id: company.id,
                        };
                        arr.push(obj);
                        if (
                            data.data.queryDepartmentsByCompanyIdIndex.items.length - 1 ==
                            index
                        ) {
                            this.setState({
                                companyName: arr,
                            });
                        }
                    },
                );
            });
    };
    getDepartments = async (companyId) => {
        let res = await this.props.client.query({
            query: gql(queryDepartmentsByCompanyIdIndex),
            variables: {
                companyId: companyId,
                first: 1000,
            },
        });
        let depts = get(res, 'data.queryDepartmentsByCompanyIdIndex.items');
        let arr = depts.map((dep) => {
            return { value: dep.name, id: dep.id };
        });
        this.setState({ companyName: arr });
    };
    getCompanyIdBySSOGoogleDomain = async (ssoGoogleDomain) => {
        console.log('domain', ssoGoogleDomain);
        const { client } = this.props;
        try {
            const { data } = await client.query({
                query: GetCompanyBySSOGoogleDomain,
                variables: { ssoGoogleDomain },
            });
            console.log('datacomp', data);
            const company = {
                ...data.getCompanyBySSOGoogleDomain,
            };
            return company;
        } catch (e) {
            console.log('error ', e);
            alert(
                'The provided google account does not match a company on record. Please sign in using your company email address.',
            );
            return '';
        }
    };
    adLogin = async (tokenData) => {
        const email = get(tokenData, 'email', '');
        const emailDomain = email.split('@')[1];
        console.log('emaildomani', emailDomain);
        // debugger
        // console.log(tokenData["cognito:username"])
        let provider = get(tokenData, ['identities'], []);
        provider = get(provider[0], 'providerName', null);
        console.log('provider', provider);
        let companyId = this.mapProviderToCompanyId(provider);
        console.log('comap', companyId);
        if (!companyId) {
            let company = await this.getCompanyIdBySSOGoogleDomain(emailDomain);
            console.log('com', company);
            companyId = company.id;
            console.log('companyid', companyId);
        }
        console.log('token data', tokenData);
        this.setState(
            {
                codedialogVisible: false,
                email: tokenData.email,
                cognitoId: tokenData['cognito:username'],
                adEmployeeId: tokenData['custom:employeeid'],
                FirstName: tokenData.given_name,
                LastName: tokenData.family_name,
                Job: tokenData['custom:jobtitle'],
                departmentHeader:
                    provider === 'SteelPartners' ? 'Company' : 'Department',
                provider: provider,
            },
            () => {
                console.log('hhhhhhhhh', this.state);
                this.queryDepartmentsByCompanyId(companyId);
                this.getDefaultUserGroup(companyId);
            },
        );
        try {
            console.log('state', this.state);
            const { data } = await this.props.client.query({
                query: GetUserByCognitoId,
                variables: { cognitoId: tokenData['cognito:username'] },
            });
            console.log('getuserbycognito', data);
            const { setCurrentUser, onAuthentication } = this.props;
            const trackingStatus = await getTrackingStatus();
            console.log('tracking status', trackingStatus);
            if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
                // enable tracking features
                OneSignal.sendTags({
                    userId: data.getUserByCognitoId.id,
                    companyId: data.getUserByCognitoId.companyId,
                    departmentId: data.getUserByCognitoId.departmentId,
                });
                //  OneSignal.inFocusDisplaying(2);
            }
            // debugger

            await setCurrentUser(data.getUserByCognitoId);
            Actions.tabbar();
            this.setState({ loading: false });
            // this.forceUpdate();
            // debugger

            // onAuthentication();
        } catch (error) {
            console.log('stateee', this.state);
            this.setState(
                {
                    codedialogVisible: false,
                },
                () => {
                    setTimeout(() => {
                        this.setState({ dialogVisible: true });
                    }, 1000);
                },
            );

            this.setState({ loading: false });
        }
    };
    eventHandler = (event) => {
        if (!event.url.match('callback')) {
            if (Platform.OS === 'ios') {
                SafariView.dismiss();
                console.log('ios');
            }
            this.setState({
                codedialogVisible: false,
            });

            let tokenData = this.parseJwt(
                Platform.OS === 'ios'
                    ? event.url.split('=')[1]
                    : event.url.split('=')[2],
            );
            // console.log('tokenData 1 ', tokenData1);
            // let tokenData = {
            //   "cognito:username": "SteelPartners_terinapp@steelpartners.com"
            // }
            this.adLogin(tokenData);
            // // console.log(tokenData);
        }
    };
    mapProviderToCompanyId = (provider) => {
        console.log('inside map provider', provider);
        let companyId = '';
        this.state.samlAuths.map((item) => {
            if (item.provider.toLowerCase() == provider.toLowerCase()) {
                // console.log('item', item.companyId);
                companyId = item.companyId;
            } else {
                return null;
            }
        });
        return companyId;
        // switch (provider) {
        //   case 'SteelPartners':
        //     return '1dd11d1e-6977-4a33-a803-64b76a54cf0d';
        //   case 'GannettFleming':
        //     return '401de09c-ec8e-4816-b405-a8726534b0af';
        //   case 'ZTSystems':
        //     return 'e600195e-d1d9-4163-8b22-f0f250c4bcfd';
        //   case 'KKI':
        //     return '23da896d-ee3e-4204-b0b2-d1097ca5b343';
        //   case 'Rush':
        //     return '6badc90b-9cf5-4c7e-ae38-5d6df1dd088a';
        //   case 'KKNA':
        //     return '23da896d-ee3e-4204-b0b2-d1097ca5b343';
        //   case 'Resolvit':
        //     return '95790c4b-8cd6-4f86-aba2-e02f113ae4f7';
        //   case 'SeaWorld':
        //     return '7d51747c-f954-493c-b49d-8931faf28025';
        //   case 'Pinterest':
        //     return 'a422a18d-601c-442f-9fc9-3d1e7642fbdb';
        //   default:
        //     return null;
        // }
    };

    getUserInvite = (id) => {
        this.props.client
            .query({
                query: GetUserInvite,
                variables: { id: id },
            })
            .then((res) => {
                this.setState({ userInvite: res.data.getUserInvite });
            });
    };
    getDefaultUserGroup = (id) => {
        return this.props.client
            .query({
                query: queryUserGroupsByCompanyIdIndex,
                variables: {
                    companyId: id,
                    first: 500,
                },
            })
            .then((data) => {
                console.log('usergroup', data);
                const userGroups = get(
                    data,
                    'data.queryUserGroupsByCompanyIdIndex.items',
                    [],
                );
                const defaultUserGroup = userGroups.filter(
                    (group) => group.name === 'Default',
                )[0];
                const defaultUserGroupId = get(defaultUserGroup, 'id');
                const defaultExternalUserGroup = userGroups.filter(
                    (group) => group.name === 'External',
                )[0];
                const defaultExternalUserGroupId = get(defaultExternalUserGroup, 'id');
                const noBonusUserGroup = userGroups.filter(
                    (group) => group.name === 'Ineligible',
                )[0];
                const noBonusUserGroupId = get(noBonusUserGroup, 'id');
                this.setState({
                    userGroups,
                    defaultUserGroupId,
                    noBonusUserGroupId,
                    defaultExternalUserGroupId,
                });
            });
    };

    async SignUpHandler() {
        var cognitoID;
        if (this.state.externalSignup) {
            await this.getDefaultUserGroup(this.state.externalUserCompanyId);
        }
        // console.log('ooo', this.state);
        this.setState({ registerModalError: false });
        if (
            this.state.email &&
            this.state.FirstName &&
            this.state.Job &&
            this.state.LastName &&
            this.state.company
        ) {
            //console.log('indside if', this.state);
            let companyId = this.mapProviderToCompanyId(this.state.provider);
            if (!companyId) {
                let company = await this.getCompanyIdBySSOGoogleDomain(
                    this.state.email.split('@')[1],
                );
                console.log('signupcompany', company);
                companyId = company.id;
            }
            Auth.signUp({
                username: uuid(),
                password: this.state.password,
                attributes: {
                    email: this.state.email.toLowerCase(),
                },
            }).then((resp) => {
                cognitoID = resp?.user?.username;
                console.log('rwspoo', resp);
                let input = {
                    cognitoId: cognitoID,
                    firstName: this.state.FirstName,
                    lastName: this.state.LastName,
                    title: this.state.Job,
                    companyId: this.state.externalUserCompanyId,
                    emailAddress: this.state.email,
                    role: 'employee',
                    avatar: null,
                    lastLogin: null,
                    active: true,
                    createdById: this.state.externalUserCompanyId,
                    departmentId: this.state.company,
                    location: JSON.stringify({
                        city: this.state.location.city ? this.state.location.city : null,
                        state: this.state.location.state ? this.state.location.state : null,
                        country: this.state.location.country
                            ? this.state.location.country
                            : null,
                    }),
                    currency: this.state.currency ? this.state.currency : 'USD',
                    userGroupId: this.state.defaultUserGroupId,
                };
                if (this.state.adEmployeeId) {
                    input.employeeId = this.state.adEmployeeId;
                }
                console.log('input', input);
                this.setState({ dialogVisible: false, pageLoading: true });
                let CreateUserInput = input;
                try {
                    this.props.client
                        .mutate({
                            mutation: CreateUser,
                            variables: {
                                input: input,
                            },
                        })
                        .then(async (result) => {
                            console.log('createuser', result);
                            const { setCurrentUser, onAuthentication } = this.props;
                            const { data } = await this.props.client.query({
                                query: GetUserByCognitoId,
                                variables: { cognitoId: cognitoID },
                            });
                            console.log('createcognit', data);
                            const trackingStatus = await getTrackingStatus();
                            console.log('tracking status', trackingStatus);
                            if (
                                trackingStatus === 'authorized' ||
                                trackingStatus === 'unavailable'
                            ) {
                                // enable tracking features
                                OneSignal.sendTags({
                                    userId: data.getUserByCognitoId.id,
                                    companyId: data.getUserByCognitoId.companyId,
                                    departmentId: data.getUserByCognitoId.departmentId,
                                });
                                //     OneSignal.inFocusDisplaying(2);
                            }
                            await setCurrentUser(data.getUserByCognitoId);
                            Actions.tabbar();
                            this.setState({ pageLoading: false });
                            // onAuthentication();
                            // this.props.onStateChange("signedIn", {});
                            // console.log(result)
                        });
                } catch (error) {
                    console.log('error is ', error);
                }
            });

            console.log('aaaaaaaa', this.state.adEmployeeId);
        } else {
            // Toast.fail('Please fill all the fields', Toast.SHORT);
            this.setState({
                registerModalError: true,
                pageLoading: false,
            });

            // Alert.alert('Warning!', 'Please fill all the fields!!!')
        }
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });
    };

    handleCancel = () => {
        this.setState({ dialogVisible: false });
    };
    handleCancelCode = () => {
        this.setState({ codedialogVisible: false });
    };

    pressHandler(code, url) {
        // alert('url')
        // console.log(code + "url" + url)
        if (code) {
            if (code.toLowerCase() == 'steelpartners') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url,
                    }).then((result) => {
                        this.setState({ loading: true });
                        this.setState({
                            codedialogVisible: false,
                        });
                        console.log('result', JSON.stringify(result));
                    })
                    : Linking.openURL(url).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'gf') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: gfLoginURL,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(gfLoginURL).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'rush') {
                Linking.openURL(rushLoginUrl).then((result) => {
                    this.setState({
                        codedialogVisible: false,
                    });
                });
            } else if (code.toLowerCase() == 'zt') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: ztLoginUrl,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(ztLoginUrl).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'kki') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: kkiLoginUrl,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(kkiLoginUrl).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'kkna') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: kknaLoginUrl,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(kknaLoginUrl).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'resolvit') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: resolvitLoginUrl,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(resolvitLoginUrl).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else if (code.toLowerCase() == 'seaworld') {
                Platform.OS === 'ios'
                    ? SafariView.show({
                        url: seaworldLoginUrl,
                    })
                        .then((result) => {
                            this.setState({ loading: true });
                            this.setState({
                                codedialogVisible: false,
                            });
                            console.log('result', JSON.stringify(result));
                        })
                        .catch((err) => console.log('error', err))
                    : Linking.openURL(seaworldLoginUrl).then((result) => {
                        this.setState({
                            codedialogVisible: false,
                        });
                    });
            } else {
                this.setState({ dialogVisible: false });
                Alert.alert(
                    'Login Failed',
                    'You have entered invalid organization code.',
                );
            }
        } else {
            Alert.alert('Alert', 'Please enter organization code.');
        }
        this.setState({ code: '' });
    }

    handleSubmit = () => {
        requestTrackingPermission();
        this.setState({
            serverError: false,
            invalidCredentials: false,
            loginLoader: true,
        });
        // if (this.state.activeStatus == false) {
        //     alert("Invalid username or password")
        //     this.setState({
        //         serverError: true,
        //         invalidCredentials: true,
        //         loginLoader: false,
        //     });
        //     return;
        // }
        const { onAuthentication, setCurrentUser } = this.props;
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({
                    serverError: true,
                    errorMessage: err.message,
                    loginLoader: false,
                });
                return;
            }
            // debugger
            Auth.signIn(values.email.toLowerCase(), values.password)
                .catch((err) => {
                    this.setState({
                        loginLoader: false,
                    });
                    Alert.alert('Error:', err.message, [{ text: 'OK' }], {
                        cancelable: false,
                    });
                    // return this.onReset();
                })
                .then(async (user) => {
                    console.log('auth user sign in ', user);
                    // debugger
                    if (get(user, 'challengeName') === 'NEW_PASSWORD_REQUIRED') {
                        this.setState({
                            resetPassDialog: true,
                            authUser: user,
                            loginLoader: false,
                        });
                        return;
                    }
                    if (!user) return;

                    const { data } = await this.props.client.query({
                        query: GetUserByCognitoId,
                        variables: { cognitoId: user.username },
                    });
                    if (data?.getUserByCognitoId?.active) {
                        const trackingStatus = await getTrackingStatus();
                        // console.log('tracking status', trackingStatus);
                        if (
                            trackingStatus === 'authorized' ||
                            trackingStatus === 'unavailable'
                        ) {
                            // enable tracking features
                            OneSignal.sendTags({
                                userId: data.getUserByCognitoId.id,
                                companyId: data.getUserByCognitoId.companyId,
                                departmentId: data.getUserByCognitoId.departmentId,
                            });
                            //    OneSignal.inFocusDisplaying(2);
                        }
                        // debugger
                        await setCurrentUser(data.getUserByCognitoId);
                        console.log('current user data :', data.getUserByCognitoId);
                        // onAuthentication(user.signInUserSession.accessToken.jwtToken);
                        // await AsyncStorage.setItem('userDetails', JSON.stringify(data.getUserByCognitoId));
                        Actions.tabbar();
                    } else {
                        alert('Invalid username or password');
                        this.setState({
                            serverError: true,
                            invalidCredentials: true,
                            loginLoader: false,
                        });
                    }
                })
                .catch((err) => {
                    if (err.code === 'NotAuthorizedException') {
                        this.setState({ invalidCredentials: true, loginLoader: false });
                    } else {
                        this.setState({ serverError: true, loginLoader: false });
                        console.error(err);
                    }
                });
        });
    };

    onReset = () => {
        this.props.form.resetFields();
    };

    validateEmail = (rule, value, callback) => {
        if (value) {
            callback();
        }
    };
    handleAddressSelect = (val) => {
        if (val) {
            let addArray = val.formatted_address.split(',');
            let country = addArray[addArray.length - 1];
            let state = addArray[addArray.length - 2];
            let city = addArray[0];
            this.setState({
                location: { country: country, state: state, city: city },
                locationModal: false,
            });
        }
    };
    handleAndroidPermission = () => {
        if (Platform.OS == 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Allow location access for better experience.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: customTranslate('ml_Cancel'),
                    buttonPositive: 'OK',
                },
            ).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getLocation();
                }
            });
        } else {
            Geolocation.requestAuthorization('whenInUse').then(() => {
                this.getLocation();
            });
        }
    };
    getLocation = () => {
        Geolocation.getCurrentPosition(
            (info) => {
                this.fetchReverseGeo(info.coords.latitude, info.coords.longitude);
            },
            (err) => console.log('blocked'),
        );
    };
    getUserByEmail = async (email) => {
        let emailExists = await this.props.client.query({
            query: GetUserByEmailAddress,
            variables: {
                emailAddress: email,
            },
        });
    };
    handleExternalSignup = async () => {
        console.log('nnnnnnnnnnnnnn');
        if (this.state.externalSignup) {
            await this.getDefaultUserGroup(this.externalUserCompanyId);
        }
        console.log('this.state', this.state);
        let re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
            this.state.email &&
            this.state.FirstName &&
            this.state.Job &&
            this.state.LastName &&
            this.state.password
            //aus code
            //this.state.company
        ) {
            if (this.state.password.length < 8) {
                alert(customTranslate('ml_MinPasswordLength'));
                return;
            }
            if (!re.test(this.state.email)) {
                alert(customTranslate('ml_InvalidEmailId'));
                return;
            }
            this.setState({
                pageLoading: true,
                dialogVisible: false,
                registerModalError: false,
            });
            const { userInvite, defaultUserGroupId, defaultExternalUserGroupId } =
                this.state;
            const { onCreate, onUpdateInvite } = this.props;
            this.props.client
                .query({
                    query: GetUserByEmailAddress,
                    variables: {
                        emailAddress: this.state.email.trim().toLowerCase(),
                    },
                })
                .then((result) => {
                    alert('An user with this email address already exists.');
                    this.setState({ pageLoading: false });
                })
                .catch((e) => {
                    const accountClaim = get(this.state, 'accountClaimData');
                    const accountClaimId = get(accountClaim, 'id');
                    Auth.signUp({
                        username: uuid(),
                        password: this.state.password,
                        attributes: {
                            email: this.state.email.toLowerCase(),
                        },
                    }).then((data) => {
                        console.log('2111', data);
                        let userGroupId = get(
                            defaultExternalUserGroupId,
                            'userGroupId',
                            defaultUserGroupId,
                        );
                        if (userGroupId === 'null' || userGroupId === null) {
                            userGroupId = defaultUserGroupId;
                        }
                        // if (!this.state.claimEligible && this.state.noBonusUserGroupId) {
                        //   userGroupId = this.state.noBonusUserGroupId;
                        // }
                        let input = {
                            cognitoId: get(data, 'user.username'),
                            companyId: this.state.externalUserCompanyId,
                            emailAddress: this.state.email,
                            role: 'employee',
                            firstName: get(this.state, 'FirstName'),
                            lastName: get(this.state, 'LastName'),
                            title: get(this.state, 'Job'),
                            departmentId: this.state.companyName.filter(
                                (item) => item.value.toLowerCase() == 'other',
                            )[0].id,
                            avatar: null,
                            lastLogin: null,
                            active: true,
                            createdById: this.state.externalUserCompanyId,
                            userGroupId: userGroupId,
                            location: JSON.stringify({
                                city: get(this.state, 'city', null),
                                state: get(this.state, 'state', null),
                                country: get(this.state, 'country', null),
                            }),
                            currency: get(this.state, 'currency') || 'USD',
                            languageCode: null,
                        };
                        console.log('input', input);

                        this.props.client
                            .mutate({
                                mutation: createUser,
                                variables: { input },
                            })
                            .then((response) => {
                                console.log('createuser', response);
                                const newUser = get(response, 'data.createUser');

                                this.setState({
                                    pageLoading: false,
                                    registerModalError: false,
                                    dialogVisible: false,
                                    dob: null,
                                    employeeId: '',
                                });
                                // Toast.show('Account Claimed Successfully', Toast.SHORT, Toast.TOP, {
                                //   backgroundColor: COLORS.dashboardGreen,
                                //   height: 50,
                                //   width: 250,
                                //   borderRadius: 10,
                                // });
                                showMessage({
                                    message: 'Account Created Successfully',
                                    type: 'success',
                                });
                            })
                            .catch((err) => {
                                console.log('oncreate error', err);
                                this.setState({ pageLoading: false, dob: null, employeeId: '' });
                            });
                    });
                });
        } else {
            this.setState({
                pageLoading: false,
                registerModalError: true,
            });
        }
    };
    handleAccountClaimFinalSubmit = () => {
        console.log('external signup');
        let re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (
            this.state.email &&
            this.state.FirstName &&
            this.state.Job &&
            this.state.LastName &&
            this.state.password &&
            //aus code
            this.state.company
        ) {
            if (this.state.password.length < 8) {
                alert(customTranslate('ml_MinPasswordLength'));
                return;
            }
            if (!re.test(this.state.email)) {
                alert(customTranslate('ml_InvalidEmailId'));
                return;
            }
            this.setState({
                pageLoading: true,
                dialogVisible: false,
                registerModalError: false,
            });
            const { userInvite, defaultUserGroupId } = this.state;
            const { onCreate, onUpdateInvite } = this.props;
            this.props.client
                .query({
                    query: GetUserByEmailAddress,
                    variables: {
                        emailAddress: this.state.email.trim().toLowerCase(),
                    },
                })
                .then((result) => {
                    alert('An user with this email address already exists.');
                    this.setState({ pageLoading: false });
                })
                .catch((e) => {
                    const accountClaim = get(this.state, 'accountClaimData');
                    const accountClaimId = get(accountClaim, 'id');
                    Auth.signUp({
                        username: uuid(),
                        password: this.state.password,
                        attributes: {
                            email: this.state.email.toLowerCase(),
                        },
                    }).then((data) => {
                        let userGroupId = get(
                            userInvite,
                            'userGroupId',
                            defaultUserGroupId,
                        );
                        if (userGroupId === 'null' || userGroupId === null) {
                            userGroupId = defaultUserGroupId;
                        }
                        if (!this.state.claimEligible && this.state.noBonusUserGroupId) {
                            userGroupId = this.state.noBonusUserGroupId;
                        }
                        let input = {
                            cognitoId: get(data, 'user.username'),
                            companyId: get(
                                userInvite,
                                'companyId',
                                get(accountClaim, 'companyId'),
                            ),
                            emailAddress: get(this.state, 'email').trim().toLowerCase(),
                            role: get(userInvite, 'role', 'employee'),
                            firstName: get(this.state, 'FirstName'),
                            lastName: get(this.state, 'LastName'),
                            title: get(this.state, 'Job'),
                            //aus code
                            departmentId: get(this.state, 'company'),
                            departmentId: this.state.companyName.filter(
                                (item) => item.value.toLowerCase() == 'other',
                            )[0].id,
                            avatar: null,
                            lastLogin: null,
                            active: get(accountClaim, 'active', true),
                            createdById: get(
                                userInvite,
                                'createdById',
                                get(accountClaim, 'companyId'),
                            ),
                            userGroupId,
                            location: JSON.stringify({
                                city: get(this.state, 'city', null),
                                state: get(this.state, 'state', null),
                                country: get(this.state, 'country', null),
                            }),
                            currency: get(this.state, 'currency') || 'USD',
                        };
                        if (accountClaimId) {
                            input.accountClaimId = accountClaimId;
                        }
                        if (this.state.employeeId) {
                            input.employeeId = this.state.employeeId;
                        }
                        // if (accountClaimId) {
                        //   input.accountClaimId = accountClaimId;
                        //   this.props.client.mutate({
                        //     mutation: gql(updateAccountClaim),
                        //     variables: {
                        //       input: {
                        //         id: accountClaimId,
                        //         claimed: true,
                        //       },
                        //     },
                        //   });
                        // }
                        this.props.client
                            .mutate({
                                mutation: createUser,
                                variables: { input },
                            })
                            .then((response) => {
                                const newUser = get(response, 'data.createUser');
                                if (userInvite) {
                                    onUpdateInvite({
                                        input: {
                                            id: userInvite.id,
                                            userId: newUser.id,
                                        },
                                    });
                                }
                                if (accountClaimId) {
                                    input.accountClaimId = accountClaimId;
                                    this.props.client
                                        .mutate({
                                            mutation: gql(updateAccountClaim),
                                            variables: {
                                                input: {
                                                    id: accountClaimId,
                                                    claimed: true,
                                                    userId: newUser.id,
                                                },
                                            },
                                        })
                                        .then((res) => console.log('updateclaim', res))
                                        .catch((err) => console.log('CLAIMERROR', err));
                                }
                                this.setState({
                                    pageLoading: false,
                                    registerModalError: false,
                                    dialogVisible: false,
                                    dob: null,
                                    employeeId: '',
                                });
                                // Toast.show('Account Claimed Successfully', Toast.SHORT, Toast.TOP, {
                                //   backgroundColor: COLORS.dashboardGreen,
                                //   height: 50,
                                //   width: 250,
                                //   borderRadius: 10,
                                // });
                                showMessage({
                                    message: 'Account Claimed Successfully',
                                    type: 'success',
                                });
                            })
                            .catch((err) => {
                                console.log('oncreate error', err);
                                this.setState({ pageLoading: false, dob: null, employeeId: '' });
                            });
                    });
                });
        } else {
            this.setState({
                pageLoading: false,
                registerModalError: true,
            });
        }
    };
    handleAccountClaimSubmit = () => {
        let { employeeId, dob } = this.state;
        // employeeId = '1009582'
        // dob = new Date('10/19/1958');
        console.log('employeeId', employeeId);
        console.log('dob', dob);
        if (!employeeId) {
            alert('Please enter Employee ID');
            return;
        }
        if (!dob) {
            alert(customTranslate('ml_PleaseEnterDateOfBirth'));
            return;
        }
        this.props.client
            .query({
                query: GetAccountClaimByEmployeeId,
                variables: {
                    employeeId: employeeId.trim().toLowerCase(),
                    dateOfBirth: dob.format('MM-DD-YYYY'),
                },
            })
            .then((res) => {
                console.log('rees', res);
                const claim = get(res, 'data.getAccountClaimByEmployeeIdDOB');
                console.log(
                    res.data.getAccountClaimByEmployeeIdDOB.dateOfBirth,
                    '<<<<  got dob',
                );
                console.log(dob, 'have dob');
                console.log(claim, 'have dob');

                if (
                    dob.format('MM/DD/YYYY').replace(/\D/g, '') ===
                    moment(claim?.dateOfBirth, 'MM/DD/YYYY')
                        .format('MM/DD/YYYY')
                        .replace(/\D/g, '')
                ) {
                    if (claim?.active) {
                        if (!claim?.claimed) {
                            this.setState(
                                {
                                    codedialogVisible: false,
                                    accountClaimData: claim,
                                    FirstName:
                                        res.data.getAccountClaimByEmployeeIdDOB.firstName || null,
                                    LastName:
                                        res.data.getAccountClaimByEmployeeIdDOB.lastName || null,
                                    Job: res.data.getAccountClaimByEmployeeIdDOB.title || null,
                                    claimEligible: claim?.eligible,
                                },
                                () => {
                                    setTimeout(() => {
                                        this.setState({ dialogVisible: true });
                                    }, 1000);
                                },
                            );
                            this.getDepartments(claim?.companyId);
                            this.getDefaultUserGroup(claim?.companyId);
                            this.getUserInvite(employeeId);
                        } else {
                            alert(customTranslate('ml_AccountAlreadyClaimed'));
                        }
                    } else {
                        alert('Account is not active.');
                    }
                } else {
                    alert(customTranslate('ml_InvalidDateOfBirth'));
                }
            })
            .catch((err) => {
                console.log(err);
                alert(customTranslate('ml_InvalidEmployeeID'));
            });
    };

    onPressLoginWithCompanyButton = async () => {
        try {
            const trackingStatus = await getTrackingStatus();
            let fullAppName = getAppFullName();
            console.log('tracking status', trackingStatus);
            if (
                Platform.OS == 'ios' &&
                (trackingStatus === 'restricted' ||
                    trackingStatus === 'not-determined' ||
                    !trackingStatus)
            ) {
                Alert.alert(
                    'Allow "' +
                    fullAppName +
                    '" to track your activity across other companies’ apps and websites?',
                    'Allow in app analytic and usage tracking so that we can provide a better experience in future updates and send custom notifications.',
                    [
                        {
                            text: 'Ask App Not to Track',
                            onPress: () =>
                                this.setState({
                                    codedialogVisible: true,
                                    accountClaim: false,
                                    //dialogVisible: true,
                                }),
                        },
                        {
                            text: 'Allow',
                            onPress: () =>
                                this.setState({
                                    codedialogVisible: true,
                                    accountClaim: false,
                                    //dialogVisible: true,
                                }),
                        },
                    ],
                );
            } else {
                this.setState({
                    codedialogVisible: true,
                    accountClaim: false,
                    //dialogVisible: true,
                });
            }
        } catch (error) {
            console.log('Error Message', error.message);
        }
    };

    renderLoginWithCompanyButton = () => {
        let app = getAppName();
        // if (app != 'erin') return null;

        return (
            <TouchableOpacity
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: hpx(50),
                }}
                activeStyle={ForgotPasswordBtnActive}
                onPress={() => this.onPressLoginWithCompanyButton()}>
                <Text style={ForgotPasswordBtnText}>
                    {customTranslate('ml_Or')} {customTranslate('ml_LogWithCompany')}
                </Text>
            </TouchableOpacity>
        );
    };
    render() {
        if (getAppName() == 'VILIVING' || getAppName() == 'northWestReferrals') {
            const { getFieldError, getFieldDecorator } = this.props.form;
            return (
                <View
                    style={
                        getAppName() == 'northWestReferrals'
                            ? { marginBottom: 50 }
                            : { marginBottom: 1 }
                    }>
                    <List
                        styles={StyleSheet.create(ListStyleOverrides)}
                        style={[
                            FormStyles,
                            !this.state.externalSignup && { backgroundColor: 'transparent' },
                        ]}
                        renderHeader={() => null}
                        renderFooter={() =>
                            (this.state.externalSignup &&
                                getFieldError('email') &&
                                getFieldError('email').join(',')) ||
                            (getFieldError('password') && getFieldError('password').join(','))
                        }>
                        {this.state.pageLoading && (
                            <View
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}>
                                <ActivityIndicator size="large" />
                            </View>
                        )}
                        {this.state.externalSignup && (
                            <React.Fragment>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_EmailAddress')}
                                    </Text>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: customTranslate('ml_NotAValidEmailAddress'),
                                            },
                                            {
                                                required: true,
                                                message: 'E-mail Required',
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            clear
                                            type="email"
                                            numberOfLines={1}
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                        />,
                                    )}
                                </View>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_Password')}
                                    </Text>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: customTranslate('ml_PasswordRequired'),
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            type="password"
                                            clear
                                            onSubmitEditing={this.handleSubmit}
                                            returnKeyType="go"
                                        />,
                                    )}
                                </View>
                            </React.Fragment>
                        )}

                        <View style={[ItemStyle, BtnContainer]}>
                            {this.state.externalSignup && (
                                <Button
                                    style={ForgotPasswordBtn}
                                    activeStyle={ForgotPasswordBtnActive}
                                    // onClick={() => this.props.onStateChange('forgotPassword', {})}
                                    onPress={() => Actions.forgotPassword()}>
                                    <Text style={ForgotPasswordBtnText}>
                                        {customTranslate('ml_ForgotYourPassword')}
                                    </Text>
                                </Button>
                            )}

                            <Modal visible={this.state.googleModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.blackTransparent,
                                    }}>
                                    <View
                                        style={{ width: 350, height: 700, backgroundColor: 'white' }}>
                                        <Text
                                            onPress={() => this.setState({ googleModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({
                                                        googleModal: false,
                                                        pageLoading: true,
                                                    });
                                                    this.adLogin(tokenData);
                                                    // this.props.client
                                                    //   .query({
                                                    //     query: GetUserByCognitoId,
                                                    //     variables: {
                                                    //       cognitoId: tokenData['cognito:username'],
                                                    //     },
                                                    //   })
                                                    //   .then((user) => {
                                                    //     console.log('user', user);
                                                    //     let {setCurrentUser} = this.props;
                                                    //     setCurrentUser(user.data.getUserByCognitoId);
                                                    //     Actions.tabbar();
                                                    //   })
                                                    //   .catch((error) => {
                                                    //     console.log('llll', tokenData.email.split('@')[1]);
                                                    //     this.props.client
                                                    //       .query({
                                                    //         query: GetCompanyBySSOGoogleDomain,
                                                    //         variables: {
                                                    //           ssoGoogleDomain: tokenData.email.split('@')[1],
                                                    //         },
                                                    //       })
                                                    //       .then((company) => {
                                                    //         console.log('company', company);
                                                    //       });
                                                    //   });
                                                }
                                            }}
                                            source={{
                                                uri: 'https://erinapp.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&client_id=56v63ge0a84vvtij0eat6i45p3',
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                            userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </Modal>
                            <Modal visible={this.state.adModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                    <SafeAreaView
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'white',
                                        }}>
                                        <Text
                                            onPress={() => this.setState({ adModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                console.log('vallll', val);
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({ adModal: false, pageLoading: true });
                                                    this.adLogin(tokenData);
                                                    // this.props.client
                                                    //   .query({
                                                    //     query: GetUserByCognitoId,
                                                    //     variables: {
                                                    //       cognitoId: tokenData['cognito:username'],
                                                    //     },
                                                    //   })
                                                    //   .then((user) => {
                                                    //     console.log('user', user);
                                                    //     let {setCurrentUser} = this.props;
                                                    //     setCurrentUser(user.data.getUserByCognitoId);
                                                    //     Actions.tabbar();
                                                    //   })
                                                    //   .catch((error) => {
                                                    //     console.log('llll', tokenData.email.split('@')[1]);
                                                    //     this.props.client
                                                    //       .query({
                                                    //         query: GetCompanyBySSOGoogleDomain,
                                                    //         variables: {
                                                    //           ssoGoogleDomain: tokenData.email.split('@')[1],
                                                    //         },
                                                    //       })
                                                    //       .then((company) => {
                                                    //         console.log('company', company);
                                                    //       });
                                                    //   });
                                                }
                                            }}
                                            source={{
                                                uri: getExternalLoginUrl(),
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        </View>
                        {this.state.externalSignup && (
                            <View style={[ItemStyle, SubmitBtnContainer]}>
                                {this.state.loginLoader ? (
                                    <ActivityIndicator size="large" color={COLORS.blue} />
                                ) : (
                                    <Button
                                        onPress={this.handleSubmit}
                                        style={[SubmitBtn, { marginBottom: 10 }]}
                                        activeStyle={SubmitBtnActive}>
                                        <Text style={[SubmitBtnText]}>
                                            {customTranslate('ml_LogIn')}{' '}
                                        </Text>
                                        <SimpleIcon
                                            name="arrow-right-circle"
                                            size={18}
                                            color={COLORS.white}
                                        />
                                    </Button>
                                )}
                            </View>
                        )}

                        {this.state.invalidCredentials && (
                            <View style={ItemStyle}>
                                <Text>{this.state.errorMessage}</Text>
                            </View>
                        )}
                        <View style={[ItemStyle, BtnContainer]}>
                            {getAppName() == 'Apploi' ? (
                                this.renderLoginWithCompanyButton()
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        //marginTop: 10,
                                        alignItems: 'center',
                                        backgroundColor: COLORS.primary,
                                        height: 50,
                                        justifyContent: 'center',
                                    }}
                                    activeStyle={ForgotPasswordBtnActive}
                                    onPress={() => {
                                        requestTrackingPermission();
                                        this.setState({ adModal: true });
                                    }}

                                // onPress={() => this.pressHandler(loginURL)}
                                >
                                    <Text
                                        style={[
                                            ForgotPasswordBtnText,
                                            { color: 'white', fontSize: 15 },
                                        ]}>
                                        {getAppName() == 'allied'
                                            ? 'Login with Company Account'
                                            : 'Login with Employee Account'}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* <TouchableOpacity
                                style={{
                                    //marginTop: 10,
                                    alignItems: 'center',
                                    backgroundColor: COLORS.primary,
                                    height: 50,
                                    justifyContent: 'center',
                                }}
                                activeStyle={ForgotPasswordBtnActive}
                                onPress={() => {
                                    requestTrackingPermission();
                                    this.setState({ adModal: true });
                                }}

                            // onPress={() => this.pressHandler(loginURL)}
                            >
                                <Text
                                    style={[ForgotPasswordBtnText, { color: 'white', fontSize: 15 }]}>
                                    Login with Employee Account
                             </Text>
                            </TouchableOpacity> */}

                            {this.state.externalSignup &&
                                this.state.disableClaimYourAccountLogin && (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ dialogVisible: true })}
                                        style={{ marginTop: 10, alignItems: 'center' }}>
                                        <Text style={{ ...ForgotPasswordBtnText }}>
                                            Create An Account
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            {this.state.disableClaimYourAccountLogin && (
                                <TouchableOpacity
                                    style={{ marginTop: 10, alignItems: 'center' }}
                                    activeStyle={ForgotPasswordBtnActive}
                                    onPress={() =>
                                        this.setState({
                                            codedialogVisible: true,
                                            accountClaim: true,
                                            //dialogVisible: true,
                                        })
                                    }

                                // onPress={() => this.pressHandler(loginURL)}
                                >
                                    <Text style={ForgotPasswordBtnText}>
                                        {customTranslate('ml_Or')}
                                        {customTranslate('ml_ClaimYourAccount')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Dialog.Container
                            visible={this.state.resetPassDialog}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>Your Password has expired</Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>New Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        secureTextEntry
                                        onChangeText={(text) => {
                                            this.setState({ resetPasswordValue: text });
                                        }}
                                        value={this.state.resetPasswordValue}
                                    />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>Confirm Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        onChangeText={(text) => {
                                            this.setState({ resetConfirmPasswordValue: text });
                                        }}
                                        value={this.state.resetConfirmPasswordValue}
                                    />
                                </View>
                            </View>

                            {!this.state.resetPassLoader ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => this.updateNewPassword()}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button
                                label="Cancel"
                                onPress={() => this.setState({ resetPassDialog: false })}
                            />
                        </Dialog.Container>

                        <Dialog.Container
                            visible={this.state.codedialogVisible}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>
                                {this.state.accountClaim
                                    ? customTranslate('ml_ClaimYourAccount')
                                    : customTranslate('ml_EnterOrganisationCode')}
                            </Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                {this.state.accountClaim ? (
                                    <View>
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_EmployeeId')}:
                                        </Text>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: COLORS.buttonGrayOutline,
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ employeeId: text });
                                            }}
                                            value={this.state.employeeId}
                                        />
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_DateOfBirth')}:
                                        </Text>
                                      <DatePicker
                                            style={{ width: '100%' }}
                                            date={this.state.dob}
                                            showIcon={false}
                                            mode="date"
                                            placeholder="select date"
                                            format="MM-DD-YYYY"
                                            //maxDate={moment().format('MM/DD/YYYY')}
                                            //maxDate="2016-06-01"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0,
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                },
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({
                                                    dob: moment(date, 'MM-DD-YYYY'),
                                                });
                                            }}
                                        /> 
                                    </View>
                                ) : (
                                    <View>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: 'black',
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                                borderColor: COLORS.buttonGrayOutline,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ code: text });
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            {this.state.codedialogVisible ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() =>
                                        this.state.accountClaim
                                            ? this.handleAccountClaimSubmit()
                                            : this.pressHandler(this.state.code, loginURL)
                                    }>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button label="Cancel" onPress={this.handleCancelCode} />
                            {!this.state.accountClaim && (
                                <View style={{ alignItems: 'center' }}>
                                    <Text>or</Text>
                                    <GoogleSigninButton
                                        style={{ width: 192, height: 48, marginVertical: 5 }}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Dark}
                                        onPress={async () => {
                                            this.setState({ codedialogVisible: false }, () => {
                                                setTimeout(
                                                    () => this.setState({ googleModal: true }),
                                                    500,
                                                );
                                            });
                                        }}
                                    />
                                </View>
                            )}
                        </Dialog.Container>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.dialogVisible}
                            onRequestClose={() => {
                                // console.log('closed')
                            }}>
                            <View style={styles1.modalCard}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 30,
                                        marginRight: 20,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                dialogVisible: false,
                                                pageLoading: false,
                                            });
                                        }}>
                                        <Image
                                            style={{ width: 20, height: 20, borderRadius: 10 }}
                                            source={require('../../../../_shared/assets/close.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <KeyboardAwareScrollView>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 20,
                                            }}>
                                            {customTranslate('ml_LetsGetStarted')}
                                        </Text>
                                        <Text style={{ textAlign: 'center' }}>
                                            {customTranslate('ml_FirstCompleteYourProfile')}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: 30 }}>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_FirstName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.FirstName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ FirstName: text });
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_LastName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.LastName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ LastName: text });
                                            }}
                                        />
                                    </View>
                                    {/* aus code */}
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {this.state.departmentHeader}
                                        </Text>
                                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                                            <Dropdown
                                                label={'Select a ' + this.state.departmentHeader}
                                                data={this.state.companyName}
                                                selectedItem={(item) => {
                                                    // console.log(item);
                                                }}
                                                onChangeText={(value, i, d) => {
                                                    // console.log('+++++++++  ', value);
                                                    // console.log('+++++++++ ----- ', i);
                                                    let newArr = this.state.companyName.filter(
                                                        (v, index) => {
                                                            return index == i;
                                                        },
                                                    );
                                                    // console.log('============', newArr);
                                                    this.setState({ company: newArr[0].id }, () => {
                                                        // console.log('++++++++  ', this.state.company);
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                    {/* <View>
                <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>{customTranslate('ml_Currency')}</Text>
                <CountryPicker
                  withCurrency
                  onSelect={val =>
                    this.setState({ currency: val.currency[0], currencyModal: false })
                  }
                  containerButtonStyle={{ backgroundColor: 'red' }}
                  visible={this.state.currencyModal}
                  renderFlagButton={() => (
                    <TouchableOpacity
                      onPress={() => this.setState({ currencyModal: true })}
                      style={[styles1.form, { justifyContent: 'center', margin: 10 }]}
                    >
                      <Text>{this.state.currency}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View> */}
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_JobTitle')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ Job: text });
                                            }}
                                            value={this.state.Job}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_Email')}
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles1.form,
                                                { backgroundColor: COLORS.lightGray2 },
                                            ]}
                                            editable={this.state.externalSignup ? true : false}
                                            value={this.state.email}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ email: text });
                                            }}
                                        />
                                    </View>
                                    {!this.state.email &&
                                        !this.state.accountClaim &&
                                        !this.state.externalSignup &&
                                        (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                Email address of user is not available.
                                            </Text>
                                        )}
                                    {this.state.accountClaim || this.state.externalSignup ? (
                                        <View>
                                            <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                                {customTranslate('ml_Password')}
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles1.form,
                                                    { backgroundColor: COLORS.lightGray2 },
                                                ]}
                                                value={this.state.password}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                onChangeText={(text) => {
                                                    this.setState({ password: text });
                                                }}
                                                secureTextEntry
                                            />
                                        </View>
                                    ) : null}

                                    <View>
                                        {this.state.registerModalError && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                * {customTranslate('ml_PleaseFillTheRequiredFields')}
                                            </Text>
                                        )}

                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginRight: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={styles1.inputTitle}>
                                                    {customTranslate('ml_Location')}
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        //backgroundColor: COLORS.blue,
                                                        //padding: 10,
                                                        borderRadius: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={this.handleAndroidPermission}>
                                                    <EvilIcon
                                                        name="location"
                                                        size={25}
                                                        color={COLORS.blue}
                                                    />
                                                    <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                                        {customTranslate('ml_AutofillLocation')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_City')}:{' '}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.setState({ locationModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text>{this.state.location.city}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_State')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text style={{ color: COLORS.lightGray }}>
                                                        {this.state.location.state}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_Country')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text style={{ color: COLORS.lightGray }}>
                                                        {this.state.location.country}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                                color: COLORS.darkGray,
                                            }}>
                                            {customTranslate('ml_BySignUp')},{' '}
                                            {customTranslate('ml_IAgreeToTheErin')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL(
                                                        'https://erinapp.com/privacy-policy/',
                                                    );
                                                }}>
                                                {customTranslate('ml_PrivacyPolicy')}
                                            </Text>{' '}
                                            {customTranslate('ml_And')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL('https://erinapp.com/terms-of-use/');
                                                }}>
                                                {customTranslate('ml_TermsOfServices')}
                                            </Text>
                                            , and agree that we can send you information about jobs
                                            and referrals at your company. You can opt out at any
                                            time.
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.red,
                                            padding: 10,
                                            margin: 15,
                                            height: 40,
                                            borderRadius: 5,
                                        }}
                                        onPress={() =>
                                            // this.state.accountClaim
                                            //   ? this.handleAccountClaimFinalSubmit()
                                            //   : this.state.externalSignup
                                            //   ? this.handleExternalSignup()
                                            //   : this.SignUpHandler()
                                            this.SignUpHandler()
                                        }>
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                            }}>
                                            {customTranslate('ml_GetStarted')}
                                        </Text>
                                    </TouchableOpacity>
                                </KeyboardAwareScrollView>
                            </View>
                            <Modal visible={this.state.locationModal} animationType="slide">
                                <SafeAreaView style={{ flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <GooglePlacesAutocomplete
                                            placeholder={customTranslate('ml_Search')}
                                            minLength={1} // minimum length of text to search
                                            autoFocus={true}
                                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                            listViewDisplayed="auto" // true/false/undefined
                                            fetchDetails={true}
                                            onPress={(data, details = null) => {
                                                // 'details' is provided when fetchDetails = true

                                                this.handleAddressSelect(details);
                                            }}
                                            getDefaultValue={() => ''}
                                            query={{
                                                // available options: https://developers.google.com/places/web-service/autocomplete
                                                key: 'AIzaSyBFPKs7Ueh6G-5TqgsFKCaJagKwizTvDlY',
                                                language: 'en', // language of the results
                                                types: '(cities)', // default: 'geocode'
                                            }}
                                            styles={{
                                                textInputContainer: {
                                                    width: '100%',
                                                },
                                                description: {
                                                    fontWeight: 'bold',
                                                },
                                                predefinedPlacesDescription: {
                                                    color: '#1faadb',
                                                },
                                            }}
                                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                            GooglePlacesDetailsQuery={{
                                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                                fields: 'formatted_address',
                                            }}
                                            debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                            renderLeftButton={() => (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: COLORS.red,
                                                        paddingHorizontal: 10,
                                                        justifyContent: 'center',
                                                        margin: 5,
                                                        borderRadius: 5,
                                                    }}
                                                    onPress={() => this.setState({ locationModal: false })}>
                                                    <Text style={{ color: '#fff' }}>
                                                        {customTranslate('ml_Cancel')}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </SafeAreaView>
                            </Modal>
                        </Modal>
                    </List>

                    {!this.state.externalSignup ? (
                        <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Or
                            </Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Login with Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                }}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: customTranslate('ml_NotAValidEmailAddress'),
                                        },
                                        {
                                            required: true,
                                            message: 'E-mail Required',
                                        },
                                    ],
                                })(
                                    <InputItem
                                        styles={{
                                            container: {
                                                backgroundColor: 'white',
                                                flex: 1,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                borderWidth: 0,
                                                padding: 5,
                                            },
                                        }}
                                        clear
                                        type="email"
                                        numberOfLines={1}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />,
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.form.validateFields((err, values) => {
                                            if (err) alert('Invalid Email');
                                            if (values.email.toLowerCase().includes('erinapp.com')) {
                                                this.setState({ externalSignup: true });
                                            } else {
                                                console.log('dfdg', getAppName());
                                                if (getAppName() == 'allied') {
                                                    this.setState({ externalSignup: true });
                                                    console.log(
                                                        'externalUserSignup',
                                                        this.state.externalUserSignup,
                                                    );
                                                } else {
                                                    console.log('dfdg', getAppName());
                                                    showMessage(
                                                        'Please click on "Login with Employee Account"',
                                                    );
                                                }
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                    }}>
                                    <EvilIcon name="arrow-right" color={'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                </View>
            );
        } else {
            const { getFieldError, getFieldDecorator } = this.props.form;
            return getAppName() == 'IQVIA' ||
                getAppName() == 'heartland' ||
                getAppName() == 'seaworld' ||
                getAppName() == 'Twilio' ||
                getAppName() == 'talentreef' ||
                getAppName() == 'heartlandAffiliation' ||
                getAppName() == 'GoDaddy' ? (
                <View>
                    {getAppName() == 'talentreef' && (
                        <Image
                            source={require('../../../../_shared/talentreef/talent_reef_logo.png')}
                            resizeMode="contain"
                            style={{ height: hpx(70), width: wpx(350), alignSelf: 'center' }}
                        />
                    )}
                    <List
                        styles={StyleSheet.create(ListStyleOverrides)}
                        style={[
                            FormStyles,
                            !this.state.externalSignup && { backgroundColor: 'transparent' },
                        ]}
                        renderHeader={() => null}
                        renderFooter={() =>
                            (this.state.externalSignup &&
                                getFieldError('email') &&
                                getFieldError('email').join(',')) ||
                            (getFieldError('password') && getFieldError('password').join(','))
                        }>
                        {this.state.pageLoading && (
                            <View
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}>
                                <ActivityIndicator size="large" />
                            </View>
                        )}
                        {this.state.externalSignup && (
                            <React.Fragment>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_EmailAddress')}
                                    </Text>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: customTranslate('ml_NotAValidEmailAddress'),
                                            },
                                            {
                                                required: true,
                                                message: 'E-mail Required',
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            clear
                                            type="email"
                                            numberOfLines={1}
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                        />,
                                    )}
                                </View>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_Password')}
                                    </Text>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: customTranslate('ml_PasswordRequired'),
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            type="password"
                                            clear
                                            onSubmitEditing={this.handleSubmit}
                                            returnKeyType="go"
                                        />,
                                    )}
                                    {/* password eye icon to be implemented here */}
                                </View>
                            </React.Fragment>
                        )}

                        <View style={[ItemStyle, BtnContainer]}>
                            {this.state.externalSignup && (
                                <Button
                                    style={ForgotPasswordBtn}
                                    activeStyle={ForgotPasswordBtnActive}
                                    onPress={() => Actions.forgotPassword()}>
                                    <Text style={ForgotPasswordBtnText}>
                                        {customTranslate('ml_ForgotYourPassword')}
                                    </Text>
                                </Button>
                            )}

                            <Modal visible={this.state.googleModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.blackTransparent,
                                    }}>
                                    <View
                                        style={{ width: 350, height: 700, backgroundColor: 'white' }}>
                                        <Text
                                            onPress={() => this.setState({ googleModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito={false}
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({
                                                        googleModal: false,
                                                        pageLoading: true,
                                                    });
                                                    this.adLogin(tokenData);
                                                }
                                            }}
                                            source={{
                                                uri: 'https://erinapp.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&client_id=56v63ge0a84vvtij0eat6i45p3',
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                            userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </Modal>
                            <Modal visible={this.state.adModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                    <SafeAreaView
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'white',
                                        }}>
                                        <Text
                                            onPress={() => this.setState({ adModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                console.log('vallll', val);
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({ adModal: false, pageLoading: true });
                                                    this.adLogin(tokenData);
                                                }
                                            }}
                                            source={{
                                                uri: getExternalLoginUrl(),
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        </View>
                        {this.state.externalSignup && (
                            <View style={[ItemStyle, SubmitBtnContainer]}>
                                {this.state.loginLoader ? (
                                    <ActivityIndicator size="large" color={COLORS.blue} />
                                ) : (
                                    <Button
                                        onPress={this.handleSubmit}
                                        style={[SubmitBtn, { marginBottom: 10 }]}
                                        activeStyle={SubmitBtnActive}>
                                        <Text style={[SubmitBtnText]}>
                                            {customTranslate('ml_LogIn')}{' '}
                                        </Text>
                                        <SimpleIcon
                                            name="arrow-right-circle"
                                            size={18}
                                            color={COLORS.white}
                                        />
                                    </Button>
                                )}
                            </View>
                        )}

                        {this.state.invalidCredentials && (
                            <View style={ItemStyle}>
                                <Text>{this.state.errorMessage}</Text>
                            </View>
                        )}
                        <View style={[ItemStyle, BtnContainer]}>
                            <TouchableOpacity
                                style={{
                                    //marginTop: 10,
                                    alignItems: 'center',
                                    backgroundColor: COLORS.primary,
                                    height: 50,
                                    justifyContent: 'center',
                                }}
                                activeStyle={ForgotPasswordBtnActive}
                                onPress={() => {
                                    if (getAppName() != 'IQVIA') {
                                        // console.log(getResponse());

                                        Linking.openURL(getExternalLoginUrl());
                                    } else {
                                        requestTrackingPermission();
                                        this.setState({ adModal: true });
                                    }
                                }}>
                                <Text
                                    style={[
                                        ForgotPasswordBtnText,
                                        { color: 'white', fontSize: 15 },
                                    ]}>
                                    {getAppName() == 'allied'
                                        ? 'Login with Company Account'
                                        : 'Login with Employee Account'}
                                </Text>
                            </TouchableOpacity>
                            {this.state.externalSignupforheartland &&
                                this.state.externalSignup && (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ dialogVisible: true })}
                                        style={{ marginTop: 10, alignItems: 'center' }}>
                                        <Text style={ForgotPasswordBtnText}>Create An Account</Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                        <Dialog.Container
                            visible={this.state.resetPassDialog}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>Your Password has expired</Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>New Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        secureTextEntry
                                        onChangeText={(text) => {
                                            this.setState({ resetPasswordValue: text });
                                        }}
                                        value={this.state.resetPasswordValue}
                                    />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>Confirm Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        onChangeText={(text) => {
                                            this.setState({ resetConfirmPasswordValue: text });
                                        }}
                                        value={this.state.resetConfirmPasswordValue}
                                    />
                                </View>
                            </View>

                            {!this.state.resetPassLoader ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => this.updateNewPassword()}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button
                                label="Cancel"
                                onPress={() => this.setState({ resetPassDialog: false })}
                            />
                        </Dialog.Container>

                        <Dialog.Container
                            visible={this.state.codedialogVisible}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>
                                {this.state.accountClaim
                                    ? customTranslate('ml_ClaimYourAccount')
                                    : customTranslate('ml_EnterOrganisationCode')}
                            </Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                {this.state.accountClaim ? (
                                    <View>
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_EmployeeId')}:
                                        </Text>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: COLORS.buttonGrayOutline,
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ employeeId: text });
                                            }}
                                            value={this.state.employeeId}
                                        />
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_DateOfBirth')}:
                                        </Text>
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            date={this.state.dob}
                                            showIcon={false}
                                            mode="date"
                                            placeholder="select date"
                                            format="MM-DD-YYYY"
                                            //maxDate={moment().format('MM/DD/YYYY')}
                                            //maxDate="2016-06-01"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0,
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                },
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({
                                                    dob: moment(date, 'MM-DD-YYYY'),
                                                });
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <View>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: 'black',
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                                borderColor: COLORS.buttonGrayOutline,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ code: text });
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            {this.state.codedialogVisible ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() =>
                                        this.state.accountClaim
                                            ? this.handleAccountClaimSubmit()
                                            : this.pressHandler(this.state.code, loginURL)
                                    }>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button label="Cancel" onPress={this.handleCancelCode} />
                            {!this.state.accountClaim && (
                                <View style={{ alignItems: 'center' }}>
                                    <Text>or</Text>
                                    <GoogleSigninButton
                                        style={{ width: 192, height: 48, marginVertical: 5 }}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Dark}
                                        onPress={async () => {
                                            this.setState({ codedialogVisible: false }, () => {
                                                setTimeout(
                                                    () => this.setState({ googleModal: true }),
                                                    500,
                                                );
                                            });
                                        }}
                                    />
                                </View>
                            )}
                        </Dialog.Container>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.dialogVisible}
                            onRequestClose={() => {
                                // console.log('closed')
                            }}>
                            <View style={styles1.modalCard}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 30,
                                        marginRight: 20,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                dialogVisible: false,
                                                pageLoading: false,
                                            });
                                        }}>
                                        <Image
                                            style={{ width: 20, height: 20, borderRadius: 10 }}
                                            source={require('../../../../_shared/assets/close.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <KeyboardAwareScrollView>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 20,
                                            }}>
                                            {customTranslate('ml_LetsGetStarted')}
                                        </Text>
                                        <Text style={{ textAlign: 'center' }}>
                                            {customTranslate('ml_FirstCompleteYourProfile')}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: 30 }}>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_FirstName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.FirstName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ FirstName: text });
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_LastName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.LastName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ LastName: text });
                                            }}
                                        />
                                    </View>
                                    {/* aus code */}
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {this.state.departmentHeader}
                                        </Text>
                                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                                            <Dropdown
                                                label={'Select a ' + this.state.departmentHeader}
                                                data={this.state.companyName}
                                                selectedItem={(item) => {
                                                    // console.log(item);
                                                }}
                                                onChangeText={(value, i, d) => {
                                                    // console.log('+++++++++  ', value);
                                                    // console.log('+++++++++ ----- ', i);
                                                    let newArr = this.state.companyName.filter(
                                                        (v, index) => {
                                                            return index == i;
                                                        },
                                                    );
                                                    // console.log('============', newArr);
                                                    this.setState({ company: newArr[0].id }, () => {
                                                        // console.log('++++++++  ', this.state.company);
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_JobTitle')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ Job: text });
                                            }}
                                            value={this.state.Job}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_Email')}
                                        </Text>

                                        {this.state.enableAppReview == true &&
                                            <TextInput
                                                style={[
                                                    styles1.form,
                                                ]}
                                                value={this.state.email}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                onChangeText={(text) => {
                                                    this.setState({ email: text });
                                                }}
                                            />
                                        }

                                        {this.state.enableAppReview == false &&
                                            <TextInput
                                                style={[
                                                    styles1.form,
                                                    { backgroundColor: COLORS.lightGray2 },
                                                ]}
                                                editable={this.state.externalSignup ? true : false}
                                                value={this.state.email}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                onChangeText={(text) => {
                                                    this.setState({ email: text });
                                                }}
                                            />
                                        }
                                    </View>
                                    {!this.state.email &&
                                        !this.state.accountClaim &&
                                        !this.state.externalSignup &&
                                        this.state.enableAppReview == false &&
                                        (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                Email address of user is not available.
                                            </Text>
                                        )}
                                    {this.state.accountClaim || this.state.externalSignup ? (
                                        <View>
                                            <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                                {customTranslate('ml_Password')}
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles1.form,
                                                    { backgroundColor: COLORS.lightGray2 },
                                                ]}
                                                value={this.state.password}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                onChangeText={(text) => {
                                                    this.setState({ password: text });
                                                }}
                                                secureTextEntry
                                            />
                                        </View>
                                    ) : null}

                                    <View>
                                        {this.state.registerModalError && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                * {customTranslate('ml_PleaseFillTheRequiredFields')}
                                            </Text>
                                        )}

                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginRight: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={styles1.inputTitle}>
                                                    {customTranslate('ml_Location')}
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        //backgroundColor: COLORS.blue,
                                                        //padding: 10,
                                                        borderRadius: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={this.handleAndroidPermission}>
                                                    <EvilIcon
                                                        name="location"
                                                        size={25}
                                                        color={COLORS.blue}
                                                    />
                                                    <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                                        {customTranslate('ml_AutofillLocation')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_City')}:{' '}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.setState({ locationModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text>{this.state.location.city}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_State')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                            backgroundColor: COLORS.lightGray3,
                                                        },
                                                    ]}>
                                                    <Text>
                                                        {this.state.location.state}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_Country')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                            backgroundColor: COLORS.lightGray3,
                                                        },
                                                    ]}>
                                                    <Text>
                                                        {this.state.location.country}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                                color: COLORS.darkGray,
                                            }}>
                                            {customTranslate('ml_BySignUp')},{' '}
                                            {customTranslate('ml_IAgreeToTheErin')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL(
                                                        'https://erinapp.com/privacy-policy/',
                                                    );
                                                }}>
                                                {customTranslate('ml_PrivacyPolicy')}
                                            </Text>{' '}
                                            {customTranslate('ml_And')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL('https://erinapp.com/terms-of-use/');
                                                }}>
                                                {customTranslate('ml_TermsOfServices')}
                                            </Text>
                                            , and agree that we can send you information about jobs
                                            and referrals at your company. You can opt out at any
                                            time.
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.red,
                                            padding: 10,
                                            margin: 15,
                                            height: 40,
                                            borderRadius: 5,
                                        }}
                                        onPress={() => this.SignUpHandler()}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                            }}>
                                            {customTranslate('ml_GetStarted')}
                                        </Text>
                                    </TouchableOpacity>
                                </KeyboardAwareScrollView>
                            </View>
                            <Modal visible={this.state.locationModal} animationType="slide">
                                <SafeAreaView style={{ flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <GooglePlacesAutocomplete
                                            placeholder={customTranslate('ml_Search')}
                                            minLength={1} // minimum length of text to search
                                            autoFocus={true}
                                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                            listViewDisplayed="auto" // true/false/undefined
                                            fetchDetails={true}
                                            onPress={(data, details = null) => {
                                                // 'details' is provided when fetchDetails = true

                                                this.handleAddressSelect(details);
                                            }}
                                            getDefaultValue={() => ''}
                                            query={{
                                                // available options: https://developers.google.com/places/web-service/autocomplete
                                                key: 'AIzaSyBFPKs7Ueh6G-5TqgsFKCaJagKwizTvDlY',
                                                language: 'en', // language of the results
                                                types: '(cities)', // default: 'geocode'
                                            }}
                                            styles={{
                                                textInputContainer: {
                                                    width: '100%',
                                                },
                                                description: {
                                                    fontWeight: 'bold',
                                                },
                                                predefinedPlacesDescription: {
                                                    color: '#1faadb',
                                                },
                                            }}
                                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                            GooglePlacesDetailsQuery={{
                                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                                fields: 'formatted_address',
                                            }}
                                            debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                            renderLeftButton={() => (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: COLORS.red,
                                                        paddingHorizontal: 10,
                                                        justifyContent: 'center',
                                                        margin: 5,
                                                        borderRadius: 5,
                                                    }}
                                                    onPress={() => this.setState({ locationModal: false })}>
                                                    <Text style={{ color: '#fff' }}>
                                                        {customTranslate('ml_Cancel')}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </SafeAreaView>
                            </Modal>
                        </Modal>
                    </List>

                    {this.state.enableAppReview == true && this.state.externalSignup == false && (
                        <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Or
                            </Text>
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Login with Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                }}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: customTranslate('ml_NotAValidEmailAddress'),
                                        },
                                        {
                                            required: true,
                                            message: 'E-mail Required',
                                        },
                                    ],
                                })(
                                    <InputItem
                                        styles={{
                                            container: {
                                                backgroundColor: 'white',
                                                flex: 1,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                borderWidth: 0,
                                                padding: 5,
                                            },
                                        }}
                                        clear
                                        type="email"
                                        numberOfLines={1}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />,
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.form.validateFields((err, values) => {
                                            if (err) alert('Invalid Email');
                                            if (
                                                values.email.toLowerCase().includes('erinapp.com')
                                            ) {
                                                this.setState({ externalSignup: true });
                                            } else {
                                                if (getAppName() == 'allied') {
                                                    this.setState({ externalSignup: true });
                                                } else {
                                                    showMessage(
                                                        'Please click on "Login with Employee Account"',
                                                    );
                                                }
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                    }}>
                                    <EvilIcon name="arrow-right" color={'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: hpx(20), alignItems: 'center' }}>
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                    Or
                                </Text>
                                <TouchableOpacity onPress={() => this.setState({ dialogVisible: true })}>
                                    <Text
                                        style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                        Create An Account
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {this.state.enableAppReview != true && Platform.OS == 'android' && (getAppName() == 'heartland' || getAppName() == 'heartlandAffiliation') && this.state.externalSignup == false && (
                        <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Or
                            </Text>
                            <Text
                                style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Login with Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                }}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: customTranslate('ml_NotAValidEmailAddress'),
                                        },
                                        {
                                            required: true,
                                            message: 'E-mail Required',
                                        },
                                    ],
                                })(
                                    <InputItem
                                        styles={{
                                            container: {
                                                backgroundColor: 'white',
                                                flex: 1,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                borderWidth: 0,
                                                padding: 5,
                                            },
                                        }}
                                        clear
                                        type="email"
                                        numberOfLines={1}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />,
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.form.validateFields((err, values) => {
                                            if (err) alert('Invalid Email');
                                            if (
                                                values.email.toLowerCase().includes('erinapp.com')
                                            ) {
                                                this.setState({ externalSignup: true });
                                            } else {
                                                if (getAppName() == 'allied') {
                                                    this.setState({ externalSignup: true });
                                                } else {
                                                    showMessage(
                                                        'Please click on "Login with Employee Account"',
                                                    );
                                                }
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                    }}>
                                    <EvilIcon name="arrow-right" color={'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {!this.state.hideLoginForm &&
                        !this.state.externalSignup &&
                        getAppName() != 'heartlandAffiliation' &&
                        getAppName() != 'heartland' ? (
                        <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                            {getAppName() == 'talentreef' ? (
                                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Or</Text>
                            ) : (
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                    Or
                                </Text>
                            )}
                            {getAppName() == 'talentreef' ? (
                                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                                    Login with Email
                                </Text>
                            ) : (
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                    Login with Email
                                </Text>
                            )}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowRadius: 2,
                                    shadowOpacity: 0.2,
                                    padding: 5,
                                }}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: customTranslate('ml_NotAValidEmailAddress'),
                                        },
                                        {
                                            required: true,
                                            message: 'E-mail Required',
                                        },
                                    ],
                                })(
                                    <InputItem
                                        styles={{
                                            container: {
                                                backgroundColor: 'white',
                                                flex: 1,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                borderWidth: 0,
                                                padding: 5,
                                            },
                                        }}
                                        clear
                                        type="email"
                                        numberOfLines={1}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />,
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.form.validateFields((err, values) => {
                                            if (err) alert('Invalid Email');
                                            if (values.email.toLowerCase().includes('erinapp.com')) {
                                                this.setState({
                                                    externalSignup: true,
                                                    hideLoginForm: true,
                                                });
                                            } else {
                                                // console.log('test', getAppName());
                                                showMessage(
                                                    'Please click on "Login with Employee Account"',
                                                );
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                    }}>
                                    <EvilIcon name="arrow-right" color={'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                </View>
            ) : (
                // <KeyboardAvoidingView behaviour="height" >
                <View>
                    <List
                        styles={StyleSheet.create(ListStyleOverrides)}
                        style={[
                            FormStyles,
                            !this.state.externalSignup && { backgroundColor: 'transparent' },
                        ]}
                        renderHeader={() => null}
                        renderFooter={() =>
                            (this.state.externalSignup &&
                                getFieldError('email') &&
                                getFieldError('email').join(',')) ||
                            (getFieldError('password') && getFieldError('password').join(','))
                        }>
                        {this.state.pageLoading && (
                            <View
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    height: '100%',
                                    width: '100%',
                                    justifyContent: 'center',
                                }}>
                                <ActivityIndicator size="large" />
                            </View>
                        )}
                        {this.state.externalSignup && (
                            <React.Fragment>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <TouchableOpacity
                                        style={{ alignSelf: 'flex-end' }}
                                        onPress={() => this.setState({ externalSignup: false })}>
                                        <Image
                                            source={require('../../../../_shared/assets/circle.png')}
                                            resizeMode={'contain'}
                                        />
                                    </TouchableOpacity>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_EmailAddress')}
                                    </Text>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: customTranslate('ml_NotAValidEmailAddress'),
                                            },
                                            {
                                                required: true,
                                                message: 'E-mail Required',
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            clear
                                            type="email"
                                            numberOfLines={1}
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                        />,
                                    )}
                                </View>
                                <View style={[ItemStyle, InputStyleContainer]}>
                                    <Text style={LabelStyles}>
                                        {customTranslate('ml_Password')}
                                    </Text>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: customTranslate('ml_PasswordRequired'),
                                            },
                                        ],
                                    })(
                                        <InputItem
                                            styles={{
                                                container: {
                                                    borderBottomColor: 'white',
                                                },
                                            }}
                                            style={InputStyle}
                                            type="password"
                                            clear
                                            onSubmitEditing={this.handleSubmit}
                                            returnKeyType="go"
                                        />,
                                    )}
                                </View>
                            </React.Fragment>
                        )}

                        <View style={[ItemStyle, BtnContainer]}>
                            {this.state.externalSignup && (
                                <Button
                                    style={ForgotPasswordBtn}
                                    activeStyle={ForgotPasswordBtnActive}
                                    // onClick={() => this.props.onStateChange('forgotPassword', {})}
                                    onPress={() => Actions.forgotPassword()}>
                                    <Text style={ForgotPasswordBtnText}>
                                        {customTranslate('ml_ForgotYourPassword')}
                                    </Text>
                                </Button>
                            )}

                            <Modal visible={this.state.googleModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.blackTransparent,
                                    }}>
                                    <View
                                        style={{ width: 350, height: 700, backgroundColor: 'white' }}>
                                        <Text
                                            onPress={() => this.setState({ googleModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({
                                                        googleModal: false,
                                                        pageLoading: true,
                                                    });
                                                    this.adLogin(tokenData);
                                                    // this.props.client
                                                    //   .query({
                                                    //     query: GetUserByCognitoId,
                                                    //     variables: {
                                                    //       cognitoId: tokenData['cognito:username'],
                                                    //     },
                                                    //   })
                                                    //   .then((user) => {
                                                    //     console.log('user', user);
                                                    //     let {setCurrentUser} = this.props;
                                                    //     setCurrentUser(user.data.getUserByCognitoId);
                                                    //     Actions.tabbar();
                                                    //   })
                                                    //   .catch((error) => {
                                                    //     console.log('llll', tokenData.email.split('@')[1]);
                                                    //     this.props.client
                                                    //       .query({
                                                    //         query: GetCompanyBySSOGoogleDomain,
                                                    //         variables: {
                                                    //           ssoGoogleDomain: tokenData.email.split('@')[1],
                                                    //         },
                                                    //       })
                                                    //       .then((company) => {
                                                    //         console.log('company', company);
                                                    //       });
                                                    //   });
                                                }
                                            }}
                                            source={{
                                                uri: 'https://erinapp.auth.us-east-2.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=https://app.erinapp.com/saml/login&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&client_id=56v63ge0a84vvtij0eat6i45p3',
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                            userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </Modal>
                            <Modal visible={this.state.adModal} transparent>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'white',
                                    }}>
                                    <SafeAreaView
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'white',
                                        }}>
                                        <Text
                                            onPress={() => this.setState({ adModal: false })}
                                            style={{
                                                margin: 10,
                                                fontSize: 20,
                                                color: '#4885ed',
                                                fontWeight: '500',
                                                textAlign: 'right',
                                            }}>
                                            Cancel
                                        </Text>
                                        <WebView
                                            incognito
                                            cacheEnabled={false}
                                            thirdPartyCookiesEnabled={false}
                                            cacheMode="LOAD_NO_CACHE"
                                            onNavigationStateChange={(val) => {
                                                console.log('vallll', val);
                                                if (val.url && val.url.includes('id_token')) {
                                                    let tokenData = this.parseJwt(
                                                        val.url.split('id_token=')[1],
                                                    );
                                                    this.setState({ adModal: false, pageLoading: true });
                                                    this.adLogin(tokenData);
                                                    // this.props.client
                                                    //   .query({
                                                    //     query: GetUserByCognitoId,
                                                    //     variables: {
                                                    //       cognitoId: tokenData['cognito:username'],
                                                    //     },
                                                    //   })
                                                    //   .then((user) => {
                                                    //     console.log('user', user);
                                                    //     let {setCurrentUser} = this.props;
                                                    //     setCurrentUser(user.data.getUserByCognitoId);
                                                    //     Actions.tabbar();
                                                    //   })
                                                    //   .catch((error) => {
                                                    //     console.log('llll', tokenData.email.split('@')[1]);
                                                    //     this.props.client
                                                    //       .query({
                                                    //         query: GetCompanyBySSOGoogleDomain,
                                                    //         variables: {
                                                    //           ssoGoogleDomain: tokenData.email.split('@')[1],
                                                    //         },
                                                    //       })
                                                    //       .then((company) => {
                                                    //         console.log('company', company);
                                                    //       });
                                                    //   });
                                                }
                                            }}
                                            source={{
                                                uri: getExternalLoginUrl(),
                                                // headers:{
                                                //     DeviceId:'my device id'
                                                // }
                                            }}
                                            onLoad={() => this.setState({ googleLoader: false })}
                                            onLoadStart={() => this.setState({ googleLoader: true })}
                                        />
                                        {this.state.googleLoader && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 350,
                                                    alignSelf: 'center',
                                                }}>
                                                <ActivityIndicator size="large" color="#4885ed" />
                                            </View>
                                        )}
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        </View>
                        {this.state.externalSignup && (
                            <View style={[ItemStyle, SubmitBtnContainer]}>
                                {this.state.loginLoader ? (
                                    <ActivityIndicator size="large" color={COLORS.blue} />
                                ) : (
                                    <Button
                                        onPress={this.handleSubmit}
                                        style={[SubmitBtn, { marginBottom: 10 }]}
                                        activeStyle={SubmitBtnActive}>
                                        <Text style={[SubmitBtnText]}>
                                            {customTranslate('ml_LogIn')}{' '}
                                        </Text>
                                        <SimpleIcon
                                            name="arrow-right-circle"
                                            size={18}
                                            color={COLORS.white}
                                        />
                                    </Button>
                                )}
                            </View>
                        )}

                        {this.state.invalidCredentials && (
                            <View style={ItemStyle}>
                                <Text>{this.state.errorMessage}</Text>
                            </View>
                        )}
                        <View style={[ItemStyle, BtnContainer]}>
                            {getAppName() == 'Apploi' ? (
                                this.renderLoginWithCompanyButton()
                            ) : (getAppName() == 'allied' ||
                                getAppName() == 'gannettFleming' ||
                                getAppName() == 'referCX') &&
                                this.state.externalSignup == false ? (
                                <TouchableOpacity
                                    style={{
                                        //marginTop: 10,
                                        alignItems: 'center',
                                        backgroundColor: COLORS.primary,
                                        height: 50,
                                        justifyContent: 'center',
                                    }}
                                    activeStyle={ForgotPasswordBtnActive}
                                    onPress={() => {
                                        requestTrackingPermission();
                                        this.setState({ adModal: true });
                                    }}

                                // onPress={() => this.pressHandler(loginURL)}
                                >
                                    <Text
                                        style={[
                                            ForgotPasswordBtnText,
                                            { color: 'white', fontSize: 15 },
                                        ]}>
                                        {getAppName() == 'allied'
                                            ? 'Login with Company Account'
                                            : 'Login with Employee Account'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <></>
                            )}

                            {this.state.externalSignup &&
                                this.state.externalUserSignup == true && (
                                    <TouchableOpacity
                                        onPress={() => this.setState({ dialogVisible: true })}
                                        style={{ marginTop: 10, alignItems: 'center' }}>
                                        {console.log('Here', this.state.externalSignup)}
                                        <Text style={ForgotPasswordBtnText}>Create An Account</Text>
                                    </TouchableOpacity>
                                )}
                        </View>
                        <Dialog.Container
                            visible={this.state.resetPassDialog}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>Your Password has expired</Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>New Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        secureTextEntry
                                        onChangeText={(text) => {
                                            this.setState({ resetPasswordValue: text });
                                        }}
                                        value={this.state.resetPasswordValue}
                                    />
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <View>
                                    <Text style={LabelStyles}>Confirm Password:</Text>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            borderColor: COLORS.buttonGrayOutline,
                                            borderWidth: 0.5,
                                            borderRadius: 5,
                                            padding: 5,
                                        }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        onChangeText={(text) => {
                                            this.setState({ resetConfirmPasswordValue: text });
                                        }}
                                        value={this.state.resetConfirmPasswordValue}
                                    />
                                </View>
                            </View>

                            {!this.state.resetPassLoader ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() => this.updateNewPassword()}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button
                                label="Cancel"
                                onPress={() => this.setState({ resetPassDialog: false })}
                            />
                        </Dialog.Container>

                        <Dialog.Container
                            visible={this.state.codedialogVisible}
                            contentStyle={{ width: '90%', maxWidth: 450 }}>
                            <Dialog.Title>
                                {this.state.accountClaim
                                    ? customTranslate('ml_ClaimYourAccount')
                                    : customTranslate('ml_EnterOrganisationCode')}
                            </Dialog.Title>
                            <View style={{ paddingHorizontal: 10 }}>
                                {this.state.accountClaim ? (
                                    <View>
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_EmployeeId')}:
                                        </Text>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: COLORS.buttonGrayOutline,
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ employeeId: text });
                                            }}
                                            value={this.state.employeeId}
                                        />
                                        <Text style={LabelStyles}>
                                            {customTranslate('ml_DateOfBirth')}:
                                        </Text>
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            date={this.state.dob}
                                            showIcon={false}
                                            mode="date"
                                            placeholder="select date"
                                            format="MM-DD-YYYY"
                                            //maxDate={moment().format('MM/DD/YYYY')}
                                            //maxDate="2016-06-01"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 4,
                                                    marginLeft: 0,
                                                },
                                                dateInput: {
                                                    marginLeft: 0,
                                                    backgroundColor: 'white',
                                                    borderRadius: 5,
                                                },
                                                // ... You can check the source to find the other keys.
                                            }}
                                            onDateChange={(date) => {
                                                this.setState({
                                                    dob: moment(date, 'MM-DD-YYYY'),
                                                });
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <View>
                                        <TextInput
                                            style={{
                                                height: 40,
                                                borderColor: 'black',
                                                borderWidth: 0.5,
                                                borderRadius: 5,
                                                padding: 5,
                                                borderColor: COLORS.buttonGrayOutline,
                                            }}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ code: text });
                                            }}
                                        />
                                    </View>
                                )}
                            </View>

                            {this.state.codedialogVisible ? (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.blue,
                                        padding: 10,
                                        margin: 15,
                                        height: 40,
                                        borderRadius: 5,
                                    }}
                                    onPress={() =>
                                        this.state.accountClaim
                                            ? this.handleAccountClaimSubmit()
                                            : this.pressHandler(this.state.code, loginURL)
                                    }>
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontSize: 18,
                                            borderRadius: 5,
                                        }}>
                                        {' '}
                                        {customTranslate('ml_Continue')}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: 'center',
                                    }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            )}
                            <Dialog.Button label="Cancel" onPress={this.handleCancelCode} />
                            {!this.state.accountClaim && (
                                <View style={{ alignItems: 'center' }}>
                                    <Text>or</Text>
                                    <GoogleSigninButton
                                        style={{ width: 192, height: 48, marginVertical: 5 }}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Dark}
                                        onPress={async () => {
                                            this.setState({ codedialogVisible: false }, () => {
                                                setTimeout(
                                                    () => this.setState({ googleModal: true }),
                                                    500,
                                                );
                                            });

                                            // GoogleSignin.configure({
                                            //   scopes: ['openid', 'email', 'profile'], // what API you want to access on behalf of the user, default is email and profile
                                            // });
                                            // await GoogleSignin.hasPlayServices();
                                            // const userInfo = await GoogleSignin.signIn();
                                            // console.log('userinfo', userInfo);
                                            // let resToken = await GoogleSignin.getTokens();
                                            // console.log('tokens: ', resToken);
                                            // Auth.configure({
                                            //   identityPoolId:
                                            //     'us-east-2:7799b39b-5403-4ff9-9014-433b1f818e03',
                                            // });
                                            // Auth.federatedSignIn(
                                            //   'google',
                                            //   {
                                            //     token: resToken.idToken,
                                            //     expires_at: 60 * 1000 + new Date().getTime(), // the expiration timestamp
                                            //   },
                                            //   userInfo.user,
                                            // )
                                            //   .then((cred) => {
                                            //     // If success, you will get the AWS credentials
                                            //     console.log('cred', cred);
                                            //     return Auth.currentAuthenticatedUser();
                                            //   })
                                            //   .then((user) => {
                                            //     // If success, the user object you passed in Auth.federatedSignIn
                                            //     console.log('user after federated login', user);
                                            //     this.props.client
                                            //       .query({
                                            //         query: GetUserByCognitoId,
                                            //         variables: {
                                            //           cognitoId: 'Google_' + user.id,
                                            //         },
                                            //       })
                                            //       .then((res) => {
                                            //         console.log('user res', res);
                                            //         let {setCurrentUser} = this.props;
                                            //         setCurrentUser(res.data.getUserByCognitoId).then(() => {
                                            //           Actions.tabbar();
                                            //         });
                                            //       })
                                            //       .catch((err) => {
                                            //         console.log('error', err);
                                            //       });
                                            //   })
                                            //   .catch((e) => {
                                            //     console.log('federated login error', e);
                                            //   });
                                        }}
                                    />
                                </View>
                            )}
                        </Dialog.Container>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.dialogVisible}
                            onRequestClose={() => {
                                // console.log('closed')
                            }}>
                            <View style={styles1.modalCard}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginTop: 30,
                                        marginRight: 20,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                dialogVisible: false,
                                                pageLoading: false,
                                            });
                                        }}>
                                        <Image
                                            style={{ width: 20, height: 20, borderRadius: 10 }}
                                            source={require('../../../../_shared/assets/close.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <KeyboardAwareScrollView>
                                    <View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 20,
                                            }}>
                                            {customTranslate('ml_LetsGetStarted')}
                                        </Text>
                                        <Text style={{ textAlign: 'center' }}>
                                            {customTranslate('ml_FirstCompleteYourProfile')}
                                        </Text>
                                    </View>
                                    <View style={{ marginTop: 30 }}>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_FirstName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.FirstName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ FirstName: text });
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_LastName')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            value={this.state.LastName}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ LastName: text });
                                            }}
                                        />
                                    </View>
                                    {/* aus code */}
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {this.state.departmentHeader}
                                        </Text>
                                        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                                            <Dropdown
                                                label={'Select a ' + this.state.departmentHeader}
                                                data={this.state.companyName}
                                                selectedItem={(item) => {
                                                    // console.log(item);
                                                }}
                                                onChangeText={(value, i, d) => {
                                                    // console.log('+++++++++  ', value);
                                                    // console.log('+++++++++ ----- ', i);
                                                    let newArr = this.state.companyName.filter(
                                                        (v, index) => {
                                                            return index == i;
                                                        },
                                                    );
                                                    // console.log('============', newArr);
                                                    this.setState({ company: newArr[0].id }, () => {
                                                        // console.log('++++++++  ', this.state.company);
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                    {/* <View>
                <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>{customTranslate('ml_Currency')}</Text>
                <CountryPicker
                  withCurrency
                  onSelect={val =>
                    this.setState({ currency: val.currency[0], currencyModal: false })
                  }
                  containerButtonStyle={{ backgroundColor: 'red' }}
                  visible={this.state.currencyModal}
                  renderFlagButton={() => (
                    <TouchableOpacity
                      onPress={() => this.setState({ currencyModal: true })}
                      style={[styles1.form, { justifyContent: 'center', margin: 10 }]}
                    >
                      <Text>{this.state.currency}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View> */}
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_JobTitle')}
                                        </Text>
                                        <TextInput
                                            style={styles1.form}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ Job: text });
                                            }}
                                            value={this.state.Job}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                            {customTranslate('ml_Email')}
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles1.form,
                                                { backgroundColor: COLORS.lightGray2 },
                                            ]}
                                            editable={this.state.externalSignup ? true : false}
                                            value={this.state.email}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            onChangeText={(text) => {
                                                this.setState({ email: text });
                                            }}
                                        />
                                    </View>
                                    {!this.state.email &&
                                        !this.state.accountClaim &&
                                        !this.state.externalSignup && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                Email address of user is not available.
                                            </Text>
                                        )}
                                    {this.state.accountClaim || this.state.externalSignup ? (
                                        <View>
                                            <Text style={{ marginLeft: 14, fontWeight: 'bold' }}>
                                                {customTranslate('ml_Password')}
                                            </Text>
                                            <TextInput
                                                style={[
                                                    styles1.form,
                                                    { backgroundColor: COLORS.lightGray2 },
                                                ]}
                                                value={this.state.password}
                                                underlineColorAndroid="transparent"
                                                autoCapitalize="none"
                                                onChangeText={(text) => {
                                                    this.setState({ password: text });
                                                }}
                                                secureTextEntry
                                            />
                                        </View>
                                    ) : null}

                                    <View>
                                        {this.state.registerModalError && (
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: COLORS.red,
                                                    fontSize: 20,
                                                }}>
                                                * {customTranslate('ml_PleaseFillTheRequiredFields')}
                                            </Text>
                                        )}

                                        <View style={{ marginTop: 10 }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginRight: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={styles1.inputTitle}>
                                                    {customTranslate('ml_Location')}
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        //backgroundColor: COLORS.blue,
                                                        //padding: 10,
                                                        borderRadius: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={this.handleAndroidPermission}>
                                                    <EvilIcon
                                                        name="location"
                                                        size={25}
                                                        color={COLORS.blue}
                                                    />
                                                    <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                                        {customTranslate('ml_AutofillLocation')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_City')}:{' '}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.setState({ locationModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text>{this.state.location.city}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_State')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text style={{ color: COLORS.lightGray }}>
                                                        {this.state.location.state}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    margin: 10,
                                                    marginLeft: 14,
                                                }}>
                                                <Text style={{ flex: 1 }}>
                                                    {customTranslate('ml_Country')}:{' '}
                                                </Text>
                                                <View
                                                    onPress={() => this.setState({ deptModal: true })}
                                                    style={[
                                                        styles1.input,
                                                        {
                                                            justifyContent: 'center',
                                                            flex: 4,
                                                            borderColor: COLORS.lightGray,
                                                        },
                                                    ]}>
                                                    <Text style={{ color: COLORS.lightGray }}>
                                                        {this.state.location.country}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                                color: COLORS.darkGray,
                                            }}>
                                            {customTranslate('ml_BySignUp')},{' '}
                                            {customTranslate('ml_IAgreeToTheErin')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL(
                                                        'https://erinapp.com/privacy-policy/',
                                                    );
                                                }}>
                                                {customTranslate('ml_PrivacyPolicy')}
                                            </Text>{' '}
                                            {customTranslate('ml_And')}{' '}
                                            <Text
                                                style={{ color: '#5FAAF8', fontSize: 14 }}
                                                onPress={() => {
                                                    Linking.openURL('https://erinapp.com/terms-of-use/');
                                                }}>
                                                {customTranslate('ml_TermsOfServices')}
                                            </Text>
                                            , and agree that we can send you information about jobs
                                            and referrals at your company. You can opt out at any
                                            time.
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.red,
                                            padding: 10,
                                            margin: 15,
                                            height: 40,
                                            borderRadius: 5,
                                        }}
                                        onPress={() =>
                                            // this.state.accountClaim
                                            //   ? this.handleAccountClaimFinalSubmit()
                                            //   : this.state.externalSignup
                                            //   ? this.handleExternalSignup()
                                            //   : this.SignUpHandler()
                                            this.SignUpHandler()
                                        }>
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                            }}>
                                            {customTranslate('ml_GetStarted')}
                                        </Text>
                                    </TouchableOpacity>
                                </KeyboardAwareScrollView>
                            </View>
                            <Modal visible={this.state.locationModal} animationType="slide">
                                <SafeAreaView style={{ flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <GooglePlacesAutocomplete
                                            placeholder={customTranslate('ml_Search')}
                                            minLength={1} // minimum length of text to search
                                            autoFocus={true}
                                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                            listViewDisplayed="auto" // true/false/undefined
                                            fetchDetails={true}
                                            onPress={(data, details = null) => {
                                                // 'details' is provided when fetchDetails = true

                                                this.handleAddressSelect(details);
                                            }}
                                            getDefaultValue={() => ''}
                                            query={{
                                                // available options: https://developers.google.com/places/web-service/autocomplete
                                                key: 'AIzaSyBFPKs7Ueh6G-5TqgsFKCaJagKwizTvDlY',
                                                language: 'en', // language of the results
                                                types: '(cities)', // default: 'geocode'
                                            }}
                                            styles={{
                                                textInputContainer: {
                                                    width: '100%',
                                                },
                                                description: {
                                                    fontWeight: 'bold',
                                                },
                                                predefinedPlacesDescription: {
                                                    color: '#1faadb',
                                                },
                                            }}
                                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                            GooglePlacesDetailsQuery={{
                                                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                                fields: 'formatted_address',
                                            }}
                                            debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                            renderLeftButton={() => (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: COLORS.red,
                                                        paddingHorizontal: 10,
                                                        justifyContent: 'center',
                                                        margin: 5,
                                                        borderRadius: 5,
                                                    }}
                                                    onPress={() => this.setState({ locationModal: false })}>
                                                    <Text style={{ color: '#fff' }}>
                                                        {customTranslate('ml_Cancel')}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </SafeAreaView>
                            </Modal>
                        </Modal>
                    </List>

                    {!this.state.externalSignup ? (
                        <View style={{ marginHorizontal: 20, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Or
                            </Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                Login with Email
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    borderRadius: 5,
                                    overflow: 'hidden',
                                    marginTop: 15,
                                }}>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            type: 'email',
                                            message: customTranslate('ml_NotAValidEmailAddress'),
                                        },
                                        {
                                            required: true,
                                            message: 'E-mail Required',
                                        },
                                    ],
                                })(
                                    <InputItem
                                        styles={{
                                            container: {
                                                backgroundColor: 'white',
                                                flex: 1,
                                                borderTopLeftRadius: 5,
                                                borderBottomLeftRadius: 5,
                                                borderWidth: 0,
                                                padding: 5,
                                            },
                                        }}
                                        clear
                                        type="email"
                                        numberOfLines={1}
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                    />,
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.form.validateFields((err, values) => {
                                            if (err) alert('Invalid Email');
                                            if (values.email.toLowerCase().includes('erinapp.com')) {
                                                this.setState({ externalSignup: true });
                                            } else {
                                                if (getAppName() == 'allied') {
                                                    this.setState({ externalSignup: true });
                                                } else {
                                                    showMessage(
                                                        'Please click on "Login with Employee Account"',
                                                    );
                                                }
                                            }
                                        });
                                    }}
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        paddingHorizontal: 5,
                                    }}>
                                    <EvilIcon name="arrow-right" color={'white'} size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                    {(this.state.disableClaimYourAccountLogin == false ||
                        this.state.disableClaimYourAccountLogin == null) &&
                        this.state.externalSignup == false &&
                        (getAppName() == 'allied' ||
                            getAppName() == 'gannettFleming' ||
                            getAppName() == 'referCX' ||
                            getAppName() == 'mscReferrals') && (
                            <TouchableOpacity
                                style={{ marginTop: 10, alignItems: 'center' }}
                                activeStyle={ForgotPasswordBtnActive}
                                onPress={() =>
                                    this.setState({
                                        codedialogVisible: true,
                                        accountClaim: true,
                                        //dialogVisible: true,
                                    })
                                }

                            // onPress={() => this.pressHandler(loginURL)}
                            >
                                {console.log(
                                    'disableClaimYourAccountLogin',
                                    this.state.disableClaimYourAccountLogin,
                                )}
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                    {customTranslate('ml_Or')}{' '}
                                </Text>
                                <Text
                                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                    {customTranslate('ml_ClaimYourAccount')}
                                </Text>
                            </TouchableOpacity>
                        )}
                </View>
            );
        }

        // </KeyboardAvoidingView>
    }
}
const styles1 = StyleSheet.create({
    form: {
        margin: 10,
        height: 40,
        borderColor: COLORS.lightGray,
        borderWidth: 0.5,
        borderRadius: 5,
        padding: 5,
    },
    modalCard: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 50,
        marginBottom: 10,
        height: Dimensions.get('window').height - 140,
        width: Dimensions.get('window').width - 20,
    },
    input: { borderRadius: 5, borderWidth: 0.5, height: 40, padding: 4 },
    inputTitle: { marginBottom: 5, fontSize: 15, fontWeight: 'bold' },
});

export default LoginForm = createForm()(LoginCard);
