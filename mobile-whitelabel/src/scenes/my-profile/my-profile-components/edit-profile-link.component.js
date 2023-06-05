import React from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { styles } from '../my-profile.styles';

const { EditProfileContainer, LinkStyles, EditProfile } = styles;

const EditProfileLink = props => {
  return (
    <View style={EditProfileContainer}>
      <Text
        onPress={() =>
          Actions.editProfileScene({
            userDetails: props.userDetails,
            employeeDetails: props.employeeDetails,
          })
        }
        style={[EditProfile, LinkStyles, { textTransform: 'capitalize' }]}
      >
        {customTranslate('ml_EditProfile')}
      </Text>
    </View>
  );
};

export default EditProfileLink;
