import React, {Component} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Linking,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import {COLORS} from '../../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import moment from 'moment';
import ReferredCard from '../../referrals/referral-items/referral-card.container';
import MyProfileCard from '../../my-profile/my-profile-components/my-profile-card.component';
//import Toast from 'react-native-toast-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {getErinSquare, getLightGrayLogo} from '../../../WhiteLabelConfig';
let {width} = Dimensions.get('window');

class EmployeeDetails extends Component {
  state = {
    showJobHistory: false,
    spinAnim: new Animated.Value(0),
    details: {
      firstName: 'Mike',
      lastName: 'Stafiej',
      emailAddress: 'test@mailinator.com',
      phoneNumber: '9999999999',
    },
  };
  componentDidMount() {
    this.spin();
  }
  componentDidUpdate(prevProps) {
    if (
      (!this.props.apiFetching &&
        this.props.user &&
        this.props.apiFetching != prevProps.apiFetching) ||
      (this.props.user != prevProps.user && !this.props.apiFetching)
    ) {
      this.setState({
        details: this.props.user ? this.props.user : {},
      });
    }
  }
  handleJobHistory = () => {
    this.setState((state) => ({showJobHistory: !state.showJobHistory}));
  };
  handleSocialClick = (url) => {
    Linking.openURL(url);
  };
  spin = () => {
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.back(),
        useNativeDriver: true,
      }),
    ).start(() => this.spin());
  };
  resendInvite = () => {
    fetch(
      'https://bbh6ooqu3e.execute-api.us-east-2.amazonaws.com/default/email-resend-new-user-invite',
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          userInviteId: this.props.userId,
        }),
      },
    )
      .then((res) => {
        // Toast.show('Invitation sent', Toast.SHORT, Toast.TOP, {
        //   backgroundColor: COLORS.dashboardGreen,
        //   height: 50,
        //   width: 250,
        //   borderRadius: 10,
        // });
        showMessage({
          message: 'Invitation sent',
          type: 'success',
        });
      })
      .catch((err) => {
        // Toast.show('Something went wrong', Toast.SHORT, Toast.TOP, {
        //   backgroundColor: COLORS.red,
        //   height: 50,
        //   width: 250,
        //   borderRadius: 10,
        // });
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
  };
  renderRecs() {
    if (
      !this.props.user ||
      !this.props.user.referrals ||
      !this.props.user.referrals.length
    ) {
      return (
        <View style={styles.noReferrals}>
          <Image
            source={getLightGrayLogo()}
            resizeMode="contain"
            style={{width: 180, height: 180, marginBottom: 5}}
          />
          <Text style={{color: '#999999'}}>
            {customTranslate('ml_ThereAreNoReferralsAtThisTime')}
          </Text>
        </View>
      );
    }

    return this.props.user.referrals.map((item) => (
      <ReferredCard
        referral={item}
        //handleContactPress={this.handleReferContactDetail}
        noJob
        key={item.id}
        jobDetail
      />
    ));
  }
  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let {
      company: {symbol, theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    return (
      <View style={{flex: 1}}>
        {this.props.user && !this.props.apiFetching ? (
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{alignItems: 'center'}}>
            <View style={{flex: 1, width: '100%'}} elevation={0}>
              <MyProfileCard
                currentUser={this.state.details}
                employeeDetails={{
                  resendInvite: this.resendInvite,
                  employeeStatus: this.props.employeeStatus,
                }}
              />
            </View>
            <Text style={styles.referralHeader}>{customTranslate('ml_Referrals')}</Text>
            <View style={{width: '95%'}}>{this.renderRecs()}</View>
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image
              style={{height: 60, width: 60, transform: [{rotate: spin}]}}
              source={
                theme.enabled && symbol && symbol.key
                  ? {
                      uri:
                        'https://s3.us-east-2.amazonaws.com/erin-avatars/' +
                        symbol.key,
                    }
                  : getErinSquare()
              }
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    width: width - 15,
    marginTop: 10,
    backgroundColor: COLORS.white,
    // shadowColor: COLORS.lightGray,
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 1,
    // },
    padding: 15,
    marginBottom: 5,
    borderRadius: 10,
  },
  referralHeader: {
    fontSize: 16,
    letterSpacing: 1.5,
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 10,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  noReferrals: {
    width: '90%',
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmployeeDetails;
