import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './top-referrers.component.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';

class BaseTopReferrers extends React.Component {
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
        {this.props.topReferrers && this.props.topReferrers.length ? (
          <View style={{paddingHorizontal: 10}}>
            {this.props.topReferrers.map((el, i) => (
              <View
                key={i}
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  onPress={() => Actions.profile()}
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.lightGray,
                    marginBottom: 5,
                  }}>
                  {i + 1}. {el.firstName + ' ' + el.lastName}
                </Text>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: COLORS.darkGray,
                    marginBottom: 5,
                  }}>
                  {el.totalReferrals}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View
            style={{
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: COLORS.grayMedium}}>No data available</Text>
          </View>
        )}
      </View>
    );
  }
}
export const TopReferrers = borderedTile(BaseTopReferrers);
