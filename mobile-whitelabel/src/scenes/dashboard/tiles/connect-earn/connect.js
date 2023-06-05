import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { borderedTile } from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import AppIcon from '../../../../_shared/components/app-icon.component';
import { COLORS } from '../../../../_shared/styles/colors';
import styles from './connect.component.style';

class BaseRefCard extends React.Component {
  render() {
    const { title, currencyRate, currencySymbol } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Image
            style={styles.image}
            source={require('../../../../_shared/assets/piggy-bank.png')}
          />
          <Text style={styles.referral}>
            Automatically find people to refer and earn higher referral bonuses!
            <Text style={styles.bold}>
              {' '}
              We only share your contacts information when you make a referral.
            </Text>
          </Text>
          <View style={styles.bonus}>
            <Text>New Referral Bonus:</Text>
            <Text style={styles.total}>
              {currencySymbol}
              {parseInt(3000 * currencyRate)}
            </Text>
          </View>
          <TouchableOpacity style={styles.buttonview} onPress={() => Actions.contacts()}>
            <AppIcon name="network" color={COLORS.white} size={25} />
            <Text style={styles.button}>Connect Contacts</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Actions.contacts()}>
          <Text style={styles.contact}>
            You can edit settings on the
            <Text style={styles.contactlink}> Contacts </Text>
            page.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export const ConnectCard = borderedTile(BaseRefCard);
