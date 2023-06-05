import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Text,
    Linking,
    ScrollView,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../services/language-manager';
import FeatherIcon from 'react-native-vector-icons/Feather';
import _ from 'lodash';
import { ReferralModal } from '../on-deck/OnDeckModalContainer';

export class ViewContact extends Component {
    state = {
        edit: false,
        details: {},
        fullData: {},
        tempDetails: {},
        tempFullData: {},
        addHistory: false,
        job: {
            name: '',
            title: '',
            start: { year: '', month: '' },
            end: { year: '', month: '' },
        },
        loading: false,
        fetchingContact: true,
    };
    // shouldComponentUpdate(nextProps) {
    //   if (this.props.visible != nextProps.visible || this.props.contact != nextProps.contact) {
    //     return true;
    //   }
    //   return false;
    // }
    handleSocialClick = url => {
        Linking.openURL(url);
    };
    componentDidUpdate(prevProps) {
        if (this.props.contact && this.props.apiFetching != prevProps.apiFetching) {
            this.setState({
                fetchingContact: this.props.apiFetching,
            });
        }
        if (this.props.contact && this.props.contact != prevProps.contact) {
            this.setState(
                {
                    fetchingContact: this.props.apiFetching,
                    details: this.props.contact,
                    fullData: this.props.contact.fullContactData
                        ? JSON.parse(this.props.contact.fullContactData)
                        : {},
                },
                this.setTempData
            );
        }
    }
    setTempData = () => {
        this.setState({
            tempDetails: this.props.contact,
            tempFullData: this.props.contact.fullContactData
                ? JSON.parse(this.props.contact.fullContactData)
                : {},
        });
    };
    prepareForm = () => {
        let socialAccounts = [];
        if (this.state.tempFullData.linkedin) {
            socialAccounts.push({ profile: this.state.tempFullData.linkedin, network: 'linkedin' });
        }
        if (this.state.tempFullData.facebook) {
            socialAccounts.push({ profile: this.state.tempFullData.facebook, network: 'facebook' });
        }
        if (this.state.tempFullData.twitter) {
            socialAccounts.push({ profile: this.state.tempFullData.twitter, network: 'twitter' });
        }
        let fullData = {
            ...this.state.tempFullData,
            dataAddOns: this.state.tempFullData.dataAddOns
                ? [...this.state.tempFullData.dataAddOns]
                : null,
            details: this.state.tempFullData.details
                ? {
                    ...this.state.tempFullData.details,
                    education: this.state.tempFullData.details.education
                        ? [...this.state.tempFullData.details.education]
                        : null,
                    topics: this.state.tempFullData.details.topics
                        ? [...this.state.tempFullData.details.topics]
                        : null,
                    profiles: this.state.tempFullData.details.profiles
                        ? { ...this.state.tempFullData.details.profiles }
                        : null,
                    phones: this.state.tempFullData.details.phones
                        ? [...this.state.tempFullData.details.phones]
                        : null,
                    employment: this.state.tempFullData.details.employment
                        ? [...this.state.tempFullData.details.employment]
                        : null,
                    photos: this.state.tempFullData.details.photos
                        ? [...this.state.tempFullData.details.photos]
                        : null,
                    emails: this.state.tempFullData.details.emails
                        ? [...this.state.tempFullData.details.emails]
                        : null,
                    urls: this.state.tempFullData.details.urls
                        ? [...this.state.tempFullData.details.urls]
                        : null,
                    name: {
                        ...this.state.tempFullData.details.name,
                        given: this.state.tempDetails.firstName || this.state.details.firstName,
                        family: this.state.tempDetails.lastName || this.state.details.lastName,
                        full: `${this.state.tempDetails.firstName || this.state.details.firstName} ${this
                            .state.tempDetails.lastName || this.state.details.lastName}`,
                    },
                    locations: this.state.tempFullData.details.locations
                        ? [...this.state.tempFullData.details.locations]
                        : null,
                    interests: this.state.tempFullData.details.interests
                        ? [...this.state.tempFullData.details.interests]
                        : null,
                }
                : null,
        };
        if (!fullData.facebook) {
            delete fullData.facebook;
        }
        if (!fullData.linkedin) {
            delete fullData.linkedin;
        }
        if (!fullData.twitter) {
            delete fullData.twitter;
        }
        if (!fullData.bio) {
            delete fullData.bio;
        }
        if (fullData.details && fullData.details.employment) {
            for (i = 0; i < fullData.details.employment.length; i++) {
                let el = fullData.details.employment[i];
                if (!el.name || !el.title) {
                    alert(customTranslate('ml_MissingJobHistoryDetails'));
                    return false;
                }
                if (el.start && (!el.start.month || !el.start.year)) {
                    delete el.start;
                }
                if (el.end && (!el.end.month || !el.end.year)) {
                    delete el.end;
                }
            }
        }

        let input = {
            firstName: this.state.tempDetails.firstName || this.state.details.firstName,
            lastName: this.state.tempDetails.lastName || this.state.details.lastName,
            emailAddress: this.state.tempDetails.emailAddress || this.state.details.emailAddress,
            phoneNumber: this.state.tempDetails.phoneNumber || this.state.details.phoneNumber,
            id: this.state.tempDetails.id,
            socialMediaAccounts: JSON.stringify(socialAccounts),
            fullContactData: JSON.stringify(fullData),
        };
        console.log('input', input);
        return input;
    };
    handleSubmit = () => {
        if (!this.prepareForm()) {
            return;
        }
        this.setState({ loading: true });
        let input = { input: this.prepareForm() };
        this.props
            .update({ variables: input })
            .then(res => {
                this.setState({ edit: false, loading: false });
            })
            .catch(err => {
                this.setState({ loading: false }, () =>
                    alert(`${customTranslate('ml_UnableToUpdateContact')}, ${customTranslate('ml_PleaseTryAgainLater')}`)
                );
                console.log('contact mutation err', err);
            });
        //this.props.onUpdate(input);
        //this.setState({ edit: false });
    };
    render() {
        return (
            <Modal visible={this.props.visible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View
                        style={{
                            height: 55,
                            flexDirection: 'row',
                            width: '100%',
                            flexDirection: 'row',
                            borderBottomColor: '#ddd',
                            borderBottomWidth: 0.5,
                        }}
                    >
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={this.state.edit ? this.handleSubmit : this.props.closeViewContact}
                        >
                            {this.state.edit ? (
                                <View
                                    style={{ padding: 3, borderWidth: 1, borderColor: '#018dd3', borderRadius: 5 }}
                                >
                                    <Text style={{ color: '#018dd3' }}>{customTranslate('ml_Save')}</Text>
                                </View>
                            ) : (
                                <FeatherIcon name="chevron-down" size={25} color="#018dd3" />
                            )}
                        </TouchableOpacity>

                        <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '400', letterSpacing: 1, fontSize: 17 }}>
                                {customTranslate('ml_Contacts_ContactDetails')}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() =>
                                this.setState(
                                    state => ({ edit: state.edit ? false : true }),
                                    () => {
                                        if (this.state.edit) {
                                            this.setTempData();
                                        }
                                    }
                                )
                            }
                        >
                            <MaterialIcon name={this.state.edit ? 'close' : 'pencil'} size={25} color="#018dd3" />
                        </TouchableOpacity>

                        {/* <TouchableOpacity
              style={{ backgroundColor: 'green', height: 50, width: '100%' }}
              onPress={this.props.closeViewContact}
            ></TouchableOpacity> */}
                    </View>
                    {!this.state.fetchingContact ? (
                        this.state.edit ? (
                            <KeyboardAwareScrollView style={{ flex: 1, padding: 15 }}>
                                <View>
                                    <Text style={styles.inputTitle}>{customTranslate('ml_FirstName')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={this.state.tempDetails.firstName}
                                        onChangeText={val => {
                                            let data = { ...this.state.tempDetails };
                                            data.firstName = val;
                                            this.setState({
                                                tempDetails: data,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.inputTitle}>{customTranslate('ml_LastName')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={this.state.tempDetails.lastName}
                                        onChangeText={val => {
                                            let data = { ...this.state.tempDetails };
                                            data.lastName = val;
                                            this.setState({
                                                tempDetails: data,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.inputTitle}>{customTranslate('ml_Email')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={
                                            this.state.tempDetails.emailAddress ? this.state.tempDetails.emailAddress : ''
                                        }
                                        onChangeText={val => {
                                            let data = { ...this.state.tempDetails };
                                            data.emailAddress = val;
                                            this.setState({
                                                tempDetails: data,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={[styles.inputTitle, { textTransform: 'capitalize' }]}>
                                        {customTranslate('ml_Phone')}
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        value={
                                            this.state.tempDetails.phoneNumber ? this.state.tempDetails.phoneNumber : ''
                                        }
                                        onChangeText={val => {
                                            let data = { ...this.state.tempDetails };
                                            data.phoneNumber = val;
                                            this.setState({
                                                tempDetails: data,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.inputTitle}>{customTranslate('ml_Contacts_Bio')}</Text>
                                    <TextInput
                                        style={[styles.input, { height: 60 }]}
                                        scrollEnabled
                                        textAlignVertical="top"
                                        multiline
                                        value={this.state.tempFullData.bio ? this.state.tempFullData.bio : ''}
                                        onChangeText={val => {
                                            let data = { ...this.state.tempFullData };
                                            data.bio = val;
                                            this.setState({
                                                tempFullData: data,
                                            });
                                        }}
                                    />
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.inputTitle}>{customTranslate('ml_Contacts_Social')}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcon size={40} name="facebook-box" color="#018dd3" />
                                        <TextInput
                                            style={[styles.input, { flex: 1, height: 30 }]}
                                            value={
                                                this.state.tempFullData.facebook ? this.state.tempFullData.facebook : ''
                                            }
                                            onChangeText={val => {
                                                let data = { ...this.state.tempFullData };
                                                data.facebook = val;
                                                this.setState({
                                                    tempFullData: data,
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcon size={40} name="linkedin-box" color="#018dd3" />
                                        <TextInput
                                            style={[styles.input, { flex: 1, height: 30 }]}
                                            value={
                                                this.state.tempFullData.linkedin ? this.state.tempFullData.linkedin : ''
                                            }
                                            onChangeText={val => {
                                                let data = { ...this.state.tempFullData };
                                                data.linkedin = val;
                                                this.setState({
                                                    tempFullData: data,
                                                });
                                            }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcon size={40} name="twitter-box" color="#018dd3" />
                                        <TextInput
                                            style={[styles.input, { flex: 1, height: 30 }]}
                                            value={this.state.tempFullData.twitter ? this.state.tempFullData.twitter : ''}
                                            onChangeText={val => {
                                                let data = { ...this.state.tempFullData };
                                                data.twitter = val;
                                                this.setState({
                                                    tempFullData: data,
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                                {this.state.addHistory ? (
                                    <TouchableOpacity
                                        style={{
                                            padding: 10,
                                            borderWidth: 0.5,
                                            borderColor: 'red',
                                            borderRadius: 5,
                                            marginTop: 10,
                                            width: 120,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                addHistory: false,
                                                job: {
                                                    name: '',
                                                    title: '',
                                                    end: { year: '', month: '' },
                                                    start: { year: '', month: '' },
                                                },
                                            });
                                        }}
                                    >
                                        <Text style={{ color: 'red', textAlign: 'center' }}>
                                            {customTranslate('ml_CancelAdd')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            padding: 10,
                                            borderWidth: 0.5,
                                            borderColor: '#40a9ff',
                                            borderRadius: 5,
                                            marginTop: 10,
                                            width: 120,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            this.setState({ addHistory: true });
                                        }}
                                    >
                                        <Text style={{ color: '#40a9ff', textAlign: 'center' }}>
                                            {customTranslate('ml_AddJobHistory')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <View style={{ marginBottom: 20 }}>
                                    {this.state.addHistory ? (
                                        <View
                                            style={{
                                                marginTop: 10,
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: 10,
                                                padding: 10,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.inputTitle}>{customTranslate('ml_Position')}</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={this.state.job.title}
                                                    onChangeText={val => {
                                                        let data = { ...this.state.job };
                                                        data.title = val;
                                                        this.setState({
                                                            job: data,
                                                        });
                                                    }}
                                                />
                                            </View>
                                            <View style={{ marginTop: 10 }}>
                                                <Text style={styles.inputTitle}>{customTranslate('ml_Organization')}</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={this.state.job.name}
                                                    onChangeText={val => {
                                                        let data = { ...this.state.job };
                                                        data.name = val;
                                                        this.setState({
                                                            job: data,
                                                        });
                                                    }}
                                                />
                                            </View>
                                            {/* <View style={{ marginTop: 10 }}>
                    <Text style={styles.inputTitle}>Description</Text>
                    <TextInput
                      style={[styles.input, { height: 60 }]}
                      scrollEnabled
                      multiline
                      textAlignVertical="top"
                    />
                  </View> */}
                                            <View style={{ marginTop: 10 }}>
                                                {/* <Text style={styles.inputTitle}>Dates</Text> */}
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text>{customTranslate('ml_Startdate')}</Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TextInput
                                                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                placeholder="mm"
                                                                value={this.state.job.start ? `${this.state.job.start.month}` : ''}
                                                                onChangeText={val => {
                                                                    let data = { ...this.state.job };
                                                                    data.start = {
                                                                        ...data.start,
                                                                        month: val,
                                                                    };
                                                                    this.setState({
                                                                        job: data,
                                                                    });
                                                                }}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                placeholder="yyyy"
                                                                value={this.state.job.start ? `${this.state.job.start.year}` : ''}
                                                                onChangeText={val => {
                                                                    let data = { ...this.state.job };
                                                                    data.start = {
                                                                        ...data.start,
                                                                        year: val,
                                                                    };
                                                                    this.setState({
                                                                        job: data,
                                                                    });
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text>{customTranslate('ml_Enddate')}</Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <TextInput
                                                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                placeholder="mm"
                                                                value={this.state.job.end ? `${this.state.job.end.month}` : ''}
                                                                onChangeText={val => {
                                                                    let data = { ...this.state.job };
                                                                    data.end = {
                                                                        ...data.end,
                                                                        month: val,
                                                                    };
                                                                    this.setState({
                                                                        job: data,
                                                                    });
                                                                }}
                                                            />
                                                            <TextInput
                                                                style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                placeholder="yyyy"
                                                                value={this.state.job.end ? `${this.state.job.end.year}` : ''}
                                                                onChangeText={val => {
                                                                    let data = { ...this.state.job };
                                                                    data.end = {
                                                                        ...data.end,
                                                                        year: val,
                                                                    };
                                                                    this.setState({
                                                                        job: data,
                                                                    });
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                                {/* <View style={{ flexDirection: 'row' }}>
                        <TextInput
                          style={[styles.input, { flex: 1, marginRight: 5 }]}
                          placeholder="start (mm/yyyy)"
                          value={
                            this.state.job.start &&
                            this.state.job.start.month &&
                            this.state.job.start.year
                              ? `${this.state.job.start.month}/${this.state.job.start.year}`
                              : ''
                          }
                          onChangeText={val => {
                            let data = { ...this.state.job };
                            data.start = {
                              ...data.start,
                              month: val.split('/')[0],
                              year: val.split('/')[1],
                            };
                            this.setState({
                              job: data,
                            });
                          }}
                        />
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="end (mm/yyyy)"
                          value={
                            this.state.job.end &&
                            this.state.job.end.month &&
                            this.state.job.end.year
                              ? `${this.state.job.end.month}/${this.state.job.end.year}`
                              : ''
                          }
                          onChangeText={val => {
                            let data = { ...this.state.job };
                            data.end = {
                              ...data.end,
                              month: val.split('/')[0],
                              year: val.split('/')[1],
                            };
                            this.setState({
                              job: data,
                            });
                          }}
                        />
                      </View> */}
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 10,
                                                    borderRadius: 5,
                                                    width: '100%',
                                                    height: 35,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderWidth: 1,
                                                    borderColor:
                                                        this.state.job.name && this.state.job.title ? '#40a9ff' : '#ccc',
                                                }}
                                                onPress={() => {
                                                    if (this.state.job.name && this.state.job.title) {
                                                        let data = this.state.tempFullData.details
                                                            ? {
                                                                ...this.state.tempFullData,
                                                                details: { ...this.state.tempFullData.details },
                                                            }
                                                            : { ...this.state.tempFullData, details: {} };

                                                        let empArray = data.details.employment
                                                            ? [...data.details.employment]
                                                            : [];
                                                        let jobData = {
                                                            ...this.state.job,
                                                            start: { ...this.state.job.start },
                                                            end: { ...this.state.job.end },
                                                        };
                                                        if (!jobData.start.year || !jobData.start.month) {
                                                            delete jobData.start;
                                                        }
                                                        if (!jobData.end.year || !jobData.end.month) {
                                                            delete jobData.end;
                                                        }
                                                        empArray.push(jobData);

                                                        data.details.employment = empArray;
                                                        this.setState({
                                                            tempFullData: data,
                                                            addHistory: false,
                                                            job: {
                                                                name: '',
                                                                title: '',
                                                                end: { year: '', month: '' },
                                                                start: { year: '', month: '' },
                                                            },
                                                        });
                                                    }
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: this.state.job.title && this.state.job.name ? '#40a9ff' : '#ccc',
                                                    }}
                                                >
                                                    {customTranslate('ml_AddJob')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : this.state.tempFullData.details &&
                                        this.state.tempFullData.details.employment &&
                                        this.state.tempFullData.details.employment.length > 0 ? (
                                        this.state.tempFullData.details.employment.map((emp, i) => (
                                            <View
                                                style={{
                                                    marginTop: 10,
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: 10,
                                                    padding: 10,
                                                }}
                                                key={i}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5,
                                                        alignSelf: 'flex-end',
                                                        borderRadius: 5,
                                                        borderWidth: 0.5,
                                                        borderColor: 'red',
                                                    }}
                                                    onPress={() => {
                                                        let data = {
                                                            ...this.state.tempFullData,
                                                            details: {
                                                                ...this.state.tempFullData.details,
                                                                employment: [...this.state.tempFullData.details.employment],
                                                            },
                                                        };
                                                        data.details.employment.splice(i, 1);
                                                        this.setState({
                                                            tempFullData: data,
                                                        });
                                                    }}
                                                >
                                                    <Text style={{ color: 'red' }}>{customTranslate('ml_Delete')}</Text>
                                                </TouchableOpacity>
                                                <View>
                                                    <Text style={styles.inputTitle}>{customTranslate('ml_Position')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        value={emp.title ? emp.title : ''}
                                                        onChangeText={val => {
                                                            let data = {
                                                                ...this.state.tempFullData,
                                                                details: { ...this.state.tempFullData.details },
                                                            };
                                                            let employmentArray = [...this.state.tempFullData.details.employment];
                                                            employmentArray[i].title = val;
                                                            data.details.employment = employmentArray;
                                                            this.setState({
                                                                tempFullData: data,
                                                            });
                                                        }}
                                                    />
                                                </View>
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={styles.inputTitle}>{customTranslate('ml_Organization')}</Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        value={emp.name ? emp.name : ''}
                                                        onChangeText={val => {
                                                            let data = {
                                                                ...this.state.tempFullData,
                                                                details: { ...this.state.tempFullData.details },
                                                            };
                                                            let employmentArray = [...this.state.tempFullData.details.employment];
                                                            employmentArray[i].name = val;
                                                            data.details.employment = employmentArray;
                                                            this.setState({
                                                                tempFullData: data,
                                                            });
                                                        }}
                                                    />
                                                </View>
                                                {/* <View style={{ marginTop: 10 }}>
                        <Text style={styles.inputTitle}>Description</Text>
                        <TextInput
                          style={[styles.input, { height: 60 }]}
                          scrollEnabled
                          multiline
                          textAlignVertical="top"
                        />
                      </View> */}
                                                <View style={{ marginTop: 10 }}>
                                                    {/* <Text style={styles.inputTitle}>Dates</Text> */}
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text>{customTranslate('ml_Startdate')}</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <TextInput
                                                                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                    placeholder="mm"
                                                                    value={emp.start && emp.start.month ? `${emp.start.month}` : ''}
                                                                    onChangeText={val => {
                                                                        let data = this.state.tempFullData.details
                                                                            ? {
                                                                                ...this.state.tempFullData,
                                                                                details: { ...this.state.tempFullData.details },
                                                                            }
                                                                            : {
                                                                                ...this.state.tempFullData,
                                                                                details: {},
                                                                            };
                                                                        let employmentArray = data.details.employment
                                                                            ? [...this.state.tempFullData.details.employment]
                                                                            : [];
                                                                        employmentArray[i].start = {
                                                                            ...employmentArray[i].start,
                                                                            month: val,
                                                                        };
                                                                        data.details.employment = employmentArray;
                                                                        this.setState({
                                                                            tempFullData: data,
                                                                        });
                                                                    }}
                                                                />
                                                                <TextInput
                                                                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                    placeholder="yyyy"
                                                                    value={emp.start && emp.start.year ? `${emp.start.year}` : ''}
                                                                    onChangeText={val => {
                                                                        let data = this.state.tempFullData.details
                                                                            ? {
                                                                                ...this.state.tempFullData,
                                                                                details: { ...this.state.tempFullData.details },
                                                                            }
                                                                            : {
                                                                                ...this.state.tempFullData,
                                                                                details: {},
                                                                            };
                                                                        let employmentArray = data.details.employment
                                                                            ? [...this.state.tempFullData.details.employment]
                                                                            : [];
                                                                        employmentArray[i].start = {
                                                                            ...employmentArray[i].start,
                                                                            year: val,
                                                                        };
                                                                        data.details.employment = employmentArray;
                                                                        this.setState({
                                                                            tempFullData: data,
                                                                        });
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text>{customTranslate('ml_Enddate')}</Text>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <TextInput
                                                                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                    placeholder="mm"
                                                                    value={emp.end && emp.end.month ? `${emp.end.month}` : ''}
                                                                    onChangeText={val => {
                                                                        let data = this.state.tempFullData.details
                                                                            ? {
                                                                                ...this.state.tempFullData,
                                                                                details: { ...this.state.tempFullData.details },
                                                                            }
                                                                            : {
                                                                                ...this.state.tempFullData,
                                                                                details: {},
                                                                            };
                                                                        let employmentArray = data.details.employment
                                                                            ? [...this.state.tempFullData.details.employment]
                                                                            : [];
                                                                        employmentArray[i].end = {
                                                                            ...employmentArray[i].end,
                                                                            month: val,
                                                                        };
                                                                        data.details.employment = employmentArray;
                                                                        this.setState({
                                                                            tempFullData: data,
                                                                        });
                                                                    }}
                                                                />
                                                                <TextInput
                                                                    style={[styles.input, { flex: 1, marginRight: 5 }]}
                                                                    placeholder="yyyy"
                                                                    value={emp.end && emp.end.year ? `${emp.end.year}` : ''}
                                                                    onChangeText={val => {
                                                                        let data = this.state.tempFullData.details
                                                                            ? {
                                                                                ...this.state.tempFullData,
                                                                                details: { ...this.state.tempFullData.details },
                                                                            }
                                                                            : {
                                                                                ...this.state.tempFullData,
                                                                                details: {},
                                                                            };
                                                                        let employmentArray = data.details.employment
                                                                            ? [...this.state.tempFullData.details.employment]
                                                                            : [];
                                                                        employmentArray[i].end = {
                                                                            ...employmentArray[i].end,
                                                                            year: val,
                                                                        };
                                                                        data.details.employment = employmentArray;
                                                                        this.setState({
                                                                            tempFullData: data,
                                                                        });
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {/* <View style={{ flexDirection: 'row' }}>
                          <TextInput
                            style={[styles.input, { flex: 1, marginRight: 5 }]}
                            placeholder="start (mm/yyyy)"
                            value={
                              emp.start && emp.start.month && emp.start.year
                                ? `${emp.start.month}/${emp.start.year}`
                                : ''
                            }
                            onChangeText={val => {
                              let data = this.state.tempFullData.details
                                ? {
                                    ...this.state.tempFullData,
                                    details: { ...this.state.tempFullData.details },
                                  }
                                : {
                                    ...this.state.tempFullData,
                                    details: {},
                                  };
                              let employmentArray = data.details.employment
                                ? [...this.state.tempFullData.details.employment]
                                : [];
                              employmentArray[i].start = {
                                month: val.split('/')[0],
                                year: val.split('/')[1],
                              };
                              data.details.employment = employmentArray;
                              this.setState({
                                tempFullData: data,
                              });
                            }}
                          />
                          <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="end (mm/yyyy)"
                            value={
                              emp.end && emp.end.month && emp.end.year
                                ? `${emp.end.month}/${emp.end.year}`
                                : ''
                            }
                            onChangeText={val => {
                              let data = this.state.tempFullData.details
                                ? {
                                    ...this.state.tempFullData,
                                    details: { ...this.state.tempFullData.details },
                                  }
                                : {
                                    ...this.state.tempFullData,
                                    details: {},
                                  };
                              let employmentArray = data.details.employment
                                ? [...this.state.tempFullData.details.employment]
                                : [];
                              employmentArray[i].end = {
                                month: val.split('/')[0],
                                year: val.split('/')[1],
                              };
                              data.details.employment = employmentArray;
                              this.setState({
                                tempFullData: data,
                              });
                            }}
                          />
                        </View> */}
                                                </View>
                                            </View>
                                        ))
                                    ) : null}
                                </View>
                            </KeyboardAwareScrollView>
                        ) : (
                            <ScrollView style={{ flex: 1, padding: 15 }}>
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text
                                            style={{
                                                fontSize: 28,
                                                marginVertical: 5,
                                                fontWeight: '700',
                                                color: '#424242',
                                            }}
                                        >
                                            {`${_.get(this.state.details, 'firstName') ||
                                                _.get(this.state.details, 'name', '')} ${_.get(
                                                    this.state.details,
                                                    'lastName'
                                                ) || _.get(this.state.details, 'name', '')}`}
                                        </Text>
                                    </View>
                                    {this.props.showAddReferral &&
                                        this.props.currentUser.company.enableGeneralReferrals && (
                                            <View style={{ flex: 1 }}>
                                                <ReferralModal referContact={this.state.details} />
                                            </View>
                                        )}
                                </View>
                                {this.state.details.emailAddress && (
                                    <Text
                                        style={{
                                            color: '#018dd3',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 5,
                                        }}
                                    >
                                        {this.state.details.emailAddress}
                                    </Text>
                                )}
                                {this.state.details.phoneNumber && (
                                    <Text
                                        style={{
                                            color: '#018dd3',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 5,
                                        }}
                                    >
                                        {this.state.details.phoneNumber}
                                    </Text>
                                )}
                                {this.state.fullData.title && (
                                    <Text style={{ fontSize: 16, color: '#424242' }}>
                                        {this.state.fullData.title}
                                        {` @ `}
                                        {this.state.fullData.organization ? this.state.fullData.organization : null}
                                    </Text>
                                )}
                                {this.state.fullData.location && (
                                    <Text style={{ fontSize: 16, color: '#424242' }}>
                                        {this.state.fullData.location}
                                    </Text>
                                )}

                                <View style={{ marginTop: 20 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', marginBottom: 5, color: '#454545' }}
                                    >
                                        {customTranslate('ml_Contacts_Social')}
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        {this.state.fullData.linkedin ||
                                            this.state.fullData.facebook ||
                                            this.state.fullData.twitter ? (
                                            <React.Fragment>
                                                {this.state.fullData.twitter && (
                                                    <MaterialIcon
                                                        size={35}
                                                        name="twitter-box"
                                                        color="#018dd3"
                                                        onPress={() => this.handleSocialClick(this.state.fullData.twitter)}
                                                    />
                                                )}
                                                {this.state.fullData.facebook && (
                                                    <MaterialIcon
                                                        size={35}
                                                        name="facebook-box"
                                                        color="#018dd3"
                                                        onPress={() => this.handleSocialClick(this.state.fullData.facebook)}
                                                    />
                                                )}
                                                {this.state.fullData.linkedin && (
                                                    <MaterialIcon
                                                        size={35}
                                                        name="linkedin-box"
                                                        color="#018dd3"
                                                        onPress={() => this.handleSocialClick(this.state.fullData.linkedin)}
                                                    />
                                                )}
                                                {/* <MaterialIcon size={35} name="facebook-box" color="#018dd3" />
                    <MaterialIcon size={35} name="linkedin-box" color="#018dd3" /> */}
                                            </React.Fragment>
                                        ) : (
                                            <Text>N/A</Text>
                                        )}
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', marginBottom: 5, color: '#454545' }}
                                    >
                                        {customTranslate('ml_Contacts_Bio')}
                                    </Text>
                                    {this.state.fullData.bio ? (
                                        <Text style={{ fontSize: 16, color: '#424242' }}>
                                            {this.state.fullData.bio}
                                        </Text>
                                    ) : (
                                        <Text>N/A</Text>
                                    )}
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#454545' }}
                                    >
                                        {customTranslate('ml_Contacts_JobHistory')}
                                    </Text>
                                    {this.state.fullData.details &&
                                        this.state.fullData.details.employment &&
                                        this.state.fullData.details.employment.length > 0 ? (
                                        this.state.fullData.details.employment.map((emp, i) => (
                                            <View
                                                key={i}
                                                style={{
                                                    borderBottomWidth: 0.5,
                                                    borderBottomColor: '#ddd',
                                                    paddingBottom: 5,
                                                    marginBottom: 10,
                                                }}
                                                key={i}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        color: '#8e98a2',
                                                    }}
                                                >
                                                    {customTranslate('ml_Position')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}
                                                    >
                                                        {emp.title ? emp.title : 'N/A'}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        marginTop: 3,
                                                        color: '#8e98a2',
                                                    }}
                                                >
                                                    {customTranslate('ml_Organization')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}
                                                    >
                                                        {emp.name ? emp.name : 'N/A'}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        marginTop: 3,
                                                        color: '#8e98a2',
                                                    }}
                                                >
                                                    {customTranslate('ml_Dates')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}
                                                    >
                                                        {emp.start ? `${emp.start.month}/${emp.start.year}` : 'N/A'}
                                                        {' - '}
                                                        {emp.end
                                                            ? `${emp.end.month}/${emp.end.year}`
                                                            : emp.start
                                                                ? customTranslate('ml_Present')
                                                                : 'N/A'}
                                                    </Text>
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text>N/A</Text>
                                    )}
                                </View>
                            </ScrollView>
                        )
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#40a9ff" />
                        </View>
                    )}
                    {this.state.loading ? (
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                backgroundColor: 'rgba(255, 255, 255, 0.77)',
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator size="large" color="#40a9ff" />
                        </View>
                    ) : null}
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    inputTitle: { marginBottom: 5, fontSize: 15, fontWeight: '600' },
    input: { borderRadius: 5, borderWidth: 0.5, height: 40, padding: 4 },
});

export default ViewContact;
