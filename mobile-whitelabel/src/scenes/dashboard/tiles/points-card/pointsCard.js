import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './pointsCard.component.style';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../../_shared/services/language-manager';

class BaseRefCard extends React.Component {
  render() {
    const {userDashboard} = this.props;
    const {ranking} = userDashboard;
    const {pointsRanking} = this.props.currentUser;
   // console.log('Points Card', this.props.pointsRanking);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.titlee}</Text>
        <View style={[styles.row]}>
          {this.props.pointsRanking > 0 ? (
            <View style={styles.leftcontent}>
              <Text style={styles.rank}>#{this.props.pointsRanking}</Text>
              <Text style={styles.jobs}>
                {customTranslate('ml_Dashboard_OfAllEmployees')}
              </Text>
            </View>
          ) : (
            <View style={styles.leftcontent}>
              <Text style={styles.jobs}>No Ranking</Text>
            </View>
          )}
          <TouchableOpacity style={[styles.leftcontent]} onPress={Actions.jobs}>
            {/* <Text style={styles.numopen}>{jobs.filter(j => j.status === 'open').length}</Text> */}
            <Text style={styles.numopen}>
              {(this.props.points || 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
            <Text style={styles.jobs}>{customTranslate('ml_Points')}</Text>
          </TouchableOpacity>
          {/* <View style={styles.rightcontent}>
            <Text style={styles.numreferrals}>
              {typeof jobMatches !== 'undefined' && jobMatches !== null ? goodMatches.length : '0'}
            </Text>
            <Text style={styles.recommended}>Referrals Recommended</Text>
          </View> */}
        </View>
      </View>
    );
  }
}
export const PointsCard = borderedTile(BaseRefCard);
