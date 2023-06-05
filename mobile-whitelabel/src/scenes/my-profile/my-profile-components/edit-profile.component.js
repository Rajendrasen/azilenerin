import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Modal,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountryPicker from 'react-native-country-picker-modal';
import { COLORS } from '../../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Actions } from 'react-native-router-flux';
import { userActions } from '../../../_store/actions';
import getSymbolFromCurrency from 'currency-symbol-map';
import { connect } from 'react-redux';
import { listDepartmentQuery, updateUserQuery } from '../profile.graphql';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Avatar from './avatar.component';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Geolocation from 'react-native-geolocation-service';
import get from 'lodash/get';
import AsyncStorage from '@react-native-community/async-storage';

class EditProfileComponent extends Component {
    state = {
        firstName: this.props.userDetails.firstName,
        avatar: this.props.userDetails.avatar,
        lastName: this.props.userDetails.lastName,
        jobTitle: this.props.userDetails.title,
        department: this.props.userDetails.department,
        availableDepartments: [],
        deptModal: false,
        loader: false,
        currencyModal: false,
        currency: this.props.userDetails.currency,
        locationModal: false,
        location: this.props.userDetails.location
            ? JSON.parse(this.props.userDetails.location)
            : {},
    };

    hideMenu = (val) => {
        this.setState({
            department: val,
            deptModal: false,
        });
    };
    componentDidMount() {
        this.getDepartments();
        AsyncStorage.getItem('appLocale').then((res) => {
            console.log(res)
        })

    }
    getDepartments = () => {
        this.props.client
            .query({
                query: listDepartmentQuery,
                variables: {
                    filter: {
                        companyId: {
                            eq: this.props.userDetails.companyId,
                        },
                        active: { eq: true },
                    },
                    limit: 2000,
                    nextToken: null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                this.setState({
                    availableDepartments: res.data.listDepartments.items,
                });
            });
    };

    udpateUser = () => {
        this.setState({ loader: true });
        let { state, city, country } = this.state.location;
        let location = {
            state: state || null,
            city: city || null,
            country: country || null,
        };

        this.props.client
            .mutate({
                mutation: updateUserQuery,
                variables: {
                    input: {
                        id: this.props.userDetails.id,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        departmentId: this.state.department.id,
                        title: this.state.jobTitle,
                        currency: this.state.currency ? this.state.currency : null,
                        location: JSON.stringify(location),
                        avatar: this.state.toDoAvatar,
                    },
                },
            })
            .then((res) => {
                if (!this.props.employeeDetails) {
                    this.props.setCurrentUser(res.data.updateUser);
                    this.getCurrencyRate(
                        res.data.updateUser.userGroup
                            ? res.data.updateUser.userGroup.currency
                            : 'USD',
                    );
                }
                this.setState({ loader: false });
                Actions.pop();
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({
                    loader: false,
                });
            });
    };

    getCurrencyRate = async (currency) => {
        const response = await fetch(
            `https://api.exchangeratesapi.io/latest?base=USD&symbols=${currency}`,
        );
        const result = await response.json();
        if (result.error) {
            // Make this USD
            this.props.setCurrencyData(1, '$');
        } else {
            const rate = result.rates[currency].toFixed(5);
            let symbol = getSymbolFromCurrency(currency);
            symbol = symbol || '$';
            this.props.setCurrencyData(rate, symbol);
        }
    };

    handleAddressSelect = (val) => {
        if (val) {
            let addArray = val.formatted_address.split(',');
            let country = addArray[addArray.length - 1];
            let state = addArray[addArray.length - 2];
            let city = addArray[0];
            this.setState({
                location: { country: country, state: state, city: city },
                locationModal: false,
            });
        }
    };

    fetchReverseGeo = (lat, lng) => {
        const key = 'AIzaSyDA9bz4iuSAItrIUdJI8KiASKgLHGcUkjg';

        fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            lat +
            ',' +
            lng +
            '&key=' +
            key,
        )
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'OK') {
                    if (responseJson.results[1]) {
                        for (var i = 0; i < responseJson.results.length; i++) {
                            if (responseJson.results[i].types[0] === 'locality') {
                                let city = get(
                                    responseJson.results[i].address_components[0],
                                    'long_name',
                                );
                                //  updateCityProfile(city);
                                let state = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 2
                                    ],
                                    'long_name',
                                );
                                //   updateStateProfile(state);
                                let country = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 1
                                    ],
                                    'long_name',
                                );
                                //  updateCountryProfile(country);
                                this.setState({
                                    location: {
                                        city,
                                        state,
                                        country,
                                    },
                                });
                            }
                        }
                    } else {
                        console.log('No reverse geocode results.');
                    }
                }
                // console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            });
    };

    handleAndroidPermission = () => {
        if (Platform.OS == 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Allow location access for better experience.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            ).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.getLocation();
                }
            });
        } else {
            Geolocation.requestAuthorization('whenInUse').then(() => {
                this.getLocation();
            });
        }
    };

    getLocation = () => {
        Geolocation.getCurrentPosition(
            (info) => {
                this.fetchReverseGeo(info.coords.latitude, info.coords.longitude);
            },
            (err) => console.log('blocked'),
        );
    };
    toDoAvatar = (obj) => {
        this.setState({ toDoAvatar: obj });
    };

    render() {
        let loader = (
            <View
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: COLORS.whiteTransparent,
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#40a9ff" />
                <Text style={{ marginTop: 10 }}>{customTranslate('ml_Updating')}...</Text>
            </View>
        );
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <KeyboardAwareScrollView style={{ flex: 1, padding: 15 }}>
                    <View style={{ width: '100%' }}>
                        <TouchableOpacity
                            onPress={this.udpateUser}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                            }}>
                            <View
                                style={{
                                    padding: 5,
                                    borderWidth: 1,
                                    borderColor: '#018dd3',
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                }}>
                                <Text style={{ color: '#018dd3' }}>{customTranslate('ml_Save')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Avatar
                            avatar={this.state.avatar}
                            firstName={this.state.firstName}
                            lastName={this.state.lastName}
                            edit
                            toDoAvatar={this.toDoAvatar}
                        />
                    </View>
                    <View>
                        <Text style={styles.inputTitle}>{customTranslate('ml_FirstName')}</Text>
                        <TextInput
                            style={styles.input}
                            value={this.state.firstName}
                            onChangeText={(val) => this.setState({ firstName: val })}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.inputTitle}>{customTranslate('ml_LastName')}</Text>
                        <TextInput
                            style={styles.input}
                            value={this.state.lastName}
                            onChangeText={(val) => this.setState({ lastName: val })}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.inputTitle}>{customTranslate('ml_JobTitle')}</Text>
                        <TextInput
                            style={styles.input}
                            value={this.state.jobTitle}
                            onChangeText={(val) => this.setState({ jobTitle: val })}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.inputTitle}>{customTranslate('ml_Department')}</Text>
                        <TouchableOpacity
                            onPress={() => this.setState({ deptModal: true })}
                            style={[styles.input, { justifyContent: 'center' }]}>
                            <Text>{this.state.department.name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.inputTitle}>{customTranslate('ml_Currency')}</Text>
                        <CountryPicker
                            withCurrency
                            onSelect={(val) =>
                                this.setState({ currency: val.currency[0], currencyModal: false })
                            }
                            containerButtonStyle={{ backgroundColor: 'red' }}
                            visible={this.state.currencyModal}
                            renderFlagButton={() => (
                                <TouchableOpacity
                                    onPress={() => this.setState({ currencyModal: true })}
                                    style={[styles.input, { justifyContent: 'center' }]}>
                                    <Text>{this.state.currency}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                            <Text style={styles.inputTitle}>{customTranslate('ml_Location')}</Text>
                            <TouchableOpacity
                                style={{
                                    //backgroundColor: COLORS.blue,
                                    //padding: 10,
                                    borderRadius: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                onPress={this.handleAndroidPermission}>
                                <EvilIcon name="location" size={25} color={COLORS.blue} />
                                <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                    {customTranslate('ml_AutofillLocation')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                            <Text style={{ flex: 1 }}>{customTranslate('ml_City')}: </Text>
                            <TouchableOpacity
                                onPress={() => this.setState({ locationModal: true })}
                                style={[styles.input, { justifyContent: 'center', flex: 5 }]}>
                                <Text>{this.state.location.city}</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                            <Text style={{ flex: 1 }}>{customTranslate('ml_State')}: </Text>
                            <View
                                onPress={() => this.setState({ deptModal: true })}
                                style={[
                                    styles.input,
                                    {
                                        justifyContent: 'center',
                                        flex: 5,
                                        borderColor: COLORS.lightGray,
                                    },
                                ]}>
                                <Text style={{ color: COLORS.lightGray }}>
                                    {this.state.location.state}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                            }}>
                            <Text style={{ flex: 1 }}>{customTranslate('ml_Country')}: </Text>
                            <View
                                onPress={() => this.setState({ deptModal: true })}
                                style={[
                                    styles.input,
                                    {
                                        justifyContent: 'center',
                                        flex: 5,
                                        borderColor: COLORS.lightGray,
                                    },
                                ]}>
                                <Text style={{ color: COLORS.lightGray }}>
                                    {this.state.location.country}
                                </Text>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Modal visible={this.state.deptModal} transparent>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: COLORS.blackTransparent,
                        }}>
                        <View
                            style={{
                                height: '80%',
                                width: '85%',
                                alignSelf: 'center',
                                borderRadius: 10,
                                backgroundColor: '#fff',
                            }}>
                            <ScrollView style={{ flex: 1, paddingTop: 13 }}>
                                {this.state.availableDepartments.map((item) => (
                                    <TouchableOpacity
                                        onPress={() => this.hideMenu(item)}
                                        key={item.id}
                                        style={{ padding: 10, paddingBottom: 13 }}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <Modal visible={this.state.locationModal} animationType="slide">
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <GooglePlacesAutocomplete
                                placeholder={customTranslate('ml_Search')}
                                minLength={1} // minimum length of text to search
                                autoFocus={true}
                                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                listViewDisplayed="auto" // true/false/undefined
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    this.handleAddressSelect(details);
                                }}
                                getDefaultValue={() => ''}
                                query={{
                                    // available options: https://developers.google.com/places/web-service/autocomplete
                                    key: 'AIzaSyBFPKs7Ueh6G-5TqgsFKCaJagKwizTvDlY',
                                    language: 'en', // language of the results
                                    types: '(cities)', // default: 'geocode'
                                }}
                                styles={{
                                    textInputContainer: {
                                        width: '100%',
                                    },
                                    description: {
                                        fontWeight: 'bold',
                                    },
                                    predefinedPlacesDescription: {
                                        color: '#1faadb',
                                    },
                                }}
                                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                GooglePlacesDetailsQuery={{
                                    // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                                    fields: 'formatted_address',
                                }}
                                debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                renderLeftButton={() => (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.red,
                                            paddingHorizontal: 10,
                                            justifyContent: 'center',
                                            margin: 5,
                                            borderRadius: 5,
                                        }}
                                        onPress={() => this.setState({ locationModal: false })}>
                                        <Text style={{ color: '#fff' }}>{customTranslate('ml_Cancel')}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </SafeAreaView>
                </Modal>
                {this.state.loader ? loader : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputTitle: { marginBottom: 5, fontSize: 15, fontWeight: '600' },
    input: { borderRadius: 5, borderWidth: 0.5, height: 40, padding: 4 },
});

const mapStateToProps = (state) => {
    const { currentUser } = state.user;
    return {
        currentUser,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentUser(user) {
            dispatch(userActions.createSetCurrentUserAction(user));
        },
        setCurrencyData(currencyRate, currencySymbol) {
            dispatch(userActions.setCurrencyData(currencyRate, currencySymbol));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withApollo(EditProfileComponent));
