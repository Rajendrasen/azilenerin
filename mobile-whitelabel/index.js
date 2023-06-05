/**
 * @format
 */

// import { AppRegistry } from 'react-native';
// import App from './src/app.component';
// import { name as appName } from './app.json';

// AppRegistry.registerComponent(appName, () => App);


import { AppRegistry } from 'react-native';
import Amplify from 'aws-amplify';
import App from './src/app.component';
import { name as appName } from './app.json';
// import { WithApiProvider } from './src/_store/_shared/api/api-provider.component';

const urlOpener = async (url, redirectUrl) => {
  // On Expo, use WebBrowser.openAuthSessionAsync to open the Hosted UI pages.
  const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

  if (type === 'success') {
    await WebBrowser.dismissBrowser();

    if (Platform.OS === 'ios') {
      return Linking.openURL(newUrl);
    }
  }
};

const oauth = {
  // Domain name
  domain: 'steelpartners.auth.us-east-2.amazoncognito.com',

  // Authorized scopes
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],

  // Callback URL
  redirectSignIn: 'https://app.erinapp.com/saml/login/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // Sign out URL
  // redirectSignOut: 'http://www.example.com/signout/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

  // 'code' for Authorization code grant, 
  // 'token' for Implicit grant
  // Note that REFRESH token will only be generated when the responseType is code
  responseType: 'token',

  // optional, for Cognito hosted ui specified options
  // options: {
  //   // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
  //   AdvancedSecurityDataCollectionFlag: true
  // },

  // urlOpener: urlOpener
}



Amplify.configure({
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_G43SkZOZF',
    userPoolWebClientId: '43lo6tposab52aj6ft6u4c33cb',
    //oAuth: oauth
  },
});

AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => WithApiProvider(App));