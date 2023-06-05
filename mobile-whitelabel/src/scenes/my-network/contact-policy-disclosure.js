import React from 'react';
import {Modal} from 'react-native';
import {getAppName} from '../../WhiteLabelConfig';
const contactPolicyDisclosure = (props) => {
  return (
    <Modal
      visible={props.visible}
      transparent
      style={{
        flex: 1,
        height: '100%',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            height: 300,
            width: '85%',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 20,
            borderRadius: 6,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                letterSpacing: 1,
                marginBottom: 10,
                fontWeight: 'bold',
              }}>
              {getAppName()} collects contacts data directly from your phone to
              the referral form, so that you can easily email or text them a
              referral to a job only when the app is in use .
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default contactPolicyDisclosure;
