import React, {Component} from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Clipboard,
  Dimensions,
  StyleSheet,
} from 'react-native';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../_shared/services/language-manager';
import Icons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import {COLORS} from '../../_shared/styles/colors';
import {getDomain} from '../../WhiteLabelConfig';
import {showMessage} from 'react-native-flash-message';
import {hpx, wpx} from '../../_shared/constants/responsive';
export default class InviteModal extends Component {
  state = {
    showModal: false,
    extendedNetworkUrl:
      'https://' +
      getDomain() +
      '/new-user-sign-up/' +
      this.props.currentUser.id,
  };
  render() {
    const {width, color} = this.props;
    return (
      <View>
        <TouchableOpacity
        onPress={() => this.setState({showModal: true})}
        >
          <View
            style={{
              width:width/10,
              borderRadius:width/100,
              height: '100%',
              backgroundColor: color,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icons
              name="ios-add-circle-outline"
              color="#000"
              size={25}
              style={{marginLeft: 2}}
            />
          </View>
          {/* <Text
            style={{
              fontSize: width > 450 ? 15 : 17,
              lineHeight: 35,
              marginLeft: 30,
              color: '#fff',
            }}>
            Invite
          </Text> */}
        </TouchableOpacity>
        <Modal
          title={customTranslate('ml_AddContacts')}
          transparent
          onClose={this.onClose}
          maskClosable
          visible={this.state.showModal}
          closable
          // footer={footerButtons}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,.4)',
            }}>
            <View style={styles1.modalBox}>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: wpx(15),
                }}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 8}}>
                  <Text
                    style={{
                      color: '#999999',
                      textAlign: 'center',
                      marginBottom: hpx(18),
                    }}>
                    After you invite contacts, they will have the ability to
                    browse your company's jobs and request referrals from you.
                    They can also authorize you to be notified when their resume
                    matches open positions.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showModal: false,
                    });
                  }}
                  style={{flex: 1, alignItems: 'flex-end'}}>
                  <Icons
                    name="ios-close"
                    size={wpx(35)}
                    color="#888888"></Icons>
                </TouchableOpacity>
              </View>

              <View style={{alignItems: 'center', marginBottom: 10}}>
                <QRCode size={110} value={this.state.extendedNetworkUrl} />
              </View>
              <Text
                style={{
                  color: '#444444',
                  fontWeight: 'bold',
                  marginBottom: 3,
                  marginTop: 10,
                }}>
                Invite Link
              </Text>
              <Text
                style={{
                  color: '#999999',
                  marginBottom: 5,
                }}>
                Anyone can use this link to join your referral network
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: 35,
                  borderRadius: 5,
                  overflow: 'hidden',
                  marginBottom: 15,
                }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 5,
                    color: '#696969',
                    flex: 1,
                  }}
                  editable={false}
                  value={this.state.extendedNetworkUrl}
                />
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(this.state.extendedNetworkUrl);
                    showMessage({
                      message: 'Copied to Clipboard.',
                      type: 'success',
                    });
                  }}
                  style={{
                    backgroundColor: COLORS.blue,
                    paddingHorizontal: 10,
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white', fontSize: 13}}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles1 = StyleSheet.create({
  modalBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 50,
    marginRight: 50,
    marginTop: 50,
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: Dimensions.get('window').width - 40,
    maxWidth: 450,
  },
  importMethod: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#999999',
    marginTop: 3,
    fontSize: 15,
  },
  addContact: {
    height: 42,
    backgroundColor: '#ef3c3f',
    width: '99.5%',
    borderRadius: 3,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
