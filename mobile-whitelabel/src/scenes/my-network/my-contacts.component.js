/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
    Button,
    SearchBar,
    List,
    InputItem,
    WhiteSpace,
} from '@ant-design/react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import { get } from 'lodash';
import QRCode from 'react-native-qrcode-svg';
const Item = List.Item;
import {
    View,
    ScrollView,
    FlatList,
    Text,
    StyleSheet,
    Platform,
    PermissionsAndroid,
    Modal,
    Dimensions,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert,
    Animated,
    ActivityIndicator,
    Easing,
    TextInput,
    Clipboard,
} from 'react-native';
import { SearchBarOverrides, styles } from './my-network.styles';
import _ from 'lodash';

import Icon from '../../_shared/components/icon';
import Contacts from 'react-native-contacts';
import Swipeout from 'react-native-swipeout';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { COLORS } from '../../_shared/styles/colors';
import CheckBox from 'react-native-check-box';
import ListItems from '../ListItems';
import Icons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AzureAuth from 'react-native-azure-auth';
//import ViewContact from '../../_shared/components/viewContact/ViewContact';
import { ContactDetails } from '../../_shared/components/viewContact/ViewContactContainer';


const azureAuth = new AzureAuth({
    clientId: '739c794a-0e60-47a4-a0c0-0b1a81ac9aef', //erin
    //clientId: '98709336-1747-4d80-ab9d-4b0fbae9f581', //aus code
    //clientId: 'b77cd394-2b71-4de1-80ff-098f86d9d2d3'
});
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';
import { downloadFromS3 } from '../../common';
import {
    getAppName,
    getDomain,
    getErinSquare,
    getLightGrayLogo,
} from '../../WhiteLabelConfig';
import AsyncStorage from '@react-native-community/async-storage';
import InviteModal from '../side-navigation/inviteModal';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
let { width } = Dimensions.get('window');

class MyContactsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            contacts: props.network.contacts,
            addContact: false,
            inputEmail: '',
            inputFirstName: '',
            inputLastName: '',
            importedContacts: [],
            ModalConatcts: [],
            modalShow: false,
            selected: true,
            selectedPhoneContact: [],
            isChecked: false,
            addGmail: false,
            addContactByEmail: false,
            index: 0,
            viewContactModal: false,
            viewContact: '',
            fullContactData: '',
            spinAnim: new Animated.Value(0),
            loading: false,
            outlookLoading: false,
            reloading: false,
            extendedNetworkUrl:
                'https://' +
                getDomain() +
                '/new-user-sign-up/' +
                this.props.network.currentUser.id,
            showContactAccess: false,
        };
    }
    contactImportAPI = (selectedContacts, currentContacts) => {
        const nonDuplicateContacts = selectedContacts.filter(
            (o) => !currentContacts.find((o2) => o.emailAddress === o2.emailAddress),
        );
        if (nonDuplicateContacts.length > 0) {
            const formattedContacts = JSON.stringify(nonDuplicateContacts);
            const promises = [];
            fetch(
                'https://hjp19u2a18.execute-api.us-east-2.amazonaws.com/default/prod-bulkContactImport',
                {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formattedContacts,
                },
            );
            Promise.all(promises)
                .then((responses) =>
                    responses.map((resp) => (resp.body ? resp.json() : {})),
                )
                .catch((error) => console.error(error));
            setTimeout(() => {
                // Toast.show(
                //   'Contacts being processed, we will notify you when finished',
                //   Toast.SHORT,
                //   Toast.TOP,
                //   {
                //     backgroundColor: COLORS.dashboardGreen,
                //     height: 60,
                //     width: 300,
                //     borderRadius: 10,
                //   }
                // );
                showMessage({
                    message: 'Contacts being processed, we will notify you when finished',
                    type: 'success',
                });
                this.props.network.refetchContacts();
            }, 1000);
            // alert('Contacts being processed, we will notify you when finished');
        } else {
            setTimeout(() => {
                // Toast.show('All Contacts previously imported', Toast.SHORT, Toast.TOP, {
                //   backgroundColor: COLORS.dashboardLightOrange,
                //   height: 50,
                //   width: 250,
                //   borderRadius: 10,
                // });
                showMessage({
                    message: 'All Contacts previously imported',
                    type: 'info',
                });
            }, 1000);
            // alert('All Contacts previously imported');
        }
    };

    async componentDidMount() {
        console.log('mount');
        GoogleSignin.configure({
            scopes: [
                'https://www.googleapis.com/auth/contacts.readonly',
                'https://www.googleapis.com/auth/contacts.other.readonly',
            ], // what API you want to access on behalf of the user, default is email and profile
        });
        this.getSummaryTotals(this.props.network.contacts);
        this.spin();

        await AsyncStorage.getItem('contactAccess').then((res) => {
            this.setState({
                showContactAccess: res == null || res == false ? false : true,
            });
        });
    }

    updateUserIncentiveEligibility = (eligible) => {
        this.props.network
            .onUpdate({
                input: {
                    id: this.props.network.user.id,
                    incentiveEligible: eligible,
                },
            })
            .then((data) => {
                console.log('.........success', data);
            })
            .catch((error) => {
                console.log('.........error', error);
            });
    };
    filterContacts(searchTerm) {
        if (searchTerm) {
            return this.props.network.contacts.filter((ref) => {
                const contactName = ref ? `${ref.firstName} ${ref.lastName}` : null;
                if (contactName) {
                    return (
                        contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                    );
                }
            });
        }
        return this.props.network.contacts;
    }

    addContact = () => {
        this.setState({ addContact: true });
    };
    onClose = () => {
        this.setState({ addContact: false });
    };

    submitContact = (currentContacts, selectedContact, onCreateContact) => {
        const isDuplicate = _.some(currentContacts, {
            emailAddress: selectedContact.input.emailAddress,
        });
        if (isDuplicate === true) {
            // Toast.show(
            //   selectedContact.input.emailAddress + customTranslate('ml_AlreadyImported'),
            // );
            showMessage({
                message:
                    selectedContact.input.emailAddress +
                    customTranslate('ml_AlreadyImported'),
                type: 'info',
            });
            this.setState({ addContactByEmail: false });
        } else {
            onCreateContact(selectedContact);
            // Toast.show(customTranslate('ml_ContactAdded'), Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.dashboardGreen,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
                message: customTranslate('ml_ContactAdded'),
                type: 'success',
            });
            this.updateUserIncentiveEligibility(true);
            this.setState({ addContactByEmail: false });
            this.props.network.refetchContacts();
        }
    };
    getPhoneContacts = () => {
        if (Platform.OS === 'ios') {
            const allContacts = Contacts.getAll((err, contacts) => {
                if (err) {
                    throw err;
                }
                this.setState({
                    ModalConatcts: contacts,
                });
                // alert to make sure
                this.setState({ importedContacts: contacts, addContact: false });
                Alert.alert(
                    'Are you sure?',
                    i18n
                        .t('ml_YouAreAboutToImportAllContacts')
                        .replace('11', contacts.length),
                    [
                        {
                            text: customTranslate('ml_Confirm'),
                            onPress: () => this.importPhoneContacts(contacts),
                        },
                        {
                            text: customTranslate('ml_Cancel'),
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            });
        } else {
            this.state.showContactAccess == false
                ? Alert.alert(
                    '',
                    `  ${getAppName()} collects contacts data directly from your phone to
              the referral form, so that you can easily email or text them a
              referral to a job only when the app is in use .`,
                    [
                        {
                            text: 'DENY',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'ALLOW', onPress: () => this.accessToContacts() },
                    ],
                )
                : this.accessToContacts();
        }
    };

    accessToContacts = async () => {
        await AsyncStorage.setItem('contactAccess', 'true');
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
                this.setState({ importedContacts: contacts, addContact: false });
                Alert.alert(
                    'Are you sure?',
                    i18n
                        .t('ml_YouAreAboutToImportAllContacts')
                        .replace('11', contacts.length),
                    [
                        {
                            text: customTranslate('ml_Confirm'),
                            onPress: () => this.importPhoneContacts(contacts),
                        },
                        {
                            text: customTranslate('ml_Cancel'),
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ],
                    { cancelable: false },
                );
            });
        });
    };

    importPhoneContacts = (contacts) => {
        let contactToImport = [];
        const currentUser = this.props.network.currentUser;
        const currentContacts = this.props.network.contacts;
        contacts.forEach((contact) => {
            if (
                contact.emailAddresses.length > 0 ||
                contact.phoneNumbers.length > 0
            ) {
                const input = {
                    input: {
                        firstName: contact.givenName || null,
                        lastName: contact.familyName || null,
                        emailAddress:
                            _.get(contact, 'emailAddresses[0].email') || undefined,
                        phoneNumber: _.get(contact, 'phoneNumbers[0].number') || null,
                        userId: currentUser.id,
                        importMethod: 'manual',
                        companyId: currentUser.companyId,
                        socialMediaAccounts: null,
                        jobHistory: null,
                    },
                };
                if (
                    this.validateEmail(input.input.emailAddress) !== true ||
                    input.input.emailAddress.length > 40
                ) {
                    input.input.emailAddress = undefined;
                }
                if (this.validatePhone(input.input.phoneNumber) !== true) {
                    input.input.phoneNumber = null;
                }
                contactToImport.push(input.input);
            }
        });
        console.log('phone contact to import', contactToImport);
        this.contactImportAPI(contactToImport, currentContacts);
        this.setState({
            modalShow: !this.state.modalShow,
        });
    };

    addContactsByGmail = (contacts) => {
        let contactToImport = [];
        const currentUser = this.props.network.currentUser;
        const currentContacts = this.props.network.contacts;
        contacts.forEach((contact) => {
            if (
                (contact.emailAddresses && contact.emailAddresses.length > 0) ||
                (contact.phoneNumbers && contact.phoneNumbers.length > 0)
            ) {
                const input = {
                    input: {
                        firstName: _.get(contact, 'names[0].givenName') || undefined,
                        lastName: _.get(contact, 'names[0].familyName') || undefined,
                        emailAddress:
                            _.get(contact, 'emailAddresses[0].value') || undefined,
                        phoneNumber:
                            _.get(contact, 'phoneNumbers[0].canonicalForm') || null,
                        userId: currentUser.id,
                        importMethod: 'google',
                        companyId: currentUser.companyId,
                        socialMediaAccounts: null,
                        jobHistory: null,
                    },
                };
                if (
                    this.validateEmail(input.input.emailAddress) !== true ||
                    input.input.emailAddress.length > 40
                ) {
                    input.input.emailAddress = undefined;
                }
                if (input.input.phoneNumber) {
                    input.input.phoneNumber = input.input.phoneNumber.replace(
                        /[&\/\\#,+()$~%.'":*?<>{}]/g,
                        '',
                    );
                }

                contactToImport.push(input.input);
            }
        });

        this.contactImportAPI(contactToImport, currentContacts);
        this.setState({
            modalShow: !this.state.modalShow,
        });
    };
    referralStatus = (fullContactStatus) => {
        try {
            switch (true) {
                case fullContactStatus === null:
                    return 'pending';

                case typeof fullContactStatus.details !== 'undefined':
                    return 'ready';

                case fullContactStatus.message === 'Profile not found':
                    return 'unavailable';

                default:
                    return 'unavailable';
            }
        } catch (error) {
            console.error(error);
        }
    };
    getSummaryTotals = (contacts = []) => {
        const totals = {
            invited: 0,
            active: 0,
            ready: 0,
        };
        contacts.forEach((contact) => {
            const fullContactData = JSON.parse(get(contact, 'fullContactData', '{}'));
            const referralStatus = this.referralStatus(fullContactData);
            if (get(contact, 'extendedUserId')) {
                totals.active++;
            }
            if (get(contact, 'inviteStatus') || referralStatus !== 'unavailable') {
                totals.invited++;
            }
            if (
                get(contact, 'extendedUser.inviteStatus') === 'complete' ||
                referralStatus === 'ready'
            ) {
                totals.ready++;
            }
        });
        this.setState({ totals });

        return totals;
    };

    addContactsByOutlook = (contacts) => {
        let contactToImport = [];
        const currentUser = this.props.network.currentUser;
        const currentContacts = this.props.network.contacts;
        contacts.forEach((contact) => {
            if (
                (contact.emailAddresses && contact.emailAddresses.length > 0) ||
                contact.mobilePhone
            ) {
                const input = {
                    input: {
                        firstName: _.get(contact, 'givenName') || undefined,
                        lastName: _.get(contact, 'surname') || undefined,
                        emailAddress:
                            _.get(contact, 'emailAddresses[0].address') || undefined,
                        phoneNumber: _.get(contact, 'mobilePhone') || null,
                        userId: currentUser.id,
                        importMethod: 'microsoft',
                        companyId: currentUser.companyId,
                        socialMediaAccounts: null,
                        jobHistory: null,
                    },
                };
                if (
                    this.validateEmail(input.input.emailAddress) !== true ||
                    input.input.emailAddress.length > 40
                ) {
                    input.input.emailAddress = undefined;
                }

                input.input.phoneNumber = input.input.phoneNumber.replace(
                    /[&\/\\#,+()$~%.'":*?<>{}]/g,
                    '',
                );

                contactToImport.push(input.input);
            }
        });
        console.log('contact to ', contactToImport);

        this.contactImportAPI(contactToImport, currentContacts);
        this.setState({
            modalShow: !this.state.modalShow,
        });
    };

    addContactEmail = () => {
        var emailId = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // const currentContacts = this.state.contacts;
        const currentUser = this.props.network.currentUser;
        const email = emailId.test(this.state.inputEmail);
        if (email) {
            const onCreateContact = this.props.network.ImportedCreateContact;
            const input = {
                input: {
                    firstName: this.state.inputFirstName || null,
                    lastName: this.state.inputLastName || null,
                    emailAddress: this.state.inputEmail,
                    userId: currentUser.id,
                    importMethod: 'email',
                    companyId: currentUser.companyId,
                    socialMediaAccounts: null,
                    jobHistory: null,
                },
            };
            this.submitContact(currentUser.contacts, input, onCreateContact);
        } else {
            // Toast.show(customTranslate('ml_InvalidEmailId'), Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.red,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
                message: customTranslate('ml_InvalidEmailId'),
                type: 'danger',
            });
        }
    };

    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    validatePhone = (phone) => {
        console.log(phone);
        var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        return re.test(String(phone).toLowerCase());
    };

    confirmDelete = (contactId, contact) => {
        if (!contact.referrals || contact.referrals.length === 0) {
            try {
                const { onDeleteContact } = this.props.network;
                const input = {
                    input: {
                        id: contactId,
                    },
                };
                onDeleteContact(input);
                // Toast.show('Contact Deleted', Toast.LONG, Toast.TOP, {
                //   backgroundColor: COLORS.dashboardGreen,
                //   height: 50,
                //   width: 250,
                //   borderRadius: 10,
                // });
                showMessage({
                    message: 'Contact Deleted',
                    type: 'success',
                });
            } catch (error) {
                console.error(error);
            }
        } else
            alert(
                `${customTranslate('ml_ContactHasActiveReferrals')}, ${customTranslate(
                    'ml_PleaseCloseAllReferralsToEnableDelete',
                )}`,
            );
    };

    openModal = () => {
        this.setState({
            addContact: !this.state.addContact,
        });
        if (Platform.OS === 'ios') {
            const allContacts = Contacts.getAll((err, contacts) => {
                if (err) {
                    throw err;
                }
                // console.log(contacts)
                this.setState({
                    index: 1,
                    ModalConatcts: contacts,
                    modalShow: !this.state.modalShow,
                });
            });
        } else {
            this.state.showContactAccess == false
                ? Alert.alert(
                    '',
                    `  ${getAppName()} collects contacts data directly from your phone to
              the referral form, so that you can easily email or text them a
              referral to a job only when the app is in use .`,
                    [
                        {
                            text: 'DENY',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        { text: 'ALLOW', onPress: () => this.accessToContacts() },
                    ],
                )
                : this.accessToModalContacts();
        }
    };

    accessToModalContacts = () => {
        const allContacts = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: customTranslate('ml_Contacts'),
                message: customTranslate('ml_ThisAppWouldLikeToViewYourContacts'),
            },
        ).then(() => {
            Contacts.getAll((err, contacts) => {
                if (err) {
                    throw err;
                }
                this.setState({
                    index: 1,
                    ModalConatcts: contacts,
                    modalShow: !this.state.modalShow,
                });
            });
        });
    };

    addGmail = async () => {
        this.setState({ loading: true, addContact: false });
        this.spin();
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let resToken = await GoogleSignin.getTokens();

            console.log('tokens: ', resToken);
            fetch(
                'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=2000',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${resToken.accessToken}`,
                    },
                    body: null,
                },
            )
                .then((res) => res.json())
                .then((result) => {
                    fetch(
                        'https://people.googleapis.com/v1/otherContacts?readMask=names,emailAddresses,phoneNumbers&pageSize=1000',
                        {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${resToken.accessToken}`,
                            },
                            body: null,
                        },
                    )
                        .then((otherRes) => otherRes.json())
                        .then((otherContacts) => {
                            console.log('other', otherContacts);

                            console.log(result);
                            let contacts = [];
                            if (otherContacts.otherContacts) {
                                contacts = otherContacts.otherContacts || [];
                            }
                            if (result.connections) {
                                contacts = [...contacts, ...result.connections];
                            }
                            if (contacts) {
                                contacts = contacts.filter((contact) => {
                                    if (contact.emailAddresses || contact.phoneNumbers) {
                                        return true;
                                    }
                                    return false;
                                });
                            }
                            this.setState({ index: 2, ModalConatcts: contacts }, () => {
                                this.setState({
                                    addContact: false,
                                    loading: false,
                                    // addGmail: !this.state.addGmail
                                    modalShow: !this.state.modalShow,
                                });
                            });
                        });
                })
                .catch((err) => {
                    this.setState({ loading: false });
                    console.log(err);
                });
            console.log(userInfo);
            this.setState({ userInfo });
        } catch (error) {
            this.setState({ loading: false });
            console.log(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };
    hanleOutlook = async () => {
        try {
            this.setState((state) => ({
                [Platform.OS == 'ios' ? 'outlookLoading' : 'loading']: true,
                addContact: Platform.OS == 'ios' ? state.addContact : false,
            }));
            this.spin();
            let tokens = await azureAuth.webAuth.authorize({
                scope: 'openid profile User.Read Contacts.Read',
            });
            this.setState({ accessToken: tokens.accessToken });
            let info = await azureAuth.auth.msGraphRequest({
                token: tokens.accessToken,
                path: '/me/contacts',
            });
            console.log('details', info, tokens);
            this.setState({ index: 3, ModalConatcts: info.value }, () => {
                this.setState({
                    addContact: false,
                    // addGmail: !this.state.addGmail
                    modalShow: !this.state.modalShow,
                    loading: false,
                    outlookLoading: false,
                });
            });

            //this.setState({ user: info.displayName, userId: tokens.userId });
        } catch (error) {
            console.log(error);
            this.setState({ outlookLoading: false, loading: false });
        }
    };
    closeViewContactModal = () => {
        this.setState({ viewContactModal: false });
    };
    spin = () => {
        Animated.loop(
            Animated.timing(this.state.spinAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.back(),
                useNativeDriver: true,
            }),
        ).start(() => this.spin());
    };
    renderIpadAddContactButton = (theme) => {
        switch (getAppName()) {
            case 'erin':
                return (
                    <TouchableOpacity
                        onPress={this.addContact}
                        style={[
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor:width <= 450
                                        ? theme.enabled
                                            ? theme.addButtonColor
                                            : COLORS.red
                                        : 'transparent',
                            },
                        ]}
                        >
                        <AntIcon
                            style={{ marginRight: 5, marginTop: 3 }}
                            size={35}
                            color={COLORS.red}
                            name="pluscircle"
                        />
                        <Text
                            style={{
                                color: COLORS.darkGray,
                                fontSize: 18,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}>
                            {customTranslate('ml_Contacts_AddContacts')}{' '}
                        </Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };
    renderAddContactButton = (theme) => {
        switch (getAppName()) {
            case 'erin':
                return (
                    <TouchableOpacity
                        onPress={this.addContact}
                        style={[
                            styles1.addContact,
                            theme.enabled && { backgroundColor: theme.addButtonColor },
                        ]}>
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            {customTranslate('ml_Contacts_AddContacts')}{' '}
                        </Text>
                        <Icons
                            name="ios-add-circle-outline"
                            color="#fff"
                            size={23}
                            style={{ marginLeft: 2 }}
                        />
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };
    render() {
        const searchTerm = this.state.searchTerm;
        const showModal = this.state.addContact;
        const { enableExtendedNetwork } = this.props.network.currentUser.company;
        const swipeBtns = (id, item) => [
            {
                text: customTranslate('ml_Delete'),
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {
                    this.confirmDelete(id, item);
                },
            },
            {
                text: 'View',
                backgroundColor: 'green',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {
                    this.setState({
                        viewContactModal: true,
                        viewContact: item,
                        fullContactData: JSON.parse(item.fullContactData),
                    });
                },
            },
        ];
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            network: {
                currentUser: {
                    company: { theme, symbol, confirmCompliance },
                },
            },
        } = this.props;
        theme = theme ? JSON.parse(theme) : {};
        return (
            <View style={{ flex: 1 }}>
                {/* <Button style={[styles.SubmitBtn, { backgroundColor: '#ef3c3f', alignItems: 'center' }]} onPress={this.addContact}>
          <Text style={{ color: 'white' }}>Add Contacts </Text>
          <Icons name="ios-add-circle-outline" color="#fff" size={25} style={{ marginLeft: 2 }} />
        </Button> */}

                {width > 450 ? (
                    <React.Fragment>
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingVertical: 10,
                                paddingHorizontal: 15,
                                backgroundColor: '#EFEFF2',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            {!confirmCompliance && this.renderIpadAddContactButton(theme)}
                            <View
                                style={{
                                    width: 300,

                                    alignSelf: width > 450 ? 'flex-end' : 'auto',
                                }}>
                                <SearchBar
                                    placeholder={customTranslate('ml_Search')}
                                    value={this.state.searchTerm}
                                    onChange={(searchTerm) => this.setState({ searchTerm })}
                                    styles={SearchBarOverrides}
                                />
                            </View>
                        </View>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        {!confirmCompliance && this.renderAddContactButton(theme)}
                        <View style={{ width: '100%', height: 40, marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: '85%' }}>
                                <SearchBar
                                    placeholder={customTranslate('ml_Search')}
                                    value={this.state.searchTerm}
                                    onChange={(searchTerm) => this.setState({ searchTerm })}
                                    styles={SearchBarOverrides}
                                />
                            </View>
                            {enableExtendedNetwork && (
                                <InviteModal currentUser={this.props.currentUser} width={width} color={theme?.addButtonColor} />
                            )}
                            {/* <View style={{ width: '15%', borderRadius: 4, height: '100%', backgroundColor: theme.addButtonColor, justifyContent: 'center', alignItems: 'center' }}>
                                <Icons
                                    name="ios-add-circle-outline"
                                    color="#000"
                                    size={25}
                                    style={{ marginLeft: 2 }}
                                />
                            </View> */}
                        </View>

                    </React.Fragment>
                )}
                {this.props.network.contacts &&
                    this.props.network.contacts.length > 0 ? (
                    <View style={{ flexDirection: 'row', backgroundColor: '#EFEFF2' }}>
                        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: this.state.reloading ? 'transparent' : COLORS.red,
                  paddingHorizontal: 8,
                  paddingVertical: 7,
                  borderRadius: 5,
                }}
                onPress={() => {
                  this.setState({ reloading: true });
                  this.props.network
                    .refetchContacts()
                    .then(res => this.setState({ reloading: false }))
                    .catch(err => this.setState({ reloading: false }));
                }}
              >
                {this.state.reloading ? (
                  <ActivityIndicator size="small" color={COLORS.red} />
                ) : (
                  <Text style={{ color: '#fff', fontSize: 13 }}>Refresh</Text>
                )}
              </TouchableOpacity>
            </View> */}
                    </View>
                ) : null}

                <View
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={true}
                    style={{ flex: 1 }}>
                    {/* May be last modal with flatlist list items */}
                    {this.state.modalShow && (
                        <Modal
                            title={customTranslate('ml_AddContacts')}
                            transparent
                            onClose={this.onClose}
                            maskClosable
                            visible={this.state.modalShow}
                            closable>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    borderWidth: 1,
                                    // borderRadius: 20,
                                    borderColor: '#ddd',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 0.5,
                                    elevation: 1,
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        marginRight: 15,
                                        marginTop: 30,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                modalShow: !this.state.modalShow,
                                            });
                                        }}
                                    // onPress={() => alert('good')}
                                    >
                                        <Icons name="ios-close" size={50} color="#888888"></Icons>
                                        {/* <Image
                    style={{ width: 20, height: 20, borderRadius: 10, color: ' #888888' }}
                    source={require('../../_shared/assets/close.png')}
                  /> */}
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 5 }}>
                                    <Text
                                        style={{
                                            color: '#444444',
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            textAlign: 'center',
                                        }}>
                                        Import{' '}
                                        {this.state.index == 1
                                            ? 'Phone'
                                            : this.state.index == 2
                                                ? 'Gmail'
                                                : 'Outlook'}{' '}
                    Contacts
                  </Text>
                                </View>
                                {this.state.ModalConatcts && this.state.ModalConatcts.length ? (
                                    <React.Fragment>
                                        <Button
                                            onPress={() => {
                                                if (this.state.index == 1) {
                                                    this.getPhoneContacts();
                                                } else if (this.state.index == 2) {
                                                    this.addContactsByGmail(this.state.ModalConatcts);
                                                } else if (this.state.index == 3) {
                                                    this.addContactsByOutlook(this.state.ModalConatcts);
                                                }
                                            }}
                                            style={{
                                                backgroundColor: COLORS.red,
                                                paddingVertical: 10,
                                                marginHorizontal: '3%',
                                                width: '94%',
                                            }}>
                                            <Text
                                                style={{
                                                    color: COLORS.white,
                                                    fontSize: 20,
                                                    fontWeight: '300',
                                                    flex: 1,
                                                }}>
                                                Import all{' '}
                                                {this.state.ModalConatcts
                                                    ? this.state.ModalConatcts.length
                                                    : 0}{' '}
                        Contacts
                      </Text>
                                        </Button>
                                        <WhiteSpace />
                                        <Text style={{ textAlign: 'center' }}>
                                            {customTranslate('ml_Or')}
                                        </Text>
                                        <WhiteSpace />

                                        {this.state.index == 1 && (
                                            <ListItems
                                                index={this.state.index}
                                                addContacts={this.importPhoneContacts}
                                                allContacts={this.state.ModalConatcts || []}
                                            />
                                        )}
                                        {this.state.index == 2 && (
                                            <ListItems
                                                index={this.state.index}
                                                addContacts={this.addContactsByGmail}
                                                allContacts={this.state.ModalConatcts || []}
                                            />
                                        )}
                                        {this.state.index == 3 && (
                                            <ListItems
                                                index={this.state.index}
                                                addContacts={this.addContactsByOutlook}
                                                allContacts={this.state.ModalConatcts || []}
                                            />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: 16, color: COLORS.lightGray }}>
                                            No valid contacts found.
                    </Text>
                                    </View>
                                )}
                            </View>
                        </Modal>
                    )}
                    {/* contact list modal end */}
                    {this.props.network.contacts &&
                        this.props.network.contacts.length > 0 ? (
                        <View style={{ paddingBottom: 0, flex: 1 }}>
                            {this.props.network.currentUser.company.enableExtendedNetwork && (
                                <View style={{ flexDirection: 'row', height: 100, padding: 2 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: COLORS.dashboardLightOrange,
                                            margin: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10,
                                        }}>
                                        <Text
                                            style={{ fontSize: 25, color: 'white', fontWeight: '800' }}>
                                            {this.state.totals ? this.state.totals.invited : 0}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: COLORS.dashboardDarkOrange,
                                            }}>
                                            Invited
                    </Text>
                                    </View>

                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: COLORS.dashboardBlue,
                                            margin: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10,
                                        }}>
                                        <Text
                                            style={{ fontSize: 25, color: 'white', fontWeight: '800' }}>
                                            {this.state.totals ? this.state.totals.active : 0}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#1949a3',
                                            }}>
                                            Active
                    </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: COLORS.dashboardGreen,
                                            margin: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10,
                                        }}>
                                        <Text
                                            style={{ fontSize: 25, color: 'white', fontWeight: '800' }}>
                                            {this.state.totals ? this.state.totals.ready : 0}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '600',
                                                color: '#06611e',
                                                textAlign: 'center',
                                            }}>
                                            Smart Referral Ready
                    </Text>
                                    </View>
                                </View>
                            )}
                            <FlatList
                                onRefresh={() => {
                                    this.setState({ reloading: true });
                                    this.props.network
                                        .refetchContacts()
                                        .then((res) => this.setState({ reloading: false }))
                                        .catch((err) => this.setState({ reloading: false }));
                                }}
                                refreshing={this.state.reloading}
                                data={_.sortBy(this.filterContacts(searchTerm), [
                                    'firstName',
                                    'lastName',
                                ])}
                                renderItem={({ item }) =>
                                    (item.firstName ||
                                        item.lastName ||
                                        item.emailAddress ||
                                        item.phoneNumber) && (
                                        // <Swipeout
                                        //   right={swipeBtns(item.id)}
                                        //   autoClose={true}
                                        //   backgroundColor="transparent"
                                        // >
                                        //   <Item
                                        //     extra={item.emailAddress && <Icon name="email-filled" color="#dddddd" />}
                                        //   >{`${_.get(item, 'firstName') || _.get(item, 'name', '')} ${_.get(
                                        //     item,
                                        //     'lastName'
                                        //   ) || _.get(item, 'name', '')}`}</Item>
                                        // </Swipeout>
                                        <React.Fragment>
                                            <Swipeout
                                                right={swipeBtns(item.id, item)}
                                                autoClose={true}
                                                backgroundColor="transparent">
                                                <TouchableOpacity
                                                    style={{
                                                        height: 40,
                                                        backgroundColor: '#fff',
                                                        borderBottomColor: '#ddd',
                                                        borderBottomWidth: 0.5,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        paddingHorizontal: 15,
                                                    }}
                                                    onPress={() => {
                                                        this.setState({
                                                            viewContactModal: true,
                                                            viewContact: item,
                                                            fullContactData: JSON.parse(item.fullContactData),
                                                        });
                                                    }}
                                                >
                                                    <View style={{ flex: 5 }}>
                                                        <Text style={{ fontSize: 17, fontWeight: '400' }}>{`${_.get(item, 'firstName') ||
                                                            _.get(item, 'name', '') ||
                                                            _.get(item, 'emailAddress', '') ||
                                                            _.get(item, 'phoneNumber', '')
                                                            } ${_.get(item, 'lastName') || _.get(item, 'name', '')
                                                            }`}</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            justifyContent: 'flex-end',
                                                        }}>
                                                        {item.phoneNumber && (
                                                            <Icons
                                                                name="ios-call"
                                                                color="#dddddd"
                                                                size={24}
                                                                style={{ marginRight: 10 }}
                                                            />
                                                        )}
                                                        {item.emailAddress && (
                                                            <Icon name="email-filled" color="#dddddd" />
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            </Swipeout>
                                        </React.Fragment>
                                    )
                                }
                                style={styles.ListStyle}
                            />
                        </View>
                    ) : (
                        <View>
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    alignItems: 'center',
                                    padding: 20,
                                    paddingTop: Dimensions.get('window').height / 8,
                                }}>
                                <Image
                                    source={getLightGrayLogo()}
                                    style={{
                                        height: Dimensions.get('window').width / 2,
                                        width: Dimensions.get('window').width / 2,
                                        marginBottom: 30,
                                    }}
                                />
                                {this.props.children}
                                <Text
                                    style={{
                                        color: '#999999',
                                        textAlign: 'center',
                                        marginHorizontal: 20,
                                        marginTop: 10,
                                    }}>
                                    {customTranslate('ml_YouHaveNotAddedAnyContacts')}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.red,
                                        borderRadius: 5,
                                        paddingVertical: 10,
                                        marginTop: 10,
                                        width: 100,
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}
                                    onPress={() => {
                                        this.spin();
                                        this.setState({ reloading: true });
                                        this.props.network
                                            .refetchContacts()
                                            .then((res) => this.setState({ reloading: false }))
                                            .catch((err) => this.setState({ reloading: false }));
                                    }}>
                                    {this.state.reloading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={{ color: '#fff' }}>
                                            {customTranslate('ml_Refresh')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
                <ContactDetails
                    visible={this.state.viewContactModal}
                    closeViewContact={this.closeViewContactModal}
                    details={this.state.viewContact}
                    fullData={this.state.fullContactData}
                    showAddReferral
                />
                <Modal
                    title={customTranslate('ml_AddContactsEmail')}
                    transparent
                    // onClose={this.onClose}
                    maskClosable
                    visible={this.state.addContactByEmail}
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
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                width: Dimensions.get('window').width - 40,
                                maxWidth: 450,
                                paddingVertical: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginRight: 15,
                                }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ addContactByEmail: false })}>
                                    <Icons name="ios-close" size={50} color="#888888" />
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
                                {customTranslate('ml_AddContacts')}
                            </Text>
                            <Text style={{ textAlign: 'center' }}>
                                {customTranslate('ml_EnterAnEmailBelowToAddAContact')}
                            </Text>

                            <View styel={{ marginHorizontal: 30 }}>
                                <InputItem
                                    clear
                                    value={this.state.inputFirstName}
                                    onChange={(inputFirstName) => {
                                        this.setState({
                                            inputFirstName,
                                        });
                                    }}
                                    placeholder="First Name"
                                    style={{
                                        borderWidth: 0.5,
                                        padding: 5,
                                        borderRadius: 5,
                                        borderColor: COLORS.borderColor,
                                    }}
                                />
                                <InputItem
                                    clear
                                    value={this.state.inputLastName}
                                    onChange={(inputLastName) => {
                                        this.setState({
                                            inputLastName,
                                        });
                                    }}
                                    placeholder="Last Name"
                                    style={{
                                        borderWidth: 0.5,
                                        padding: 5,
                                        borderRadius: 5,
                                        borderColor: COLORS.borderColor,
                                    }}
                                />
                                <InputItem
                                    clear
                                    value={this.state.inputEmail}
                                    onChange={(inputEmail) => {
                                        this.setState({
                                            inputEmail,
                                        });
                                    }}
                                    placeholder="example@gmail.com"
                                    style={{
                                        borderWidth: 0.5,
                                        padding: 5,
                                        borderRadius: 5,
                                        borderColor: COLORS.borderColor,
                                    }}
                                />
                                <View styel={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Button
                                        disabled={
                                            !this.state.inputEmail || !this.state.inputFirstName
                                        }
                                        type="primary"
                                        onPress={this.addContactEmail}>
                                        {customTranslate('ml_AddContact')}
                                    </Button>

                                    {/* <Button type="warning" onPress={() => {
                    this.openModal()
                  }}>
                    <Text>Import Phone Contacts </Text>
                  </Button> */}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View>
                    {/* add contacts modal */}
                    <Modal
                        title={customTranslate('ml_AddContacts')}
                        transparent
                        onClose={this.onClose}
                        maskClosable
                        visible={showModal}
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
                                        marginRight: 15,
                                    }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 8 }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 27,
                                                fontWeight: 'bold',
                                                color: '#444444',
                                            }}>
                                            {customTranslate('ml_AddContacts')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                addContact: !this.state.addContact,
                                            });
                                        }}
                                        style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Icons name="ios-close" size={40} color="#888888"></Icons>
                                    </TouchableOpacity>
                                </View>

                                {/* phone and gmail */}
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#999999',
                                    }}>
                                    {customTranslate(
                                        'ml_AutomaticallyFindPeopleToReferToOpenJobs',
                                    )}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        marginTop: 15,
                                    }}>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.openModal();
                                            }}>
                                            <Image
                                                style={{ width: 60, height: 60 }}
                                                source={require('../../_shared/assets/phone-book.png')}
                                            />
                                            <Text
                                                style={[
                                                    styles1.importMethod,
                                                    { textTransform: 'capitalize' },
                                                ]}>
                                                {customTranslate('ml_Phone')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ addContact: false }, () => {
                                                    this.setState({ addContactByEmail: true });
                                                });
                                            }}

                                        >
                                            <Image
                                                style={{ width: 60, height: 60 }}
                                                source={require('../../_shared/assets/envelope.png')}
                                            />
                                            <Text style={styles1.importMethod}>
                                                {customTranslate('ml_Email')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/* <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Sorry!',
                      'Coming soon feature!')
                  }}
                >
                  <Image
                    style={{ width: 60, height: 60, }}
                    source={require('../../_shared/assets/envelope.png')}
                  />
                  <Text style={{ textAlign: 'center' }}>Email</Text>
                </TouchableOpacity> */}
                                </View>
                                {/* outlook */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        paddingVertical: 5,
                                        marginTop: 15,
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.addGmail();
                                        }}>
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../_shared/assets/gmail.png')}
                                        />
                                        <Text style={styles1.importMethod}>Gmail</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this.hanleOutlook}>
                                        <Image
                                            style={{ width: 60, height: 60 }}
                                            source={require('../../_shared/assets/outlook1.png')}
                                        />
                                        <Text style={styles1.importMethod}>Outlook</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {this.state.outlookLoading ? (
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.77)',
                                    }}>
                                    <Animated.Image
                                        style={{ height: 60, width: 60, transform: [{ rotate: spin }] }}
                                        source={
                                            theme.enabled && symbol && symbol.key
                                                ? {
                                                    uri: downloadFromS3(symbol.key),
                                                }
                                                : getErinSquare()
                                        }
                                    />
                                </View>
                            ) : null}
                        </View>
                    </Modal>
                </View>
                {this.state.loading ? (
                    <View
                        style={{
                            width: '100%',
                            height: Dimensions.get('window').height - 120,
                            position: 'absolute',
                            top: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.77)',
                        }}>
                        <Animated.Image
                            style={{ height: 60, width: 60, transform: [{ rotate: spin }] }}
                            source={
                                theme.enabled && symbol && symbol.key
                                    ? {
                                        uri: downloadFromS3(symbol.key),
                                    }
                                    : getErinSquare()
                            }
                        />
                    </View>
                ) : null}
            </View>
        );
    }

}
const mapStateToProps = (state) => {
    const { currentUser } = state.user;
    return {
        currentUser,
    };
};

const styles1 = StyleSheet.create({
    modalBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
export default connect(
    mapStateToProps,
)(withApollo(MyContactsComponent));
// export default MyContactsComponent;
