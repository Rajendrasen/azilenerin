import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { FormattedCurrency } from 'react-native-globalize';
import Icon from '../../../../_shared/components/icon';
import { borderedTile } from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import { COLORS } from '../../../../_shared/styles/colors';
import styles from './recommended.component.style';

class BaseRefCard extends React.Component {
  render() {
    const { title, selectJob, matchNumber, currencyRate, currencySymbol } = this.props;
    if (selectJob) {
      let parsedReferralBonus;
      let parsedLocation;
      let location;

      // referralBonus is coming in as a json string for admin@bestco.com
      if (typeof selectJob.referralBonus === 'string') {
        parsedReferralBonus = JSON.parse(selectJob.referralBonus);
      }

      const refBonus = parsedReferralBonus || selectJob.referralBonus;
      if (selectJob && selectJob.location && typeof selectJob.location === 'string') {
        parsedLocation = JSON.parse(selectJob.location);

        if (typeof parsedLocation === 'undefined') {
          location = 'null, null';
        } else if (parsedLocation) {
          location =
            parsedLocation.isRemote === true
              ? 'Remote'
              : `${parsedLocation.city}, ${parsedLocation.state}`;
        }
      }

      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => Actions.jobDetail({ job: selectJob })}>
            <Text
              style={[
                styles.jobtitle,
                {
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              ]}
            >
              {selectJob.title}
            </Text>
          </TouchableOpacity>
          <View style={styles.row}>
            {selectJob.department && (
              <View style={styles.department}>
                <Icon name="folder" color={COLORS.darkGray} fill={COLORS.darkGray} />
                <Text style={styles.deptext}>{selectJob.department.name}</Text>
              </View>
            )}
            <View style={styles.department}>
              <Icon name="placeholder" color={COLORS.darkGray} fill={COLORS.darkGray} />
              <Text style={styles.deptext}>
                {!location || location.startsWith('null,') ? 'Unavailable ' : location}
              </Text>
            </View>
          </View>
          {refBonus && refBonus.hasBonus && (
            <View style={styles.amount}>
              <Text style={styles.total}>
                <FormattedCurrency
                  value={parseInt(refBonus.amount * currencyRate)}
                  currency="USD"
                  style={styles.total}
                  maximumFractionDigits={0}
                  currencySymbol={currencySymbol}
                />
              </Text>
            </View>
          )}
          <View style={styles.referral}>
            <Image
              style={styles.tick}
              source={require('../../../../_shared/assets/tick-inside-circle.png')}
            />
            <TouchableOpacity onPress={() => Actions.contacts()}>
              <Text style={styles.network}>{matchNumber} Person/s </Text>
            </TouchableOpacity>
            <Text style={styles.match}>In Your Network Match This Job!</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noReferralsContainer}>
          <Text style={styles.noReferralsText}>
            Sorry, we don’t have any Smart Referrals for you.
          </Text>
        </View>
      </View>
    );
  }
}
export const RecommendedReferralCard = borderedTile(BaseRefCard);
