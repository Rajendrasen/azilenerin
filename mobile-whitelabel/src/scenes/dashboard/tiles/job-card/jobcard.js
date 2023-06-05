import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './jobcard.component.style';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../../_shared/services/language-manager';

class BaseRefCard extends React.Component {
  render() {
    const {title, jobs, jobMatches} = this.props;
    let goodMatches = [];
    if (typeof jobMatches !== 'undefined' && jobMatches !== null) {
      goodMatches = jobMatches.filter(
        (jobMatch) =>
          jobMatch.relevance >= 10 && jobMatch.matchStatus !== false,
      );
    }
    if (!jobs || !jobs.length) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={styles.leftcontent} onPress={Actions.jobs}>
              <Text style={styles.numopen}>0</Text>
              <Text style={styles.jobs}>
                {customTranslate('ml_Dashboard_OpenPositions')}
              </Text>
            </TouchableOpacity>
            <View style={styles.rightcontent}>
              <Text style={styles.numreferrals}>
                {typeof jobMatches !== 'undefined' && jobMatches !== null
                  ? goodMatches.length
                  : '0'}
              </Text>
              <Text style={styles.recommended}>
                {customTranslate('ml_Dashboard_ReferralsRecommended')}
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={([styles.row], {justifyContent: 'center'})}>
          <TouchableOpacity
            style={[styles.leftcontent, {width: '100%'}]}
            onPress={Actions.jobs}>
            {/* <Text style={styles.numopen}>{jobs.filter(j => j.status === 'open').length}</Text> */}
            <Text style={styles.numopen}>{jobs}</Text>
            <Text style={styles.jobs}>
              {customTranslate('ml_Dashboard_OpenPositions')}
            </Text>
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
export const JobCard = borderedTile(BaseRefCard);
