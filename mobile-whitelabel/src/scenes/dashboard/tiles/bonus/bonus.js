import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './bonus.component.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';

class BaseBonus extends React.Component {
  render() {
    const {title, jobs, jobMatches, currencySymbol} = this.props;
    if (this.props.dashBonuses) {
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
                  backgroundColor: COLORS.dashboardGreen,
                  alignSelf: 'center',
                  padding: 12,
                  paddingHorizontal: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: '#fff',
                    marginBottom: 5,
                  }}>
                  {currencySymbol} {this.props.dashBonuses.earned || 0}
                </Text>
                <Text
                  style={{
                    color: '#06611e',
                    fontSize: 15,
                    fontWeight: '600',
                  }}>
                  {customTranslate('ml_Earned')}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  padding: 12,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: COLORS.dashboardLightOrange,
                    marginBottom: 5,
                  }}>
                  {currencySymbol} {this.props.dashBonuses.inWaitingPrcess || 0}
                </Text>
                <Text
                  style={{
                    color: COLORS.buttonGrayText,
                    fontSize: 15,
                    textTransform: 'capitalize'
                  }}>
                  {customTranslate('ml_InWaitingPeriod')}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  padding: 12,
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: COLORS.buttonGrayText,
                    marginBottom: 5,
                  }}>
                  {currencySymbol} {this.props.dashBonuses.totalAvailable || 0}
                </Text>
                <Text
                  style={{
                    color: COLORS.buttonGrayText,
                    fontSize: 15,
                  }}>
                  {customTranslate('ml_TotalReferrals')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
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
          <Text style={{alignSelf:'center', marginVertical: 10}}>No Bonus data available</Text>
        </View>
      );
    }
  }
}
export const Bonus = (BaseBonus);
