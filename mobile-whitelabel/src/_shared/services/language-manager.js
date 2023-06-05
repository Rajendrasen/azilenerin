import I18n from 'react-native-i18n';
import {listMultiLingual} from '../../_store/_shared/api/graphql/custom/localisation/localisation.graphql';
import RNRestart from 'react-native-restart';
import {AsyncStorage} from 'react-native';
I18n.fallbacks = true;
let languages = {};
let en = {
  ml_Dashboard_Dashboard: 'Dashboard',
  ml_Password: 'Password',
  ml_ChooseEmployeeGroup: 'Choose An Employee Group',
  ml_APIKeyOrURL: 'API Key or URL',
  ml_perday: 'per day',
  ml_Next: 'Next',
  ml_ActiveEmployees: 'Active Employees',
  ml_Active: 'Active',
  ml_RefNotShow: 'The referral will not show on your',
  ml_EmailAddress: 'Email Address',
  ml_PleaseEnterDescription: 'Please enter Description',
  ml_WouldYouLikeToResendInvite: 'Would you like to resend invite ?',
  ml_Group: 'Group',
  ml_EnterReferral: 'We will send them information to apply.',
  ml_Phone: 'phone',
  ml_Ref_Hired: 'A Referral Has Been Hired!',
  ml_And: 'and',
  ml_BonusCampaign_Edit: 'Edit',
  ml_AndInDept: 'In Department',
  ml_Add: 'Add',
  ml_OpenJobs: 'Open Jobs',
  ml_PleaseCloseAllReferralsToEnableDelete:
    'please close all referrals to enable delete',
  ml_Leaderboards: 'Leaderboards',

  ml_Employees_Without_Referrals: 'Employees without Referrals',
  ml_WithoutReferrals: 'Without Referrals',
  ml_BonusBuilder: 'Bonus Settings',
  ml_ConfirmUpdate: 'confirm update ?',
  ml_ChangeJobSearchLocation: 'Change Job Search Location',
  ml_perweek: 'per week',
  ml_All: 'All',
  ml_postion: 'postion',
  ml_AllReferrals: 'All Referrals',
  ml_Department: 'Department',
  ml_StartTyping: "Start typing a contact's name...",
  ml_Source: 'Source',
  ml_AddContacts: 'Add Contacts',
  ml_Contacts_MyContacts: 'My Contacts',
  ml_MyCountry: 'My Country',
  ml_Log_Hired: 'Log In to',
  ml_BonusCampaign_Select: 'Select Jobs',
  ml_YouHaveNotAddedAnyContacts: 'You have not added any contacts',
  ml_AlreadyReferred_ReferralForm:
    'This person has already been referred for this position.',
  ml_Internship: 'Internship',
  ml_SelectDates: 'Select Dates',
  ml_BonusWaitingPeriod: 'Bonus Waiting Period',
  ml_Ineligible: 'Ineligible',
  ml_Transferred: 'Transferred',
  ml_Announcements: 'Announcements',
  ml_LastName: 'Last Name',
  ml_ManageReferrals: 'Manage Referrals',
  ml_PleaseEnterPayOutDays: 'Please enter Pay-out days.',
  ml_PleaseEnterDateOfBirth: 'Please enter Date of Birth',
  ml_NOTE: 'NOTE',
  ml_JobShares: 'Job Shares',
  ml_Interviewing: 'Interviewing ',
  ml_Jobs_JobDetail: 'Job Detail',
  ml_Dashboard_YourRankings: 'Your Rankings',
  ml_SearchByName: 'Search',
  ml_PleaseEnterJobTitle: 'Please enter Job title',
  ml_BonusCampaign_JobsSelected: 'Jobs Selected',
  ml_AllBonuses: 'All Bonuses',
  ml_Admin: 'Admin',
  ml_Internal_Mobility: 'Internal Mobility',
  ml_Referrals_Referrals: 'Referrals',
  ml_FilterByStatus: 'Filter By Status',
  ml_Interested: 'Interested?',
  ml_ReferralLink: 'Referral link',
  ml_AutofillLocation: 'Autofill Location',
  ml_Contacts_AddContacts: 'Add Contacts',
  ml_Invite: 'Invite',
  ml_EnterNewDepartment: 'Enter a new department',
  ml_ClaimYourAccount: 'Claim Your Account',
  ml_MyReferrals: 'My Referrals',
  ml_ReferredBy: 'Referred By',
  ml_NotHired: 'Not Hired',
  ml_ForAJob: 'has referred you for a job at',
  ml_Jobs: 'Jobs',
  ml_open_to_new_roles: 'Open To New Roles',
  ml_NewReferral_Submitting:
    'By submitting, you consent to ERIN storing, processing and sharing your name and contact information with',
  ml_ImportDepartments: 'Import Departments',
  ml_CloseJob: 'Close Job',
  ml_SyncJobs: 'Sync Jobs',
  ml_Dashboard_WePayBonuses: 'We pay bonuses after 90 days.',
  ml_Bonuses: 'Bonuses',
  ml_ManageJobs: 'Manage Jobs',
  ml_PleaseFillTheRequiredFields: 'Please fill the required fields',
  ml_BonusDetails: 'Bonus Details',
  ml_BonusCampaign_Jobs: 'Jobs',
  ml_IncludeMessageToContact: 'Include a message to your contact',
  ml_BonusCampaign_Create: 'Create A Bonus Campaign',
  ml_RequireCandidate:
    'Require candidates to verify their email address before applying for a position.',
  ml_Remove: 'Remove',
  ml_Inactive: 'Inactive',
  ml_ResendInvite: 'Resend Invite',
  ml_AddNote: 'Add Note',
  ml_NewPassword: 'New Password',
  ml_Status_ReferralCard: 'Status',
  ml_Dashboard: 'Dashboard',
  ml_ReferralInfo: 'Referral Info',
  ml_City: 'City',
  ml_Referrals: 'Referrals',
  ml_State: 'State',
  ml_PleaseInputFirstName: 'Please input First Name',
  ml_Hired: 'Hired',
  ml_Would: 'Would you like to also',
  ml_NoNotifications: 'No Notifications',
  ml_AddEmployees: 'Add Employees',
  ml_AccountAlreadyClaimed: 'Account already claimed',
  ml_InvitePeople: 'Invite People to',
  ml_SendBy: 'Send By',
  ml_Started: 'Started',
  ml_Contacts_Contacts: 'Contacts',
  ml_ViewBonusDetails: 'View Bonus Details',
  ml_Startdate: 'Start date',
  ml_ChooseBonusBuilder: 'Choose a Bonus Builder',
  ml_For: 'for',
  ml_Administrator: 'Administrator',
  ml_Branding: 'Branding',
  ml_Accepted: 'Accepted',
  ml_Referred: 'Referred',
  ml_AddReferral: 'Add Referral',
  ml_Subject_ReferralForm: 'Employee Referral made for',
  ml_ContinueJob: 'Continue Job',
  ml_UpdateInformation: 'Update information',
  ml_AcceptStart: 'Accept and Start Application',
  ml_MatchQualityFilter: 'Match Quality Filter',
  ml_DoYouKnow: 'Do you know someone who would thrive at',
  ml_DoYouWant:
    'Select jobs to be included in the email. Job title and bonus amount will be displayed.',
  ml_NewReferral_Contact: 'Contact by Email',
  ml_LogoSize: '( optional: logo size should be 1950 x 650)',
  ml_MyCompanyHiring:
    'My company, Techahead, is hiring a tester. Check out the job description here: google . Interested? Contact me if you’d like me to refer you.',
  ml_MarketingDirector: 'Ex. Marketing Director',
  ml_BonusCampaign_Include:
    'Include jobs in the email and have the option to change their bonuses in the next step',
  ml_ForgotYourPassword: 'Forgot Your Password ?',
  ml_ValueDoesNotMatchAnAvailableOption:
    'Value does not match an available option',
  ml_NotValid: 'Not a valid email address.',
  ml_Incentivize:
    'Incentivize your employees to connect their contacts. All job referrals will be reduced by this amount for employees who have not connected their contacts. Note: Contact Incentive is not compatible with Bonus Builder.',
  ml_CreateReferralFor: 'Create a referral for the',
  ml_ImportContacts: 'import contacts',
  ml_Settings: 'Settings',
  ml_PostNewJob: 'Post a new job',
  ml_Autofill_BrowseJobs: 'Autofill Location',
  ml_TopReferrers: 'Top Referrers',
  ml_UnableToUpdateContact: 'Unable to update contact',
  ml_peryear: 'per year',
  ml_Declined: 'Declined',
  ml_Logo: 'Logo Upload',
  ml_CloseThisJob: 'Close this job',
  ml_LetsGetStarted: "Let's Get Started",
  ml_ReferralsByBonusLevel: 'Referrals By Bonus Level',
  ml_ViewAll: 'VIEW ALL',
  ml_EnterOneEmailAddress:
    'Enter one email address per line to send an invite to your employees',
  ml_BonusPayments: 'Bonus Payments',
  ml_NotifyDepartmentOnly: 'Notify Department Only',
  ml_YouReferred: "You've Been Referred For A Job.",
  ml_AttachResume: 'to attach a resume',
  ml_SmartReferralInfo: 'smart referral info',
  ml_PasswordRequired: 'Password Required',
  ml_Name: 'Name',
  ml_Click_JobCard: 'Click to set location',
  ml_ManageDepartments: 'Manage Departments',
  ml_CheckAgain: 'Check again',
  ml_AutomaticallyFindPeopleToReferToOpenJobs:
    'Automatically find people to refer to open jobs',
  ml_Error_Gift_Card:
    'You do not have enough points remaining to add this giftcard to cart.',
  ml_NoResponse: 'No Response',
  ml_Action: 'Action',
  ml_Referral_Made: 'A Referral Has Been Made.',
  ml_JobByBonusLevel: 'Job By Bonus Level',
  ml_Employees: 'Employees',
  ml_Country: 'Country',
  ml_Referrals_TieredBonus: 'Tiered Bonus',
  ml_Referrals_payments: 'Payments',
  ml_Help: 'Help',
  ml_SuperAdministrator: 'Super Administrator',
  ml_Pos_Hired: 'position',
  ml_ReferralDetails: 'Referral Details',
  ml_MyProfile_Terms: 'Terms of Use',
  ml_NewReferral_Referred: "You've been referred at",
  ml_TieredBonus: 'Tiered Bonus',
  ml_NewYork: 'New York',
  ml_FilterByDepartment: 'Filter By Department',
  ml_BonusCampaign_JobsIn: 'Jobs in Subcompany',
  ml_AreYouDiscard: 'Are you sure you want to discard these changes?',
  ml_SelectRole: 'Select a role to be applied to all invites',
  ml_NotYetEarned: 'Not Yet Earned',
  ml_DiscardJob: 'Discard Job',
  ml_AddaNote: 'Add a Note',
  ml_Language: 'Language',
  ml_Support: 'Support',
  ml_apply_internally: 'Apply Internally',
  ml_send_referral: 'Send A Referral',
  ml_People: 'People',
  ml_TotalBonuses: 'Total Bonuses',
  ml_DeletePayment: 'Delete Payment',
  ml_Candidate: 'Candidate',
  ml_AllLocations: 'All locations',
  ml_BonusCampaigns: 'Bonus Campaigns',
  ml_ReferAContact: 'Refer a Contact',
  ml_MyProfile_Signout: 'Sign Out',
  ml_LetsStarted: "Let's Get Started",
  ml_CurrentPassword: 'Current Password',
  ml_Dashboard_OpenPositions: 'Open Positions',
  ml_GetStarted: 'Get Started',
  ml_MyProfile_Help: 'Help & Support',
  ml_Licensing: 'Licensing',
  ml_EmployeeDashboard_Made: 'Made This Year',
  ml_BonusAmount: 'Bonus Amount',
  ml_Manager: 'Manager',
  ml_Alerts: 'Alerts',
  ml_Dashboard_OfAllEmployees: 'Of All Employees',
  ml_YouHaveNoAlertsAtThisTime: 'You have no alerts at this time.',
  ml_Remote: 'Remote',
  ml_Dashboard_ReferralsRecommended: 'Referrals Recommended',
  ml_StartDate: 'Start Date',
  ml_REFERRALSUMMARY: 'REFERRAL SUMMARY',
  ml_Summary: 'Summary',
  ml_YourRetentionBonus: 'Your Retention Bonus',
  ml_Notifications: 'Notifications',
  ml_Type: 'Type:',
  ml_Can_Hired: 'has hired a canditate for the',
  ml_EnterReferralInformation: 'Enter Referral Information',
  ml_Users: 'Users',
  ml_Points: 'Points',
  ml_ReferFromPhoneBook: 'Refer from Phone Book',
  ml_EnterAnEmailBelowToAddAContact: 'Enter an email below to add a contact',
  ml_Dashboard_PersonMatch: "Person's in Your Network Match This Job.",
  'ml_ThereAreNoEmployeesAtThisTime.': 'There are no Employees at this time.',
  ml_ReferralAutomaticallyAccepted:
    'The referral will automatically be set to "Accepted" status. No notification will be sent to the employee or candidate',
  ml_ViewDeleteEmailRecipients: 'View or Delete Email Recipients',
  ml_Info: 'Info',
  ml_OpenJob: '(Open Job)',
  ml_AllowUsers:
    'Allow users to refer themselves by indicating they are interested in a job posting.',
  ml_RemoveLogo: 'Remove Logo',
  ml_CloseThisJobMeans:
    'Closing this job means you are no longer accepting referrals.',
  ml_Details: 'Details',
  ml_HiringContact: 'Hiring Contact',
  ml_AddGeneralReferral: 'Add General Referral',
  ml_EmployeeId: 'Employee ID',
  ml_Contract: 'Contract',
  ml_SubmitReferral: 'Submit Referral',
  ml_CompanyBranding: 'Company Branding',
  ml_PleaseSelectAHiringContact: 'Please select a Hiring Contact',
  ml_WhatERIN: 'What is ERIN?',
  ml_optional: 'optional',
  ml_BonusCampaign_Name: 'Schedule Name',
  ml_DaysFromHireDate: 'Days from hire date',
  ml_Close: 'Close',
  ml_ShowLess: 'Show less',
  ml_Update: 'Update',
  ml_NotifyAllEmployees: 'Notify All Employees',
  ml_AddMore: 'add more',
  ml_Days: 'days, payable to',
  ml_TotalJobViews: 'Total Job Views',
  ml_Required: 'required',
  ml_Integrations: 'Integrations',
  ml_DontPayBonus: "Don't Pay a Bonus",
  ml_PublicJobPostingLink: 'Public Job Posting Link',
  ml_LoadingContacts: 'loading contacts',
  ml_BonusCampaign_BonusCampaigns: 'Bonus Campaigns',
  ml_ReferredOn: 'Referred on',
  ml_SmartReferrals: 'Smart Referrals',
  ml_SelectLanguage: 'Select Language',
  ml_NoMoreReferrals: '(no more referrals)',
  ml_Status: 'Status',
  ml_CreatedBy: 'Created By',
  ml_Excellent: 'Excellent',
  ml_LastLogin: 'Last Login',
  ml_YouAreAboutToImportAllContacts: 'You are about to import all 11 contacts',
  ml_TotalBonus: 'Total Bonus',
  ml_Clickhere: 'Click here',
  ml_BonusCampaign_Download: 'Download List',
  ml_ShareJob: 'Share Job',
  ml_EmployeeDashboard_YourRank:
    'Your rank will be available after you make your first referral.',
  ml_Position: 'position.',
  ml_Amount: 'Amount',
  ml_TotalJobs: 'Total Jobs',
  ml_EnterNewEmailAddress: 'Enter a new email address',
  ml_NoLocation: 'No Location',
  ml_TotalReferrals: 'Total Referrals',
  ml_Contacts_ReferContact: 'Refer Contact',
  ml_EmailPhoneNumber: 'Email / Phone Number',
  ml_Connected: 'Connected',
  ml_WithIn: 'within',
  ml_CloseThisWindow: 'Close This Window',
  ml_Already_ReferralForm: 'already exists.',
  ml_Congrats_Accepted:
    'Congratulations. A referral has accepted and is interested in your open position.',
  ml_EnterOrganisationCode: 'Enter Organization Code',
  ml_SendEmailNotification:
    'Send an email notification to hiring manager when a referral is made, accepted and candidate is hired.',
  ml_ByCreating: 'By creating a profile you agree to the ERIN',
  ml_ConfirmNewPosition: 'Confirm new position',
  ml_Delete: 'Delete',
  ml_View_ReferralForm: 'view',
  ml_IneligibleEmployee: 'Ineligible Employee',
  ml_BonusCampaign_Complete: 'Complete',
  ml_InGroup: 'In Group',
  ml_GeneralReferrals: 'General Referrals',
  ml_DashboardReferralPolicyText: 'Dashboard Referral Policy Text',
  ml_ViewAllJobs: 'View All Jobs',
  ml_Congrats_Hired:
    'Congratulations! You can see more information about this referral and others by logging in to',
  ml_Jobs_ReferSomeone: 'Refer Someone',
  ml_Congrats_Ref: 'Congratulations on your referral for',
  ml_Referral_For: 'has made a referral for the',
  ml_DescribeResponsibility:
    'Describe the responsibility of the job, required experience, education, etc',
  ml_SubmitGeneralReferral: 'Submit General Referral',
  ml_GeneralReferralswillallow:
    'General Referrals will allow your contact to accept and apply for a generic position and be considered for other roles within the organization.',
  ml_Confirm: 'Confirm Updates?',
  ml_FirstCompleteYourProfile: 'First complete your profile',
  ml_Message_The_Recruiter: 'Message the Recruiter',
  ml_ReferredSuccessfully: 'Referred successfully',
  ml_Bonus: 'Bonus',
  ml_allJobs: 'All Jobs',
  ml_Edit: 'Edit',
  ml_CompanyName: 'Company Name:',
  ml_YouCanAlso: 'You can also add additional details in this format',
  ml_Currency: 'Currency',
  ml_ContactWith_ReferralForm: 'A contact with this',
  ml_Web_Hired: 'website',
  ml_BonusCampaign_Bonus: 'Temporary Bonus',
  ml_ClickHereToReferThemOrViewTheContact:
    'Click here to refer them or view the contact',
  ml_SelectEmployee: 'Select an Employee',
  ml_IAgreeToTheErin: 'I agree to the ERIN',
  ml_NotificationLabel: 'Who should we notify that this job has been added?',
  ml_EmployeeGroup: 'Employee Group',
  ml_TopReferrersThisMonth: 'Top Referrers This Month',
  ml_ContinueWorking: 'Continue Working',
  ml_Good: 'Good',
  ml_Earned: 'Earned',
  ml_EmployeeDashboard_AllEmp: 'Of All Employees',
  ml_EmployeeWithReferrals: 'Employees with Referrals',
  ml_AddContact: 'Add Contact',
  ml_ContactAlready_ReferralForm:
    'A contact with this email address already exists.',
  ml_View: 'View Referral',
  ml_Enddate: 'End date',
  ml_Account: 'Account',
  ml_Removing: 'Removing',
  ml_Said: 'said:',
  ml_Recipient: 'Recipient',
  ml_Finder: 'Finder',
  ml_WhoShould: 'Who should we notify that this job has been added',
  ml_Referral: 'Referral',
  ml_ConnectedApps: 'Connected Apps',
  ml_MessageCenter_SelectJob: 'Select Job(s)',
  ml_Select: 'Select',
  ml_Never: 'Never',
  ml_HasReferred: 'has referred you for a position at their company,',
  ml_EndDates: 'End Dates',
  ml_Save: 'Save',
  ml_UserName: 'User Name',
  ml_SelectJob: 'Select a Job',
  ml_Email: 'Email',
  ml_Job_title: 'Job Title',
  ml_Location: 'Location',
  ml_Departments: 'Departments',
  ml_RecipientName: 'Recipient Name',
  ml_SelectDepartment: 'Select a department',
  ml_Fulltime: 'Full-time',
  ml_AreYouSure: 'Are you sure you want to discard this Job',
  ml_Share: 'Share',
  ml_ShareThisJob: 'Share this job',
  ml_SearchNetwork: 'Search Network',
  ml_SendAMessage: 'Send A Message',
  ml_NoSmartReferrals:
    'There are no smart referrals for this job, see more by adding more',
  ml_Dashboard_MadeThisYear: 'Made This Year',
  ml_Color: 'Color (optional):',
  ml_NewReferral_JobType: 'Job Type',
  ml_ShareOn: 'Share on',
  ml_Therearenoopenjobsatthistime: 'There are no open jobs at this time.',
  ml_BackToLogin: 'Back to Login',
  ml_WebSite: 'website',
  ml_showLess: 'show less',
  ml_AcceptedReferrals: 'Accepted Referrals',
  ml_Hired_By_Bonus_Level: 'Hired By Bonus Level',
  ml_AddContactsEmail: 'Add Contacts email',
  ml_Imported: 'Imported',
  ml_ChangeLocation_BrowseJobs: 'Change Job Search Location',
  ml_BonusCampaign_BonusSchedule: 'Bonus Schedule',
  ml_FirstName: 'First Name',
  ml_CreateJob: 'Create Job',
  ml_Contact_ReferralForm: 'the contact.',
  ml_FilterJobs: 'Filter Jobs',
  ml_EditProfile: 'EDIT PROFILE',
  ml_Jobs_Departments: 'Departments',
  ml_LastUpdatedDashboard: 'Last Updated',
  ml_FilterByRecruiter: 'Filter by Recruiter',
  ml_MakeReferral: 'Make Referral',
  ml_HasRequestedReferralFor: 'has requested a referral for',
  ml_Notification:
    'Notification Who should we notify that this job has been added?',
  ml_Miles: 'miles',
  ml_AddJobHistory: 'Add Job History',
  ml_PleaseEnterAmount: 'Please enter amount',
  ml_Referrals_Interviewing: 'Interviewing',
  ml_SendBonusEarnedNotifications: 'Send bonus earned notifications to:',
  ml_yearly: 'yearly',
  ml_MissingJobHistoryDetails: 'Missing job history details',
  ml_MessageCenter: 'Message Center',
  ml_ReferralBonus: 'Referral Bonus',
  ml_TermsOfServices: 'Terms of services',
  ml_UpdateSettings: 'Update Settings',
  ml_Trouble_ReferralForm:
    'We are having trouble submitting the form. Please make sure the form is filled out correctly and try again.',
  ml_EmpSelected: 'Employees Selected',
  ml_BonusNotes: 'Bonus Notes',
  ml_HarvestAPIKey: 'Harvest API Key',
  ml_FormBuilder: 'Form Builder',
  ml_ManagerPermissions: 'Manager Permissions',
  ml_Resume: 'Resume',
  ml_SignOut: 'Sign Out',
  ml_JobTitle: 'Job Title',
  ml_ClickHere_ReferralForm: 'Click here',
  ml_Search: 'Search',
  ml_Search_Mobility: 'Search by skills, location, etc.',
  ml_SelectJobCreateReferral: 'Select a job to create referral',
  ml_ViewPublicJobPosting: 'View Public Job Posting',
  ml_ClosedJobs: 'Closed Jobs',
  ml_EmployeeDashboard_YourReferrals: 'Your Referrals',
  ml_GreatWork: 'Great Work.',
  ml_MyProfile_Privacy: 'Privacy Policy',
  ml_Subject_Accepted: 'Job Referral Accepted',
  ml_TotalGeneralReferrals: 'Total General Referrals',
  ml_By: 'by',
  ml_Total: 'Total',
  ml_ToRefer_ReferralForm: 'to refer them or',
  ml_AddLocation: 'Add Location',
  ml_JobInfo: 'Job Info',
  ml_LogWithCompany: 'Log in with a Company Account',
  ml_ExportDataCSV: 'Export data to .CSV',
  ml_NewEmployeeGroup: 'Enter a new employee group',
  ml_NewReferral_Privacy: 'Privacy Policy',
  ml_Present: 'Present',
  ml_Commision: 'Commision',
  ml_EligibleDate: 'Eligible Date',
  ml_FirstComplete: 'First complete your profile',
  ml_PasswordUpdatedSuccessfully: 'Password updated successfully.',
  ml_PersonalizeMessage: 'Personalize the message to your referral',
  ml_InNetworkContacts: 'In Network Contacts',
  ml_Problem: 'There was a problem creating your account. Please try again.',
  ml_SoftwareERIN:
    'ERIN is software that allows employees to recommend their contacts for positions at their company. You can learn more about our product on our',
  ml_BonusCampaign_Campaign: 'Create Campaign',
  ml_TotalSmartReferrals: 'Total Smart Referrals',
  ml_Added: 'Added',
  ml_YoureOneClickAwayFromFillingThisPosition:
    "You're one click away from filling this position.",
  ml_WithReferralsJobs: 'With Referrals',
  ml_Cancel: 'Cancel',
  ml_AllowGeneralReferrals: 'Allow users to make general referrals',
  ml_TopDepartments: 'Top Departments',
  ml_Show: 'Show',
  ml_BonusName: 'Bonus Name',
  ml_OpenPositions: 'Open Positions',
  ml_NewReferral_Apply: 'Accept & Apply',
  ml_Referral_Directed:
    'The referral has been directed to your public job posting and hiring manager information. You can also reach out to them directly by viewing the referral in ERIN and sending them an email.',
  ml_Job: 'Job',
  ml_CompanyBrand: 'Company Brand Color',
  ml_AllMatches: 'All Matches',
  ml_EditBonus: 'EDIT BONUS',
  ml_EnterNewEmailReferral: 'Enter a new Email Referral',
  ml_DefaultBonusAmount: 'Default Bonus Amount:',
  ml_BonusCampaign_Active: 'Active',
  ml_SearchYourNetwork:
    'Search your network to find potential referrals. You will be able to see the referrals information after your employee accepts your request and refers the contact.',
  ml_ToAddExistingContact: 'to add an existing contact',
  ml_Success: 'Success. Your information has been submitted for this position.',
  ml_Subject: 'Subject',
  ml_perhour: 'per hour',
  ml_ViewDeleteEmployeeGroups: 'View or Delete Employee groups',
  ml_NotifyAll: 'Notify All Employees',
  ml_ATSIntegration: 'ATS Integration',
  ml_NewReferral_Decline: 'Decline Referral',
  ml_Contacts: 'Contacts',
  ml_PleaseInputLastName: 'Please input Last Name',
  ml_Referrals_AddReferral: 'Add Referral',
  ml_PhoneNumber: 'phone number',
  ml_NotAValidEmailAddress: 'Not a Valid E-mail Address',
  ml_Blog: 'Blog',
  ml_Referrals_DaysPolicy: 'Earned per our 90 day policy',
  ml_TheMessage:
    'The message will include the default company header and logo.',
  ml_NoReferrals: 'There are no Referrals for this job',
  ml_Congratulations_ReferralForm:
    "Congratulations. You don't need to do anything at the moment. Once the candidate accepts they will be directed to apply for the position or contact you directly.",
  ml_Apply: 'apply',
  ml_Employee: 'Employee',
  ml_EmployeeData: 'Employee Data',
  ml_BonusCampaign_None: 'None',
  ml_SubmitAsHired: 'Submit as Hired',
  ml_ReferSomeone: 'Refer Someone',
  ml_JobDetails: 'Job Details',
  ml_Code: 'Code',
  ml_Matches: 'Matches',
  ml_BonusEarnedNotifications: 'Bonus Earned Notifications',
  ml_ReferralFinder: 'Referral Finder',
  ml_JobDescription: 'Description',
  ml_Compliance: 'Compliance',
  ml_MadeThisMonth: 'Made This Month',
  ml_Contacts_Social: 'Social',
  ml_Review: 'Review',
  ml_BonusCampaign_All: 'All',
  ml_ImportAllContacts: 'import all contacts',
  ml_ContactAdded: 'contact added',
  ml_DateOfBirth: 'Date of Birth',
  ml_Continue: 'Continue',
  ml_Mobile: 'Mobile',
  ml_BrowseJobs: 'Jobs',
  ml_CreateNewJob: 'Create a New Job',
  ml_Contacts_Bio: 'Bio',
  ml_NewReferral_Accepted:
    'To accept your referral and apply to the position, we need more information.',
  ml_Refer_Info: 'Enter a referral and we will send them information to apply.',
  ml_NoReferralsJobs: 'No Referrals',
  ml_UnacceptedInvites: 'Unaccepted Invites',
  ml_Updating: 'updating',
  ml_MessageCenter_Email: 'Email',
  ml_AlreadyImported: 'already imported',
  ml_Optional: '(optional)',
  ml_ImportPhoneContacts: 'Import Phone Contacts',
  ml_AddBonus: 'Add Bonus',
  ml_ReferContact: 'Refer Contact',
  ml_ContactIncentiveAmount: 'Contact Incentive Amount:',
  ml_BonusCampaign_Bulk: 'or bulk select jobs with these filters',
  ml_AboutErin: 'About ERIN',
  ml_ToEnterNameAndEmail: 'to enter name and email',
  ml_ReferralPolicy: 'Referral Policy',
  ml_QuickLinks: 'QUICK LINKS',
  ml_Payment: 'Payment',
  ml_BonusEarnedNote: 'Bonus Earned Note',
  ml_CodeRequired: 'Code Required',
  ml_ThereAreNoReferralsAtThisTime: 'There are no Referrals at this time.',
  ml_LetUsKnow:
    'Let us know that you are interested in this position and we will be in touch.',
  ml_redirectedInterested:
    'You will be directed to our job site to apply for this position.',
  ml_ApplyOnJobSite: 'Apply On Job Site',
  ml_WhoWill: 'Who will this message go to?',
  ml_Sync: 'Sync',
  ml_delete_my_account: 'Delete My Account',
  ml_Jobs_OpenJobs: 'Open Jobs',
  ml_Organization: 'Organization',
  ml_ResetPassword: 'Reset Password',
  ml_EmployeeDashboard_Earned: 'Earned',
  ml_EmailEtc: 'Email, First Name, Last Name, Job Title, Department, Group',
  ml_MyProfile: 'My Profile',
  ml_Jobs_By_Bonus_Level: 'Jobs By Bonus Level',
  ml_Jobs_AllLocations: 'All locations',
  ml_BonusCampaign_Start: 'Start date',
  ml_EmployeeView: 'Employee View',
  ml_BonusCampaign_End: 'End date',
  ml_Description: 'Description',
  ml_DownloadResume: 'Download Resume',
  ml_Terms: 'Terms of Use',
  ml_TheReferral_ReferralForm:
    'The referral has been directed to your public job posting and hiring manager information. You can also reach out to them directly by viewing the referral in ERIN and sending them an email.',
  ml_EDITJOB: 'EDIT JOB',
  ml_Adding: 'Adding',
  ml_IneligibleCandidate: 'Ineligible Candidate',
  ml_New_Employees: 'New Employees this month',
  ml_InvitationSent: 'Invitation sent',
  ml_SearchJobs: 'Search Jobs',
  ml_SelectDate: 'select date',
  ml_About: 'About ERIN',
  ml_None: 'None',
  ml_ViewReferral: 'View Your Referral',
  ml_DeleteBonus: 'Delete Bonus',
  ml_ViewDeleteDepartments: 'View or Delete Departments',
  ml_DisableSmartReferrals: 'Disable Smart Referrals',
  ml_NotListed: 'Not listed',
  ml_MyContacts: 'Contacts',
  ml_Agree:
    'and agree that we can send you information about jobs and referrals at your company. You can opt out at any time.',
  ml_ReferralBonuses: 'Referral Bonuses',
  ml_SelfReferred: 'Self Referred',
  ml_Back: 'Back',
  ml_ReferralReady: 'Referral Ready',
  ml_Dates: 'Dates',
  ml_AddEmployee: 'Add Employee',
  ml_Send: 'Send',
  ml_NoBonusAvailableYet: 'No bonus available yet.',
  ml_AdministratorNotifications: 'Hiring Manager Notifications',
  ml_BySignUp: 'By Sign up',
  ml_Here: 'here',
  ml_InvalidEmployeeID: 'Invalid Employee ID',
  ml_EmployeeDashboard_ReferralsMade: 'Referrals Made',
  ml_showNore: 'show more',
  ml_FilterByCompany: 'Filter by Company',
  ml_PleaseTryAgainLater: 'Please try again later',
  ml_Reopen: 'You can re-open the job at any time.',
  ml_Made_Last_Month: 'Made Last Month',
  ml_Parttime: 'Part-time',
  ml_ReferralInformation: 'Referral Information',
  ml_EarnedDate: 'Earned Date',
  ml_Click_SetLocation: 'Click to set location',
  ml_NoReferralsYet: 'Sorry, you have not made any Smart Referrals yet',
  ml_HiringContactLabel:
    'Add a hiring contact to be listed on the job description. Note they must have an account',
  ml_permonth: 'per month',
  ml_EmployeeDashboard_YourRanking: 'Your Ranking',
  ml_RecipientType: 'Recipient Type',
  ml_ContactHasActiveReferrals: 'Contact has active referrals',
  ml_ATSName: 'ATS Name',
  ml_Pending: 'Pending',
  ml_Or: 'or',
  ml_CancelAdd: 'Cancel Add',
  ml_Message: 'Message',
  ml_Contacts_ContactDetails: 'Contact Details',
  ml_NewReferral_Hiring:
    'hiring team. Your data will never be sold or redistributed by ERIN. Please read our',
  ml_NewReferral_ReferredBy: 'Referred By',
  ml_Jobs_SeeMore: 'See More',
  ml_SubmitMe: 'Submit Me For This Position',
  ml_CustomerID: 'Customer ID',
  ml_ReferralComments: 'Referral Comments',
  ml_SmartReferral: 'Smart Referral',
  ml_RefPopup: 'My Referrals',
  ml_Unaccepted: 'Unaccepted',
  ml_seeLess: 'see less',
  ml_LogIn: 'Log In',
  ml_Paid: 'Paid',
  ml_RemoveBrandColor: 'Remove Brand Color',
  ml_Privacy: 'Privacy Policy,',
  ml_MinPasswordLength: 'Min Password length must be 8',
  ml_AddJob: 'Add Job',
  ml_Referrals_Accepted: 'Accepted',
  ml_InvalidDateOfBirth: 'Invalid Date of Birth',
  ml_FilterByBonus: 'Filter by Bonus',
  ml_EmailConfirmation: 'Email Confirmation',
  ml_PleaseEnterAValidUrl: 'Please enter a valid url',
  ml_RegisteredEmployees: 'Registered Employees',
  ml_EmailPhone: 'Email / Phone Number',
  ml_Person: 'Person',
  ml_PrivacyPolicy: 'Privacy Policy',
  ml_ThisAppWouldLikeToViewYourContacts:
    'This app would like to view your contacts',
  ml_BonusCampaign_Dept: 'and in Departments',
  ml_InviteEmployees: 'Invite Employees',
  ml_UpdateBonuses: 'Update Bonuses',
  ml_BonusCampaign_Choose: 'Choose a Bonus',
  ml_EditJob: 'Edit Job',
  ml_Clear: 'clear',
  ml_Referrals_TotalEarned: 'Total Earned',
  ml_On: 'on',
  ml_Jobs_IAmInterested: "I'm interested",
  ml_Company: 'Company',
  ml_ThereAreNoReferralsFor: 'There are no Referrals for',
  ml_SelectAStartDate: 'Select a Start Date',
  ml_JobType: 'Job Type',
  ml_CompanySettings: 'Company Settings',
  ml_ShowJobHistory: 'Show Job History',
  ml_BonusCampaign_Selects: 'Select Job(s)',
  ml_YourEarnedTotal:
    'Your Earned Total reflects referral bonuses that are past the waiting period.',
  ml_UnableToGetBonuses: 'Unable to get Bonuses.',
  ml_PleaseSelectDepartment: 'Please select Department',
  ml_SendMe: 'Send Me A Test Email',
  ml_DateHired: 'Date Hired',
  ml_Role: 'Role',
  ml_SubmitThem: 'Submit them to be considered for new opportunities.',
  ml_Contacts_JobHistory: 'Job History',
  ml_DateSynced: 'Date Synced',
  ml_Refresh: 'Refresh',
  ml_IAmInterested: "I'm Interested",
  ml_ReferralCreated: 'referral created',
  ml_PortalID: 'Portal ID',
  ml_NotifyDepartment: 'Notify Department Only',
  ml_MyAccount: 'My Account',
  ml_RemotePosition: 'This Position is Remote',
  ml_SubmitToJob: 'Submit to Job',
  ml_AlmostThere: 'Almost There. How does everything look',
  ml_JobTitleExperience: 'Job Title / Experience',
  ml_AContactWithThisEmailAddressAlreadyExists:
    'A contact with this email address already exists',
  ml_showMore: 'show more',
  ml_BonusCampaign_TempSchedule: 'Temporary Bonus Schedule',
  ml_SelectEmployees: 'Select Employees',
  ml_Text: 'Text',
  ml_PleaseSelectBonus: 'Please select bonus',
  ml_DiscardChanges: 'Discard Changes',
  ml_LastLoginNever: 'Last Login: Never',
  ml_After: 'After',
  ml_Submit: 'Submit',
  ml_HiredDate: 'Hired Date',
  ml_BusinessNetwork: 'Business Network',
  ml_Salary: 'Salary',
  ml_ToLearn:
    "To learn more and for the option to accept your referral, click the button below. You will see more information about the job and be able to apply if you'd like to be considered.",
  ml_AddGroupBonus: 'Add Group Bonus',
  ml_ReferredCandidate: 'Referred Candidate',
  ml_NewReferral_More: 'for more information.',
  ml_EnableGDPR: 'Enable GDPR Compliant Referrals',
  ml_EmployeeDashboard_Referrals: 'Referrals',
  ml_AddConnection: 'Add Connection',
  ml_MessageHiringContact: 'Message the Hiring Contact',
  ml_SalaryRange: 'Salary Range',
  ml_RecommendedSmartReferrals: 'Recommended Smart Referrals',
  ml_PageAccepted: 'page until it is accepted.',
  ml_RemoveFromGeneralReferrals: 'Remove from General Referrals ?',
  ml_Dashboard_YourReferrals: 'Your Referrals',
  ml_Dashboard_ReferralPolicy: 'Referral Policy',
  ml_ContactNoEmailPhone:
    'Contact does not have an email address or Phone number. Add an email or phone to this person in Contacts',
  ml_Example: 'Example',
  ml_LetUsKnowHowToGetInTouchWithThemAboutNewOpportunities:
    'Let us know how to get in touch with them about new opportunities.',
  ml_EmployeeDashboard_OpenJobs: 'Open Jobs',
  ml_CompanyWebsite: 'Company Website',
  ml_ShareMyReferralLink: 'Share My Referral Link',
  ml_TheReferralWillNotShowOnYourMyReferralsPageUntilItIsAccepted:
    'The referral will not show on your My Referrals page until it is accepted.',
  ml_JobDetailDescription: 'Job Description',
  ml_HowKnowThem: 'How do you know them, why are they a good fit, etc.',
  ml_HasMadeAReferralFor: 'has made a referral for',
  ml_HasAcceptedAReferralFor: 'has accepted a referral for',
  ml_JustHired: 'just hired',
  ml_InvalidEmailId: 'Invalid email id',
  ml_InternalMobility: 'Internal Mobility',
  ml_UpdateOtherReferralsAs: 'Update other referrals as',
  ml_PleaseEnterYourEmail: 'Please enter your email',
  ml_Referral_Accepted: 'A Referral Has Accepted.',
  ml_HasAddedANewJob: 'has added a new job',
  ml_ClickHere: 'click here',
  ml_Hello: 'Hello',
  ml_ViewJob: 'View Job',
  ml_MaxCharacters:
    'Max of 60 Characters. This note displays on the My Referrals page.',
  ml_ShowMore: 'Show More',
  ml_Made_This: 'made this referral for the',
  ml_InWaitingPeriod: 'In Waiting Period',
  ml_DateReferred: 'Date Referred',
  ml_ReferralNotAvailable: 'Referral Not Available',
  ml_InterestedNotAvailable: "I'm Interested Not Available",
  ml_Doctor_Mobile_Number: 'Doctor Mobile Number',
  ml_Soucre_Campaign: 'Source Campaign',
  ml_Practice_Name: 'Practice Name',
  ml_Office_Phone: 'Office Phone (if not available , enter NA)',
  ml_referral_network: 'Referral Network',
};
const getLanguagesFromGoogle = (locale) => {
  let translated = [];
  let strings = Object.values(en);
  let totalCalls = strings.length / 100;
  let promises = [];

  for (let i = 0; i < Math.ceil(totalCalls); i++) {
    promises[i] = new Promise((resolve, reject) => {
      translateString(strings.slice(i * 100, (i + 1) * 100)).then((res) => {
        let arr = res.map((item) => item.translatedText);
        resolve(arr);
      });
    });
  }
  return Promise.all(promises).then((values) => {
    translated = [].concat.apply([], values);
    let languages = {
      [locale]: {},
    };
    Object.keys(en).forEach((item, i) => {
      languages[locale][item] = translated[i];
    });
    languages.en = en;
    console.log('ffff', languages);
    return languages;
  });
};
const setLanguages = (arr) => {
  // for (let i = 0; i < arr.length; i++) {
  //   let item = arr[i];
  //   languages = {
  //     ...languages,
  //     [item.languageCode]: {
  //       ...languages[item.languageCode],
  //       [item.key]: item.text,
  //     },
  //   };
  // }
  languages = arr;
  console.log('langugate', languages);
  // languages.en = en;
  I18n.translations = languages;
  //if (I18n.currentLocale() === 'en') I18n.locale = 'pt';
  let currentLocale = languageCodeResolver(I18n.currentLocale());
  AsyncStorage.getItem('appLocale').then((code) => {
    I18n.locale = code ? code : currentLocale;
  });
};

export const setLanguageWithCheck = (apiCode) => {
  console.log('called the set lanaguage', apiCode);

  AsyncStorage.getItem('appLocale').then((localCode) => {
    console.log('localCode', localCode, 'apiCode', apiCode); // I18n.locale = code ? code : currentLocale;

    if (apiCode == localCode) return;

    AsyncStorage.setItem('appLocale', apiCode).then((res) => {
      if (I18n.currentLocale() !== apiCode) {
        RNRestart.Restart();
      }
    });
  });
};

export const getLanguages = (client) => {
  return AsyncStorage.getItem('appLocale').then((code) => {
    code = code
      ? languageCodeResolver(code)
      : languageCodeResolver(I18n.currentLocale());
    if (code.toLowerCase() == 'us' || code.toLowerCase == 'en') {
      I18n.translations = {en};
      I18n.locale = 'en';
      return;
    }
    return getLanguagesFromGoogle(code)
      .then((res) => {
        console.log('ttt', res);
        setLanguages(res);
        return true;
      })
      .catch((err) => {
        I18n.translations = {en};
        I18n.locale = 'en';
      });

    // return client
    //   .query({
    //     query: listMultiLingual,
    //     variables: {
    //       limit: 100000,
    //       nextToken: null,
    //       filter: {
    //         languageCode: {
    //           eq: code
    //             ? languageCodeResolver(code)
    //             : languageCodeResolver(I18n.currentLocale()),
    //         },
    //       },
    //     },
    //   })
    //   .then((res) => {
    //     console.log('lang res', res);
    //     setLanguages(res.data.listMultiLingual.items);
    //     return true;
    //   })
    //   .catch((err) => {
    //     I18n.translations = {en};
    //     I18n.locale = 'en';
    //   });
  });
};

export const setLanguage = (code) => {
  console.log('called the set lanaguage');
  AsyncStorage.setItem('appLocale', code).then((res) => {
    if (I18n.currentLocale() !== code) {
      RNRestart.Restart();
    }
  });
};

export const languageCodeResolver = (locale) => {
  let code = locale.toLowerCase();
  if (code.includes('en')) return 'US';
  if (code.includes('pt-br') || code.includes('pt_br')) return 'PT-BR';
  if (code.includes('pt')) return 'PT';
  if (code.includes('fr')) return 'FR';
  if (code.includes('ru')) return 'RU';
  if (code.includes('de')) return 'DE';
  if (code.includes('es')) return 'ES';
  if (code.includes('zh')) return 'ZH-CN';
  if (code.includes('nl')) return 'NL';
  if (code.includes('de')) return 'DE';
  if (code.includes('it')) return 'IT';
  if (code.includes('ja')) return 'JA';
  else return 'US';
};

export const translateString = (string) => {
  let target = '';
  //alert("dfd")

  return AsyncStorage.getItem('appLocale').then((code) => {
    target = code ? code : languageCodeResolver(I18n.currentLocale());
    console.log('language target', code);
    target = target.toLowerCase() == 'us' ? 'en' : target;

    return fetch(
      'https://translation.googleapis.com/language/translate/v2?key=AIzaSyDs-46OpAOBFJb-ydH9wPpdJI1XdFAxkhI',
      {
        method: 'POST',
        body: JSON.stringify({
          q: string,
          target: target.toLowerCase(),
        }),
      },
    )
      .then((res) => res.json())
      .then((json) => {
        //console.log('goggle res', string, json);
        if (Array.isArray(string)) return json.data.translations;
        return json.data.translations[0].translatedText;
      });
  });
  // return AsyncStorage.getItem('appLocale').then((code) => {
  //     let target = code ? code : languageCodeResolver(I18n.currentLocale());
  //     target = target.toLowerCase() == 'us' ? 'en' : target;

  //     return fetch(
  //         'https://translation.googleapis.com/language/translate/v2?key=AIzaSyDs-46OpAOBFJb-ydH9wPpdJI1XdFAxkhI',
  //         {
  //             method: 'POST',
  //             body: JSON.stringify({
  //                 q: string,
  //                 target: target.toLowerCase(),
  //             }),
  //         },
  //     )
  //         .then((res) => res.json())
  //         .then((json) => {
  //             //console.log('goggle res', string, json);
  //             if (Array.isArray(string)) return json.data.translations;
  //             return json.data.translations[0].translatedText;
  //         });
  // });
};

export const customTranslate = (str) => {
  return I18n.t(str, {defaultValue: en[str]});
};
