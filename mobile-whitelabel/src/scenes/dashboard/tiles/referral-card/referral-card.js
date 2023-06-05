import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './referralcard.component.style';
import {Actions} from 'react-native-router-flux';
import {
  calculateReferralBonusTotal,
  calculateTotalBonuses,
} from '../../../../_shared/services/utils';
import {COLORS} from '../../../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';

class BaseRefCard extends React.Component {
  render() {
    const {
      title,
      userDashboard,
      currentUser: {
        incentiveEligible,
        company: {contactIncentiveBonus, hideBonus},
        role,
      },
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={{flexDirection: 'row', flex: 1}}>
          <TouchableOpacity
            style={[
              styles.row,
              {
                flex: 1,
                height: 73,
                paddingBottom: 3,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={Actions.referrals}>
            <Text style={styles.total}>
              {userDashboard ? userDashboard.totalReferrals : 0}
            </Text>
            <Text style={styles.referral}>{customTranslate('ml_Referrals')}</Text>
          </TouchableOpacity>
          {hideBonus && role == 'employee' ? null : (
            <View
              style={{
                flex: 1,
                height: 73,
                paddingBottom: 3,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.lightGreen,
                borderRadius: 10,
              }}>
              <Text style={[styles.total, {color: COLORS.green}]}>
                {this.props.currencySymbol}
                {userDashboard
                  ? calculateTotalBonuses(
                      this.props.referralBonuses,
                      false,
                      this.props.currencyRate,
                    )
                  : 0}
              </Text>
              <Text style={styles.referral}>{customTranslate('ml_TotalBonuses')}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
export const ReferralCard = borderedTile(BaseRefCard);
