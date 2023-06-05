import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import ProgressBar from '../../../../_shared/components/progress-bar/progressbar';
import Icon from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';

class BaseAcceptedReferrals extends React.Component {
  getReferralStatus() {
    if (
      this.props.referrals &&
      this.props.referrals.current > this.props.referrals.previous
    ) {
      return 'arrowup';
    }
    if (
      this.props.referrals &&
      this.props.referrals.current < this.props.referrals.previous
    ) {
      return 'arrowdown';
    }
    if (
      this.props.referrals &&
      (this.props.referrals.current === 0 ||
        this.props.referrals.current === this.props.referrals.previous)
    ) {
      return 'minus';
    }
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

  getPercent = () => {
    let acceptedReferralCounts = this.props.referrals;
    if (!acceptedReferralCounts) return 0;
    if (!acceptedReferralCounts.current && !acceptedReferralCounts.previous)
      return 0;
    if (acceptedReferralCounts.current && !acceptedReferralCounts.previous)
      return 100;
    let percentChangeAccept = acceptedReferralCounts
      ? parseFloat(
          Math.abs(
            ((acceptedReferralCounts.current -
              acceptedReferralCounts.previous) /
              acceptedReferralCounts.previous) *
              100,
          ).toFixed(0),
        )
      : 0;
    percentChangeAccept = percentChangeAccept > 100 ? 100 : percentChangeAccept;
    if (percentChangeAccept === Infinity) percentChangeAccept = 100;
    return percentChangeAccept;
  };
  getReferralColor() {
    if (
      this.props.referrals &&
      this.props.referrals.current > this.props.referrals.previous
    ) {
      return COLORS.dashboardGreen;
    }
    if (
      this.props.referrals &&
      this.props.referrals.current < this.props.referrals.previous
    ) {
      return COLORS.red;
    }
    if (
      this.props.referrals &&
      (this.props.referrals.current === 0 ||
        this.props.referrals.current === this.props.referrals.previous)
    ) {
      return COLORS.dashboardLightOrange;
    }
  }
  render() {
    const {title, userDashboard} = this.props;

    const percentChange = this.handlePercentChange();
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.row]}>
          {this.props.referrals && (
            <View style={styles.content}>
              <Text style={styles.rank}>{this.props.referrals.current}</Text>
              <Text style={styles.employees}>{customTranslate('ml_MadeThisMonth')}</Text>
            </View>
          )}
          {!this.props.referrals && (
            <View style={styles.content}>
              {/* <Text style={styles.employees}>{customTranslate('ml_NoReferralsYet')}</Text> */}
              <Text style={[styles.employees, {flex: 1}]}>
                {
                  'Your referrals status will be available after you make your first referral.'
                }
              </Text>
            </View>
          )}
          {/* {!this.props.referrals ? (
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
          )} */}
          {this.props.referrals && (
            <View style={styles.content}>
              <Text style={styles.rank}>{this.props.referrals.previous}</Text>
              <Text style={[styles.employees, {textTransform: 'capitalize'}]}>
                {customTranslate('ml_Made_Last_Month')}
              </Text>
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
        {/* <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View style={{flex: 5}}>
            <View
              style={{
                height: 8,
                backgroundColor: 'rgb(239, 239, 239)',
                borderRadius: 10,
                width: '100%',
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: this.getReferralColor(),
                  width: this.getPercent() + '%',
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}></View>
            </View>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: COLORS.grayMedium,
              }}>
              {this.getPercent()}%
            </Text>
          </View>
        </View> */}
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

export const AcceptedReferrals = borderedTile(BaseAcceptedReferrals);
