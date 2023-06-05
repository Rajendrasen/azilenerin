import React, { Component } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { SearchBar, ActivityIndicator } from '@ant-design/react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import _ from 'lodash';
import { wpx, hpx, nf } from '../../_shared/constants/responsive';
import BonusCard from './bonus-card/bonus-card.component';
import { styles, SearchBarOverrides } from '../referrals/referrals.style';
import { withApollo } from 'react-apollo';
import { COLORS } from '../../_shared/styles/colors';
let { width } = Dimensions.get('window');
import DatePicker from 'react-native-datepicker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { updateBonus } from '../../_store/_shared/api/graphql/custom/bonuses/update-bonus.graphql';
import { queryBonusByCompanyIdIndex } from '../../_store/_shared/api/graphql/custom/bonuses/query-bonus-by-company-id.graphql';
import moment from 'moment';
import gql from 'graphql-tag';
import { downloadFromS3 } from '../../common';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';

class Bonus extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            referrals: [],
            pageNumber: 1,
            pageLoading: true,
            spinAnim: new Animated.Value(0),
            dateModal: false,
            bonusDetailModal: false,
            allBonuses: [],
            nextToken: null,
            bonuses: [],
            reloading: false,
            status: 'all',
            startDate: null,
            endDate: null,
            bonusDetail: null,
            edit: false,
            tempBonusDetail: null,
        };
    }
    // componentDidUpdate(prevProps) {
    //     if (this.state.nextToken && this.state.nextToken != prevState.nextToken)
    //         this.getBonuses();
    // }
    componentDidMount() {
        this.getBonuses();
        this.spin();
        //setTimeout(() => this.fetchData(1), 4000);
    }
    _menu = null;

    setMenuRef = (ref) => {
        this._menu = ref;
    };

    handleStatus = (status) => {
        this.setState({ status: status }, () => this.fetchData(1));

        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    _editMenu = null;

    setEditMenuRef = (ref) => {
        this._editMenu = ref;
    };

    handleEditStatus = (status) => {
        this.setState({
            tempBonusDetail: { ...this.state.tempBonusDetail, bonusStatus: status },
        });

        this._editMenu.hide();
    };

    showEditMenu = () => {
        this._editMenu.show();
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

    fetchData = (pageNumber) => {
        this.setState({ pageLoading: true });
        let newArr = _.sortBy(
            this.filterReferrals(this.state.searchTerm),
            'earnedDate',
        ).reverse();
        let fromIndex = (pageNumber - 1) * 10;
        let toIndex = fromIndex + 10;
        let pageReferrals = newArr.slice(fromIndex, toIndex);
        if (pageNumber == 1) {
            this.setState({
                pageNumber: pageNumber,
                bonuses: pageReferrals,
                pageLoading: false,
            });
        } else {
            this.setState({
                pageNumber: pageNumber,
                bonuses: [...this.state.bonuses, ...pageReferrals],
                pageLoading: false,
                reloading: false,
            });
        }
    };

    fetchDataOnRefresh = () => {
        setTimeout(() => this.fetchData(1), 10);
    };
    filterReferrals(searchTerm) {
        let bonuses = this.state.allBonuses;
        if (searchTerm) {
            bonuses = this.state.allBonuses.filter((ref) => {
                const contactName = ref.user
                    ? `${ref.user.firstName} ${ref.user.lastName}`
                    : null;
                if (contactName) {
                    return (
                        contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                        ref.job.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                    );
                }
            });
            return bonuses;
        }
        if (this.state.status === 'earned') {
            return bonuses.filter((item) => item.bonusStatus == 'earned');
        }
        if (this.state.status === 'not yet earned') {
            return bonuses.filter((item) => item.bonusStatus !== 'earned');
        }
        if (this.state.startDate && this.state.endDate) {
            return bonuses.filter((item) => {
                return (
                    this.state.endDate.toISOString() >= item.earnedDate &&
                    item.earnedDate >= this.state.startDate.toISOString()
                );
            });
        }
        if (this.state.allBonuses) {
            return this.state.allBonuses;
        }
        return null;
    }
    handleSearch = (text) => {
        this.setState(
            {
                searchTerm: text,
            },
            () => this.fetchData(1),
        );
    };

    getBonuses = () => {
        this.props.client
            .query({
                query: queryBonusByCompanyIdIndex,
                variables: {
                    companyId: this.props.currentUser.companyId,
                    nextToken: this.state.nextToken ? this.state.nextToken : null,
                },
            })
            .then((res) => {
                this.setState(
                    (state) => ({
                        allBonuses: [
                            ...state.allBonuses,
                            ...res.data.queryBonusByCompanyIdIndex.items,
                        ],
                        nextToken: res.data.queryBonusByCompanyIdIndex.nextToken,
                    }),
                    () => {
                        if (this.state.allBonuses && !this.state.nextToken) {
                            this.setState({ reloading: false });
                            this.fetchData(1);
                        }
                    },
                );
            });
    };

    parseBonusStatus(status) {
        if (status === 'paid') {
            return customTranslate('ml_Paid');
        } else if (status === 'ineligibleEmployee') {
            return customTranslate('ml_IneligibleEmployee');
        } else if (status === 'ineligibleCandidate') {
            return customTranslate('ml_IneligibleCandidate');
        } else if (status === 'pending') {
            return customTranslate('ml_Pending');
        } else if (status === 'earned') {
            return customTranslate('ml_Earned');
        }
    }

    handleCardClick = (item) => {
        this.setState({ bonusDetail: item, tempBonusDetail: item }, () =>
            this.setState({ bonusDetailModal: true }),
        );
    };

    handleSubmit = () => {
        let {
            id,
            amountDue,
            startDate,
            earnedDate,
            bonusStatus,
            notes,
        } = this.state.tempBonusDetail;
        let input = {
            id,
            amountDue: amountDue ? amountDue : this.state.bonusDetail.amountDue,
            startDate,
            earnedDate,
            bonusStatus,
            notes: notes ? notes : null,
        };
        this.props.client
            .mutate({
                mutation: gql(updateBonus),
                variables: { input: input },
            })
            .then((res) => {
                let index = this.state.allBonuses.findIndex(
                    (item) => item.id === res.data.updateBonus.id,
                );
                let bonuses = [...this.state.allBonuses];
                bonuses[index] = { ...bonuses[index], ...res.data.updateBonus };
                this.setState(
                    {
                        bonusDetail: { ...this.state.bonusDetail, ...res.data.updateBonus },
                        allBonuses: bonuses,
                    },
                    () => this.fetchData(1),
                );
            });
    };

    render() {
        let { bonusDetail } = this.state;
        let { currentUser } = this.props;
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            company: { symbol, theme, disableManagerPermissions },
        } = currentUser;
        theme = theme ? JSON.parse(theme) : {};
        if (this.state.pageLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            );
        } else {
            const { searchTerm } = this.state;
            return (
                <View style={styles.container}>
                    <View style={{ backgroundColor: '#EFEFF2' }}>
                        {width <= 450 && (
                            <SearchBar
                                placeholder={customTranslate('ml_Search')}
                                onChange={(text) => {
                                    this.handleSearch(text);
                                }}
                                styles={SearchBarOverrides}
                            />
                        )}

                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            <Menu
                                ref={this.setMenuRef}
                                button={
                                    <TouchableOpacity
                                        style={Styles.filterButton}
                                        onPress={this.showMenu}>
                                        <Text style={Styles.activeFilterText}>
                                            {this.state.status == 'all'
                                                ? customTranslate('ml_All')
                                                : this.state.status == 'earned'
                                                    ? customTranslate('ml_Earned')
                                                    : customTranslate('ml_NotYetEarned')}
                                        </Text>
                                    </TouchableOpacity>
                                }>
                                <MenuItem onPress={() => this.handleStatus('all')}>
                                    {customTranslate('ml_All')}
                                </MenuItem>
                                <MenuItem onPress={() => this.handleStatus('earned')}>
                                    {customTranslate('ml_Earned')}
                                </MenuItem>
                                <MenuItem onPress={() => this.handleStatus('not yet earned')}>
                                    {customTranslate('ml_NotYetEarned')}
                                </MenuItem>
                            </Menu>

                            <TouchableOpacity
                                style={Styles.filterButton}
                                onPress={() => this.setState({ dateModal: true })}>
                                <Text style={Styles.inactiveFilterText}>
                                    {customTranslate('ml_EarnedDate')}
                                </Text>
                            </TouchableOpacity>
                            {width > 450 && (
                                <View style={{ width: 250, marginLeft: 'auto' }}>
                                    <SearchBar
                                        placeholder={customTranslate('ml_Search')}
                                        onChange={(text) => {
                                            this.handleSearch(text);
                                        }}
                                        styles={SearchBarOverrides}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                    {this.state.bonuses.length ? (
                        <View style={{ alignItems: 'center', paddingBottom: 160 }}>
                            <FlatList
                                numColumns={width > 450 ? 2 : 1}
                                onRefresh={() => {
                                    this.setState({ reloading: true, allBonuses: [], bonuses: [] });
                                    this.getBonuses();
                                }}
                                refreshing={this.state.reloading}
                                data={this.state.bonuses}
                                renderItem={({ item }) => (
                                    <BonusCard
                                        client={this.props.client}
                                        bonus={item}
                                        currencyRate={this.props.currencyRate}
                                        currencySymbol={this.props.currencySymbol}
                                        handlePress={this.handleCardClick}
                                        currentUser={this.props.currentUser}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                onEndReachedThreshold={0.2}
                                onEndReached={() => {
                                    if (
                                        this.state.pageNumber + 1 >
                                        this.state.allBonuses.length / 10 + 1
                                    ) {
                                        return;
                                    } else {
                                        this.fetchData(this.state.pageNumber + 1);
                                    }
                                }}
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
                                    {customTranslate('ml_NoBonusAvailableYet')}
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
                                        this.getBonuses();
                                    }}>
                                    <Text style={{ color: '#fff' }}>{customTranslate('ml_Refresh')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <Modal transparent visible={this.state.dateModal}>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.blackTransparent,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    borderRadius: 10,
                                    backgroundColor: 'white',
                                    width: width - 30,
                                    alignItems: 'center',
                                    paddingBottom: 5,
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View
                                        style={{
                                            flex: 5,
                                            paddingVertical: 5,
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: COLORS.darkGray,
                                                alignSelf: 'center',
                                                fontWeight: '600',
                                            }}>
                                            {customTranslate('ml_SelectDates')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => this.setState({ dateModal: false })}>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ alignItems: 'center', marginTop: 20 }}>
                                    <Text
                                        style={{
                                            fontWeight: '500',
                                            fontSize: 16,
                                            marginBottom: 5,
                                            color: COLORS.darkGray,
                                        }}>
                                        {customTranslate('ml_Startdate')}:{' '}
                                    </Text>
                                    <DatePicker
                                        style={{ width: 200 }}
                                        date={this.state.startDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="MM-DD-YYYY"
                                        // minDate={moment().format('MM/DD/YYYY')}
                                        // maxDate={moment().format('MM/DD/YYYY')}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                backgroundColor: 'white',
                                            },
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({
                                                startDate: moment(date, 'MM-DD-YYYY'),
                                            });
                                        }}
                                    /> 
                                </View>
                                <View style={{ alignItems: 'center', marginTop: 15 }}>
                                    <Text
                                        style={{
                                            fontWeight: '500',
                                            fontSize: 16,
                                            marginBottom: 5,
                                            color: COLORS.darkGray,
                                        }}>
                                        {customTranslate('ml_Enddate')}:{' '}
                                    </Text>
                                   <DatePicker
                                        style={{ width: 200 }}
                                        date={this.state.endDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="MM-DD-YYYY"
                                        // minDate={moment().format('MM/DD/YYYY')}
                                        //maxDate="2016-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                backgroundColor: 'white',
                                            },
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            this.setState({
                                                endDate: moment(date, 'MM-DD-YYYY'),
                                            });
                                        }}
                                    /> 
                                </View>
                                <TouchableOpacity
                                    style={{ width: '95%', marginTop: 15 }}
                                    onPress={() => {
                                        this.setState({ dateModal: false });
                                        this.fetchData(1);
                                    }}>
                                    <View
                                        style={{
                                            height: 45,
                                            backgroundColor: COLORS.blue,
                                            marginVertical: 3,
                                            borderRadius: 3,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                color: COLORS.white,
                                                fontSize: 20,
                                                fontWeight: '300',
                                            }}>
                                            Apply
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ startDate: null, endDate: null })} style={{ alignSelf: 'center', marginVertical: hpx(10) }}>
                                    <Text
                                        style={{
                                            color: COLORS.hyperLink,
                                            fontSize: nf(16),
                                        }}>
                                        Clear
                                        </Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Modal transparent visible={this.state.bonusDetailModal}>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.blackTransparent,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    borderRadius: 10,
                                    backgroundColor: 'white',
                                    width: width > 450 ? 450 : width - 30,
                                    paddingBottom: 20,
                                }}>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View
                                        style={{
                                            flex: 5,
                                            paddingVertical: 5,
                                            justifyContent: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                color: COLORS.black,
                                                alignSelf: 'center',
                                                fontWeight: '600',
                                            }}>
                                            {customTranslate('ml_BonusDetails')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() =>
                                            this.setState({ bonusDetailModal: false, edit: false })
                                        }>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                </View>
                                {this.state.bonusDetail && !this.state.edit ? (
                                    <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_RecipientName')}:
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? bonusDetail.user
                                                        ? bonusDetail.user.firstName +
                                                        ' ' +
                                                        bonusDetail.user.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName
                                                    : bonusDetail.contact
                                                        ? bonusDetail.contact.firstName +
                                                        ' ' +
                                                        bonusDetail.contact.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_RecipientType')}:
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType}
                                            </Text>
                                        </View>
                                        <View style={[Styles.row, { marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_Job')}:</Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.job ? bonusDetail.job.title : null}
                                            </Text>
                                        </View>
                                        <View style={[Styles.row]}>
                                            <Text style={Styles.key}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? customTranslate('ml_ReferredCandidate')
                                                    : customTranslate('ml_ReferredBy')}
                        :
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? bonusDetail.contact
                                                        ? bonusDetail.contact.firstName +
                                                        ' ' +
                                                        bonusDetail.contact.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName
                                                    : bonusDetail.user
                                                        ? bonusDetail.user.firstName +
                                                        ' ' +
                                                        bonusDetail.user.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_BonusAmount')}:
                      </Text>
                                            <Text style={[Styles.value, { color: COLORS.green }]}>
                                                {this.props.currencySymbol +
                                                    parseInt(this.props.currencyRate) *
                                                    parseInt(bonusDetail.amountDue)}
                                            </Text>
                                        </View>
                                        <View style={[Styles.row, { marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_HiredDate')}:</Text>
                                            <Text style={Styles.value}>
                                                {moment(bonusDetail.hireDate).format('MM/DD/YYYY')}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>{customTranslate('ml_Startdate')}:</Text>
                                            <Text style={Styles.value}>
                                                {moment(bonusDetail.startDate).format('MM/DD/YYYY')}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>{customTranslate('ml_Status')}:</Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.bonusStatus}
                                            </Text>
                                        </View>
                                        <View style={[{ flexDirection: 'column', marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_BonusNotes')}:</Text>
                                            <Text
                                                style={[
                                                    Styles.value,
                                                    { marginTop: 3, fontSize: 15, textTransform: 'none' },
                                                ]}>
                                                {bonusDetail.notes}
                                            </Text>
                                        </View>
                                        {!disableManagerPermissions ? (
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 15,
                                                    height: 45,
                                                    backgroundColor: COLORS.blue,
                                                    borderRadius: 3,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    this.setState({ edit: true });
                                                }}>
                                                <Text
                                                    style={{
                                                        color: COLORS.white,
                                                        fontSize: 20,
                                                        fontWeight: '300',
                                                    }}>
                                                    {customTranslate('ml_Edit')}
                                                </Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                ) : this.state.bonusDetail && this.state.edit ? (
                                    <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_RecipientName')}:
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? bonusDetail.user
                                                        ? bonusDetail.user.firstName +
                                                        ' ' +
                                                        bonusDetail.user.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName
                                                    : bonusDetail.contact
                                                        ? bonusDetail.contact.firstName +
                                                        ' ' +
                                                        bonusDetail.contact.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_RecipientType')}:
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType}
                                            </Text>
                                        </View>
                                        <View style={[Styles.row, { marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_Job')}:</Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.job ? bonusDetail.job.title : null}
                                            </Text>
                                        </View>
                                        <View style={[Styles.row]}>
                                            <Text style={Styles.key}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? customTranslate('ml_ReferredCandidate')
                                                    : customTranslate('ml_ReferredBy')}
                        :
                      </Text>
                                            <Text style={Styles.value}>
                                                {bonusDetail.recipientType == 'employee'
                                                    ? bonusDetail.contact
                                                        ? bonusDetail.contact.firstName +
                                                        ' ' +
                                                        bonusDetail.contact.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName
                                                    : bonusDetail.user
                                                        ? bonusDetail.user.firstName +
                                                        ' ' +
                                                        bonusDetail.user.lastName
                                                        : currentUser.firstName + ' ' + currentUser.lastName}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_BonusAmount')}:
                      </Text>
                                            <TextInput
                                                style={{
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 28,
                                                    padding: 4,
                                                    justifyContent: 'center',
                                                    borderColor: COLORS.borderColor,
                                                    width: 60,
                                                }}
                                                keyboardType="number-pad"
                                                value={this.state.tempBonusDetail.amountDue.toString()}
                                                onChangeText={(val) =>
                                                    this.setState({
                                                        tempBonusDetail: {
                                                            ...this.state.tempBonusDetail,
                                                            amountDue: val,
                                                        },
                                                    })
                                                }
                                            />
                                        </View>
                                        <View style={[Styles.row, { marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_HiredDate')}:</Text>
                                            <Text style={Styles.value}>
                                                {moment(bonusDetail.hireDate).format('MM/DD/YYYY')}
                                            </Text>
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>{customTranslate('ml_Startdate')}:</Text>
                                         <DatePicker
                                                style={{ width: 130 }}
                                                date={moment(
                                                    this.state.tempBonusDetail.startDate,
                                                ).format('MM-DD-YYYY')}
                                                mode="date"
                                                placeholder="select date"
                                                showIcon={false}
                                                format="MM-DD-YYYY"
                                                minDate={moment().format('MM/DD/YYYY')}
                                                //maxDate="2016-06-01"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateInput: {
                                                        backgroundColor: 'white',
                                                        height: 30,
                                                        borderRadius: 3,
                                                    },
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => {
                                                    this.setState({
                                                        tempBonusDetail: {
                                                            ...this.state.tempBonusDetail,
                                                            startDate: moment(date, 'MM-DD-YYYY'),
                                                        },
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={[Styles.row, { marginTop: 0 }]}>
                                            <Text style={Styles.key}>
                                                {customTranslate('ml_EligibleDate')}:
                      </Text>
                                         <DatePicker
                                                style={{ width: 130 }}
                                                date={moment(
                                                    this.state.tempBonusDetail.earnedDate,
                                                ).format('MM-DD-YYYY')}
                                                mode="date"
                                                placeholder="select date"
                                                showIcon={false}
                                                format="MM-DD-YYYY"
                                                minDate={moment().format('MM/DD/YYYY')}
                                                //maxDate="2016-06-01"
                                                confirmBtnText="Confirm"
                                                cancelBtnText="Cancel"
                                                customStyles={{
                                                    dateInput: {
                                                        backgroundColor: 'white',
                                                        height: 30,
                                                        borderRadius: 3,
                                                    },
                                                    // ... You can check the source to find the other keys.
                                                }}
                                                onDateChange={(date) => {
                                                    this.setState({
                                                        tempBonusDetail: {
                                                            ...this.state.tempBonusDetail,
                                                            earnedDate: moment(date, 'MM-DD-YYYY'),
                                                        },
                                                    });
                                                }}
                                            /> 
                                        </View>
                                        <View style={Styles.row}>
                                            <Text style={Styles.key}>{customTranslate('ml_Status')}:</Text>
                                            <Menu
                                                ref={this.setEditMenuRef}
                                                button={
                                                    <TouchableOpacity
                                                        style={{
                                                            borderRadius: 3,
                                                            borderWidth: 0.5,
                                                            borderColor: COLORS.blue,
                                                            paddingHorizontal: 10,
                                                            height: 30,
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                        }}
                                                        onPress={this.showEditMenu}>
                                                        <Text
                                                            style={{
                                                                color: COLORS.blue,
                                                                marginRight: 10,
                                                                textTransform: 'capitalize',
                                                            }}>
                                                            {this.parseBonusStatus(
                                                                this.state.tempBonusDetail.bonusStatus,
                                                            )}
                                                        </Text>
                                                        <IonIcon
                                                            name="ios-arrow-down"
                                                            size={15}
                                                            color={COLORS.blue}
                                                        />
                                                    </TouchableOpacity>
                                                }>
                                                <MenuItem
                                                    onPress={() => this.handleEditStatus('pending')}>
                                                    {customTranslate('ml_Pending')}
                                                </MenuItem>
                                                <MenuItem
                                                    onPress={() =>
                                                        this.handleEditStatus('ineligibleCandidate')
                                                    }>
                                                    {customTranslate('ml_IneligibleCandidate')}
                                                </MenuItem>
                                                <MenuItem
                                                    onPress={() =>
                                                        this.handleEditStatus('ineligibleEmployee')
                                                    }>
                                                    {customTranslate('IneligibleEmployee')}
                                                </MenuItem>
                                                <MenuItem
                                                    onPress={() => this.handleEditStatus('earned')}>
                                                    {customTranslate('ml_Earned')}
                                                </MenuItem>
                                                <MenuItem onPress={() => this.handleEditStatus('paid')}>
                                                    {customTranslate('ml_Paid')}
                                                </MenuItem>
                                            </Menu>
                                        </View>
                                        <View style={[{ flexDirection: 'column', marginTop: 15 }]}>
                                            <Text style={Styles.key}>{customTranslate('ml_BonusNotes')}:</Text>
                                            <TextInput
                                                style={{
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 28,
                                                    padding: 4,
                                                    justifyContent: 'center',
                                                    borderColor: COLORS.borderColor,
                                                    marginTop: 5,
                                                    height: 70,
                                                }}
                                                scrollEnabled
                                                multiline
                                                value={this.state.tempBonusDetail.notes}
                                                onChangeText={(val) =>
                                                    this.setState({
                                                        tempBonusDetail: {
                                                            ...this.state.tempBonusDetail,
                                                            notes: val,
                                                        },
                                                    })
                                                }
                                            />
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                style={{
                                                    marginTop: 15,
                                                    height: 45,
                                                    backgroundColor: COLORS.blue,
                                                    borderRadius: 3,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    this.setState({ edit: false });
                                                    this.handleSubmit();
                                                }}>
                                                <Text
                                                    style={{
                                                        color: COLORS.white,
                                                        fontSize: 20,
                                                        fontWeight: '300',
                                                    }}>
                                                    {customTranslate('ml_Save').toString()}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : null}
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
            );
        }
    }
}
export default withApollo(Bonus);

const Styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    value: { fontWeight: '300', fontSize: 16, textTransform: 'capitalize' },
    key: { fontSize: 16, fontWeight: '600', marginRight: 5 },
    settingCard: {
        minHeight: 50,
        width: Dimensions.get('window').width - 30,
        paddingTop: 8,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    settingCardText: {
        fontSize: 18,
        marginLeft: 8,
        // color: 'black'
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
});