import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Image,
} from 'react-native';
import {
    Button,
    SearchBar,
    List,
    InputItem,
    WhiteSpace,
} from '@ant-design/react-native';
import { SearchBarOverrides } from '../my-network/my-network.styles';
import Steps from '../../_shared/components/steps/steps.component';
import { listTieredBonuses } from '../../_store/_shared/api/graphql/custom/tiered-bonuses/list-tiered-bonuses.graphql';
import moment from 'moment';
import { COLORS } from '../../_shared/styles/colors';
import { Actions } from 'react-native-router-flux';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import AddReferral from '../../_shared/components/refer-someone/add-referral-form-free-user/add-referral.component';
import _ from 'lodash';
import { listReferralsQuery } from './referrals.graphql';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';

class ManageReferrals extends Component {
    state = {
        searchTerm: '',
        nextToken: null,
        latestReferrals: [],
        pageNumber: 1,
        referrals: [],
        pageLoading: true,
        reloading: false,
        spinAnim: new Animated.Value(0),
        width: Dimensions.get('window').width,
        bonuses: [],
        steps: [
            {
                title: customTranslate('ml_Referred'),
            },
            {
                title: customTranslate('ml_Accepted'),
            },
            {
                title: customTranslate('ml_Interviewing'),
            },
            {
                title: customTranslate('ml_Hired'),
            },
        ],
    };
    componentDidMount() {
        this.addRotateEvent();
        this.getBonuses();
        this.getReferrals();
        this.spin();
    }
    componentWillUnmount() {
        this.removeRotateEvent();
    }
    addRotateEvent = () => {
        Dimensions.addEventListener('change', () => {
            this.setState({
                width: Dimensions.get('window').width,
            });
        });
    };
    removeRotateEvent = () => {
        Dimensions.removeEventListener('change');
    };
    componentDidUpdate(prevProps, prevState) {
        if (this.state.nextToken && prevState.nextToken != this.state.nextToken) {
            this.getReferrals();
        }
    }
    handleSearch = (text) => {
        this.setState(
            {
                searchTerm: text,
            },
            () => this.fetchData(1),
        );
    };
    mapBonus = (job) => {
        let finalBonus = null;
        if (job) {
            let bonus = job.referralBonus ? JSON.parse(job.referralBonus) : null;
            if (bonus) {
                if (bonus.amount) {
                    finalBonus = bonus.amount;
                }
                if (bonus.tieredBonusId) {
                    finalBonus = this.state.bonuses.filter(
                        (item) => item.id === bonus.tieredBonusId,
                    )[0];
                    finalBonus = finalBonus ? finalBonus.name : '';
                }
            }
        }
        return finalBonus;
    };
    getReferrals = () => {
        this.props.client
            .query({
                query: listReferralsQuery,
                variables: {
                    filter: {
                        companyId: { eq: this.props.currentUser.companyId },
                    },
                    limit: 10000,
                    nextToken: this.state.nextToken ? this.state.nextToken : null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                if (res.data.listReferrals && res.data.listReferrals.items) {
                    this.setState(
                        {
                            latestReferrals: [
                                ...this.state.latestReferrals,
                                ...res.data.listReferrals.items,
                            ],
                            nextToken: res.data.listReferrals.nextToken,
                        },
                        () => {
                            this.fetchData(1);
                            if (!res.data.listReferrals.nextToken) {
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
    getBonuses = () => {
        this.props.client
            .query({
                query: gql(listTieredBonuses),
                variables: {
                    filter: { companyId: { eq: this.props.currentUser.companyId } },
                    limit: 1000,
                    nextToken: null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                console.log('resss', res);
                if (res.data && res.data.listTieredBonuses) {
                    this.setState({ bonuses: res.data.listTieredBonuses.items });
                }
            });
    };
    renderHeader = () => {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.grayMedium,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                        }}>
                        Candidate
                    </Text>
                </View>
                <View style={{ flex: 1.2 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.grayMedium,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                        }}>
                        Job
                    </Text>
                </View>
                <View style={{ flex: 0.8 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.grayMedium,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                        }}>
                        Date Referred
                    </Text>
                </View>
                <View style={{ flex: 0.8 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.grayMedium,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                        }}>
                        Status
                    </Text>
                </View>
                {this.state.width > 1000 && (
                    <View style={{ flex: 0.9 }}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: COLORS.grayMedium,
                                textTransform: 'capitalize',
                                fontWeight: '600',
                            }}>
                            Bonus
                        </Text>
                    </View>
                )}
                {this.state.width > 1000 && (
                    <View style={{ flex: 0.8 }}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: COLORS.grayMedium,
                                textTransform: 'capitalize',
                                fontWeight: '600',
                            }}>
                            Date Hired
                        </Text>
                    </View>
                )}

                <View style={{ flex: 0.9 }}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: COLORS.grayMedium,
                            textTransform: 'capitalize',
                            fontWeight: '600',
                        }}>
                        Referred By
                    </Text>
                </View>
            </View>
        );
    };
    referralStatus = (status) => {
        console.log("ref status", status);
        switch (status.toLowerCase()) {
            case 'referred':
                return {
                    status: customTranslate('ml_Referred'),
                    stepIndex: 0,
                };
            case 'accepted':
                return {
                    status: customTranslate('ml_Accepted'),
                    stepIndex: 1,
                };
            case 'interviewing':
                return {
                    status: customTranslate('ml_Interviewing'),
                    stepIndex: 2,
                };
            case 'hired':
                return {
                    status: customTranslate('ml_Hired'),
                    stepIndex: 3,
                };
            case 'nothired':
                return {
                    status: customTranslate('ml_NotHired'),
                    stepIndex: 4,
                };
            case 'inactive':
                return {
                    status: customTranslate('ml_NotHired'),
                    stepIndex: 4,
                };
            case 'noresponse':
                return {
                    status: customTranslate('ml_NotHired'),
                    stepIndex: 4,
                };
            case 'transferred':
                return {
                    status: customTranslate('ml_Transferred'),
                    stepIndex: 4,
                };
            default:
                return { status: customTranslate('ml_Referred'), stepIndex: 0 };
        }
    };
    renderReferralRow = ({ item }) => {
        let width = this.state.width;
        if (width > 450) {
            return (
                <TouchableOpacity
                    style={{
                        backgroundColor: '#fff',
                        borderBottomColor: '#ddd',
                        borderBottomWidth: 0.5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                    }}
                    onPress={() =>
                        Actions.referralDetail({
                            referralId: item.id,
                        })
                    }
                    key={item.id}>
                    <View style={{ flex: 1 }}>
                        {item.contact ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>{`${item.contact.firstName} ${item.contact.lastName}`}</Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</Text>
                        )}
                    </View>
                    <View style={{ flex: 1.2 }}>
                        {item.job ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>
                                {item?.job?.title}
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>
                                {''}
                            </Text>
                        )}
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: COLORS.grayMedium,
                            }}>
                            {moment(item.referralDate).format('MM/DD/YYYY')}
                        </Text>
                    </View>
                    <View style={{ flex: 0.8 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: COLORS.grayMedium,
                                textTransform: 'capitalize',
                            }}>
                            {this.referralStatus(item.status).status}
                        </Text>
                    </View>
                    {this.state.width > 1000 && (
                        <View style={{ flex: 0.9 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.dashboardGreen,
                                    textTransform: 'capitalize',
                                }}>
                                {this.mapBonus(item.job)}
                            </Text>
                        </View>
                    )}
                    {this.state.width > 1000 && (
                        <View style={{ flex: 0.8 }}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.grayMedium,
                                }}>
                                {moment(item.referralDate).format('MM/DD/YYYY')}
                            </Text>
                        </View>
                    )}
                    <View style={{ flex: 0.9 }}>
                        {item.user ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity
                style={{
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 0.5,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    padding: 10,
                    margin: 5,
                }}
                onPress={() =>
                    Actions.referralDetail({
                        referralId: item.id,
                    })
                }
                key={item.id}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {item.contact ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: 'black',
                                    marginBottom: 3,
                                }}>{`${item.contact.firstName} ${item.contact.lastName}`}</Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                    marginBottom: 3,
                                }}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</Text>
                        )}
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '500',
                                color: COLORS.blue,
                            }}>
                            {item?.job?.title}
                        </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: COLORS.dashboardGreen,
                                textTransform: 'capitalize',
                                marginBottom: 3,
                            }}>
                            {this.mapBonus(item.job)}
                        </Text>
                        <Text
                            style={{
                                fontSize: 14,
                                color: COLORS.grayMedium,
                            }}>
                            {moment(item.referralDate).format('MM/DD/YYYY')}
                        </Text>
                    </View>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Steps
                        steps={
                            [
                                {
                                    title: customTranslate('ml_Referred'),
                                },
                                {
                                    title: customTranslate('ml_Accepted'),
                                },
                                {
                                    title: customTranslate('ml_Interviewing'),
                                },
                                {
                                    title: this.parseFinalStatus(item.status)
                                }
                            ]
                        }
                        status={this.referralStatus(item.status)}
                        //updateStatus={this.updateReferral}
                        noJob={false}
                        referralStatusLabel={this.props.currentUser.company.referralStatus}
                    //disableManagerPermissions={disableManagerPermissions}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: COLORS.grayMedium, fontWeight: '600' }}>
                        Referred By:{' '}
                        {item.user ? (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                }}>{`${item.user.firstName} ${item.user.lastName}`}</Text>
                        ) : (
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: '500',
                                    color: COLORS.blue,
                                }}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</Text>
                        )}
                    </Text>
                    <Text style={{ color: COLORS.grayMedium }}>
                        {this.referralStatus(item.status).status}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    getStatusString = (status) => {
        switch (status.toLowerCase()) {
            case 'referred':
                return customTranslate('ml_Referred');
            case 'accepted':
                return customTranslate('ml_Accepted');
            case 'interviewing':
                return (
                    this.props.currentUser.company.referralStatus ||
                    customTranslate('ml_Interviewing')
                );
            case 'hired':
                return customTranslate('ml_Hired');
            case 'noresponse':
                return customTranslate('ml_NoResponse');
            case 'inactive':
                return 'Inactive';
            case 'nothired':
                return customTranslate('ml_NotHired');
            case 'transferred':
                return customTranslate('ml_Transferred');

            default:
                return null;
        }
    };
    fetchData = (pageNumber) => {
        //this.setState({ pageLoading: true });

        let newArr = _.sortBy(
            this.filterJobs(this.state.searchTerm),
            'referralDate',
        ).reverse();
        let fromIndex = (pageNumber - 1) * 20;
        let toIndex = fromIndex + 20;
        let pageReferrals = newArr.slice(fromIndex, toIndex);
        if (pageNumber == 1) {
            this.setState({ pageNumber: pageNumber, referrals: pageReferrals });
        } else {
            this.setState({
                pageNumber: pageNumber,
                referrals: [...this.state.referrals, ...pageReferrals],
                // pageLoading: false,
            });
        }
    };
    filterJobs = (searchTerm) => {
        if (searchTerm) {
            return this.state.latestReferrals.filter((ref) => {
                const contactName = ref.contact
                    ? `${ref.contact.firstName} ${ref.contact.lastName}`
                    : `${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`;
                if (contactName) {
                    return (
                        contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                    );
                }
            });
        }
        return this.state.latestReferrals;
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
    parseFinalStatus = (status) => {
        switch (status) {
            case 'notHired':
                return customTranslate('ml_NotHired');
            case 'declined':
                return customTranslate('ml_Declined');
            case 'noresponse':
                return customTranslate('ml_NoResponse');
            case 'inactive':
                return customTranslate('ml_Inactive');
            case 'ineligible':
                return customTranslate('ml_Ineligible');
            case 'transferred':
                return customTranslate('ml_Transferred')
            default:
                return customTranslate('ml_Hired');
        }
    };
    render() {
        let width = this.state.width;
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            company: { symbol, theme },
        } = this.props.currentUser;
        theme = theme ? JSON.parse(theme) : {};

        return (
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: width > 450 ? 'row' : 'column',
                        padding: width > 450 ? 10 : 0,
                    }}>
                    {this.props.currentUser.company.accountType === 'free' && (
                        <AddReferral
                            bonuses={this.state.bonuses}
                            currentUser={this.props.currentUser}
                            getBonus={this.getBonuses}
                            width={width}
                        />
                    )}

                    <SearchBar
                        placeholder={customTranslate('ml_Search')}
                        value={this.state.searchTerm}
                        onChange={(text) => {
                            this.handleSearch(text);
                        }}
                        styles={SearchBarOverrides}
                        style={width > 450 && { maxWidth: 200 }}
                    />
                </View>
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
                ) : this.state.referrals && this.state.referrals.length > 0 ? (
                    <View style={{ flex: 1 }}>
                        {this.state.width > 450 && this.renderHeader()}
                        <FlatList
                            style={{ flex: 1 }}
                            data={this.state.referrals}
                            renderItem={this.renderReferralRow}
                            onEndReached={() => {
                                if (
                                    this.state.pageNumber + 1 >
                                    this.state.latestReferrals.length / 20 + 1
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
                                this.setState({ reloading: true, latestReferrals: [] });
                                this.getReferrals();
                            }}
                            refreshing={this.state.reloading}
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
                                You do not have any referrals. Click{' '}
                                <Text style={{ fontWeight: 'bold' }}>Add Referral</Text> to create
                                your first referral.
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
                                    this.getReferrals();
                                }}>
                                <Text style={{ color: '#fff' }}>Refresh</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default withApollo(ManageReferrals);
