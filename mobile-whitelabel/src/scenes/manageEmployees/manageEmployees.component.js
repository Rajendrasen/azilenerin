import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Animated,
    Easing,
    Image,
    StyleSheet,
    Modal,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import {
    Button,
    SearchBar,
    List,
    InputItem,
    WhiteSpace,
} from '@ant-design/react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import { SearchBarOverrides } from '../my-network/my-network.styles';
import { COLORS } from '../../_shared/styles/colors';
import { Actions } from 'react-native-router-flux';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import _ from 'lodash';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from '../../_shared/components/icon/index';
import AddEmployee from '../../_shared/components/employees/add-employee.component';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import {
    queryUserInvitesByCompanyId,
    queryUsersByCompanyIdIndex,
} from '../../_store/_shared/api/graphql/custom/employees/employees-queries';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';
const { width, height } = Dimensions.get('window');

class ManageEmployees extends Component {
    state = {
        searchTerm: '',
        nextToken: null,
        userNextToken: null,
        latestEmployees: [],
        pageNumber: 1,
        employees: [],
        pageLoading: true,
        reloading: false,
        spinAnim: new Animated.Value(0),
        latestUsers: [],
        filterModal: false,
        filters: {
            status: 'all',
            departments: {},
        },
        showDepartments: false,
        departments: [],
        status: 'all',
        depts: {},
    };
    componentDidMount() {
        this.getAllUsers();
        this.spin();
    }
    //   componentDidUpdate(prevProps, prevState) {
    //     if (this.state.nextToken && prevState.nextToken != this.state.nextToken) {
    //       this.getEmployees();
    //     }
    //     if (
    //       this.state.userNextToken &&
    //       prevState.userNextToken != this.state.userNextToken
    //     ) {
    //       this.getUsers();
    //     }
    //     if (
    //       prevProps.departments != this.props.departments ||
    //       (this.state.departments.length == 0 && this.props.departments)
    //     ) {
    //       this.setState({departments: this.props.departments});
    //     }
    //   }
    getAllUsers = () => {
        this.getUsers();
        this.getEmployees();
    };
    handleSearch = (text) => {
        this.setState(
            {
                searchTerm: text,
            },
            () => this.fetchData(1),
        );
    };
    getUsers = () => {
        this.props.client
            .query({
                query: queryUsersByCompanyIdIndex,
                variables: {
                    companyId: this.props.currentUser.companyId,
                    limit: 10000,
                    nextToken: this.state.userNextToken ? this.state.userNextToken : null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                if (
                    res.data.queryUsersByCompanyIdIndex &&
                    res.data.queryUsersByCompanyIdIndex.items
                ) {
                    let employees = _.orderBy(
                        [
                            ...this.state.latestUsers,
                            ...res.data.queryUsersByCompanyIdIndex.items,
                        ],
                        ['firstName', 'lastName'],
                        ['asc', 'asc'],
                    );
                    this.setState(
                        {
                            latestUsers: employees,
                            userNextToken: res.data.queryUsersByCompanyIdIndex.userNextToken,
                        },
                        () => {
                            this.fetchData(1);
                            if (!this.state.nextToken && !this.state.userNextToken) {
                                this.setState({
                                    pageLoading: false,
                                    reloading: false,
                                });
                            }
                        },
                    );
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    getEmployees = () => {
        this.props.client
            .query({
                query: queryUserInvitesByCompanyId,
                variables: {
                    //   filter: {
                    //     userId: { eq: this.props.currentUser.id },
                    //   },
                    companyId: this.props.currentUser.companyId,
                    limit: 10000,
                    nextToken: this.state.nextToken ? this.state.nextToken : null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                if (
                    res.data.queryUserInvitesByCompanyId &&
                    res.data.queryUserInvitesByCompanyId.items
                ) {
                    let employees = res.data.queryUserInvitesByCompanyId.items.filter(
                        (item) => !item.userId,
                    );
                    employees = _.orderBy(
                        [...this.state.latestEmployees, ...employees],
                        ['firstName', 'lastName'],
                        ['asc', 'asc'],
                    );
                    this.setState(
                        {
                            latestEmployees: employees,
                            nextToken: res.data.queryUserInvitesByCompanyId.nextToken,
                        },
                        () => {
                            this.fetchData(1);
                            if (!this.state.nextToken && !this.state.userNextToken) {
                                this.setState({
                                    pageLoading: false,
                                    reloading: false,
                                });
                            }
                        },
                    );
                }
            })
            .catch((err) => this.setState({ pageLoading: false, reloading: false }));
    };
    renderEmployeeRow = ({ item }) => {
        return (
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
                // onPress={() =>
                //   Actions.referralDetail({
                //     referralId: item.id,
                //   })
                // }
                key={item.id}
                onPress={() =>
                    item.active
                        ? Actions.employeeDetails({
                            userId: item.userId || item.id,
                            employeeStatus: item.active,
                        })
                        : this.resendInvite(item.id)
                }>
                <View style={{ flex: 4.5 }}>
                    {item.firstName || item.lastName ? (
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '500',
                                color: COLORS.blue,
                            }}>{`${item.firstName} ${item.lastName}`}</Text>
                    ) : (
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '500',
                                color: COLORS.blue,
                            }}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</Text>
                    )}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1.5,
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}>
                    <Text style={{ fontSize: 13, color: '#8D99A3' }}>
                        {item.active ? customTranslate('ml_Active') : customTranslate('ml_Unaccepted')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    _menu = null;

    setMenuRef = (ref) => {
        this._menu = ref;
    };

    handleStatus = (val) => {
        this.setState({ status: val }, () => {
            this.fetchData(1);
        });
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    fetchData = (pageNumber) => {
        //this.setState({ pageLoading: true });

        //let newArr = _.sortBy(this.filterJobs(this.state.searchTerm), 'referralDate').reverse();
        let newArr = this.filterJobs(this.state.searchTerm);
        let fromIndex = (pageNumber - 1) * 20;
        let toIndex = fromIndex + 20;
        let pageEmployees = newArr.slice(fromIndex, toIndex);
        if (pageNumber == 1) {
            this.setState({ pageNumber: pageNumber, employees: pageEmployees });
        } else {
            this.setState({
                pageNumber: pageNumber,
                employees: [...this.state.employees, ...pageEmployees],
                // pageLoading: false,
            });
        }
    };
    filterJobs = (searchTerm) => {
        let employees =
            this.state.status == 'active'
                ? [...this.state.latestUsers]
                : this.state.status == 'unaccepted'
                    ? [...this.state.latestEmployees]
                    : [...this.state.latestUsers, ...this.state.latestEmployees];
        let filterDepts = { ...this.state.depts };
        if (Object.keys(this.state.depts).length) {
            employees = employees.filter((emp) => {
                if (filterDepts[emp.departmentId]) {
                    return true;
                }
                return false;
            });
        }
        if (searchTerm) {
            return employees.filter((ref) => {
                const contactName = ref
                    ? `${ref.firstName} ${ref.lastName}`
                    : `${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`;
                if (contactName) {
                    return (
                        contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                    );
                }
            });
        }
        return employees;
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
    resendInvite = (id) => {
        Alert.alert(
            customTranslate('ml_ResendInvite'),
            customTranslate('ml_WouldYouLikeToResendInvite'),
            [
                {
                    text: customTranslate('ml_Cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        fetch(
                            'https://bbh6ooqu3e.execute-api.us-east-2.amazonaws.com/default/email-resend-new-user-invite',
                            {
                                method: 'POST',
                                mode: 'no-cors',
                                body: JSON.stringify({
                                    userInviteId: id,
                                }),
                            },
                        )
                            .then((res) => {
                                // Toast.show(customTranslate('ml_InvitationSent'), Toast.SHORT, Toast.TOP, {
                                //   backgroundColor: COLORS.dashboardGreen,
                                //   height: 50,
                                //   width: 250,
                                //   borderRadius: 10,
                                // });
                                showMessage({
                                    message: customTranslate('ml_InvitationSent'),
                                    type: 'success',
                                });
                            })
                            .catch((err) => {
                                // Toast.show('Something went wrong', Toast.SHORT, Toast.TOP, {
                                //   backgroundColor: COLORS.red,
                                //   height: 50,
                                //   width: 250,
                                //   borderRadius: 10,
                                // });
                                showMessage({
                                    message: 'Something went wrong',
                                    type: 'danger',
                                });
                            });
                    },
                },
            ],
            { cancelable: false },
        );
    };
    render() {
        const { status } = this.state.filters;
        const showClosed = status === 'closed';
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let { currentUser, departments, usersGroups } = this.props;
        let {
            company: { symbol, theme },
        } = currentUser;
        theme = theme ? JSON.parse(theme) : {};
        let filters = (
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Menu
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={this.showMenu}>
                            <Text style={styles.activeFilterText}>
                                {this.state.status == 'all'
                                    ? customTranslate('ml_All')
                                    : this.state.status == 'active'
                                        ? customTranslate('ml_Active')
                                        : customTranslate('ml_Unaccepted')}
                            </Text>
                            <IonIcon
                                name={'md-arrow-dropdown'}
                                size={20}
                                color={COLORS.buttonGrayOutline}
                                style={{ marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                    }>
                    <MenuItem
                        onPress={() => this.handleStatus('all')}
                        style={{ width: 250 }}>
                        {customTranslate('ml_All')}
                    </MenuItem>
                    <MenuItem onPress={() => this.handleStatus('active')}>
                        {customTranslate('ml_Active')}
                    </MenuItem>
                    <MenuItem onPress={() => this.handleStatus('unaccepted')}>
                        {customTranslate('ml_Unaccepted')}
                    </MenuItem>
                </Menu>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => this.setState({ showDepartments: true })}>
                    <Text
                        style={
                            Object.keys(this.state.depts).length > 0
                                ? styles.activeFilterText
                                : styles.inactiveFilterText
                        }>
                        {customTranslate('ml_Departments')}
                    </Text>
                    <IonIcon
                        name={'md-arrow-dropdown'}
                        size={20}
                        color={COLORS.buttonGrayOutline}
                        style={{ marginLeft: 10, marginTop: 2 }}
                    />
                </TouchableOpacity>
            </View>
        );
        return (
            <View style={{ flex: 1 }}>
                {width > 450 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingVertical: 10,
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                            backgroundColor: '#EFEFF2',
                        }}>
                        <View>
                            <AddEmployee
                                currentUser={currentUser}
                                departments={departments}
                                userGroups={usersGroups}
                                getAllUsers={this.getAllUsers}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {filters}
                            <View style={{ width: 250 }}>
                                <SearchBar
                                    placeholder={customTranslate('ml_Search')}
                                    onChange={(text) => {
                                        this.handleSearch(text);
                                    }}
                                    showCancelButton={false}
                                    styles={SearchBarOverrides}
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View>
                        <AddEmployee
                            currentUser={currentUser}
                            departments={departments}
                            userGroups={usersGroups}
                            getAllUsers={this.getAllUsers}
                        />

                        <SearchBar
                            placeholder={customTranslate('ml_Search')}
                            onChange={(text) => {
                                this.handleSearch(text);
                            }}
                            showCancelButton={false}
                            styles={SearchBarOverrides}
                        />
                    </View>
                )}
                {width <= 450 && (
                    <View style={{ backgroundColor: '#EFEFF2' }}>
                        {!this.props.onDeckRefer && filters}
                    </View>
                )}

                {this.state.pageLoading ? (
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.Image
                            style={{ height: 60, width: 60, transform: [{ rotate: spin }] }}
                            source={
                                theme.enabled && symbol && symbol.key
                                    ? {
                                        uri:
                                            'https://s3.us-east-2.amazonaws.com/erin-avatars/' +
                                            symbol.key,
                                    }
                                    : getErinSquare()
                            }
                        />
                    </View>
                ) : this.state.employees && this.state.employees.length > 0 ? (
                    <FlatList
                        style={{ flex: 1, backgroundColor: '#fff' }}
                        data={this.state.employees}
                        renderItem={this.renderEmployeeRow}
                        onEndReached={() => {
                            if (
                                this.state.pageNumber + 1 >
                                [...this.state.latestEmployees, ...this.state.latestUsers]
                                    .length /
                                20 +
                                1
                            ) {
                                return;
                            } else {
                                // debugger
                                if (!this.state.pageLoading) {
                                    this.fetchData(this.state.pageNumber + 1);
                                }
                            }
                        }}
                        onRefresh={() => {
                            this.setState({
                                reloading: true,
                                latestEmployees: [],
                                latestUsers: [],
                            });
                            this.getAllUsers();
                        }}
                        refreshing={this.state.reloading}
                    />
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
                                {customTranslate('ml_ThereAreNoEmployeesAtThisTime')}
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
                                    this.setState({ pageLoading: true });
                                    this.getAllUsers();
                                }}>
                                <Text style={{ color: '#fff' }}>{customTranslate('ml_Refresh')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                <Modal visible={this.state.showDepartments} transparent>
                    <SafeAreaView
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,.4)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                width: width - 30,
                                maxHeight: height - 150,
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                maxWidth: 450,
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: 40,
                                    alignSelf: 'flex-end',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() =>
                                    this.setState((state) => ({
                                        showDepartments: false,
                                        filters: { ...state.filters, departments: state.depts },
                                    }))
                                }>
                                <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                            </TouchableOpacity>
                            <ScrollView style={{ padding: 10 }}>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {this.state.departments &&
                                        this.state.departments.length > 0 &&
                                        this.state.departments.map((dep) => (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor: this.state.filters.departments[
                                                        dep.id
                                                    ]
                                                        ? 'rgb(189, 249, 189)'
                                                        : 'transparent',
                                                    height: 40,
                                                    borderRadius: 5,
                                                    paddingHorizontal: 10,
                                                    marginBottom: 5,
                                                    marginRight: 3,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    borderWidth: this.state.filters.departments[dep.id]
                                                        ? 0
                                                        : 1,
                                                    borderColor: '#888',
                                                }}
                                                key={dep.id}
                                                onPress={() => {
                                                    let tempDepts = { ...this.state.filters.departments };
                                                    if (tempDepts[dep.id]) {
                                                        delete tempDepts[dep.id];
                                                    } else {
                                                        tempDepts[dep.id] = dep.name;
                                                    }
                                                    this.setState({
                                                        filters: {
                                                            ...this.state.filters,
                                                            departments: tempDepts,
                                                        },
                                                    });
                                                }}>
                                                <Text
                                                    style={{
                                                        color: this.state.filters.departments[dep.id]
                                                            ? 'rgb(29, 134, 29)'
                                                            : '#777',
                                                    }}>
                                                    {dep.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </ScrollView>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 10,
                                        //backgroundColor: COLORS.red,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        margin: 5,
                                        flex: 1,
                                        borderWidth: 0.5,
                                        borderColor: COLORS.buttonGrayOutline,
                                    }}
                                    onPress={() => {
                                        this.setState(
                                            (state) => ({
                                                filters: { ...state.filters, departments: {} },
                                                depts: {},
                                            }),
                                            () => {
                                                this.fetchData(1);
                                            },
                                        );
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 20,
                                            fontWeight: '300',
                                            marginRight: 5,
                                            color: COLORS.buttonGrayText,
                                        }}>
                                        {customTranslate('ml_Clear')}
                                    </Text>
                                    {/* <Icon name="checkmark_circle" color="white" /> */}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 10,
                                        backgroundColor: COLORS.blue,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        margin: 5,
                                        flex: 1,
                                    }}
                                    onPress={() => {
                                        this.setState(
                                            (state) => ({
                                                depts: state.filters.departments,
                                                showDepartments: false,
                                            }),
                                            () => {
                                                this.fetchData(1);
                                            },
                                        );
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 20,
                                            fontWeight: '300',
                                            marginRight: 5,
                                        }}>
                                        {customTranslate('ml_Apply')}
                                    </Text>
                                    {/* <Icon name="checkmark_circle" color="white" /> */}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
    },
    outerListcontainer: {
        marginTop: 5,
    },
    openJobs: { marginTop: 20, marginLeft: 15, fontSize: 15 },
    headerRow: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activeButton: {
        backgroundColor: COLORS.red,
        color: COLORS.white,
        borderWidth: 0,
        padding: 5,
    },
    inactiveButton: {
        marginHorizontal: 3,
        padding: 4.5,
        borderWidth: 0.5,
        borderColor: COLORS.lightGray,
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginRight: 22,
    },
    noJobsText: {
        color: COLORS.darkGray,
        fontWeight: '600',
        fontSize: 16,
    },
    SubmitBtn: {
        backgroundColor: COLORS.red,
        marginBottom: 0,
    },

    SubmitBtnText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '300',
    },

    SubmitBtnContainer: {
        marginHorizontal: '2%',
        width: '96%',
        justifyContent: 'center',
    },
    filterButton: {
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: COLORS.lightGray3,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginHorizontal: 2.5,
    },
    activeFilterText: {
        fontSize: 13,
        color: COLORS.blue,
        fontWeight: '400',
        textTransform: 'capitalize',
    },
    inactiveFilterText: {
        fontSize: 13,
        color: COLORS.lightGray,
        fontWeight: '400',
    },
});

export default withApollo(ManageEmployees);
