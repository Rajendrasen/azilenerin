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
  // AsyncStorage
} from 'react-native';
import {List, Button, TextareaItem} from '@ant-design/react-native';
import _, {get} from 'lodash';
import Icon from '../../icon/index';
import {styles} from '../referral-modal.styles';
import ContactAutoComplete from './contact-autocomplete.component';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {createForm} from 'rc-form';
//import { colors } from 'react-native-elements';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../services/language-manager';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import RenderHtml from 'react-native-render-html';
import {withApollo} from 'react-apollo';
import {createContact} from '../../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
import {queryReferralQuestionsByCompanyId} from '../../../../_store/_shared/api/graphql/custom/referrals/query-referral-questions-by-company-id';
// import Mixpanel from 'react-native-mixpanel';
import {COLORS} from '../../../styles/colors';
import {queryContactsByUserIdIndex} from '../../../../_store/_shared/api/graphql/custom/contacts/contacts-by-userId-graphql';
import gql from 'graphql-tag';
import AsyncStorage from '@react-native-community/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import {showMessage} from 'react-native-flash-message';

let {width} = Dimensions.get('window');
class ReferralForm extends React.PureComponent {
  state = {
    contactId: '',
    sendBy: 'email',
    contactExist: false,
    contactLoading: true,
    radius: new Animated.Value(3),
    width: new Animated.Value(100),
    showProgress: false,
    progress: 0,
    success: false,
    referralQuestions: '',
    referralLoading: false,
  };

  selectSendBy = (val, ref, cb) => {
    this.setState({sendBy: val}, () => {
      if (val === 'text' && cb) this.phone = cb();
    });
  };

  getReferralQuestions = () => {
    this.props.client
      .query({
        query: queryReferralQuestionsByCompanyId,
        variables: {
          companyId: this.props.currentUser.companyId,
        },
        fetchPolicy: 'network-only',
      })
      .then((res) => {
        console.log('referral questions ', res);
        this.setState({
          referralQuestions: _.sortBy(
            res.data.queryReferralQuestionsByCompanyId.items,
            ['sortOrder'],
          ).filter((item) => !item.isCandidate && !item.isInterested),
        });
        let questions = res.data.queryReferralQuestionsByCompanyId.items;
        for (let i = 0; i < questions.length; i++) {
          let question = JSON.parse(questions[i].questions);
          if (
            question.element &&
            question.element.toLowerCase() === 'dropdown'
          ) {
            this.setState({[question.field_name + 'drop']: false});
          }
        }
      })
      .catch((err) => {
        console.log('question error', err);
      });
  };

  renderQuestionComponents = () => {
    let elements = [];
    const {getFieldDecorator} = this.props.form;
    if (this.state.referralQuestions) {
      let questions = this.state.referralQuestions;
      elements = questions.map((item) => {
        let question = JSON.parse(item.questions);
        if (!question.element) return null;
        if (question.element.toLowerCase() === 'label') {
          return (
            <View
              key={question.field_name}
              style={{
                flexDirection: 'row',
                marginVertical: 5,
                marginHorizontal: 10,
              }}>
              <RenderHtml html={question.content.replace('&nbsp;', ' ')} />
              {/* <Text
                style={{
                  fontWeight: question.bold ? 'bold' : 'normal',
                  fontStyle: question.italic ? 'italic' : 'normal',
                }}>
                {question.content.replace('&nbsp;', ' ')}
              </Text> */}
            </View>
          );
        }
        if (question.element.toLowerCase() === 'linebreak') {
          return (
            <View
              key={question.field_name}
              style={{
                borderBottomColor: '#d9d9d9',
                borderBottomWidth: 1,
                marginVertical: 5,
                marginHorizontal: 10,
              }}
            />
          );
        }
        if (question.element.toLowerCase() === 'textinput') {
          return (
            <View style={{marginHorizontal: 10}} key={question.field_name}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold', flex: 1}}>
                  {question.label.replace('&nbsp;', ' ')}
                  {/* {!question.required && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'red',
                        fontWeight: 'normal',
                      }}>
                      {' '}
                      (Required)
                    </Text>
                  )} */}
                </Text>
              </View>
              <View style={styles.FormItemStyles}>
                {/* <FormItem style={styles.FormItemStyles}> */}
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
                    paddingBottom: 10,
                  }}
                  placeholder={''}
                  placeholderTextColor={COLORS.lightGray}
                  onChangeText={(val) =>
                    this.setState({[question.field_name]: val})
                  }
                  value={this.state[question.field_name]}
                />
                {/* </FormItem> */}
              </View>
            </View>
          );
        }
        if (question.element.toLowerCase() === 'textarea') {
          return (
            <View key={question.field_name}>
              <View style={[styles.LabelStyles, {marginHorizontal: 10}]}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontWeight: 'bold', flex: 1}}>
                    {question.label.replace('&nbsp;', ' ')}
                  </Text>
                  {/* {!question.required && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: 'red',
                        fontWeight: 'normal',
                      }}>
                      {' '}
                      (Required)
                    </Text>
                  )} */}
                </View>
                <TextareaItem
                  multiline
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
                  placeholder={''}
                  scrollEnabled
                  placeholderTextColor={COLORS.lightGray}
                  rows={3}
                  // onFocus={() => {
                  //   this._autoComplete && this._autoComplete.onBlur();
                  // }}
                  onChangeText={(val) =>
                    this.setState({[question.field_name]: val})
                  }
                  value={this.state[question.field_name]}
                />
              </View>
            </View>
          );
        }
        if (question.element.toLowerCase() === 'dropdown') {
          if (!this.state[question.field_name]) {
            this.setState({[question.field_name]: question.options[0]});
          }
          return (
            <View style={{marginHorizontal: 10}} key={question.field_name}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontWeight: 'bold'}}>
                  {question.label.replace('&nbsp;', ' ')}
                </Text>
              </View>
              <Menu
                ref={(ref) => {
                  this[`${question.field_name}ref`] = ref;
                }}
                button={
                  <TouchableOpacity
                    onPress={() => this[`${question.field_name}ref`].show()}
                    style={{
                      borderWidth: 1,
                      borderColor: '#d9d9d9',
                      height: 45,
                      padding: 10,
                      marginVertical: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 15}}>
                      {this.state[question.field_name]
                        ? this.state[question.field_name].text
                        : ''}
                    </Text>
                    <FontIcon
                      name="caret-down"
                      color={COLORS.darkGray}
                      size={20}
                    />
                  </TouchableOpacity>
                }>
                {question.options.map((item) => (
                  <MenuItem
                    style={{width: 350}}
                    key={item.value}
                    onPress={() => {
                      this.setState({
                        [question.field_name]: item,
                      });
                      this[`${question.field_name}ref`].hide();
                    }}>
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
              {/* <TouchableOpacity
                onPress={() =>
                  this.setState({[question.field_name + 'drop']: true})
                }
                style={{
                  borderWidth: 1,
                  borderColor: '#d9d9d9',
                  height: 45,
                  padding: 10,
                  marginVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 15}}>
                  {this.state[question.field_name]
                    ? this.state[question.field_name].text
                    : ''}
                </Text>
                <FontIcon name="caret-down" color={COLORS.darkGray} size={20} />
              </TouchableOpacity>
              {this.state[question.field_name + 'drop'] && (
                <View
                  style={{
                    width: '100%',
                    maxHeight: 150,
                    position: 'absolute',
                    borderWidth: 1,
                    borderColor: '#d9d9d9',
                    borderRadius: 5,
                    bottom: 0,
                    backgroundColor: '#fff',
                  }}
                  shadowOffset={{height: 6}}
                  shadowColor="gray"
                  shadowOpacity={0.5}>
                  <ScrollView nestedScrollEnabled>
                    {question.options.map((item) => (
                      <TouchableOpacity
                        key={item.value}
                        onPress={() => {
                          this.setState({
                            [question.field_name + 'drop']: false,
                            [question.field_name]: item,
                          });
                        }}
                        style={{padding: 10}}>
                        <Text>{item.text}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )} */}
            </View>
          );
        }
        return null;
      });
      return elements;
    }
    return null;
  };

  checkPhone = () => {
    //console.log('ccccc', this.phone.getValue())
    if (this.state.sendBy == 'text' && !this.phone.isValidNumber()) {
      alert('Please enter a valid phone number with country.');
      return false;
    }
    if (this.state.sendBy == 'text' && this.state.contactExist) {
      return false;
    }
    return true;
  };

  existingPhone = (val) => {
    this.setState({contactExist: val});
  };

  checkIsAlreadyReferredToJob = () => {
    const {job, form} = this.props;
    const userId = form.getFieldValue('userId');
    const email = form.getFieldValue('emailAddress');
    let phone = '';
    if (this.phone) {
      phone = this.phone.getValue().replace(/\D/g, '');
    }
    const isAlreadyReferredToJob = get(job, 'referrals', []).find(
      (referral) =>
        referral.contactId === userId ||
        (referral.contact && referral.contact.emailAddress === email) ||
        (referral.contact && referral.contact.phoneNumber == phone),
    );
    if (isAlreadyReferredToJob) {
      return false;
    }
    console.log('ooo');
    return true;
  };
  componentDidMount() {
    this.getReferralQuestions();
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

  // onRef(component) {
  //   this._autoComplete = component;
  // }

  shrinkAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: 10,
        duration: 300,
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
        toValue: 100,
        duration: 300,
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

  handleQuestionsData = () => {
    let errors = [];
    let answers = [];
    if (this.state.referralQuestions) {
      let questions = this.state.referralQuestions;
      questions.forEach((item) => {
        let question = JSON.parse(item.questions);
        if (!question.required && !this.state[question.field_name]) {
          Alert.alert(
            'Please fill',
            question.label,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
          return;
        }
        let answer = {
          name: question.field_name,
          question: question.label,
        };
        if (question.element && question.element.toLowerCase() === 'dropdown') {
          answer.text = this.state[question.field_name].text;
          answer.value = this.state[question.field_name].value;
        } else {
          answer.value = this.state[question.field_name];
          answer.text = '';
        }
        answers.push(answer);
      });
      console.log('answers', answers);
    }
  };

  createProspect = (questionsData) => {
    // if (get(currentUser, 'companyId') === 'd0829b5c-c03d-45fc-9a0e-e58a3f0c75d3') {
    let customFields = [];
    questionsData.forEach((item) => {
      if (item.question.trim() === 'LinkedIn Profile:' && item.value !== '') {
        let obj = {
          id: 4154281003,
          name: 'LinkedIn URL',
          value: escape(item.value),
        };
        customFields.push(obj);
      } else if (
        item.question.trim() === 'Disponibilidade para quais escritorios' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4154285003,
          name: 'Preferencia Escritorio',
          value: escape(item.text),
        };
        customFields.push(obj);
      }
      // this
      else if (
        item.question.trim() === 'Grau de Senioridade da Indicacao' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4312450003,
          name: 'Indicacao Grau Senioridade',
          value: escape(item.text),
        };
        customFields.push(obj);
      } else if (
        item.question.trim() === 'Indicacao PCD' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4154282003,
          name: 'PCD',
          value: escape(item.text),
        };
        customFields.push(obj);
      } else if (
        item.question.trim() === 'Relacao com o indicado' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4312451003,
          name: 'Indicacao Relacao',
          value: escape(item.text),
        };
        customFields.push(obj);
      }
      // this
      else if (
        item.question.trim() === 'Disposicao para vir para a ZUP' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4312452003,
          name: 'Indicacao Disponibilidade',
          value: escape(item.text),
        };
        customFields.push(obj);
      } else if (
        item.question.trim() === 'Descritivo do indicante' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4312453003,
          name: 'Indicacao Descritivo',
          value: escape(item.value),
        };
        customFields.push(obj);
      } else if (
        item.question.trim() ===
          'Como voce avaliaria essa pessoa tecnicamente' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4312488003,
          name: 'Indicacao Avaliacao Tecnica',
          value: escape(item.text),
        };
        customFields.push(obj);
      }
      // else if (item.question.trim() === '(Already done by email of referrer)' && (item.value !== '' || item.text !== '')) {
      //   let obj = {
      //     id: 4312489003,
      //     name: "Email Indicante",
      //     value: item.value
      //   }
      //   customFields.push(obj);
      // }
      else if (
        item.question.trim() ===
          'Descreva o que torna essa indicação ideal para ZUP' &&
        (item.value !== '' || item.text !== '')
      ) {
        let obj = {
          id: 4313705003,
          name: 'Advocacy Zupper Indicante',
          value: escape(item.value),
        };
        customFields.push(obj);
      }
    });
    return customFields;
  };

  handleSubmit = () => {
    try {
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

      const {form} = this.props;
      form.validateFields((err, values) => {
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
        if (!this.checkIsAlreadyReferredToJob()) {
          alert('This Email/Phone already referred to this job.');
          return;
        }
        console.log('new', newContact, err);

        if (!err) {
          let answers = [];
          let qstnError = false;
          if (this.state.referralQuestions) {
            let questions = this.state.referralQuestions;
            for (let i = 0; i < questions.length; i++) {
              let question = JSON.parse(questions[i].questions);
              if (
                question.element &&
                !question.required &&
                !this.state[question.field_name] &&
                question.element.toLowerCase() !== 'linebreak' &&
                question.element.toLowerCase() !== 'label'
              ) {
                console.log('question ', question);

                Alert.alert(
                  'Complete Required Fields',
                  question.label,
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  {cancelable: false},
                );
                qstnError = true;
                break;
              }
              if (question.element) {
                let element = question.element.toLowerCase();
                if (
                  element === 'dropdown' ||
                  element === 'textarea' ||
                  element === 'textinput'
                ) {
                  let answer = {
                    name: question.field_name,
                    question: question.label,
                  };
                  if (question.element.toLowerCase() === 'dropdown') {
                    answer.text = this.state[question.field_name].text;
                    answer.value = this.state[question.field_name].value;
                  } else {
                    answer.value = this.state[question.field_name] || '';
                    answer.text = '';
                  }
                  answers.push(answer);
                }
              }
            }
            console.log('answers', answers);
          }
          if (qstnError) return;
          if (newContact) {
            if (this.checkPhone()) {
              //toggleIsSubmitting();
              // this.showAnimation(12000).then(() => {
              //this.shrinkAnimation();
              this.setState({referralLoading: true});
              let contactInput = {
                firstName: values.firstName,
                lastName: values.lastName,
                //emailAddress: email,
                socialMediaAccounts: null,
                userId: currentUser.id,
                companyId: currentUser.companyId,
                jobHistory: null,
                importMethod: this.state.sendBy === 'text' ? 'manual' : 'email',
                //phoneNumber: phone,
              };
              if (this.state.sendBy === 'text')
                contactInput.phoneNumber = this.phone
                  .getValue()
                  .replace(/\D/g, '');
              if (email) contactInput.emailAddress = email;

              this.props.client
                .mutate({
                  mutation: gql`
                    mutation CreateContact($input: CreateContactInput!) {
                      createContact(input: $input) {
                        id
                      }
                    }
                  `,
                  variables: {
                    input: contactInput,
                  },
                })
                .catch((err) => {
                  console.log(err);
                })
                .then((response) => {
                  // debugger
                  // console.log('response create contact : ', response);
                  const contactId = get(response, 'data.createContact.id');
                  // console.log('create referral response : ', response);
                  // Mixpanel.trackWithProperties('Create Referral', {
                  //   jobId: job.id,
                  //   jobTitle: job.title,
                  //   contactId,
                  //   contactName:
                  //     contactInput.firstName + ' ' + contactInput.lastName,
                  //   user: currentUser.firstName + ' ' + currentUser.lastName,
                  //   userId: currentUser.id,
                  // });
                  let input = {
                    companyId: currentUser.companyId,
                    contactId,
                    userId: currentUser.id,
                    jobId: job.id,
                    status: 'referred',
                    note: values.note ? values.note : null,
                    message: values.message ? values.message : null,
                    referralType: this.state.sendBy,
                    questionsData: JSON.stringify(answers),
                    referralDevice: 'mobile',
                    referralSource: 'direct',
                  };
                  if (this.props.isCampaignActive) {
                    input.campaignId = this.props.campaignId;
                  }
                  console.log('referral input', input);
                  return onCreateReferral({
                    input: input,
                  });
                })
                .then((result) => {
                  if (this.props.getJobDetails) this.props.getJobDetails();
                  console.log('create referral response', result);
                  if (
                    result.data.createReferral.job.externalSource ===
                      'Greenhouse' &&
                    email
                  ) {
                    const enableProspectCreation = get(
                      currentUser,
                      'company.enableProspectCreation',
                    );
                    if (true) {
                      let configMode = '';
                      let url =
                        'https://8wcdx6ez2j.execute-api.us-east-2.amazonaws.com/default/GreenhouseCreateProspectDev';
                      configMode = 'prod';
                      let customFields = [];
                      if (
                        get(currentUser, 'companyId') ===
                        '55e9bd5f-2dbc-408d-8a1d-2dd898447a3e'
                      ) {
                        customFields = this.createProspect(answers);
                        let myObj = {
                          firstName: get(values, 'firstName'),
                          lastName: get(values, 'lastName'),
                          emailId: email,
                          externalJobId:
                            result.data.createReferral.job.externalJobId,
                          companyId: get(currentUser, 'companyId'),
                          referralEmailId:
                            result.data.createReferral.user.emailAddress,
                          configMode: configMode,
                          custom_fields: customFields,
                        };
                        console.log('myobj', myObj);
                        fetch(url, {
                          headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'User-Agent': 'ERINWeb',
                          },
                          method: 'POST',
                          mode: 'no-cors',
                          body: JSON.stringify(myObj),
                        }).then((res) => {
                          console.log('prospect res', res);
                        });
                      }
                    }
                  }
                  this.setState({referralLoading: false, success: true}, () => {
                    setTimeout(() => {
                      this.props.setModalVisible(false);
                    }, 1000);
                  });

                  //this.handleReferralSuccess();
                  // debugger
                  // console.log(response);
                  //this.props.setModalVisible(false);
                  //toggleIsSubmitting();
                })
                .catch((errCreateReferral) => {
                  // debugger
                });
              // });
            }
          } else {
            console.log('1111');
            if (this.checkIsAlreadyReferredToJob()) {
              this.setState({referralLoading: true});
              //this.shrinkAnimation();
              //toggleIsSubmitting();
              //this.showAnimation(6000)
              //.then(() => {
              // Mixpanel.trackWithProperties('Create Referral', {
              //   jobId: job.id,
              //   jobTitle: job.title,
              //   contactId: values.userId,
              //   user: currentUser.firstName + ' ' + currentUser.lastName,
              //   userId: currentUser.id,
              // });
              let input = {
                companyId: currentUser.companyId,
                contactId: values.userId,
                userId: currentUser.id,
                jobId: job.id,
                status: 'referred',
                note: values.note ? values.note : null,
                message: values.message ? values.message : null,
                referralType: this.state.sendBy,
                questionsData: JSON.stringify(answers),
                referralDevice: 'mobile',
                referralSource: 'direct',
              };
              if (this.props.isCampaignActive) {
                input.campaignId = this.props.campaignId;
              }
              onCreateReferral({
                input: input,
              })
                //})
                .then((result) => {
                  if (this.props.getJobDetails) this.props.getJobDetails();

                  console.log('create referral response', result, values);
                  let user = values.user;
                  if (
                    result.data.createReferral.job.externalSource ===
                      'Greenhouse' &&
                    user.emailAddress
                  ) {
                    const enableProspectCreation = get(
                      currentUser,
                      'company.enableProspectCreation',
                    );
                    if (true) {
                      let configMode = '';
                      let url =
                        'https://8wcdx6ez2j.execute-api.us-east-2.amazonaws.com/default/GreenhouseCreateProspectDev';
                      configMode = 'prod';
                      let customFields = [];
                      if (
                        get(currentUser, 'companyId') ===
                        '55e9bd5f-2dbc-408d-8a1d-2dd898447a3e'
                      ) {
                        customFields = this.createProspect(answers);
                        let myObj = {
                          firstName: get(user, 'firstName'),
                          lastName: get(user, 'lastName'),
                          emailId: user.emailAddress,
                          externalJobId:
                            result.data.createReferral.job.externalJobId,
                          companyId: get(currentUser, 'companyId'),
                          referralEmailId:
                            result.data.createReferral.user.emailAddress,
                          configMode: configMode,
                          custom_fields: customFields,
                        };
                        console.log('myobj', myObj);
                        fetch(url, {
                          headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'User-Agent': 'ERINWeb',
                          },
                          method: 'POST',
                          mode: 'no-cors',
                          body: JSON.stringify(myObj),
                        }).then((res) => {
                          console.log('prospect res', res);
                        });
                      }
                    }
                  }
                  this.explosion?.start();
                  showMessage({
                    message: 'You earned 25 points',
                    type: 'success',
                    color: 'white',
                    backgroundColor: COLORS.green,
                    position: 'bottom',
                  });
                  this.setState({referralLoading: false, success: true}, () => {
                    setTimeout(() => {
                      this.props.setModalVisible(false);
                    }, 4000);
                  });
                  // this.handleReferralSuccess();
                  //this.props.setModalVisible(false);
                });
            } else {
              Alert.alert(
                'An error occured',
                'This is contact is already referred to this job.',
                [{text: 'OK', onPress: () => null}],
                {cancelable: false},
              );
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
    } catch (err) {
      this.explosion.stop();
      alert(
        'This referral was not saved. Please refresh and try again at another time.',
      );
    }
  };

  getContacts = async (token = null) => {
    try {
      let data = await this.props.client.query({
        query: gql(queryContactsByUserIdIndex),
        variables: {userId: this.props.currentUser.id, after: token},
        fetchPolicy: 'network-only',
      });
      console.log('data', data);
      if (data.data.queryContactsByUserIdIndex) {
        this.props.toggleContactLoading(false);
      }
      return data;
    } catch (error) {
      console.log(error);
      this.props.toggleContactLoading(false);
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
            //ref={(ref) => this.onRef(ref)}
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
                  placeholderTextColor={COLORS.lightGray}
                  rows={3}
                  // onFocus={() => {
                  //   this._autoComplete && this._autoComplete.onBlur();
                  // }}
                />,
              )}
            </View>
          </View>
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
                  scrollEnabled
                  placeholderTextColor={COLORS.lightGray}
                  rows={3}
                  // onFocus={() => {
                  //   this._autoComplete && this._autoComplete.onBlur();
                  // }}
                />,
              )}
            </View>
          </View>
          {this.renderQuestionComponents()}

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
                    width: this.state.width.interpolate({
                      inputRange: [10, 90],
                      outputRange: ['10%', '90%'],
                    }),
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
                  style={{width: '100%', alignItems: 'center'}}
                  onPress={() => {
                    this.handleSubmit();
                  }}>
                  <Animated.View
                    style={{
                      width: this.state.width.interpolate({
                        inputRange: [10, 90],
                        outputRange: ['10%', '90%'],
                      }),
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

            {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
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

export const ReferralFormComponent = createForm()(withApollo(ReferralForm));
