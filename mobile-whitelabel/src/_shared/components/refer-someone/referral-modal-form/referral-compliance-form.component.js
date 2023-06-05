import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import {List, Button, TextareaItem} from '@ant-design/react-native';
import {get} from 'lodash';
import Icon from '../../icon/index';
import {styles} from '../referral-modal.styles';
import ContactAutoComplete from './contact-autocomplete.component';
import {createForm} from 'rc-form';
//import { colors } from 'react-native-elements';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {withApollo} from 'react-apollo';
import {createContact} from '../../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
import {COLORS} from '../../../styles/colors';
import {queryContactsByUserIdIndex} from '../../../../_store/_shared/api/graphql/custom/contacts/contacts-by-userId-graphql';
import {createWebNotification} from '../../../../_store/_shared/api/graphql/custom/referrals/create-referral.graphql';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../services/language-manager';
import gql from 'graphql-tag';
import {getDomain} from '../../../../WhiteLabelConfig';
import AsyncStorage from '@react-native-community/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import { showMessage } from 'react-native-flash-message';
let {width} = Dimensions.get('window');
class ReferralForm extends React.PureComponent {
  state = {
    contactId: '',
    sendBy: 'email',
    contactExist: false,
    contactLoading: true,
    radius: new Animated.Value(3),
    width: new Animated.Value(width - 40),
    showProgress: false,
    progress: 0,
    success: false,
  };

  selectSendBy = (val, ref, cb) => {
    this.setState({sendBy: val}, () => {
      if (val === 'text' && cb) this.phone = cb();
    });
  };

  checkPhone = () => {
    if (this.state.sendBy == 'text' && !this.phone.isValidNumber()) {
      alert('Please enter a valid phone number with country.');
      return false;
    }
    // if (this.state.sendBy == 'text' && this.state.contactExist) {
    //   return false;
    // }
    return true;
  };

  existingPhone = (val) => {
    this.setState({contactExist: val});
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
      return false;
    }
    return true;
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

  onRef(component) {
    this._autoComplete = component;
  }

  shrinkAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: 45,
        duration: 250,
      }),
      Animated.timing(this.state.radius, {
        toValue: 22.5,
        duration: 250,
      }),
    ]).start(this.handleProgress);
  };

  handleProgress = () => {
    this.setState({showProgress: true, progress: 80}, () => {
      this.circularProgress.animate(this.state.progress, 2000, Easing.quad);
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
      }),
      Animated.timing(this.state.radius, {
        toValue: 3,
        duration: 250,
      }),
    ]).start(() => setTimeout(() => this.props.setModalVisible(false), 1000));
  };

  handleReferralSuccess = () => {
    this.setState({progress: 100}, () =>
      this.circularProgress.animate(this.state.progress, 800, Easing.quad),
    );
  };

  createNotification = () => {
    const {currentUser, job} = this.props;
    let input = {
      companyId: currentUser.company.id,
      dateCreated: new Date().toISOString(),
      jobId: job.id,
      referralDevice: 'mobile',
      referralType: this.state.sendBy,
      requestingUserId: currentUser.id,
      status: 'referred',
      type: 'gdprReferralCreated',
      userId: currentUser.id,
    };

    console.log('web notification input', input);
    return this.props.client
      .mutate({
        mutation: createWebNotification,
        variables: {
          input,
        },
      })
      .then((res) => get(res, 'data.createWebNotification.id', ''));
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
      job,
      onCreateContact,
      onCreateReferral,
      currentUser,
      selectedContact,
    } = this.props;
    let {subCompany = {}} = currentUser;
    subCompany = subCompany || {};
    let {
      id: subCompanyId,
      logo: subCompanyLogo,
      name: subCompanyName,
    } = subCompany;
    const {form} = this.props;
    form.validateFields(async (err, values) => {
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
      this.checkIsAlreadyReferredToJob();

      if (!err) {
        if (newContact) {
          if (this.checkPhone()) {
            this.setState({referralLoading: true});
            //toggleIsSubmitting();
            // this.showAnimation(12000).then(() => {
            // this.shrinkAnimation();
            // let contactInput = {
            //   firstName: values.firstName,
            //   lastName: values.lastName,
            //   //emailAddress: email,
            //   socialMediaAccounts: null,
            //   userId: currentUser.id,
            //   companyId: currentUser.companyId,
            //   jobHistory: null,
            //   importMethod: this.state.sendBy === 'text' ? 'manual' : 'email',
            //   //phoneNumber: phone,
            // };
            // if (this.state.sendBy === 'text')
            //   contactInput.phoneNumber = this.phone.getValue().replace(/\D/g, '');
            // if (email) contactInput.emailAddress = email;
            //production url
            let url =
              'https://5dd3j5bcbc.execute-api.us-east-2.amazonaws.com/default/gdpr-referral-created-prod-app';
            //dev url
            // let url =
            //   'https://5g39ams6q6.execute-api.us-east-2.amazonaws.com/default/dev-gdpr-referral-created';
            let notificationId = await this.createNotification();
            let referral = {
              companyId: currentUser.companyId,
              jobId: job.id,
              note: values.note ? values.note : null,
              referralType: this.state.sendBy,
              referrerFirstName: currentUser.firstName,
              referrerLastName: currentUser.lastName,
              firstName: values.firstName,
              lastName: values.lastName,
              brandLogo: currentUser.company.logo,
              referralDevice: 'mobile',
              company: currentUser.company.name,
              title: job.title,
              location: job.location,
              avatar: currentUser.avatar,
              brandColor: currentUser.company.brandColor,
              referredBy: currentUser.id,
              languageCode: currentUser.languageCode
                ? currentUser.languageCode
                : 'US',

              senderEmailAddress: get(
                currentUser,
                'company.senderEmailAddress',
                'ERIN <noreply@erinapp.com>',
              ),
              host: getDomain(),
              webNotificationId: notificationId,
              whiteLabel: false,
            };
            if (this.state.sendBy === 'text') {
              referral.phoneNumber = this.phone.getValue().replace(/\D/g, '');
              referral.referralType = 'text';
            }
            if (email) {
              referral.emailAddress = email;
              referral.referralType = 'email';
            }
            if (subCompanyId) referral.subCompanyId = subCompanyId;
            if (subCompanyLogo) referral.subCompanyLogo = subCompanyLogo;
            if (subCompanyName) referral.subCompanyName = subCompanyName;

            console.log('referral', referral);
            fetch(url, {
              method: 'POST',
              body: JSON.stringify({referral}),
            }).then((res) => {
              res.json().then((json) => console.log('res', json));
              // this.handleReferralSuccess();
              this.setState({referralLoading: false, success: true}, () => {
                showMessage({
                  message: 'You earned 25 points',
                  type: 'success',
                  color: 'white',
                  backgroundColor: COLORS.green,
                  position: 'bottom',
                });

                this.explosion?.start();
                setTimeout(() => {
                  this.props.setModalVisible(false);
                }, 4000);
              });
            });
            // this.props.client
            //   .mutate({
            //     mutation: gql(createContact),
            //     variables: {
            //       input: contactInput,
            //     },
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   })
            //   .then(response => {
            //     // debugger
            //     // console.log('response create contact : ', response);
            //     const contactId = get(response, 'data.createContact.id');
            //     // console.log('create referral response : ', response);
            //     return onCreateReferral({
            //       input: {
            //         companyId: currentUser.companyId,
            //         contactId,
            //         userId: currentUser.id,
            //         jobId: job.id,
            //         status: 'referred',
            //         note: values.note ? values.note : null,
            //         message: values.message ? values.message : null,
            //         referralType: this.state.sendBy,
            //       },
            //     });
            //   })
            //   .then(response => {
            //     // debugger
            //     // console.log(response);
            //     //this.props.setModalVisible(false);
            //     //toggleIsSubmitting();
            //     this.handleReferralSuccess();
            //   })
            //   .catch(errCreateReferral => {
            //     // debugger
            //   });
            // });
          }
        } else {
          if (this.checkIsAlreadyReferredToJob()) {
            // this.shrinkAnimation();
            //toggleIsSubmitting();
            //this.showAnimation(6000)
            //.then(() => {

            console.log('create referrasl', {
              companyId: currentUser.companyId,
              contactId: values.userId,
              userId: currentUser.id,
              jobId: job.id,
              status: 'referred',
              note: values.note ? values.note : null,
              message: values.message ? values.message : null,
              referralType: this.state.sendBy,
              referralDevice: 'mobile',
              referralSource: 'direct',
            });
            onCreateReferral({
              input: {
                companyId: currentUser.companyId,
                contactId: values.userId,
                userId: currentUser.id,
                jobId: job.id,
                status: 'referred',
                note: values.note ? values.note : null,
                message: values.message ? values.message : null,
                referralType: this.state.sendBy,
                referralDevice: 'mobile',
                referralSource: 'direct',
              },
            })
              //})
              .then((res) => {
                console.log("onCreateReferral res==>>",res)
                // res.e
                
                // this.handleReferralSuccess();

                //confetti to be used here
                this.explosion?.start();
                showMessage({message: 'You earned 25 points',type:"success",color:"white",backgroundColor:COLORS.green,position:"bottom"});
              });
            showMessage({
              message: 'You earned 25 points',
              type: 'success',
              color: 'white',
              backgroundColor: COLORS.green,
              position: 'bottom',
            });
            setTimeout(() => {
              this.props.setModalVisible(false);
            }, 4000);
          } else {
            Alert.alert(
              'An error occured',
              'This is contact is already referred to this job.',
              [{text: 'OK', onPress: () => null}],
              {cancelable: false},
            );
            this.explosion?.stop();
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

  getContacts = async (token = null) => {
    try {
      let data = await this.props.client.query({
        query: gql(queryContactsByUserIdIndex),
        variables: {userId: this.props.currentUser.id, after: token},
        fetchPolicy: 'network-only',
      });
      console.log('data', data);
      if (!data.data.queryContactsByUserIdIndex.nextToken) {
        this.props.toggleContactLoading(false);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  circularProgress;

  render() {
    const {
      contacts,
      newContact,
      handleNewContact,
      autoCompleteResult,
      handleContactChange,
      toggleIsSubmitting,
      handleError,
      job,
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
            getContacts={this.getContacts}
            selectSendBy={this.selectSendBy}
            sendBy={this.state.sendBy}
            existingPhone={this.existingPhone}
            contactLoading={this.state.contactLoading}
            currentUser={currentUser}
          />
          <View style={styles.FormItemStyles}>
            <View style={[styles.LabelStyles, {marginHorizontal: 10}]}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {customTranslate('ml_IncludeMessageToContact')}{' '}
                </Text>
                <Text>{customTranslate('ml_Optional')}</Text>
              </View>

              {getFieldDecorator('note', {
                rules: [],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: 'white',
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
                  placeholder={customTranslate('ml_PersonalizeMessage')}
                  rows={3}
                  // onFocus={() => {
                  //   this._autoComplete && this._autoComplete.onBlur();
                  // }}
                />,
              )}
            </View>
          </View>
          {/* <View>
            <View style={[styles.LabelStyles, { marginHorizontal: 10 }]}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>Message the Hiring Contact </Text>
                <Text>(optional)</Text>
              </View>
              {getFieldDecorator('message', {
                rules: [],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: colors.white,
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
                  placeholder="How do you know them, why are they a good fit, etc."
                  rows={3}
                  onFocus={() => {
                    this._autoComplete && this._autoComplete.onBlur();
                  }}
                />
              )}
            </View>
          </View> */}
          <Text
            style={[styles.SmallText, {paddingHorizontal: 0, fontSize: 12}]}>
            {/* Enter a referral and we&#39;ll send them a link to apply and/or contact the
                        hiring manager. */}
            {customTranslate(
              'ml_TheReferralWillNotShowOnYourMyReferralsPageUntilItIsAccepted',
            )}
          </Text>
          <View style={styles.SubmitBtnContainer}>
            {/* <View style={{alignItems: 'center'}}>
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
                      backgroundColor: COLORS.blue,
                      marginVertical: 3,
                      borderRadius: this.state.radius,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.SubmitBtnText}>
                      {customTranslate('ml_SubmitReferral')}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              )}
            </View> */}

            {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
            </Button> */}
            {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
            {this.state.referralLoading ? (
              <ActivityIndicator size="small" color={COLORS.blue} />
            ) : this.state.success ? (
              <View
                style={{
                  width: '100%',
                  height: 45,
                  backgroundColor: COLORS.dashboardGreen,
                  marginVertical: 3,
                  borderRadius: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontIcon size={30} color="#fff" name="check" />
              </View>
            ) : (
              <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
                <Text style={styles.SubmitBtnText}>
                  {customTranslate('ml_SubmitReferral')}{' '}
                </Text>
              </Button>
            )}
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

export const ReferralComplianceFormComponent = createForm()(
  withApollo(ReferralForm),
);
