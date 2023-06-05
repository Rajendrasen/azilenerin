import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import ProgressBar from '../../../../_shared/components/progress-bar/progressbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';

class BaseRefCard extends React.Component {
  getReferralColor() {
    if (this.props.currentReferralCount > this.props.previousReferralCount) {
      return COLORS.dashboardGreen;
    }
    if (this.props.referralsTotal < this.props.previousReferralCount) {
      return COLORS.red;
    }
    return COLORS.dashboardLightOrange;
  }
  getReferralStatus() {
    if (this.props.currentReferralCount > this.props.previousReferralCount) {
      return 'arrowup';
    }
    if (this.props.referralsTotal < this.props.previousReferralCount) {
      return 'arrowdown';
    }
    return 'minus';
  }

  handlePercentChange() {
    const {currentReferralCount, previousReferralCount} = this.props;
    let percentChange = parseFloat(
      Math.abs(
        ((currentReferralCount - previousReferralCount) /
          previousReferralCount) *
          100,
      ).toFixed(0),
    );

    if (percentChange === Infinity) {
      percentChange = 100;
    } else if (isNaN(percentChange)) {
      percentChange = 0;
    }
    return percentChange;
  }

  render() {
    const {title, userDashboard} = this.props;
    if (!userDashboard) return null;
    const {ranking} = userDashboard;
    const percentChange = this.handlePercentChange();
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.row]}>
          {ranking > 0 && (
            <View style={styles.content}>
              <Text style={styles.rank}># {ranking}</Text>
              <Text style={styles.employees}>
                {customTranslate('ml_Dashboard_OfAllEmployees')}
              </Text>
            </View>
          )}
          {ranking === -1 && (
            <View style={styles.content}>
              {/* <Text style={styles.employees}>{customTranslate('ml_NoReferralsYet')}</Text> */}
              <Text style={[styles.employees, {flex: 1}]}>
                {
                  'Your rank will be available after you make your first referral.'
                }
              </Text>
            </View>
          )}
          {ranking === -1 ? (
            <View style={styles.content}>
              <Image
                source={require('../../../../_shared/assets/rank.png')}
                style={{width: 40, height: 40}}
              />
            </View>
          ) : (
            <View style={styles.content}>
              <View
                style={[
                  {
                    backgroundColor: this.getReferralColor(),
                  },
                  styles.iconContainer,
                ]}>
                <Icon
                  name={this.getReferralStatus()}
                  fill={COLORS.white}
                  color={COLORS.white}
                  size={15}
                />
              </View>
            </View>
          )}
        </View>
        <View style={[styles.percent, {marginTop: 10}]}>
          {/* <ProgressBar
            percentage={percentChange / (percentChange * 0.01)}
            color={this.getReferralColor()} />
          <Text
            style={[
              {
                color: this.getReferralColor(),
              },
              styles.percentText,
            ]}
          >
            {percentChange}%
          </Text> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  percentText: {
    fontWeight: 'bold',
  },
  container: {
    height: 100,
  },
  title: {
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    width: '50%',
    alignItems: 'center',
  },
  rank: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  employees: {
    color: COLORS.lightGray,
  },
  percent: {
    flexDirection: 'row',
  },
  iconContainer: {
    padding: 15,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
});

export const EmployeeRankCard = borderedTile(BaseRefCard);
