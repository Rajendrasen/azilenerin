import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Button,
    TouchableWithoutFeedback,
    FlatList,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import Toast from 'react-native-toast-native';
import Contacts from 'react-native-contacts';
//import { List, ListItem } from 'react-native-elements';
import { WhiteSpace } from '@ant-design/react-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { COLORS } from '../_shared/styles/colors';
export default class ContactList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fakeContact: [],
            SelectedFakeContactList: [],
            loading: false,
            contacts: [],
        };
    }

    press = (hey) => {
        this.state.fakeContact.map((item) => {
            if (item.recordID === hey.recordID) {
                item.check = !item.check;
                if (item.check === true) {
                    this.state.SelectedFakeContactList.push(item);
                    // console.log('selected:' + item.givenName);
                } else if (item.check === false) {
                    const i = this.state.SelectedFakeContactList.indexOf(item);
                    if (1 != -1) {
                        this.state.SelectedFakeContactList.splice(i, 1);
                        // console.log('unselect:' + item.givenName)
                        return this.state.SelectedFakeContactList;
                    }
                }
            }
        });
        this.setState({ fakeContact: this.state.fakeContact });
    };

    _showSelectedContact() {
        return this.state.SelectedFakeContactList.length;
    }
    phoneContacts = () => {
        this.props.allContacts.map((info) => {
            info.check = false;
            // return contacts;
        });

        var cont = this.props.allContacts.sort(function (a, b) {
            if (a.givenName < b.givenName) return -1;
            if (a.givenName > b.givenName) return 1;
            return 0;
        });
        // console.log('......', cont);
        this.setState({ fakeContact: cont, loading: false, contacts: cont });
    };
    gmailContacts = () => {
        this.props.allContacts.map((info) => {
            info.check = false;
            // return contacts;
        });
        let withNames = this.props.allContacts.filter((el) => el.names);
        let withoutNames = this.props.allContacts.filter((el) => !el.names);
        var sorted = withNames.sort((a, b) => {
            var comparison = 0;
            if (a.names && b.names) {
                if (
                    a.names[0].displayName.toLowerCase() >
                    b.names[0].displayName.toLowerCase()
                ) {
                    return (comparison = 1);
                }
                if (
                    a.names[0].displayName.toLowerCase() <
                    b.names[0].displayName.toLowerCase()
                ) {
                    return (comparison = -1);
                }
            }
            return -1;
        });
        this.setState({ fakeContact: [...sorted, ...withoutNames], contacts: sorted, loading: false });
    };
    outlookContacts = () => {
        this.props.allContacts.map((info) => {
            info.check = false;
            // return contacts;
        });
        var sorted = this.props.allContacts.sort((a, b) => {
            var comparison = 0;
            if (a.displayName > b.displayName) {
                return (comparison = 1);
            }
            if (a.displayName < b.displayName) {
                return (comparison = -1);
            }
            return comparison;
        });
        this.setState({ fakeContact: sorted, contacts: sorted, loading: false });
    };
    componentDidMount() {
        if (this.props.index == 1) {
            this.phoneContacts();
        } else if (this.props.index == 2) {
            this.gmailContacts();
        } else if (this.props.index == 3) {
            this.outlookContacts();
        }
    }

    _showContactList = () => {
        const url = 'https://jsonplaceholder.typicode.com/users';
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                return this.setState({
                    fakeContact: data,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderHeader = () => {
        return <Header searchFilterFunction={this.searchFilterFunction} />;
    };
    searchFilterFunction = (text) => {
        const newData = this.state.contacts.filter((item) => {
            console.log("This is item", item)
            const itemData = item.displayName
                ? `${item.displayName.toUpperCase()}   
          ${item.displayName.toUpperCase()}`
                : item.names
                    ? `${item.names[0].givenName.toUpperCase()}   
          ${item.names[0].givenName.toUpperCase()}`
                    : item.emailAddresses
                        ? `${item.emailAddresses[0]?.email.toUpperCase()}`
                        : item.phoneNumbers
                            ? item.phoneNumbers[0].value
                            : `${item.givenName.toUpperCase()}`;

            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        this.setState({ fakeContact: newData });
    };

    getPhoneContacts() {
        if (this.state.SelectedFakeContactList.length > 0) {
            this.props.addContacts(this.state.SelectedFakeContactList);
        } else {
            // Toast.show('Please select a contact.', Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.darkGray,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            alert('Please select a contact.');
        }
    }
    checkItem = (item, i) => {
        if (this.state.fakeContact[i].check) {
            //remove item
            // Change in the current list
            let oldList = this.state.fakeContact;
            oldList[i].check = false;
            this.setState({ fakeContact: oldList });

            //add it to the selected list
            let deleteIndex = this.state.SelectedFakeContactList.indexOf(item);
            let oldSelected = this.state.SelectedFakeContactList;
            oldSelected.splice(deleteIndex, 1);
            this.setState({ SelectedFakeContactList: oldSelected });
            console.log(this.state);
        } else {
            // Change in the current list
            let oldList = this.state.fakeContact;
            oldList[i].check = true;
            this.setState({ fakeContact: oldList });

            //add it to the selected list
            let oldSelected = this.state.SelectedFakeContactList;
            oldSelected.push(oldList[i]);
            this.setState({ SelectedFakeContactList: oldSelected });
            console.log(this.state);
        }
    };
    renderGmailContacts = (item, i) => {
        //console.log(i);
        return (
            <TouchableOpacity
                style={styles.singleItemContainer}
                onPress={() => {
                    this.checkItem(item, i);
                }}>
                <View
                    style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
                    {item.names ? (
                        <Text
                            style={{
                                fontWeight: 'bold',
                            }}>
                            {item.names[0].displayName}
                        </Text>
                    ) : item.emailAddresses ? (
                        <Text
                            style={{
                                fontWeight: 'bold',
                            }}>
                            {' '}
                            {`${item.emailAddresses[0].value}`}
                        </Text>
                    ) : (
                        <Text>
                            {item.phoneNumbers[0].canonicalForm
                                ? item.phoneNumbers[0].canonicalForm
                                : item.phoneNumbers[0].value}
                        </Text>
                    )}
                </View>
                <View
                    style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    {item.check ? (
                        <Icon name="ios-checkbox" size={30} color={primaryColor}></Icon>
                    ) : (
                        <Icon name="ios-square-outline" size={30} color={darkGrey}></Icon>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    renderOutlookContacts = (item, i) => {
        return (
            <TouchableOpacity
                style={styles.singleItemContainer}
                onPress={() => {
                    this.checkItem(item, i);
                }}>
                <View
                    style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }}>
                    {item.check ? (
                        item.displayName ? (
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                }}>
                                {item.displayName}
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                }}>
                                {' '}
                                {`${item.displayName}`}
                            </Text>
                        )
                    ) : (
                        <Text> {`${item.displayName}`}</Text>
                    )}
                </View>
                <View
                    style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    {item.check ? (
                        <Icon name="ios-checkbox" size={30} color={primaryColor}></Icon>
                    ) : (
                        <Icon name="ios-square-outline" size={30} color={darkGrey}></Icon>
                    )}
                </View>
            </TouchableOpacity>
            //<Text>hello</Text>
        );
    };
    render() {
        // if (!this.state.fakeContact.length) {
        //     console.log(this.state.fakeContact.length)
        //     return (
        //         <View style={styles.container}>
        //             <ActivityIndicator size="large" color={COLORS.lightGray} />
        //         </View>
        //     )
        // }
        // else {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={COLORS.lightGray} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.storyContainer}>
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.fakeContact}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state}
                        ListHeaderComponent={this.renderHeader}
                        renderItem={({ item, index }) => {
                            if (this.props.index == 2) {
                                return this.renderGmailContacts(item, index);
                            } else if (this.props.index == 3) {
                                return this.renderOutlookContacts(item, index);
                            } else if (!item.givenName && !item.familyName) {
                                return;
                            }

                            return (
                                <TouchableOpacity
                                    style={styles.singleItemContainer}
                                    onPress={() => {
                                        this.press(item);
                                    }}>
                                    <View
                                        style={{
                                            flex: 3,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                        }}>
                                        {item.check ? (
                                            item.givenName && item.familyName ? (
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}>
                                                    {' '}
                                                    {`${item.givenName}`} {`${item.familyName}`}
                                                </Text>
                                            ) : (
                                                <Text
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}>
                                                    {' '}
                                                    {`${item.givenName}`}
                                                </Text>
                                            )
                                        ) : item.givenName && item.familyName ? (
                                            <Text>
                                                {' '}
                                                {`${item.givenName}`} {`${item.familyName}`}
                                            </Text>
                                        ) : (
                                            <Text> {`${item.givenName}`}</Text>
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                        }}>
                                        {item.check ? (
                                            <Icon
                                                name="ios-checkbox"
                                                size={30}
                                                color={primaryColor}></Icon>
                                        ) : (
                                            <Icon
                                                name="ios-square-outline"
                                                size={30}
                                                color={darkGrey}></Icon>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => {
                        this.getPhoneContacts();
                    }}
                    style={{
                        height: 45,
                        width: '94%',
                        paddingVertical: 10,
                        marginHorizontal: '3%',
                        borderRadius: 5,
                        position: 'absolute',
                        top: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.blue,
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 20,
                            fontWeight: '300',
                        }}>
                        Import{' '}
                        {this.state.SelectedFakeContactList.length
                            ? this.state.SelectedFakeContactList.length
                            : 'Selected'}{' '}
            Contacts
          </Text>
                </TouchableOpacity>
            </View>
        );
        // }
    }
}

const primaryColor = '#1abc9c';
const lightGrey = '#ecf0f1';
const darkGrey = '#bdc3c7';

const Header = (props) => (
    <View style={styles.searchContainer}>
        <TextInput
            style={{
                height: 40,
                width: '96%',
                alignSelf: 'center',
                backgroundColor: '#ecf0f1',
                borderRadius: 5,
                padding: 5,
            }}
            placeholder="Search..."
            onChangeText={(text) => {
                props.searchFilterFunction(text);
            }}
        />
    </View>
);

const styles = StyleSheet.create({
    singleItemContainer: {
        flexDirection: 'row',
        paddingLeft: 10,
        marginHorizontal: '3%',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ecf0f1',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 0,
    },
    storyContainer: {
        flex: 1,
        marginTop: 40,
    },

    containerFooter: {
        height: 50,
        backgroundColor: '#1abc9c',
        padding: 5,
        flexDirection: 'row',
    },
    searchContainer: {
        flex: 1,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
