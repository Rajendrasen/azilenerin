import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  Image,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {withApollo} from 'react-apollo';
import {RouterContext} from '../../../_shared/contexts/router.context';
import {LoginForm} from './login-items/login-card.component';
import ExternalLoginForm from './login-items/external-login-card.component';
import styles from './login.styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectLanguage from '../../../_shared/components/language/select-language.component';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../_shared/services/language-manager';
import {
  backgroundImage,
  getAppName,
  getErinLogo,
  getWhiteLogo,
} from '../../../WhiteLabelConfig';
import AsyncStorage from '@react-native-community/async-storage';

const {LinkContainer, Link, BackgroundImageContainer, BackgroundImage, Logo} =
  styles;

const LoginBackground = backgroundImage();
let ErinLogo = getWhiteLogo();

if (
  getAppName() == 'sevita' ||
  getAppName() == 'heartland' ||
  getAppName() == 'trinity'
)
  ErinLogo = null;

class LoginComponent extends React.Component {
  state = {
    languageModalVisible: false,
  };
  // componentDidMount() {
  //   AsyncStorage.getItem('appLocale').then(res => {
  //     if (!res) {
  //       this.setState({ languageModalVisible: true });
  //     }
  //   });
  // }
  // closeLanguageModal = () => {
  //   this.setState({ languageModalVisible: false });
  // };
  renderLoginForm = (
    onAuthentication,
    users,
    setCurrentUser,
    client,
    onCreate,
    onUpdateInvite,
  ) => {
    if (
      getAppName() == 'pinterest' ||
      getAppName() == 'sevita' ||
      getAppName() == 'heartland' ||
      getAppName() == 'trinity' ||
      getAppName() == 'referCX' ||
      getAppName() == 'seaworld' ||
      getAppName() == 'Twilio' ||
      getAppName() == 'talentreef' ||
      getAppName() == 'IQVIA' ||
      getAppName() == 'heartlandAffiliation' ||
      getAppName() == 'GoDaddy' ||
      getAppName() == 'VILIVING' ||
      getAppName() == 'northWestReferrals' ||
      getAppName() == 'Apploi' ||
      getAppName() == 'allied' ||
      getAppName() == 'gannettFleming'
    ) {
      return (
        <ExternalLoginForm
          onAuthentication={onAuthentication}
          users={users}
          setCurrentUser={setCurrentUser}
          client={client}
          onStateChange={this.props.onStateChange}
          onCreate={onCreate}
          onUpdateInvite={onUpdateInvite}
          onCreateDepartment={this.props.onCreateDepartment}
        />
      );
    } else {
      return (
        <LoginForm
          onAuthentication={onAuthentication}
          users={users}
          setCurrentUser={setCurrentUser}
          client={client}
          onStateChange={this.props.onStateChange}
          onCreate={onCreate}
          onUpdateInvite={onUpdateInvite}
          onCreateDepartment={this.props.onCreateDepartment}
        />
      );
    }
  };
  renderAbout = () => {
    switch (getAppName()) {
      case 'erin':
        return (
          <View style={LinkContainer}>
            <Text
              style={Link}
              onPress={() =>
                Linking.openURL('https://erinapp.com/about').catch((err) =>
                  console.error('An error occurred', err),
                )
              }>
              {customTranslate('ml_AboutErin')}
            </Text>

            <Text style={Link}>&#183;</Text>
            <Text
              style={Link}
              onPress={() =>
                Linking.openURL('https://erinapp.com/support').catch((err) =>
                  console.error('An error occurred', err),
                )
              }>
              {customTranslate('ml_Help')}
            </Text>
            <Text style={Link}>&#183;</Text>
            <Text
              style={Link}
              onPress={() =>
                Linking.openURL('https://erinapp.com/blog').catch((err) =>
                  console.error('An error occurred', err),
                )
              }>
              Blog
            </Text>
          </View>
        );
      default:
        return null;
    }
  };
  render() {
    // console.log('app name', getAppName());
    const {users, setCurrentUser, client, onCreate, onUpdateInvite} =
      this.props;
    // if (this.props.authState !== 'signIn') return null;
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={0}
        keyboardShouldPersistTaps="always">
        <ImageBackground
          source={LoginBackground}
          style={BackgroundImageContainer}
          imageStyle={BackgroundImage}>
          {/* <KeyboardAvoidingView> */}
          {getAppName() == 'referC' ||
          getAppName() == 'seaworld' ||
          getAppName() == 'talentreef' ||
          getAppName() == 'GoDaddy' ||
          getAppName() == 'IQVIA' ||
          getAppName() == 'VILIVING' ||
          getAppName() == 'heartlandAffiliation' ||
          getAppName() == 'northWestReferrals' ||
          getAppName() == 'gannettFleming' ||
          getAppName() == 'mscReferrals' ? null : (
            <Image
              source={ErinLogo}
              alt="Erin Logo"
              style={[
                Logo,
                {
                  // marginTop: 90
                },
              ]}
              resizeMode="contain"
            />
          )}

          <View style={styles.formContainer}>
            <RouterContext.Consumer>
              {({onAuthentication}) =>
                this.renderLoginForm(
                  onAuthentication,
                  users,
                  setCurrentUser,
                  client,
                  onCreate,
                  onUpdateInvite,
                )
              }
            </RouterContext.Consumer>
          </View>

          {/* </KeyboardAvoidingView> */}
          {this.renderAbout()}
        </ImageBackground>
        {/* <SelectLanguage close={this.closeLanguageModal} visible={this.state.languageModalVisible} /> */}
      </KeyboardAwareScrollView>
    );
  }
}

export default withApollo(LoginComponent);
