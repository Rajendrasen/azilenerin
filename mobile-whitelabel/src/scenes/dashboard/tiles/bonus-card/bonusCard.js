import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './bonusCard.component.style';
import i18n from 'react-native-i18n';
import {COLORS} from '../../../../_shared/styles/colors';
import get from 'lodash/get';
import moment from 'moment';

class BaseBonusCard extends React.Component {
  render() {
    const {title, jobs, jobMatches} = this.props;
    let firstBonus = this.props.bonuses[0];
    const jobTitle = get(firstBonus, 'job.title', '');
    const jobId = get(firstBonus, 'job.id', '');
    const startDate = get(firstBonus, 'startDate');
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <View style={{paddingLeft: 10}}>
          <Text
            style={{fontWeight: 'bold', color: COLORS.blue, marginBottom: 3}}>
            {jobTitle}
          </Text>
          <Text style={{ fontSize: 13, marginBottom: 5}}>
            Start Date:{' '}
            <Text style={{fontWeight: '400', color: COLORS.grayMedium}}>
              {moment(startDate).format('MM/DD/YYYY')}
            </Text>
          </Text>
          <View style={{marginTop: 10}}>
            {this.props.bonuses.map((bonus) => (
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.green,
                  marginBottom: 3,
                }}>
                ${get(bonus, 'amountDue')}{' '}
                <Text style={{fontWeight: '400', color: COLORS.grayMedium}}>
                  eligible on{' '}
                  {moment(get(bonus, 'earnedDate')).format('MM/DD/YYYY')}
                </Text>
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  }
}
export const BonusCard = borderedTile(BaseBonusCard);
