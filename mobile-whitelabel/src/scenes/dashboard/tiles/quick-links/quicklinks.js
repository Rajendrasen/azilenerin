import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {borderedTile} from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './quicklink.component.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import {COLORS} from '../../../../_shared/styles/colors';

class BaseQuickLink extends React.Component {
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
        <View style={{paddingLeft: 10}}>
          <Text
            onPress={() => Actions.profile()}
            style={{fontWeight: 'bold', color: COLORS.blue, marginBottom: 5}}>
            {customTranslate('ml_MyProfile')}
          </Text>

          <Text
            onPress={() => Actions.resetPasswordSingle()}
            style={{fontWeight: 'bold', color: COLORS.blue, marginBottom: 5}}>
            {customTranslate('ml_ResetPassword')}
          </Text>
          <Text
            onPress={() => Linking.openURL('https://erinapp.com/support')}
            style={{fontWeight: 'bold', color: COLORS.blue, marginBottom: 5}}>
            {customTranslate('ml_Support')}
          </Text>
        </View>
      </View>
    );
  }
}
export const QuickLink = (BaseQuickLink);
