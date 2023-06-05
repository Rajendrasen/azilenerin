import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {WhiteSpace} from '@ant-design/react-native';
import get from 'lodash/get';
import {Actions} from 'react-native-router-flux';
import {styles} from '../../referrals/referral-items/referral-card.styles';
import {COLORS} from '../../../_shared/styles/colors';
//import Toast from 'react-native-toast-native';
//import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import {calculateReferralBonus} from '../../../_shared/services/utils';
import moment from 'moment';

class BonusCard extends React.PureComponent {
  state = {
    spinAnim: new Animated.Value(0),
  };

  render() {
    let {
      user,
      job,
      amountDue,
      bonusStatus,
      earnedDate,
      recipientType,
      contact,
      payment,
    } = this.props.bonus;
    let {currentUser} = this.props;
    let firstName = user ? user.firstName : currentUser.firstName;
    let lastName = user ? user.lastName : currentUser.lastName;
    let {currencySymbol, currencyRate} = this.props;
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let referral = this.props.noJob ? 'referralDetails' : 'referral';
    if (true) {
      // if (!contact) return null;
      return (
        <TouchableOpacity
          style={styles.referralCardContainer}
          onPress={() => this.props.handlePress(this.props.bonus)}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              {/* {this.props.currentUser==this.render.props} */}

              <View style={{flex: 1}}>
                <TouchableOpacity style={{flex: 1}}>
                  <Text style={styles.candidateName}>
                    {recipientType == 'employee'
                      ? firstName + ' ' + lastName
                      : contact
                      ? contact.firstName + ' ' + contact.lastName
                      : currentUser.firstName + ' ' + currentUser.lastName}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.jobTitle, {color: 'green'}]}>
                {currencySymbol + parseInt(currencyRate) * parseInt(amountDue)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginRight: 2,
              }}>
              <TouchableOpacity onPress={() => Actions.jobDetail({job})}>
                <Text
                  numberOfLines={2}
                  style={[styles.jobTitle, {width: (200 / 375) * width}]}>
                  {job ? job.title : ''}
                </Text>
              </TouchableOpacity>

              <Text style={styles.date}>
                {moment(earnedDate).format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>
          <WhiteSpace size="xl" />
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: COLORS.grayMedium,
              }}>
              Recipient Type:{' '}
              <Text style={{fontWeight: '300', textTransform: 'capitalize'}}>
                {recipientType}
              </Text>
            </Text>
          </View>
          <View
            style={{
              marginTop: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: COLORS.grayMedium,
              }}>
              {customTranslate('ml_Bonus')} {customTranslate('ml_Status')}:{' '}
              <Text style={{fontWeight: '300', textTransform: 'capitalize'}}>
                {bonusStatus}
              </Text>
            </Text>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: COLORS.grayMedium,
              }}>
              Payment:{' '}
              <Text style={{fontWeight: '300', textTransform: 'capitalize'}}>
                {payment}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.referralCardContainer}>
          <Animated.Image
            style={{
              height: 30,
              width: 30,
              transform: [{rotate: spin}],
              alignSelf: 'center',
            }}
            source={require('../../../_shared/assets/erin_square.png')}
          />
        </View>
      );
    }
  }
}

const styles1 = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    color: COLORS.red,
    fontSize: 28,
    marginBottom: 0,
    fontWeight: '600',
    marginTop: 15,
  },
});

export default BonusCard;
