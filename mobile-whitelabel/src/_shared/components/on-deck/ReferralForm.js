import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {List, Button, TextareaItem} from '@ant-design/react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../services/language-manager';
import {get} from 'lodash';
import Icon from '../icon/index';
import {styles} from '../refer-someone/referral-modal.styles';
import ContactAutoComplete from './ContactAutoComplete';
import {createForm} from 'rc-form';
//import {colors} from 'react-native-elements';
import {withApollo} from 'react-apollo';
import {createContact} from '../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
import gql from 'graphql-tag';
import moment from 'moment';
//import Toast from 'react-native-toast-native';
import {COLORS} from '../../styles/colors';
import {updateContactQuery} from './referral-contact.graphql';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {getAppName} from '../../../WhiteLabelConfig';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {log} from 'react-native-reanimated';
let {width} = Dimensions.get('window');
import ConfettiCannon from 'react-native-confetti-cannon';
class ReferralForm extends React.PureComponent {
  state = {
    contactId: '',
    radius: new Animated.Value(3),
    width: new Animated.Value(width - 40),
    showProgress: false,
    progress: 0,
    success: false,
    doctorMobileNumber: '',
    campaign: '',
    state: '',
    practiceName: '',
    officePhone: '',
    email: '',
    doctorMobileNumberError: false,
    campaignError: false,
    stateError: false,
    practiceNameError: false,
    officePhoneError: false,
    emailError: false,
    visible: false,
  };
  checkIsAlreadyReferredToJob = () => {
    const {job, form} = this.props;
    const userId = form.getFieldValue('userId');
    const email = form.getFieldValue('emailAddress');

    const isAlreadyReferredToJob = get(job, 'referrals', []).find(
      (referral) =>
        referral.contactId === userId ||
        (referral.contact && referral.contact.emailAddress === email),
    );
    if (isAlreadyReferredToJob) {
      return new Error('This person has already been referred');
    }
    return;
  };
  componentDidMount() {
    AsyncStorage.getItem('contactId').then((contactId) => {
      this.setState({
        contactId: contactId,
      });
    });
  }
  showAnimation = (time) => {
    const {toggleIsSubmitting, handleCancel} = this.props;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          toggleIsSubmitting();
          handleCancel && handleCancel();
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 6000);
    });
  };
  shrinkAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: 45,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.radius, {
        toValue: 22.5,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(this.handleProgress);
  };
  circularProgress;

  handleProgress = () => {
    this.setState({showProgress: true, progress: 80}, () => {
      this.circularProgress.animate(this.state.progress, 800, Easing.quad);
    });
  };

  afterAnimation = () => {
    if (this.state.progress == 100) {
      this.setState(
        {showProgress: false, progress: 0, success: true},
        this.handleSuccessExpand,
      );
    }
  };
  handleSuccessExpand = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: width - 40,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.radius, {
        toValue: 3,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => setTimeout(() => this.props.setModalVisible(false), 4000));
  };

  handleReferralSuccess = () => {
    this.setState({progress: 100}, () =>
      this.circularProgress.animate(this.state.progress, 800, Easing.quad),
    );
    this.explosion.start();
    let timeId = setTimeout(() => {
      showMessage({
        message: 'You earned 25 points',
        type: 'success',
        color: 'white',
        backgroundColor: COLORS.green,
        position: 'bottom',
      });
      clearTimeout(timeId);
    }, 1000);
  };
  handleSubmit = () => {
    const {
      contacts,
      newContact,
      handleNewContact,
      autoCompleteResult,
      handleContactChange,
      toggleIsSubmitting,
      handleError,
      onCreateContact,
      onCreateReferral,
      currentUser,
      selectedContact,
    } = this.props;

    const {form} = this.props;
    form.validateFields((err, values) => {
      console.log('values>?>?>?', values);

      const emailPattern =
        /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,20}[\.][a-z]{2,5}/g;
      const phonePattern =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      let email = null,
        phone = null,
        importMethod = '';
      if (values.emailAddress != undefined) {
        if (emailPattern.test(values.emailAddress)) {
          email = values.emailAddress;
          importMethod = 'email';
        } else if (phonePattern.test(values.emailAddress)) {
          phone = values.emailAddress;
          importMethod = 'manual';
        }
      }
      if (!err) {
        console.log('fdgdf');

        if (getAppName() == 'heartlandAffiliation') {
          const {
            doctorMobileNumber,
            campaign,
            state,
            practiceName,
            officePhone,
            email,
          } = this.state;
          let firstname = values.firstName;
          let lastName = values.lastName;
          let myemail = values.emailAddress;
          let note = values.message;
          if (doctorMobileNumber == null || doctorMobileNumber == '') {
            this.setState({
              doctorMobileNumber: true,
              campaignError: false,
              stateError: false,
              practiceNameError: false,
              officePhoneError: false,
              emailError: false,
            });
          } else if (campaign == null || campaign == '') {
            this.setState({
              doctorMobileNumber: false,
              campaignError: true,
              stateError: false,
              practiceNameError: false,
              officePhoneError: false,
              emailError: false,
            });
          } else if (state == null || state == '') {
            this.setState({
              doctorMobileNumber: false,
              campaignError: false,
              stateError: true,
              practiceNameError: false,
              officePhoneError: false,
              emailError: false,
            });
          } else if (practiceName == null || practiceName == '') {
            this.setState({
              doctorMobileNumber: false,
              campaignError: false,
              stateError: false,
              practiceNameError: true,
              officePhoneError: false,
              emailError: false,
            });
          } else if (officePhone == null || officePhone == '') {
            this.setState({
              doctorMobileNumber: false,
              campaignError: false,
              stateError: false,
              practiceNameError: false,
              officePhoneError: true,
              emailError: false,
            });
          } else if (email == null || email == '') {
            this.setState({
              doctorMobileNumber: false,
              campaignError: false,
              stateError: false,
              practiceNameError: false,
              officePhoneError: false,
              emailError: true,
            });
          } else {
            this.setState({
              doctorMobileNumber: false,
              campaignError: false,
              stateError: false,
              practiceNameError: false,
              officePhoneError: false,
              emailError: false,
            });
          }

          this.shrinkAnimation();
          let hubspotData = {
            company: currentUser?.company?.name,
            companyId: currentUser?.companyId,
            email: myemail,
            firstname: firstname,
            lastname: lastName,
            referred_doctor: firstname + ' ' + lastName,
            //referred_doctor: hubSpotPracticeName,
            source_campaign: 'Internal Referral - ERIN - Source',
            name_of_your_practice: practiceName,
            phone: phone,
            business_state: state,
            office_phone_number: officePhone,
            // email: hubSpotEmail
          };
          console.log(hubspotData);
          console.log({
            doctorMobileNumber,
            campaign,
            state,
            practiceName,
            officePhone,
            email,
            firstname,
            lastName,
            myemail,
            note,
          });

          try {
            fetch(
              'https://qqdcnuvxb7.execute-api.us-east-2.amazonaws.com/default/erinfree-create-hubspot-contact',
              {
                method: 'POST',
                body: JSON.stringify(hubspotData),
              },
            )
              .then((response) => response.json())
              .then((responseData) => {
                this.handleReferralSuccess();
                console.log('response of the data', responseData);
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          if (newContact) {
            //toggleIsSubmitting();
            // this.showAnimation(12000).then(() => {
            this.shrinkAnimation();

            this.props.client
              .mutate({
                mutation: gql(createContact),
                variables: {
                  input: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    emailAddress: email,
                    socialMediaAccounts: null,
                    userId: currentUser.id,
                    companyId: currentUser.companyId,
                    jobHistory: null,
                    importMethod: 'email',
                    phoneNumber: phone,
                    onDeckStatus: 'onDeck',
                    onDeckDate: moment(),
                    onDeckNote: values.message ? values.message : null,
                  },
                },
              })
              .catch((err) => {
                console.log(err);
              })
              .then((response) => {
                // debugger
                console.log('response create contact : ', response);
                //  const contactId = get(response, 'data.createContact.id');
                this.handleReferralSuccess();
                // this.props.setModalVisible(false);
                // toggleIsSubmitting();
                // console.log('create referral response : ', response);
                //   return onCreateReferral({
                //     input: {
                //       companyId: currentUser.companyId,
                //       contactId,
                //       userId: currentUser.id,
                //       jobId: job.id,
                //       status: 'referred',
                //       note: values.note ? values.note : null,
                //       message: values.message ? values.message : null,
                //     },
                //   });
              });
            // .then(response => {
            //   this.props.setModalVisible(false);
            //   toggleIsSubmitting();
            // })
            // .catch(errCreateReferral => {});
          } else {
            //toggleIsSubmitting();
            this.shrinkAnimation();
            this.props.client
              .mutate({
                mutation: updateContactQuery,
                variables: {
                  input: {
                    id: values.userId,
                    onDeckStatus: 'onDeck',
                    onDeckDate: moment(),
                    onDeckNote: values.message ? values.message : null,
                  },
                },
              })
              .then((res) => {
                // this.props.setModalVisible(false);
                // toggleIsSubmitting();
                this.handleReferralSuccess();
                // Toast.show(customTranslate('ml_ReferralCreated'), Toast.LONG, Toast.TOP, {
                //   backgroundColor: COLORS.dashboardGreen,
                //   height: 50,
                //   width: 250,
                //   borderRadius: 10,
                // });
                showMessage({
                  message: customTranslate('ml_ReferralCreated'),
                  type: 'success',
                });
              });

            //   toggleIsSubmitting();
            //   this.showAnimation(6000)
            //     .then(() => {
            //       onCreateReferral({
            //         input: {
            //           companyId: currentUser.companyId,
            //           contactId: values.userId,
            //           userId: currentUser.id,
            //           jobId: job.id,
            //           status: 'referred',
            //           note: values.note ? values.note : null,
            //           message: values.message ? values.message : null,
            //         },
            //       });
            //     })
            //     .then(() => this.props.setModalVisible(false));
          }
        }
      } else {
        const errors = [];
        Object.keys(err).map(
          (key) =>
            err[key].errors &&
            err[key].errors.forEach((error) => errors.push(error.message)),
        );
        Alert.alert(
          'An error occured',
          errors.join('.\n'),
          [{text: 'OK', onPress: () => null}],
          {
            cancelable: false,
          },
        );
        handleError();
      }
    });
  };
  onRef(component) {
    this._autoComplete = component;
  }
  render() {
    const {
      contacts,
      newContact,
      handleNewContact,
      autoCompleteResult,
      handleContactChange,
      toggleIsSubmitting,
      handleError,
      onCreateContact,
      onCreateReferral,
      currentUser,
      selectedContact,
    } = this.props;

    // console.log('props for referral form : ', this.props.onCreateContact)
    const {getFieldDecorator} = this.props.form;
    return (
      <ScrollView
        style={styles.ReferralFormStyle}
        showsVerticalScrollIndicator={false}
        scrollEnabled={this.props.newContact}
        nestedScrollEnabled={true}
        >
        <List style={styles.ModalStyles} onSubmit={this.handleSubmit}>
          <ContactAutoComplete
            generalJobs={this.props.generalJobs}
            contacts={contacts}
            ContactOptions={autoCompleteResult}
            form={this.props.form}
            newContact={newContact}
            handleContactChange={handleContactChange}
            handleNewContact={handleNewContact}
            customValidator={() => null}
            setModalVisible={this.props.setModalVisible}
            ref={(ref) => this.onRef(ref)}
            selectedContact={selectedContact}
            referContact={this.props.referContact}
          />
          <View>
            <View style={[styles.LabelStyles, {marginHorizontal: 10}]}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {customTranslate('ml_Message_The_Recruiter')}{' '}
                </Text>
                <Text>{customTranslate('ml_Optional')}</Text>
              </View>
              {getFieldDecorator('message', {
                rules: [],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: COLORS.white,
                    },
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d9d9d9',
                    borderRadius: 4,
                    marginVertical: 5,
                    padding: 1,
                    fontSize: 15,
                  }}
                  placeholder={customTranslate('ml_HowKnowThem')}
                  rows={3}
                  onFocus={() => {
                    this._autoComplete && this._autoComplete.onBlur();
                  }}
                />,
              )}
            </View>
            {getAppName() == 'heartlandAffiliation' && (
              <View style={{paddingHorizontal: 10, width: '100%'}}>
                <View style={{width: '100%'}}>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    {customTranslate('ml_Doctor_Mobile_Number')}{' '}
                  </Text>
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    keyboardType="number-pad"
                    onChange={(text) =>
                      this.setState({doctorMobileNumber: text})
                    }
                  />
                  {this.state.doctorMobileNumberError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      *{' '}
                      {customTranslate('ml_Doctor_Mobile_Number') +
                        ' can not be empty'}
                    </Text>
                  )}

                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>
                    {customTranslate('ml_Soucre_Campaign')}{' '}
                  </Text>
                  {/* <DropDownPicker
                                        listMode="MODAL"
                                        setValue={(item) => {
                                            console.log('item', item());
                                            this.setState({
                                                campaign: 'Internal Referral - ERIN - Source'
                                            });
                                        }}
                                        value={'Internal Referral - ERIN - Source'}
                                        placeholder={'Select Source Campaign'}
                                        onClose={() => this.setState({ visible: false })}
                                        onOpen={() => this.setState({ visible: true })}
                                        style={{ borderColor: '#d9d9d9' }}
                                        placeholderStyle={{ color: '#d9d9d9' }}
                                        zIndex={1000}
                                        open={this.state.visible}
                                        items={[{ title: 'Internal Referral - ERIN - Source' }].map((item) => ({
                                            label: item.title,
                                        }))}
                                    /> */}
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    value={'Internal Referral - ERIN - Source'}
                    editable={false}
                    onChange={(text) => this.setState({campaign: text})}
                  />
                  {this.state.campaignError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      *{' '}
                      {customTranslate('ml_Soucre_Campaign') +
                        ' can not be empty'}
                    </Text>
                  )}
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    {customTranslate('ml_State')}{' '}
                  </Text>
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    onChange={(text) => this.setState({state: text})}
                  />
                  {this.state.stateError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      * {customTranslate('ml_State') + ' can not be empty'}
                    </Text>
                  )}
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    {customTranslate('ml_Practice_Name')}{' '}
                  </Text>
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    onChange={(text) => this.setState({practiceName: text})}
                  />
                  {this.state.practiceNameError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      *{' '}
                      {customTranslate('ml_Practice_Name') +
                        ' can not be empty'}
                    </Text>
                  )}
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    {customTranslate('ml_Office_Phone')}{' '}
                  </Text>
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    onChange={(text) => this.setState({officePhone: text})}
                  />
                  {this.state.officePhoneError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      * {'Phone number can not be empty'}
                    </Text>
                  )}
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    {customTranslate('ml_Email')}{' '}
                  </Text>
                  <TextareaItem
                    styles={{
                      container: {
                        borderBottomColor: 'white',
                      },
                    }}
                    style={formstyles.textAreaStyle}
                    onChange={(text) => this.setState({email: text})}
                  />
                  {this.state.emailError && (
                    <Text style={{fontSize: 12, marginTop: -2, color: 'red'}}>
                      * {customTranslate('ml_Email') + ' can not be empty'}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
          <View style={styles.SubmitBtnContainer}>
            {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              
            </Button> */}
            {/* <Button style={styles.SubmitBtn}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
            <View style={{alignItems: 'center'}}>
              {this.state.showProgress ? (
                <AnimatedCircularProgress
                  style={{marginVertical: 3}}
                  size={45}
                  width={6}
                  fill={0}
                  tintColor={COLORS.blue}
                  onAnimationComplete={this.afterAnimation}
                  backgroundColor={COLORS.lightGray3}
                  ref={(ref) => (this.circularProgress = ref)}
                />
              ) : this.state.success ? (
                <Animated.View
                  style={{
                    width: this.state.width,
                    height: 45,
                    backgroundColor: COLORS.dashboardGreen,
                    marginVertical: 3,
                    borderRadius: this.state.radius,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontIcon size={30} color="#fff" name="check" />
                </Animated.View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.handleSubmit();
                  }}>
                  <Animated.View
                    style={{
                      width: this.state.width,
                      height: 45,
                      backgroundColor: COLORS.primary,
                      marginVertical: 3,
                      borderRadius: this.state.radius,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.SubmitBtnText}>
                      {customTranslate('ml_SubmitReferral')}{' '}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </List>
        <View style={{position: 'absolute', bottom: -15}}>
          <ConfettiCannon
            autoStart={false}
            ref={(ref) => (this.explosion = ref)}
            fadeOut={true}
            count={200}
            origin={{x: -10, y: 0}}
          />
        </View>
      </ScrollView>
    );
  }
}

const formstyles = StyleSheet.create({
  textAreaStyle: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    marginVertical: 5,
    padding: 1,
    fontSize: 15,
  },
});

export const ReferralFormComponent = createForm()(withApollo(ReferralForm));
