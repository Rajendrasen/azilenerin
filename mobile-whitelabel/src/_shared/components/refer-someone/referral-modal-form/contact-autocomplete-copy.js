import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    PermissionsAndroid,
    ScrollView,
    TextInput,
    Modal,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Contacts from 'react-native-contacts';
import { List, TextareaItem, ActivityIndicator } from '@ant-design/react-native';
import { Actions } from 'react-native-router-flux';
import { styles } from '../referral-modal.styles';
import { COLORS } from '../../../styles/colors';
import { ContactDetails } from '../../viewContact/ViewContactContainer';
import PhoneInput from 'react-native-phone-input';
import { withApollo } from 'react-apollo';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../services/language-manager';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import gql from 'graphql-tag';

class ContactAutoComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            hideResults: true,
            contactExists: '',
            contacts: [],
            viewContact: '',
            fullContactData: '',
            viewContactModal: false,
            selectedContact: '',
            maxLength: 10,
            nextToken: null,
            showSuggestion: false,
            phoneBookModal: false,
            modalContacts: [],
            selectedContact: '',
            modalPhoneNumber: '',
        };
        this.handleAutoCompleteCustomValidator = this.handleAutoCompleteCustomValidator.bind(
            this,
        );
        this.handleNewContactCustomValidator = this.handleNewContactCustomValidator.bind(
            this,
        );
    }

    debounceTimer;

    componentWillMount() {
        const { selectedContact } = this.props;
        if (selectedContact) {
            this.setState({
                text: `${selectedContact.firstName} ${selectedContact.lastName}`,
                hideResults: true,
            });
            this.props.form.setFieldsValue({
                userId: selectedContact.id,
            });
        }
    }

    onBlur() {
        this.setState({ hideResults: true });
    }

    onFocus() {
        this.setState({ hideResults: false });
    }

    handleContacts = async () => {
        let data = await this.props.getContacts(this.state.nextToken);
        this.setState((state) => ({
            contacts: state.contacts.concat(
                data.data.queryContactsByUserIdIndex.items,
            ),
            nextToken: data.data.queryContactsByUserIdIndex.nextToken,
        }));
    };
    async componentDidMount() {
        this.handleContacts();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.state.nextToken && prevState.nextToken != this.state.nextToken) {
            this.handleContacts();
        }
    }

    checkExistingPhone = (val) => {
        console.log('uuuuu', val, this.state.contacts);
        // if(this.state.modalPhoneNumber){
        //   val = this.state.modalPhoneNumber
        // }
        if (!val) {
            val = this.phone.getValue();
        }
        console.log('oooo', val);
        this.setState({
            maxLength: val.match(/\+1/)
                ? 12
                : this.phone.getCountryCode() == 1
                    ? 10
                    : 50,
        });
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            let currentVal = this.phone.getValue().replace(/\D/g, '');
            // if (currentVal.match(this.phone.getCountryCode()).index == 0)
            //   currentVal.replace(this.phone.getCountryCode(), '');
            let contacts =
                this.state.contacts && this.state.contacts.length > 0
                    ? this.state.contacts
                    : this.props.contacts;
            if (!contacts) {
                contacts = [];
            }
            const foundContactPhone = contacts.find((contact) => {
                if (
                    contact.phoneNumber &&
                    contact.phoneNumber.replace(/\D/g, '') === currentVal
                ) {
                    return true;
                }
                return false;
            });
            if (foundContactPhone) {
                this.props.existingPhone(true);
                this.setState({
                    contactExists: {
                        ...foundContactPhone,
                        message: 'A contact with this Phone # already exists',
                    },
                });
                // const error = new Error('A contact with this Phone # already exists');
                // errors.push(error);
            } else {
                this.props.existingPhone(false);
                this.setState({ contactExists: '' });
            }
        }, 600);
    };

    async handleNewContactCustomValidator(rule, value, callback) {
        let contacts =
            this.state.contacts && this.state.contacts.length > 0
                ? this.state.contacts
                : this.props.contacts;
        // if (!contacts) {
        //   newContacts = await this.props.getContacts();
        //   this.setState({ contacts: newContacts });
        //   contacts = newContacts;
        // }
        if (!contacts) {
            contacts = [];
        }
        const { customValidator } = this.props;
        //const { contacts = [] } = this.props;
        const errors = [];

        const customValidatorError = customValidator();
        if (customValidatorError) {
            errors.push(customValidatorError);
            callback(errors);
            return;
        }
        if (!contacts) {
            contacts = [];
        }
        const foundContact = contacts.find(
            (contact) => contact.emailAddress === value,
        );
        //const foundContactPhone = contacts.find(contact => contact.phoneNumber === value);
        const emailPattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,20}[\.][a-z]{2,5}/g;
        const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!emailPattern.test(value)) {
            const error = new Error(customTranslate('ml_InvalidEmailId'));
            errors.push(error);
        }
        if (foundContact) {
            this.setState({
                contactExists: {
                    ...foundContact,
                    message: customTranslate('ml_AContactWithThisEmailAddressAlreadyExists'),
                },
            });
            const error = new Error(
                customTranslate('ml_AContactWithThisEmailAddressAlreadyExists'),
            );
            errors.push(error);
        }
        //else if (foundContactPhone) {
        //   this.setState({
        //     contactExists: {
        //       ...foundContactPhone,
        //       message: 'A contact with this Phone # already exists',
        //     },
        //   });
        //   const error = new Error('A contact with this Phone # already exists');
        //   errors.push(error);
        // }
        else {
            this.setState({ contactExists: '' });
        }

        callback(errors);
    }

    handleAutoCompleteCustomValidator(rule, value, callback) {
        let newValue = value ? value : this.state.contactExists.id;
        const { ContactOptions, customValidator } = this.props;
        const errors = [];

        const customValidatorError = customValidator();
        if (customValidatorError) {
            errors.push(customValidatorError);
        }
        if (!ContactOptions) {
            ContactOptions = [];
        }
        const isMatch = ContactOptions.find((option) => option.id === newValue);
        if (!isMatch) {
            const error = new Error(customTranslate('ml_ValueDoesNotMatchAnAvailableOption'));
            errors.push(error);
        }
        if (isMatch && !isMatch.emailAddress && !isMatch.phoneNumber) {
            const error = new Error(customTranslate('ml_ContactNoEmailPhone'));
            errors.push(error);
        }

        callback(errors);
    }

    closeViewContactModal = () => {
        this.setState({ viewContactModal: false });
    };
    referralType = (contact) => {
        this.setState({ selectedContact: contact });
        if (!this.props.newContact) {
            if (!contact.emailAddress) {
                this.props.selectSendBy('text');
            } else if (!contact.phoneNumber) {
                this.props.selectSendBy('email');
            }
        }
    };
    onChangeText(text, contactFromPhoneBook = false) {
        this.setState({ phoneBookModal: false });
        console.log('text ', text);
        const { handleContactChange } = this.props;
        if (typeof text === 'object') {
            this.referralType(text);
            this.setState({
                text: `${text.firstName} ${text.lastName}`,
                hideResults: true,
                showSuggestion: false,
            });
            this.props.form.setFieldsValue({
                userId: text.id,
                user: text,
            });
        } else {
            this.setState({ text, showSuggestion: true });
        }
        handleContactChange(text, this.state.contacts, contactFromPhoneBook);
    }

    createContact = (values) => {
        console.log('values', values);
        if (!values.phoneNumbers || !values.phoneNumbers.length) {
            alert('Contact does not have any Phone number');
            return;
        }
        let contactExists = this.props.ContactOptions.filter(
            (item) => item.phoneNumber == values.phoneNumbers[0].number,
        );
        if (contactExists && contactExists.length) {
            console.log('skfsljflsjjflsdjflsdjflk');
            this.onChangeText(contactExists[0]);
            return;
        }
        let contactInput = {
            firstName: values.givenName,
            lastName: values.familyName,
            //emailAddress: email,
            socialMediaAccounts: null,
            userId: this.props.currentUser.id,
            companyId: this.props.currentUser.companyId,
            jobHistory: null,
            importMethod: 'manual',
            phoneNumber: values.phoneNumbers[0].number,
        };
        this.props.client
            .mutate({
                mutation: gql`
          mutation CreateContact($input: CreateContactInput!) {
            createContact(input: $input) {
              id
              firstName
              lastName
              phoneNumber
              referrals {
                id
                contactId
              }
            }
          }
        `,
                variables: {
                    input: contactInput,
                },
            })
            .then((res) => {
                console.log('contact created', res);
                this.onChangeText(res.data.createContact, true);
            })
            .catch((err) => {
                console.log('erer', err);
            });
    };

    getPhoneContacts = () => {
        if (Platform.OS === 'ios') {
            try {
                const allContacts = Contacts.getAll((err, contacts) => {
                    if (err) {
                        alert('Unable to get contacts');
                    }
                    console.log(('contacts', contacts));
                    this.setState({
                        modalContacts: contacts,
                        phoneBookModal: true,
                    });
                    // alert to make sure
                });
            } catch (err) {
                alert('Unable to get contacts');
            }
        } else {
            const allContacts = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: customTranslate('ml_Contacts_Contacts'),
                    message: customTranslate('ml_ThisAppWouldLikeToViewYourContacts'),
                },
            ).then(() => {
                Contacts.getAll((err, contacts) => {
                    if (err) {
                        throw err;
                    }
                    this.setState({ modalContacts: contacts, phoneBookModal: true });
                });
            });
        }
    };

    render() {
        const { newContact, handleNewContact, ContactOptions } = this.props;
        const { getFieldDecorator } = this.props.form;
        let {
            company: { confirmCompliance },
        } = this.props.currentUser;
        const FormItem = List.Item;
        if (newContact) {
            return (
                <View>
                    <Text style={styles.FormTitle}>
                        {customTranslate('ml_EnterReferralInformation')}
                    </Text>
                    <View style={{ marginHorizontal: 10 }}>
                        <View style={styles.FormItemStyles}>
                            {/* <FormItem style={styles.FormItemStyles}> */}
                            {getFieldDecorator('firstName', {
                                rules: [
                                    { required: true, message: customTranslate('ml_PleaseInputFirstName') },
                                ],
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
                                        fontSize: 15,
                                    }}
                                    placeholder={customTranslate('ml_FirstName')}
                                    placeholderTextColor={COLORS.lightGray}
                                />,
                            )}
                            {/* </FormItem> */}
                        </View>
                        <View style={styles.FormItemStyles}>
                            {/* <FormItem style={styles.FormItemStyles}> */}
                            {getFieldDecorator('lastName', {
                                rules: [
                                    { required: true, message: customTranslate('ml_PleaseInputLastName') },
                                ],
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
                                        fontSize: 15,
                                    }}
                                    placeholder={customTranslate('ml_LastName')}
                                    placeholderTextColor={COLORS.lightGray}
                                />,
                            )}
                        </View>
                        {/* <View style={styles.FormItemStyles}>
              {getFieldDecorator('emailAddress', {
                rules: [
                  //{ type: 'email', message: 'Enter a valid E-mail' },
                  {
                    required: true,
                    message: '*',
                  },
                  { validator: this.handleNewContactCustomValidator },
                ],
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
                    fontSize: 12,
                    paddingBottom: 12,
                    // justifyContent: "flex-start"
                  }}
                  placeholder="E-mail or Phone (with country code)"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              )}
            </View> */}
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    flex: 1,
                                    alignItems: 'center',
                                    marginVertical: 5,
                                }}>
                                <Text style={{ marginVertical: 5, fontWeight: '600', flex: 0.5 }}>
                                    {customTranslate('ml_SendBy')}:
                </Text>
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        paddingHorizontal: 10,
                                        marginHorizontal: 5,
                                        borderRadius: 5,
                                        backgroundColor:
                                            this.props.sendBy === 'email' ? '#858e96' : 'transparent',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: this.props.sendBy === 'email' ? 0 : 1,
                                        borderColor: '#d9d9d9',
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        this.setState({ contactExists: '' }, () =>
                                            this.props.selectSendBy('email'),
                                        );
                                    }}>
                                    <Text
                                        style={{
                                            color: this.props.sendBy === 'email' ? '#fff' : '#a0a0a0',
                                        }}>
                                        {customTranslate('ml_Email')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        padding: 8,
                                        paddingHorizontal: 10,
                                        marginLeft: 5,
                                        borderRadius: 5,
                                        backgroundColor:
                                            this.props.sendBy === 'text' ? '#858e96' : 'transparent',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: this.props.sendBy === 'text' ? 0 : 1,
                                        borderColor: '#d9d9d9',
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        this.setState({ contactExists: '' }, () => {
                                            this.props.selectSendBy('text', this.phone, () => {
                                                return this.phone;
                                            });
                                        });
                                    }}>
                                    <Text
                                        style={{
                                            color: this.props.sendBy === 'text' ? '#fff' : '#a0a0a0',
                                        }}>
                                        {customTranslate('ml_Text')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {this.props.sendBy === 'email' ? (
                                <View style={styles.FormItemStyles}>
                                    {getFieldDecorator('emailAddress', {
                                        rules: [
                                            //{ type: 'email', message: 'Enter a valid E-mail' },
                                            {
                                                required: true,
                                                message: '*',
                                            },
                                            { validator: this.handleNewContactCustomValidator },
                                        ],
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
                                                fontSize: 15,
                                                // justifyContent: "flex-start"
                                            }}
                                            placeholder={customTranslate('ml_Email')}
                                            placeholderTextColor={COLORS.lightGray}
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                        />,
                                    )}
                                </View>
                            ) : (
                                <View
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#d9d9d9',
                                        borderRadius: 4,
                                        marginVertical: 5,
                                        padding: 1,
                                        fontSize: 12,
                                        // justifyContent: "flex-start"
                                        padding: 11,
                                        //flexDirection: 'row',
                                    }}>
                                    <PhoneInput
                                        ref={(ref) => (this.phone = ref)}
                                        onChangePhoneNumber={this.checkExistingPhone}
                                        textProps={{
                                            placeholder: customTranslate('ml_PhoneNumber'),
                                            maxLength: this.state.maxLength,
                                            placeholderTextColor: COLORS.lightGray,
                                        }}
                                        value={this.state.modalPhoneNumber}
                                    />
                                    {/* <Text style={{ fontSize: 12, lineHeight: 18 }}>+91</Text>
                  <TextInput style={{ flex: 1, fontSize: 12, paddingLeft: 3 }}>825881149</TextInput> */}
                                </View>
                            )}
                        </View>
                        {this.state.contactExists && !confirmCompliance ? (
                            <React.Fragment>
                                <Text
                                    style={[styles.SmallText, { color: 'red', marginBottom: 0 }]}>
                                    {this.state.contactExists.message}
                                </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            //this.onChangeText(this.state.contactExists);
                                            //this.setState({ contactExists: '' });
                                            handleNewContact(() =>
                                                this.onChangeText(this.state.contactExists),
                                            );
                                        }}>
                                        <Text
                                            style={[
                                                { color: COLORS.blue, fontSize: 14, fontWeight: '300' },
                                            ]}>
                                            {customTranslate('ml_Clickhere')}{' '}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'red', fontSize: 14, fontWeight: '300' }}>
                                        to refer them or{' '}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                viewContactModal: true,
                                                fullContactData: this.state.contactExists,
                                                viewContact: this.state.contactExists,
                                            });
                                            // Actions.contacts();
                                            // this.props.setModalVisible(false);
                                        }}>
                                        <Text
                                            style={{
                                                color: COLORS.blue,
                                                fontSize: 14,
                                                fontWeight: '300',
                                            }}>
                                            view{' '}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: 'red', fontSize: 14, fontWeight: '300' }}>
                                        the contact.
                  </Text>
                                </View>
                            </React.Fragment>
                        ) : null}
                        {/* {!confirmCompliance ? (
              <Text
                style={[
                  styles.SmallText,
                  {
                    color: 'grey',
                    marginVertical: 0,
                    fontWeight: '600',
                    marginVertical: 5,
                  },
                ]}>
                {customTranslate('ml_Or')}{' '}
                <Text
                  style={[
                    styles.SmallText,
                    styles.AddContactsHere,
                    styles.LinkStyles,
                    {fontWeight: '600'},
                  ]}
                  onPress={handleNewContact}>
                  {customTranslate('ml_Clickhere')}{' '}
                </Text>
                {customTranslate('ml_ToAddExistingContact')}
              </Text>
            ) : null} */}
                        <Text style={{ alignSelf: 'center', marginVertical: 5 }}>
                            <Text
                                style={{ color: COLORS.blue, fontWeight: 'bold' }}
                                onPress={() => this.getPhoneContacts()}>
                                Click here
              </Text>{' '}
              to refer from Phone Book
            </Text>
                    </View>
                    <ContactDetails
                        visible={this.state.viewContactModal}
                        closeViewContact={this.closeViewContactModal}
                        details={this.state.viewContact}
                        fullData={this.state.fullContactData}
                    />
                    <Modal visible={this.state.phoneBookModal}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.blackTransparent,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: '90%',
                                    height: '80%',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                }}>
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 17,
                                        marginVertical: 20,
                                    }}>
                                    Select a Contact To Refer
                </Text>
                                {this.state.modalContacts && this.state.modalContacts.length ? (
                                    <ScrollView>
                                        {this.state.modalContacts.map((con) => (
                                            <TouchableOpacity
                                                // onPress={() => {
                                                //   if (!con.phoneNumbers || !con.phoneNumbers.length) {
                                                //     alert('Contact does not have any phone number');
                                                //     return;
                                                //   }
                                                //   this.props.selectSendBy('text', this.phone, () => {
                                                //     return this.phone;
                                                //   });
                                                //   this.props.form.setFieldsValue({
                                                //     firstName: con.givenName,
                                                //     lastName: con.familyName,
                                                //   });
                                                //   setTimeout(() => {
                                                //     console.log('iiiiii', this.phone);
                                                //     this.setState(
                                                //       {
                                                //         modalPhoneNumber: con.phoneNumbers[0].number
                                                //           .replaceAll('(', '')
                                                //           .replaceAll(')', '')
                                                //           .replaceAll('-', ''),
                                                //         phoneBookModal: false,
                                                //       },
                                                //       this.checkExistingPhone,
                                                //     );
                                                //   }, 1000);
                                                // }}
                                                onPress={() => alert("Test")}
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    borderBottomColor: COLORS.lightGray,
                                                    borderBottomWidth: 0.5,
                                                    paddingHorizontal: 10,
                                                    alignItems: 'center',
                                                    height: 40,
                                                }}>
                                                <Text>{con.givenName + ' ' + con.familyName}</Text>
                                                {/* <View
                          style={{
                            height: 20,
                            width: 20,
                            borderWidth:
                              this.state.selectedContact.recordID ==
                              con.recordID
                                ? 0
                                : 0.5,
                            borderColor: COLORS.grayMedium,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:
                              this.state.selectedContact.recordID ==
                              con.recordID
                                ? COLORS.dashboardGreen
                                : 'white',
                            borderRadius: 2,
                          }}>
                          <FontIcon name="check" size={15} color={'white'} />
                        </View> */}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <View
                                        style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text>No contacts available</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    onPress={() => this.setState({ phoneBookModal: false })}
                                    style={{
                                        height: 40,
                                        backgroundColor: COLORS.blue,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: 3,
                                        borderRadius: 5,
                                    }}>
                                    <Text
                                        style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>
                                        Cancel
                  </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        } else {
            return (
                <View style={styles.AutoCompleteZIndex}>
                    <FormItem style={styles.FormItemStyles}>
                        {getFieldDecorator('user', { initialValue: '' })(<View></View>)}
                        {getFieldDecorator('userId', {
                            rules: [
                                { required: true, message: 'Please Input Contact Name' },
                                {
                                    validator: this.handleAutoCompleteCustomValidator,
                                },
                            ],
                        })(
                            <View style={[styles.LabelStyles, styles.AutoCompleteZIndex]}>
                                <Text>{customTranslate('ml_ReferAContact')}</Text>
                                {/* <Autocomplete
                  data={ContactOptions}
                  defaultValue={this.state.text}
                  hideResults={this.state.hideResults}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={this.state.text}
                  autoCapitalize="none"
                  autoCorrect={false}
                  listStyle={styles.AutoCompleteListStyles}
                  inputContainerStyle={styles.InputStyles}
                  onFocus={() => this.onFocus()}
                  placeholder={customTranslate('ml_StartTyping')}
                  renderItem={(item) => (
                    <TouchableOpacity
                      onPress={() => this.onChangeText(item.item)}
                      style={styles.AutoCompleteListItemStyles}>
                      <Text>{`${item.item.firstName} ${item.item.lastName}`}</Text>
                    </TouchableOpacity>
                  )}
                /> */}
                                <TextInput
                                    style={[styles.InputStyles, { padding: 5, height: 45 }]}
                                    onChangeText={(text) => this.onChangeText(text)}
                                    value={this.state.text}
                                    placeholder={customTranslate('ml_StartTyping')}
                                />
                                {this.state.showSuggestion && (
                                    <ScrollView
                                        style={{
                                            maxHeight: 100,
                                            borderWidth: 1,
                                            borderColor: '#d9d9d9',
                                        }}
                                        nestedScrollEnabled={true}>
                                        {ContactOptions.map((item) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                onPress={() => this.onChangeText(item)}
                                                style={styles.AutoCompleteListItemStyles}>
                                                <Text>{`${item.firstName} ${item.lastName}`}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>,
                        )}
                        {/* <Text style={{ textAlign: 'center', marginVertical: 5 }}>Send referral to:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  height: 30,
                  paddingHorizontal: 7,
                  justifyContent: 'center',
                  marginRight: 5,
                  borderRadius: 3,
                  backgroundColor: COLORS.red,
                }}
              >
                <Text style={{ fontSize: 14, color: '#fff' }}>samplemail@sampleemail.com</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 0.5,
                  borderColor: COLORS.darkGray,
                  height: 30,
                  paddingHorizontal: 7,
                  justifyContent: 'center',
                  borderRadius: 3,
                }}
              >
                <Text style={{ fontSize: 14, color: COLORS.darkGray }}>8787878787</Text>
              </TouchableOpacity>
            </View> */}
                        {this.state.text && this.state.selectedContact && (
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: 5,
                                        fontWeight: '600',
                                    }}>
                                    {customTranslate('ml_SendBy')}:
                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        marginBottom: 5,
                                    }}>
                                    {this.state.selectedContact.emailAddress && (
                                        <TouchableOpacity
                                            style={{
                                                padding: 8,
                                                paddingHorizontal: 10,
                                                marginHorizontal: 5,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.props.sendBy === 'email'
                                                        ? '#858e96'
                                                        : 'transparent',
                                                width: 70,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: this.props.sendBy === 'email' ? 0 : 1,
                                                borderColor: '#d9d9d9',
                                            }}
                                            onPress={() => this.props.selectSendBy('email')}>
                                            <Text
                                                style={{
                                                    color:
                                                        this.props.sendBy === 'email' ? '#fff' : '#a0a0a0',
                                                }}>
                                                {customTranslate('ml_Email')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    {this.state.selectedContact.phoneNumber && (
                                        <TouchableOpacity
                                            style={{
                                                padding: 8,
                                                paddingHorizontal: 10,
                                                marginHorizontal: 5,
                                                borderRadius: 5,
                                                backgroundColor:
                                                    this.props.sendBy === 'text'
                                                        ? '#858e96'
                                                        : 'transparent',
                                                width: 70,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderWidth: this.props.sendBy === 'text' ? 0 : 1,
                                                borderColor: '#d9d9d9',
                                            }}
                                            onPress={() =>
                                                this.props.selectSendBy('text', this.phone, () => {
                                                    return this.phone;
                                                })
                                            }>
                                            <Text
                                                style={{
                                                    color:
                                                        this.props.sendBy === 'text' ? '#fff' : '#a0a0a0',
                                                }}>
                                                {customTranslate('ml_Text')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {this.props.sendBy === 'email' ? (
                                    <View style={styles.FormItemStyles}>
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
                                                fontSize: 13,
                                                color: '#999',
                                                backgroundColor: 'rgba(245,245,245,1)',
                                                // justifyContent: "flex-start"
                                            }}
                                            placeholder={customTranslate('ml_Email')}
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            disabled={true}
                                            editable={false}
                                            value={this.state.selectedContact.emailAddress}
                                        />
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#d9d9d9',
                                            borderRadius: 4,
                                            marginVertical: 5,
                                            padding: 1,
                                            backgroundColor: 'rgba(245,245,245,1)',
                                            // justifyContent: "flex-start"
                                            padding: 11,
                                            //flexDirection: 'row',
                                        }}>
                                        <PhoneInput
                                            ref={(ref) => (this.phone = ref)}
                                            onChangePhoneNumber={this.checkExistingPhone}
                                            textProps={{ placeholder: 'Phone number' }}
                                            disabled
                                            textStyle={{ color: '#999', fontSize: 13 }}
                                            value={
                                                this.state.selectedContact.phoneNumber.replace(
                                                    /\D/g,
                                                    '',
                                                ).length == 10
                                                    ? '+1' +
                                                    this.state.selectedContact.phoneNumber.replace(
                                                        /\D/g,
                                                        '',
                                                    )
                                                    : '+' +
                                                    this.state.selectedContact.phoneNumber.replace(
                                                        /\D/g,
                                                        '',
                                                    )
                                            }
                                        />
                                        {/* <Text style={{ fontSize: 12, lineHeight: 18 }}>+91</Text>
                  <TextInput style={{ flex: 1, fontSize: 12, paddingLeft: 3 }}>825881149</TextInput> */}
                                    </View>
                                )}
                            </View>
                        )}

                        <Text style={[styles.LinkContainerStyles, { fontWeight: '600' }]}>
                            <Text
                                style={[
                                    styles.SmallText,
                                    styles.AddContactsHere,
                                    styles.LinkStyles,
                                    { fontWeight: '600' },
                                ]}
                                onPress={() => {
                                    this.props.setModalVisible(false);
                                    Actions.contacts();
                                }}>
                                {customTranslate('ml_ImportContacts')}{' '}
                            </Text>
                            <Text style={[styles.SmallText, { fontWeight: '600' }]}>
                                {customTranslate('ml_Or')}{' '}
                            </Text>
                            <Text
                                style={[
                                    styles.SmallText,
                                    styles.AddContactsHere,
                                    styles.LinkStyles,
                                    { fontWeight: '600' },
                                ]}
                                onPress={() =>
                                    this.setState(
                                        { contactExists: '', text: '', selectedContact: '' },
                                        handleNewContact,
                                    )
                                }>
                                {customTranslate('ml_ClickHere')}{' '}
                            </Text>
                            {customTranslate('ml_ToEnterNameAndEmail')}
                        </Text>
                        <Text style={{ alignSelf: 'center', marginVertical: 5 }}>
                            <Text
                                style={{ color: COLORS.blue, fontWeight: 'bold' }}
                                onPress={() => this.getPhoneContacts()}>
                                Click here
              </Text>{' '}
              to refer from Phone Book
            </Text>
                    </FormItem>
                </View>
            );
        }
    }
}

export default withApollo(ContactAutoComplete);
