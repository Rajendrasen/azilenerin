import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../my-profile.styles';

const { EditProfileContainer, LinkStyles, EditProfile } = styles;

const EditProfileLink = props => {
  return (
    <TouchableOpacity
      onPress={props.resendInvite}
      style={[EditProfileContainer, { marginTop: 0, marginBottom: 0 }]}
    >
      <Text style={[EditProfile, LinkStyles]}>Resend Invite</Text>
    </TouchableOpacity>
  );
};

export default EditProfileLink;
