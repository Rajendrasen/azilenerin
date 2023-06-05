import React from 'react';
import { View, Text, Linking } from 'react-native';
import format from 'date-fns/format';
import { styles } from '../my-profile.styles';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';

const { EmployeeName, Heading, LinkStyles, EmployeeEmail, Flex } = styles;

const EmployeeInfo = props => {
  const { firstName, lastLogin, lastName, emailAddress } = props;
  return (
    <View style={[Flex, { height: 130 }]}>
      <Text style={[EmployeeName, Heading]} numberOfLines={2}>
        {firstName} {lastName}
      </Text>
      <Text
        style={{
          color: '#018dd3',
          fontWeight: 'bold',
          // height: 130
        }}
        // onPress={() => Linking.openURL(`mailto:${emailAddress}`)}
        numberOfLines={3}
      >
        {emailAddress}
      </Text>
      {lastLogin && (
        <Text numberOfLines={1}>
          {customTranslate('ml_LastLogin')}: {format(lastLogin, 'M/D/YYYY')}
        </Text>
      )}
    </View>
  );
};

export default EmployeeInfo;
