import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {COLORS, globalStyle} from '../../styles/colors';
import Icon from '../icon';
import {ReferralFormComponent} from './referral-modal-form/referral-form.component';
import {ReferralComplianceFormComponent} from './referral-modal-form/referral-compliance-form.component';
import {styles} from './referral-modal.styles';
import {calculateReferralBonus} from '../../../_shared/services/utils';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../services/language-manager';
import Icons from 'react-native-vector-icons/Ionicons';
import {downloadFromS3} from '../../../common';
import {getErinSquare} from '../../../WhiteLabelConfig';
class ReferSomeone extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      isSubmitting: false,
      newContact: false,
      error: false,
      modalVisible: false,
      selectedContact: null,
      modalBackgroundColor: '',
      spinAnim: new Animated.Value(0),
      contactLoading: true,
    };
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleSelectContact = this.handleSelectContact.bind(this);
  }

  componentDidMount() {
    //debugger
    if (this.props.matchInfo) {
      this.handleSelectContact(this.props.matchInfo);
    }
    this.spin();
  }
  toggleContactLoading = (val) => {
    this.setState({
      contactLoading: val,
    });
  };
  spin = () => {
    // debugger
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.back(),
        useNativeDriver: true,
      }),
    ).start(() => this.spin());
  };

  setModalVisible(visible) {
    if (visible == false) {
      this.spin();
      this.setState({contactLoading: true});
    }
    setTimeout(() => {
      this.setState({modalVisible: visible});
    }, 4000);
  }

  handleError = () => {
    this.setState({error: true});
  };

  toggleIsSubmitting = () => {
    this.setState((prevState) => ({isSubmitting: !prevState.isSubmitting}));
  };

  handleContactChange = (value, updatedContacts, newContact) => {
    // debugger
    // console.log('contacts - -', this.props.contacts);
    let autoCompleteResult = [];
    if (!value || (!this.props.contacts && !updatedContacts)) {
      autoCompleteResult = [];
    } else if (typeof value === 'string') {
      let contacts =
        updatedContacts && updatedContacts.length > 0
          ? updatedContacts
          : this.props.contacts;
      if (!contacts) contacts = [];
      contacts.forEach((record) => {
        const {firstName, lastName, emailAddress} = record;
        const isFirstNameMatch =
          firstName && firstName.toLowerCase().includes(value.toLowerCase());
        const isLastNameMatch =
          lastName && lastName.toLowerCase().includes(value.toLowerCase());
        const isFullNameMatch =
          firstName &&
          lastName &&
          (firstName + ' ' + lastName)
            .toLowerCase()
            .includes(value.toLowerCase());
        const isEmailMatch =
          emailAddress &&
          emailAddress.toLowerCase().includes(value.toLowerCase());

        if (
          isFirstNameMatch ||
          isLastNameMatch ||
          isEmailMatch ||
          isFullNameMatch
        ) {
          autoCompleteResult.push(record);
        }
      });
    } else {
      let contacts =
        updatedContacts && updatedContacts.length > 0
          ? updatedContacts
          : this.props.contacts;
      contacts.forEach((record) => {
        const {firstName, lastName, emailAddress} = record;
        const isFirstNameMatch =
          firstName &&
          value.firstName &&
          firstName.toLowerCase().includes(value.firstName.toLowerCase());
        const isLastNameMatch =
          lastName &&
          value.lastName &&
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
    if (newContact) {
      autoCompleteResult.push(value);
    }
    this.setState({autoCompleteResult});
  };

  handleNewContact = (cb) => {
    this.setState(
      (prevState) => ({newContact: !prevState.newContact}),
      () => {
        if (cb && {}.toString.call(cb) === '[object Function]') cb();
      },
    );
  };

  handleSelectContact(contact) {
    this.setState({selectedContact: contact});
  }

  render() {
    // console.log('....../', this.props)
    //debugger
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let {
      job,
      contacts,
      handleCancel,
      ImportedCreateContact,
      onCreateReferral,
      currentUser,
      currencyRate,
      currencySymbol,
      currentTieredBonus,
      disabled,
    } = this.props;
    let propsJob = this.props.propsJob || {};
    let {
      campaignId,
      campaignStartDate,
      campaignEndDate,
      campaignTieredBonus,
      campaignTieredBonusId,
      campaignName,
    } = propsJob;
    // debugger
    let isCampaignActive = false;
    if (
      campaignId &&
      new Date(campaignStartDate) <= new Date() <= new Date(campaignEndDate) &&
      !campaignTieredBonus.archived
    ) {
      isCampaignActive = true;
      currentTieredBonus = JSON.parse(campaignTieredBonus);
    }
    let {
      company: {theme, symbol},
    } = currentUser;
    theme = theme ? JSON.parse(theme) : {};

    const {autoCompleteResult, newContact, isSubmitting, error} = this.state;
    let {referralBonus} = job;
    let {
      location,
      company: {contactIncentiveBonus},
    } = currentUser;

    let {
      incentiveEligible,
      userGroupId,
      company: {confirmCompliance},
    } = currentUser;
    if (typeof location == 'string') {
      location = location ? JSON.parse(location) : {isRemote: true};
    } else {
      location = location ? location : {isRemote: true};
    }

    let parsedReferralBonus;
    if (typeof referralBonus === 'string') {
      parsedReferralBonus = JSON.parse(referralBonus);
    } else {
      parsedReferralBonus = referralBonus;
    }
    // if (typeof referralBonus === 'string') {
    //   referralBonus = JSON.parse(referralBonus);
    // }
    // const formattedCurrency =
    //   referralBonus && referralBonus.hasBonus
    //     ? `${referralBonus.amount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    //     : '0';
    return (
      <View style={this.props.containerStyle}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalBackgroundColor: '',
            });
            // Alert.alert('Modal has been closed.');
          }}>
          <SafeAreaView style={{backgroundColor: 'rgba(0,0,0,.4)'}}>
            <KeyboardAwareScrollView
              style={[
                styles.container,
                {
                  backgroundColor: 'transparent',
                },
              ]}
              extraScrollHeight={200}>
              <View>
                {isSubmitting ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: Dimensions.get('window').height - 40,
                      width: Dimensions.get('window').width - 20,

                      marginHorizontal: 10,
                      backgroundColor: COLORS.white,
                      borderRadius: 30,
                      marginTop: 20,
                    }}>
                    <Image
                      source={require('../../assets/makingreferral300.gif')}
                      alt="makingReferral"
                      resizeMode="contain"
                      style={styles.GifStyle}
                    />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.FullHeight,
                      {
                        backgroundColor: 'white',
                        borderRadius: 30,
                        marginTop: 20,
                        maxWidth: 450,
                        alignSelf: 'center',
                      },
                    ]}>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                      <View style={{flex: 1}}></View>
                      <View style={{flex: 5}}>
                        <Text
                          style={[
                            styles.ModalTitle,
                            theme.enabled && {color: theme.buttonColor},
                          ]}>
                          {customTranslate('ml_Jobs_ReferSomeone')}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(!this.state.modalVisible);
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

                        <Icons
                          name="ios-close"
                          size={40}
                          color="#8f99a2"></Icons>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.SmallText, {paddingHorizontal: 35}]}>
                      {/* Enter a referral and we&#39;ll send them a link to apply and/or contact the
                        hiring manager. */}
                      {customTranslate('ml_EnterReferral')}
                    </Text>
                    <View style={styles.JobInfoContainer}>
                      <View style={styles.Flex}>
                        <Text style={styles.JobTitle}>{job.title}</Text>
                        <View style={[styles.Row, {flex: 1, flexWrap: 'wrap'}]}>
                          <View
                            style={[
                              styles.Row,
                              styles.RowMarginRight,
                              {marginRight: 5},
                            ]}>
                            <Icon name="folder" color={COLORS.darkGray} />
                            <Text style={styles.LocationTextMargin}>
                              {job.department ? job.department.name : ''}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.Row,
                              styles.RowMarginRight,
                              {marginTop: 5, marginRight: 0},
                            ]}>
                            <Icon name="placeholder" color={COLORS.darkGray} />
                            <Text
                              style={styles.DeptTextMargin}
                              numberOfLines={2}>
                              {!location.isRemote &&
                              (location.city || location.state)
                                ? `${location.city}, ${location.state}`
                                : 'Remote'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.Currency}>
                          {`${
                            calculateReferralBonus(
                              contactIncentiveBonus,
                              parsedReferralBonus?.amount,
                              incentiveEligible,
                              currentTieredBonus,
                              'employee',
                              userGroupId,
                              currencyRate,
                            ) == 0
                              ? ''
                              : currencySymbol +
                                parseInt(
                                  calculateReferralBonus(
                                    contactIncentiveBonus,
                                    parsedReferralBonus?.amount,
                                    incentiveEligible,
                                    currentTieredBonus,
                                    'employee',
                                    userGroupId,
                                    currencyRate,
                                  ),
                                )
                          }`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                        {/* <Text style={styles.Currency}>${formattedCurrency}</Text> */}
                      </View>
                    </View>
                    {confirmCompliance ? (
                      <ReferralComplianceFormComponent
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
                        job={job}
                        setModalVisible={this.setModalVisible}
                        selectedContact={this.state.selectedContact}
                        handleSelectContact={this.handleSelectContact}
                        toggleContactLoading={this.toggleContactLoading}
                      />
                    ) : (
                      !confirmCompliance && (
                        <ReferralFormComponent
                          getJobDetails={this.props.getJobDetails}
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
                          job={job}
                          setModalVisible={this.setModalVisible}
                          selectedContact={this.state.selectedContact}
                          handleSelectContact={this.handleSelectContact}
                          toggleContactLoading={this.toggleContactLoading}
                          isCampaignActive={isCampaignActive}
                          campaignId={campaignId}
                        />
                      )
                    )}
                    {this.state.contactLoading ? (
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          position: 'absolute',
                          backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          borderTopRightRadius: 30,
                          borderTopLeftRadius: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Animated.Image
                          style={{
                            height: 40,
                            width: 40,
                            transform: [{rotate: spin}],
                          }}
                          source={
                            theme.enabled && symbol && symbol.key
                              ? {
                                  uri: downloadFromS3(symbol.key),
                                }
                              : getErinSquare()
                          }
                        />
                        <Text
                          style={{marginTop: 10, fontSize: 17, color: '#222'}}>
                          {customTranslate('ml_LoadingContacts')}...
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </Modal>

        <TouchableOpacity
          style={[
            styles.button,
            this.props.style,
            theme.enabled && {backgroundColor: theme.buttonColor},
            disabled && globalStyle.disabledButton,
          ]}
          onPress={() => {
            if (disabled) return;
            this.setModalVisible(true);
            this.setState({
              modalBackgroundColor: COLORS.lightGray,
              newContact: this.props.title ? false : true,
            });
          }}>
          {/* <Icon name="user" color={COLORS.white} /> */}
          <Text
            style={[
              styles.buttontext,
              disabled && globalStyle.disabledButtonText,
            ]}>
            {disabled
              ? customTranslate('ml_ReferralNotAvailable')
              : this.props.title || customTranslate('ml_Jobs_ReferSomeone')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ReferSomeone;
