import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { borderedTile } from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import AppIcon from '../../../../_shared/components/app-icon.component';
import { COLORS } from '../../../../_shared/styles/colors';
import styles from './contacts.component.style';

class BaseRefCard extends React.Component {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Image style={styles.image} source={require('../../../../_shared/assets/group.png')} />
          <Text style={styles.referral}>
            Automatically find people to refer and earn higher referral bonuses!
            <Text style={styles.bold}>
              {' '}
              We only share your contacts information when you make a referral.
            </Text>
          </Text>
          <TouchableOpacity style={styles.buttonview} onPress={() => Actions.contacts()}>
            <AppIcon name="network" color={COLORS.white} size={25} />
            <Text style={styles.button}>Connect Contacts</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => Actions.contacts()}>
          <Text style={styles.contact}>
            You can edit your
            <Text style={styles.contactlink}> Contacts </Text>
            settings at any time.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export const ContactsCard = borderedTile(BaseRefCard);
