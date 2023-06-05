import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './employees.component.style';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';

class BaseEmployees extends React.Component {
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
        <View style={{alignItems: 'center', marginTop: 5}}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={Math.floor(
              (this.props.withReferrals /
                (this.props.withReferrals + this.props.withoutReferrals)) *
                100,
            )}
            tintColor={COLORS.primary}
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="rgb(239, 239, 239)">
            {() => (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: COLORS.buttonGrayText,
                  }}>
                  {this.props.withReferrals + this.props.withoutReferrals}
                </Text>
                <Text style={{color: COLORS.buttonGrayText}}>Total</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
        <View
          style={{
            height: 0.6,
            backgroundColor: COLORS.buttonGrayOutline,
            marginTop: 10,
            marginBottom: 10,
          }}></View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    height: 12,
                    width: 28,
                    backgroundColor: 'rgb(239, 239, 239)',
                    borderRadius: 10,
                    marginRight: 5,
                  }}></View>
                <Text
                  onPress={() => Actions.profile()}
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.lightGray,
                  }}>
                  {customTranslate('ml_Employees') + ':'}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.darkGray,
                  marginBottom: 5,
                }}>
                {this.props.withoutReferrals}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 5,
                }}>
                <View
                  style={{
                    height: 12,
                    width: 28,
                    backgroundColor: COLORS.primary,
                    borderRadius: 10,
                    marginRight: 5,
                  }}></View>
                <Text
                  onPress={() => Actions.profile()}
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.lightGray,
                    textTransform: 'capitalize',
                  }}>
                  {customTranslate('ml_EmployeeWithReferrals') + ':'}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.darkGray,
                  marginBottom: 5,
                }}>
                {this.props.withReferrals}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: 'bold',
                color: COLORS.darkGray,
                marginBottom: 5,
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 5,
              }}>
              {this.props.newEmployees}{' '}
              <Text style={{color: COLORS.lightGray, textTransform: 'capitalize'}}>
                {customTranslate('ml_New_Employees')}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
export const Employees = borderedTile(BaseEmployees);
