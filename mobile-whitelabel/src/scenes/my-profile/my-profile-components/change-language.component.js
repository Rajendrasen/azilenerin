import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { styles } from '../my-profile.styles';
import SelectLanguage from '../../../_shared/components/language/select-language.component';

const { LinkStyles } = styles;

const ChangeLanguage = () => {
  return (
    <View>
      <Text style={LinkStyles}>Change Language</Text>
      <SelectLanguage visible={true} />
    </View>
  );
};

export default ChangeLanguage;
