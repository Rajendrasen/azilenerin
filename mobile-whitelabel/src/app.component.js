import React, {Component} from 'react';
import Routes from './router/router';
import {Platform, View, Text,
    //  AsyncStorage
    } from 'react-native';
import {Provider} from 'react-redux';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {requestTrackingPermission} from 'react-native-tracking-transparency';
import ConfettiCannon from 'react-native-confetti-cannon';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {PersistGate} from 'redux-persist/integration/react';
import {configureStore} from './_store/configureStore';
import {RouterContext} from './_shared/contexts/router.context';
import {ApolloProvider} from 'react-apollo';
import Amplify, {Auth} from 'aws-amplify';
import {FormattedProvider} from 'react-native-globalize';
import AwsAppSyncClient from 'aws-appsync';
import {NativeModules} from 'react-native';
import {Rehydrated} from 'aws-appsync-react';
import OneSignal from 'react-native-onesignal';
//import awsMeta from './_store/_shared/api/aws-exports';
import SplashScreen from 'react-native-splash-screen';
import {decryptUsingAES256} from './settings';
//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import GetAWSSecrets from './secret-manager';
// import Mixpanel from 'react-native-mixpanel';
import gql from 'graphql-tag';
import CustomSplash from '../src/scenes/loader';
import FlashMessage from 'react-native-flash-message';
import {getLanguages} from './_shared/services/language-manager';
import {get} from 'lodash';
import {COLORS} from './_shared/styles/colors';
import AsyncStorage from '@react-native-community/async-storage';
let client;
const {store, persistor} = configureStore();
const GetUserByCognitoId = gql`
  query GetUserByCognitoId($cognitoId: ID!) {
    getUserByCognitoId(cognitoId: $cognitoId) {
      lastNotificationCheck
    }
  }
`;
const queryWebNotificationsByUserIdIndex = gql`
  query QueryWebNotificationsByUserIdIndex(
    $userId: ID!
    $first: Int
    $after: String
  ) {
    queryWebNotificationsByUserIdIndex(
      userId: $userId
      first: $first
      after: $after
    ) {
      items {
        id
        dateCreated
      }
      nextToken
    }
  }
`;

export default class App extends React.PureComponent {
  constructor() {
    super();
    // setTimeout(() => {
    //   // OneSignal.init('72f20567-ab2f-4c39-86b9-22945ce1c034');//aus code
    //   OneSignal.init('66bf4a74-a72f-4309-9ca4-19a9ce6aa7f0'); //erin
    // }, 1000);
    this.state = {auth: false, showAnimation: false};
    this.onAuthentication = this.onAuthentication.bind(this);
    this.onSignout = this.onSignout.bind(this);
  }

  // getToken = async () => {
  //     const pushToken = (await OneSignal.getDeviceState()).pushToken
  //     console.log("push token", pushToken);
  // }

  componentDidMount() {
    //  this.getToken();
    clearInterval();
    // OneSignal.addEventListener('received', (not) => {
    //   if (get(not, 'payload.body', '').toLowerCase().includes('point')) {
    //     showMessage({
    //       message: not.payload.body,
    //       backgroundColor: COLORS.dashboardGreen,
    //     });
    //     this.explosion && this.explosion.start();
    //   }
    // });
    requestTrackingPermission().then((res) => {
      this.setState({trackingStatus: res});
      if (res === 'authorized' || res === 'unavailable') {
        // enable tracking features
      }
    });
    // OneSignal.inFocusDisplaying(2);
    // OneSignal.init('66bf4a74-a72f-4309-9ca4-19a9ce6aa7f0');
    OneSignal.setAppId('66bf4a74-a72f-4309-9ca4-19a9ce6aa7f0');
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        console.log(
          'OneSignal: notification will show in foreground:',
          notifReceivedEvent,
        );
        let notif = notifReceivedEvent.getNotification();
        notifReceivedEvent.complete(notif);
      },
    );

    GetAWSSecrets().then((response) => {
      const d = decryptUsingAES256(
        response.jsonResult['initial'],
        response.AesSecretKey,
        response.AesSecretIVKey,
      );
      let dt = d ? JSON.parse(d) : null;
      Amplify.configure({
        Auth: {
          identityPoolId: dt.IdentityPoolId,
          region: dt.AWSPoolRegion,
          // userPoolId: "",
          // userPoolWebClientId: ""
        },
      });
      const awsMeta = {
        url: dt.AppSyncEndPoint,
        region: dt.AWSPoolRegion,
        auth: {
          type: 'AWS_IAM',
          credentials: () => Auth.currentCredentials(),
        },
        disableOffline: true,
      };
      client = new AwsAppSyncClient(awsMeta);
      this.forceUpdate();
    });
    getLanguages().then((dt) => {
      console.log('dt is ', dt);
    });
    SplashScreen.hide();

    // Mixpanel.sharedInstanceWithToken(
    //   '3769f656f0734ad39407fd76c505cdf6',
    // ).then((res) => {});
    if (__DEV__ && Platform.OS === 'ios') {
      //remoteDebugger
      // NativeModules.DevSettings.setIsDebuggingRemotely(true);
    }
    // eslint-disable-next-line no-console
    console.disableYellowBox = true;
    // setTimeout(() => {
    //   //OneSignal.init('72f20567-ab2f-4c39-86b9-22945ce1c034');//aus
    //   OneSignal.init('66bf4a74-a72f-4309-9ca4-19a9ce6aa7f0'); //erin
    //   //PushNotificationIOS.addEventListener('notification', this.handleNotification);
    // }, 1000);
  }

  handleNotification = () => {
    AsyncStorage.getItem('currentUser').then((res) => {
      if (res) {
        let {id, cognitoId} = JSON.parse(res);
        let promise1 = new Promise((resolve, reject) =>
          this.getUserDetails(cognitoId, resolve, reject),
        );
        let promise2 = new Promise((resolve, reject) =>
          this.getNotifications(id, resolve, reject),
        );
        Promise.all([promise1, promise2]).then((values) => {
          console.log(values);
          let [lastCheck, nots] = values;
          this.getCount(nots, lastCheck);
        });
      }
    });
  };

  getUserDetails = async (id, resolve, reject) => {
    try {
      let {data} = await client.query({
        query: GetUserByCognitoId,
        variables: {cognitoId: id},
        networkPolicy: 'network-only',
      });
      console.log('getUserDetails user', data);
      resolve(data.getUserByCognitoId.lastNotificationCheck);
    } catch (err) {
      reject(err);
    }
  };

  getNotifications = async (id, resolve, reject) => {
    try {
      let {data} = await client.query({
        query: queryWebNotificationsByUserIdIndex,
        variables: {userId: id},
        networkPolicy: 'network-only',
      });
      console.log('nots', data);
      resolve(data.queryWebNotificationsByUserIdIndex.items);
    } catch (err) {
      reject(err);
    }
  };

  getCount = (userNotifications, lastNotificationCheck) => {
    let count = 0;
    userNotifications.forEach((notification) => {
      if (!lastNotificationCheck) {
        count = userNotifications.length;
      } else if (notification.dateCreated > lastNotificationCheck) {
        count += 1;
      }
    });
    //PushNotificationIOS.setApplicationIconBadgeNumber(count);
  };

  onAuthentication = () => {
    // Cookies.set('jwt', authToken);
    // this.forceUpdate();
    this.setState({
      auth: true,
    });
  };

  onSignout = () => {
    // Cookies.remove('jwt');
    this.forceUpdate();
    this.setState({
      auth: false,
    });
  };

  explosion;

  render() {
    const providerValue = Object.assign(this.state, {
      auth: {}, //getCachedJwt(),
      onAuthentication: this.onAuthentication,
      onSignout: this.onSignout,
    });

    return client ? (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        {/* <View> */}
        <ApolloProvider client={client}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <RouterContext.Provider value={providerValue}>
                <FormattedProvider locale="en" currency="USD">
                  <Rehydrated
                    render={({rehydrated}) =>
                      rehydrated ? (
                        <Routes
                          auth={this.state.auth}
                          rerender={() => this.onSignout()}
                        />
                      ) : (
                        <CustomSplash />
                      )
                    }></Rehydrated>
                  {/* <Routes auth={this.state.auth} rerender={() => this.onSignout()} /> */}
                </FormattedProvider>
              </RouterContext.Provider>
            </PersistGate>
          </Provider>
        </ApolloProvider>
        <FlashMessage
          style={{alignItems: 'center'}}
          titleStyle={{fontWeight: 'bold'}}
          position="top"
        />
        <View style={{position: 'absolute', bottom: -15}}>
          <ConfettiCannon
            autoStart={false}
            ref={(ref) => (this.explosion = ref)}
            fadeOut={true}
            count={200}
            origin={{x: -10, y: 0}}
          />
        </View>
      </SafeAreaProvider>
    ) : (
      <CustomSplash />
    );
  }
}
