import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './referrals.component.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';
import { get } from 'lodash';

class BaseReferrals extends React.Component {
  parseStatus = (el) => {
    switch (el) {
      case 'accepted':
        return customTranslate('ml_Accepted');
      case 'hired':
        return customTranslate('ml_Hired');
      case 'referred':
        return customTranslate('ml_Referred');
      case 'notHired':
        return customTranslate('ml_NotHired');
      case 'interviewing':
        return get(
          this,
          'props.currentUser.company.referralStatus',
          customTranslate('ml_Interviewing'),
        );
      case 'declined':
        return customTranslate('ml_Declined');
      case 'noresponse':
        return customTranslate('ml_NoResponse');
      case 'inactive':
        return customTranslate('ml_Inactive');
      case 'ineligible':
        return customTranslate('ml_Ineligible');
      default:
        return null;
    }
  };
  render() {
    const {title, jobs, jobMatches} = this.props;
    let goodMatches = [];
    if (typeof jobMatches !== 'undefined' && jobMatches !== null) {
      goodMatches = jobMatches.filter(
        (jobMatch) =>
          jobMatch.relevance >= 10 && jobMatch.matchStatus !== false,
      );
    }

    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: COLORS.dashboardBlue,
                alignSelf: 'center',
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: 5,
                }}>
                {this.props.totalReferrals}
              </Text>
              <Text
                style={{
                  color: COLORS.darkBlue,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                {customTranslate('ml_TotalReferrals')}
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            {this.props.statusWise ? (
              Object.keys(this.props.statusWise).map((el, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    onPress={() => Actions.profile()}
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.lightGray,
                      marginBottom: 5,
                      textTransform: 'capitalize',
                    }}>
                    {this.parseStatus(el)}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: COLORS.darkGray,
                      marginBottom: 5,
                    }}>
                    {this.props.statusWise[el]}
                  </Text>
                </View>
              ))
            ) : (
              <Text
                onPress={() => Actions.profile()}
                style={{
                  fontWeight: 'bold',
                  color: COLORS.lightGray,
                  marginBottom: 5,
                }}>
                No data available at this moment
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            height: 0.6,
            backgroundColor: COLORS.buttonGrayOutline,
            marginTop: 10,
            marginBottom: 10,
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 1,
            }}>
            <Text style={[styles.title, {marginRight: 10}]}>
              {customTranslate('ml_ReferralsByBonusLevel')}
            </Text>
          </View>
          {this.props.tierWise ? (
            this.props.tierWise && (
              <View style={{flex: 1}}>
                {this.props.tierWise.map((el, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      onPress={() => Actions.profile()}
                      style={{
                        fontWeight: 'bold',
                        color: COLORS.lightGray,
                        marginBottom: 5,
                      }}>
                      {el.name + ':'}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: COLORS.darkGray,
                        marginBottom: 5,
                      }}>
                      {el.count}
                    </Text>
                  </View>
                ))}
              </View>
            )
          ) : (
            <Text
              onPress={() => Actions.profile()}
              style={{
                fontWeight: 'bold',
                color: COLORS.lightGray,
                marginBottom: 5,
              }}>
              No data found
            </Text>
          )}
        </View>
      </View>
    );
  }
}
export const Referrals = borderedTile(BaseReferrals);
