const gConfig = {
  apiKey: 'AIzaSyDcE5xTaw-xgWMs9-4WxzM0BMI8_vmO208',
  authDomain: 'erinauth.firebaseapp.com',
  clientId: '996972904195-3m334og960dn8t956a0uqf03ra7tkt28.apps.googleusercontent.com',
  discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
  peopleUrl:
    'https://people.googleapis.com/v1/people/me/connections?personFields=names%2CemailAddresses',
  contactsUrl: 'https://www.googleapis.com/m8/feeds/contacts/default/full?access_token=',
  scope:
    'https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.readonly',
};

export default gConfig;
