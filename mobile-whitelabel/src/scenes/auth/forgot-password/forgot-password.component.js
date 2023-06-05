import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  Image,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import {withApollo} from 'react-apollo';
import {ForgotPasswordForm} from './forgot-password-items/forgot-password-card.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import styles from './forgot-password.styles';
import {
  backgroundImage,
  getAppName,
  getErinLogo,
  getWhiteLogo,
} from '../../../WhiteLabelConfig';

const {
  LinkContainer,
  Link,
  BackgroundImageContainer,
  BackgroundImage,
  Logo,
} = styles;

const LoginBackground = backgroundImage();
let ErinLogo = getAppName() == 'trinity' ? getErinLogo() : getWhiteLogo();
if (getAppName() == 'sevita' || getAppName() == 'heartland') ErinLogo = null;
class ForgotPasswordComponent extends React.Component {
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
    // if (this.props.authState !== 'forgotPassword') return null;
    return (
      <KeyboardAvoidingView extraScrollHeight={10}>
        <ImageBackground
          source={LoginBackground}
          style={BackgroundImageContainer}
          imageStyle={BackgroundImage}>
          <Image
            source={ErinLogo}
            alt="Erin Logo"
            style={Logo}
            resizeMode="contain"
          />
          <View>
            <ForgotPasswordForm onStateChange={this.props.onStateChange} />
          </View>
          {this.renderAbout()}
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

export default withApollo(ForgotPasswordComponent);
