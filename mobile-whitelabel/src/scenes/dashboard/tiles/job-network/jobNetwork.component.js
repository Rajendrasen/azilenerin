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
        company: {contactIncentiveBonus},
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
                width: '100%',
                height: 73,
                paddingBottom: 3,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
            onPress={Actions.jobs}>
            <Text style={{fontSize: 15, color: 'grey'}}>
              You can browse jobs and request referrals from:
            </Text>
            <Text style={{color: COLORS.blue, fontWeight: 'bold',fontSize: 18, marginTop: 10}}>BestCo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export const JobNetwork = borderedTile(BaseRefCard);
