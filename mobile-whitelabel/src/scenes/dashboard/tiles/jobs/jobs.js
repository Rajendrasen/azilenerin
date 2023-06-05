import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './jobs.component.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';

class BaseJobs extends React.Component {
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
      <View style={ {
        width: '98%',
        marginVertical: 8,
        backgroundColor: COLORS.white,
        // shadowColor: COLORS.lightGray,
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 1,
        //   width: 1,
        // },
        padding: 15,
        borderRadius: 10,
        flex: 1
      }}>
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
                backgroundColor: COLORS.dashboardLightOrange,
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
                {this.props.totalJobs}
              </Text>
              <Text
                style={{
                  color: COLORS.dashboardDarkOrange,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                {customTranslate('ml_TotalJobs')}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
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
                  textTransform: 'capitalize'
                }}>
                {customTranslate('ml_WithReferralsJobs') + ':'}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.darkGray,
                  marginBottom: 5,
                }}>
                {this.props.jobsWithReferral}
              </Text>
            </View>
            <View
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
                {customTranslate('ml_WithoutReferrals') + ':'}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.darkGray,
                  marginBottom: 5,
                }}>
                {this.props.jobsWithoutReferral}
              </Text>
            </View>
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
              {customTranslate('ml_JobByBonusLevel')}
            </Text>
          </View>
          <View style={{flex: 1}}>
            {this.props.tierWise ? (
              this.props.tierWise.map((el, i) => (
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
              ))
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
      </View>
    );
  }
}
export const Jobs = (BaseJobs);
