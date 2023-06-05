import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { styles } from '../my-profile.styles';

const { LinkStyles } = styles;

const PasswordLink = () => {
  return (
    <View>
      <Text style={LinkStyles} onPress={() => Actions.resetPasswordScene()}>
        {customTranslate('ml_ResetPassword')}
      </Text>
    </View>
  );
};

export default PasswordLink;
