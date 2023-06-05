import React, {Component} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ReferralFormComponent} from './ReferralForm';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../services/language-manager';
import {COLORS} from '../../styles/colors';
import EntypoIcon from 'react-native-vector-icons/Entypo';
class OnDeckModal extends Component {
  state = {
    modalVisible: false,
    isSubmitting: false,
    autoCompleteResult: [],
    isSubmitting: false,
    newContact: true,
    error: false,
    modalVisible: false,
    selectedContact: null,
    modalBackgroundColor: '',
    width: Dimensions.get('window').width,
  };

  handleNewContact = () => {
    this.setState((prevState) => ({newContact: !prevState.newContact}));
  };
  handleContactChange = (value) => {
    // debugger
    // console.log('contacts - -', this.props.contacts);
    let autoCompleteResult = [];
    if (!value || !this.props.contacts) {
      autoCompleteResult = [];
    } else if (typeof value === 'string') {
      this.props.contacts.forEach((record) => {
        const {firstName, lastName, emailAddress} = record;
        const isFirstNameMatch =
          firstName && firstName.toLowerCase().includes(value.toLowerCase());
        const isLastNameMatch =
          lastName && lastName.toLowerCase().includes(value.toLowerCase());
        const isEmailMatch =
          emailAddress &&
          emailAddress.toLowerCase().includes(value.toLowerCase());

        if (isFirstNameMatch || isLastNameMatch || isEmailMatch) {
          autoCompleteResult.push(record);
        }
      });
    } else {
      this.props.contacts.forEach((record) => {
        const {firstName, lastName, emailAddress} = record;
        const isFirstNameMatch =
          firstName &&
          firstName.toLowerCase().includes(value.firstName.toLowerCase());
        const isLastNameMatch =
          lastName &&
          lastName.toLowerCase().includes(value.lastName.toLowerCase());
        const isEmailMatch =
          value.emailAddress &&
          emailAddress &&
          emailAddress.toLowerCase().includes(value.emailAddress.toLowerCase());

        if (isFirstNameMatch || isLastNameMatch || isEmailMatch) {
          autoCompleteResult.push(record);
        }
      });
    }
    this.setState({autoCompleteResult});
  };
  toggleIsSubmitting = () => {
    this.setState((prevState) => ({isSubmitting: !prevState.isSubmitting}));
  };
  handleError = () => {
    this.setState({error: true});
  };
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  handleSelectContact = (contact) => {
    this.setState({selectedContact: contact});
  };

  render() {
    const {
      contacts,
      handleCancel,
      ImportedCreateContact,
      onCreateReferral,
      currentUser,
    } = this.props;
    let {
      company: {theme},
    } = currentUser;
    // console.log("current user company", this.props.currentUser)
    theme = this.props.themedata ? JSON.parse(this.props.themedata) : {};
    // console.log("theme is here", this.props.themedata)
    let {width} = this.state;

    const {autoCompleteResult, newContact, isSubmitting, error} = this.state;
    return (
      <View>
        <TouchableOpacity
          style={[
            {
              height: 42,
              width: width > 450 ? 'auto' : '99.5%',
              borderRadius: 3,
              alignSelf: width > 450 ? 'flex-start' : 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                width <= 450
                  ? theme.enabled
                    ? theme.addButtonColor
                    : this.props.referContact
                    ? COLORS.primary
                    : COLORS.red
                  : 'transparent',
              borderWidth: this.props.referContact ? 0 : 0,
              borderColor: COLORS.buttonGrayOutline,
            },
            this.props.passedStyling,
          ]}
          onPress={() => this.setState({modalVisible: true})}>
          {width > 450 && (
            <AntIcon
              style={{marginRight: 5, marginTop: 3}}
              size={35}
              color={COLORS.red}
              name="pluscircle"
            />
          )}
          <Text
            style={{
              color:
                width > 450
                  ? COLORS.darkGray
                  : this.props.referContact
                  ? 'white'
                  : 'white',
              fontSize: this.props.referContact ? 14 : 18,
              textAlign: 'center',
              fontWeight: width > 450 ? 'bold' : '600',
            }}>
            {this.props.referContact
              ? customTranslate('ml_AddGeneralReferral') + ' '
              : customTranslate('ml_SubmitGeneralReferral') + ' '}
          </Text>
          {!this.props.referContact && width <= 450 && (
            <Icons
              name="ios-add-circle-outline"
              color="#fff"
              size={23}
              style={{marginLeft: 2}}
            />
          )}
        </TouchableOpacity>
        <Modal visible={this.state.modalVisible} transparent>
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,.4)',
            }}>
            <KeyboardAwareScrollView
              style={[
                {
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#fff',
                },
                {
                  backgroundColor: 'transparent',
                },
              ]}
              extraScrollHeight={200}>
              <View>
                {this.state.isSubmitting ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      marginHorizontal: 10,
                      backgroundColor: '#fff',
                      borderRadius: 30,
                      marginTop: 20,
                      paddingVertical: 20,
                    }}>
                    <Image
                      source={require('../../assets/makingreferral300.gif')}
                      alt="makingReferral"
                      resizeMode="contain"
                      style={{width: '100%'}}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      {
                        flex: 1,
                        height: '96%',
                        width: '94%',
                        marginHorizontal: '3%',
                        backgroundColor: '#fff',
                        paddingBottom: 24,
                      },
                      {
                        backgroundColor: 'white',
                        borderRadius: 30,
                        marginTop: 20,
                        maxWidth: 450,
                        alignSelf: 'center',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 1}}></View>
                      <View
                        style={{
                          flex: 6,
                          justifyContent: 'center',
                          paddingTop: 27,
                        }}>
                        <Text
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            color: theme.enabled
                              ? theme.buttonColor
                              : '#ef3c3f',
                            fontSize: 28,
                            marginBottom: 0,
                            fontWeight: '600',
                          }}>
                          {customTranslate('ml_AddGeneralReferral')}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({modalVisible: false});
                        }}
                        style={[
                          {
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        ]}>
                        {/* close button */}
                        {/* change to without circle  */}

                        <EntypoIcon
                          name="cross"
                          size={40}
                          color="#8f99a2"></EntypoIcon>
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={[
                        {
                          fontSize: 14,
                          fontWeight: '300',
                          width: '100%',
                          textAlign: 'center',
                          marginVertical: 15,
                        },
                        {paddingHorizontal: 35},
                      ]}>
                      {customTranslate('ml_DoYouKnow')}{' '}
                      {this.props.currentUser.company.name}?{''}
                      {customTranslate('ml_SubmitThem')}
                    </Text>
                    <ReferralFormComponent
                      generalJobs={this.props.generalJobs}
                      newContact={newContact}
                      handleNewContact={this.handleNewContact}
                      contacts={contacts}
                      handleContactChange={this.handleContactChange}
                      autoCompleteResult={autoCompleteResult}
                      isSubmitting={isSubmitting}
                      toggleIsSubmitting={this.toggleIsSubmitting}
                      handleCancel={handleCancel}
                      error={error}
                      handleError={this.handleError}
                      onCreateContact={ImportedCreateContact}
                      onCreateReferral={onCreateReferral}
                      currentUser={currentUser}
                      //job={job}
                      setModalVisible={this.setModalVisible}
                      selectedContact={this.state.selectedContact}
                      handleSelectContact={this.handleSelectContact}
                      referContact={this.props.referContact}
                    />
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

export default OnDeckModal;
