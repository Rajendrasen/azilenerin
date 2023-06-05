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
} from 'react-native';
import { SearchBar, ActivityIndicator } from '@ant-design/react-native';
import GDPRFlash from '../../_shared/components/gdpr-flash/gdpr-flash.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import _ from 'lodash';
import ReferralCard from './referral-items/referral-card.container';
import { ListReferralsDashboard } from '../../_store/_shared/api/graphql/custom/referrals/referralsWithContactAndJob.graphql';
import EmptyScene from '../empty-scene/empty-scene.component';
import { styles, SearchBarOverrides } from './referrals.style';
import { withApollo } from 'react-apollo';
import { getAppName } from '../../WhiteLabelConfig';
import { COLORS } from '../../_shared/styles/colors';
import { downloadFromS3 } from '../../common';
import { get } from 'lodash';
import { queryWebNotificationsReferrals } from '../../_store/_shared/api/graphql/custom/users/query-webnotifications-by-userid.graphql';
import {
    calculateReferralBonusTotal,
    calculateTotalBonuses,
} from '../../_shared/services/utils';
import { ContactDetails } from '../../_shared/components/viewContact/ViewContactContainer';
import Icons from 'react-native-vector-icons/Ionicons';
import { ReferralModal } from '../../_shared/components/on-deck/OnDeckModalContainer';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';
import { searchReferralsDataNetwork } from './referral-items/referralFunctions';
import { queryReferralsByUserIdIndex } from '../../_store/_shared/api/graphql/custom/referrals/referral-by-userid-index.graphql';
import { ReferralFormComponent } from '../../_shared/components/on-deck/ReferralForm';

let { width } = Dimensions.get('window');

class Referrals extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            totalBonus: 0,
            referrals: null,
            pageNumber: 1,
            pageLoading: true,
            spinAnim: new Animated.Value(0),
            viewContactModal: false,
            viewContact: '',
            fullContactData: '',
            nextToken: null,
            latestReferrals: [],
            reloading: false,
            width: Dimensions.get('window').width,
            gdprReferrals: [],
        };
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.nextToken && this.state.nextToken != prevState.nextToken)
            this.getReferrals();
    }
    componentDidMount() {
        Dimensions.addEventListener('change', () => {
            this.setState({
                width: Dimensions.get('window').width,
            });
        });
        this.spin();
        this.getReferrals();
        // this.getReferralsFromApi()
        //this.getGDPRReferrals();
        //setTimeout(() => this.fetchData(1), 4000);
    }
    componentWillUnmount() {
        Dimensions.removeEventListener('change');
    }
    getGDPRReferrals = () => {
        this.props.client
            .query({
                query: queryWebNotificationsReferrals,
                variables: {
                    type: 'referralRequested',
                    userId: this.props.currentUser.id,
                },
            })
            .then((res) => {
                this.setState({
                    gdprReferrals: get(
                        res,
                        'data.queryWebNotificationsByUserIdIndex.items',
                        [],
                    ).filter(
                        (notification) =>
                            notification.type === 'gdprReferralCreated' &&
                            get(notification, 'user.id') === this.props.currentUser.id &&
                            get(notification, 'status') === 'referred',
                    ),
                });
            });
    };

    getReferralsFromQuery = () => {
        this.props.client
            .query({
                query: queryReferralsByUserIdIndex,
                variables: {
                    userId: this.props.currentUser.id,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                //console.log("response of the get referrals", res.data.listReferrals.items[0])
                // let result = res.data.listReferrals.items.find((x) => x.id == 'af30b277-e66d-4ba2-b0d7-4e3f455c0898');
                console.log("result is ", res?.data?.queryReferralsByUserIdIndex?.items[0]);
                let items = res?.data?.queryReferralsByUserIdIndex?.items

                // items?.map((item) => {
                //     Object.assign(item.job, { 'contactIncentiveBonus': 0 })
                //     return item
                // })
                // Object.keys().
                // items?.map((referral) => {
                //     let bonus = get(referral, 'job.referralBonus');
                //     if (bonus && typeof bonus === 'string') {
                //         referral.job.referralBonus = JSON.parse(referral.job.referralBonus)
                //     }
                // })
                // this.setState({
                //     latestReferrals: items,
                //     pageLoading: false,
                // })
                // //this.fetchData(1);
                // console.log("item", items[0]);
                // this.setState({
                //     latestReferrals: items,
                //     pageLoading: false,
                //     // listReferrals: res?.data?.queryReferralsByUserIdIndex?.items, 
                // })
                this.setState(
                    {
                        latestReferrals: [
                            ...this.state.latestReferrals,
                            ...get(res, 'data.queryReferralsByUserIdIndex.items', []).filter(
                                (item) => item.referralType != 'self',
                            ),
                        ],
                        nextToken: res.data.queryReferralsByUserIdIndex.nextToken,
                    },
                    () => {
                        // console.log(this.state.latestReferrals.length)
                        if (
                            this.state.latestReferrals &&
                            this.state.latestReferrals.length &&
                            !res.data.queryReferralsByUserIdIndex?.nextToken
                        ) {
                            this.fetchData(1);
                        }
                        if (getAppName() == 'Erin') {
                            this.setState({ referrals: this.state.latestReferrals })
                        }
                        // if (this.state.latestReferrals.length >= 2) {
                        //     this.fetchData(1);
                        // }
                    },
                );


                // setTimeout(() => {
                //     console.log("latestReferrals", this.state.latestReferrals)
                // }, 5000);
                // console.log("referrals", this.state.referrals)
                if (!res.data.queryReferralsByUserIdIndex?.nextToken) {
                    this.setState({
                        pageLoading: false,
                        reloading: false,
                    });
                }
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({ pageLoading: false, reloading: false });
            });
    }

    getReferralsFromOld = () => {
        this.props.client
            .query({
                query: ListReferralsDashboard,
                variables: {
                    filter: {
                        userId: { eq: this.props.currentUser.id },
                    },
                    limit: 10000,
                    nextToken: this.state.nextToken ? this.state.nextToken : null,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                this.setState(
                    {
                        latestReferrals: [
                            ...this.state.latestReferrals,
                            ...get(res, 'data.listReferrals.items', []).filter(
                                (item) => item.referralType != 'self',
                            ),
                        ],
                        nextToken: res.data.listReferrals.nextToken,
                    },
                    () => {
                        if (
                            this.state.latestReferrals &&
                            this.state.latestReferrals.length &&
                            !res.data.listReferrals.nextToken
                        ) {
                            this.fetchData(1);
                        }
                    },
                );
                if (!res.data.listReferrals.nextToken) {
                    this.setState({
                        pageLoading: false,
                        reloading: false,
                    });
                }
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({ pageLoading: false, reloading: false });
            });
    };

    getReferrals = () => {
        //this.getReferralsFromApi()
        this.getReferralsFromQuery();
        // this.getReferralsFromOld()
    };

    getReferralsFromApi = () => {

        let qry = '';
        let query = {
            query: qry,
            filters: {
                all: [
                    {
                        user_id: this.props.currentUser.id
                        // company_id: this.props.currentUser.company.id
                    },
                ],
                any: [],
                none: [],
            },
            page: {
                size: 1000
            },
        };
        try {
            fetch('https://host-b93sm9.api.swiftype.com/api/as/v1/engines/erin-referrals/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer search-c8iq6284cm17eu79wu8podg7',
                },
                body: JSON.stringify(query)
            }).then((response) => response.json())
                .then((responseData) => {

                    let allData = []
                    // console.log("blank", responseData?.results[0]);
                    // responseData?.results?.map((item) => {
                    //     let newRef = {
                    //         companyId: get(item, 'company_id.raw'),
                    //         contact: {
                    //             id: get(item, 'contact_id.raw'),
                    //             firstName: get(item, 'contact_first_name.raw'),
                    //             lastName: get(item, 'contact_last_name.raw'),
                    //             employeeId: get(item, 'contact_employee_id.raw'),
                    //             emailAddress: get(item, 'contact_email_address.raw'),
                    //             phoneNumber: get(item, 'contact_phone_number.raw'),
                    //         },

                    //     }
                    //     allData.push(newRef)
                    //     this.setState({ referrals: allData })
                    //     console.log(allData)
                    // })
                    console.log("initial", responseData?.results[0]);
                    responseData.results?.forEach((ref) => {
                        const resume = JSON.parse(get(ref, 'contact_resume.raw', '{}'));
                        const contactResume = get(resume, 'key') ? resume : null;
                        let newRef = {
                            //bonusStatus: get(ref, 'status.raw'),
                            companyId: get(ref, 'company_id.raw'),

                            contact: {
                                id: get(ref, 'contact_id.raw'),
                                firstName: get(ref, 'contact_first_name.raw'),
                                lastName: get(ref, 'contact_last_name.raw'),
                                employeeId: get(ref, 'contact_employee_id.raw'),
                                emailAddress: get(ref, 'contact_email_address.raw'),
                                phoneNumber: get(ref, 'contact_phone_number.raw'),
                            },
                            contactId: get(ref, 'contact_id.raw'),
                            contactResume,
                            customStatus: get(ref, 'custom_status.raw'),
                            diversityHire: get(ref, 'diversity_hire.raw') === 'true' ? true : false,
                            hireDate: get(ref, 'date_hired.raw'),
                            id: get(ref, 'id.raw'),
                            job: {
                                id: get(ref, 'job_id.raw'),
                                title: get(ref, 'job_title.raw'),
                                hiringManager: get(ref, 'hiring_manager_id.raw'),
                                tieredBonusId: get(ref, 'tiered_bonus_id.raw'),
                                tieredBonus: {
                                    id: get(ref, 'tiered_bonus_id.raw'),
                                    name: get(ref, 'tiered_bonus_name.raw'),
                                    tiers: get(ref, 'tiered_bonus_tiers.raw'),
                                },
                                referralBonus: JSON.stringify({
                                    tieredBonusId: get(ref, 'tiered_bonus_id.raw'),
                                    hasBonus: true

                                }),

                                company: {
                                    contactIncentiveBonus: 10
                                },
                                subCompanyId: get(ref, 'sub_company_id'),
                                // referralBonus: get(ref, 'job.referralBonus')
                            },
                            bonus: {
                                amount: get(ref, 'bonus_amount.raw'),
                                tieredBonusId: get(ref, 'tiered_bonus_id.raw'),
                            },
                            jobId: get(ref, 'job_id.raw'),
                            message: get(ref, 'message.raw', null),
                            note: get(ref, 'note.raw'),
                            referralDate: get(ref, 'date_referred.raw'),
                            referralType: get(ref, 'referral_type.raw'),
                            status: get(ref, 'status.raw'),
                            user: {
                                id: get(ref, 'user_id.raw'),
                                firstName: get(ref, 'user_first_name.raw'),
                                lastName: get(ref, 'user_last_name.raw'),
                                employeeId: get(ref, 'contact_employee_id.raw'),
                                //incentiveEligible: true,
                                //userGroupId:  get(ref, 'tiered_bonus_tiers.raw'),
                            },
                            userId: get(ref, 'user_id.raw'),
                            referralSource: get(ref, 'referral_source.raw'),
                        };
                        if (get(ref, 'retro_tiered_bonus_id.raw')) {
                            newRef.tieredBonusId = get(ref, 'retro_tiered_bonus_id.raw');
                            let retroTieredBonus = {
                                id: get(ref, 'retro_tiered_bonus_id.raw'),
                                name: get(ref, 'retro_tiered_bonus_name.raw'),
                                tiers: get(ref, 'retro_tiered_bonus_tiers.raw'),
                            };
                            newRef.tieredBonus = retroTieredBonus;
                        }
                        if (get(ref, 'campaign_id.raw')) {
                            newRef.campaignId = get(ref, 'campaign_id.raw');
                            newRef.campaign = {
                                id: get(ref, 'campaign_id.raw'),
                                archived: get(ref, 'campaign_archived.raw'),
                                name: get(ref, 'campaign_name.raw'),
                                startDate: get(ref, 'campaign_start_date.raw'),
                                endDate: get(ref, 'campaign_end_date.raw'),
                                tieredBonusId: get(ref, 'campaign_tiered_bonus_id.raw'),
                                tieredBonus: {
                                    id: get(ref, 'campaign_tiered_bonus_id.raw'),
                                    name: get(ref, 'campaign_tiered_bonus_name.raw'),
                                    tiers: get(ref, 'campaign_tiered_bonus_tiers.raw'),
                                },
                            };
                        }
                        allData.push(newRef);

                    });
                    console.log("new ref", allData[0]);

                    this.setState({
                        referrals: allData, pageLoading: false,
                        reloading: false,
                    })
                })
        } catch (error) {
            console.error(error);
        }
    }



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
            'referralDate',
        ).reverse();
        let fromIndex = (pageNumber - 1) * 10;
        let toIndex = fromIndex + 10;
        let pageReferrals = newArr.slice(fromIndex, toIndex);
        if (pageNumber == 1) {
            this.setState({
                pageNumber: pageNumber,
                referrals: pageReferrals,
                pageLoading: false,
            });
        } else {
            this.setState((state) => ({
                pageNumber: pageNumber,
                referrals: [...this.state.referrals, ...pageReferrals],
                pageLoading: state.nextToken ? true : false,
            }));
        }
    };

    // componentWillMount() {
    //   let total = 0;
    //   if (this.props.referrals) {
    //     this.props.referrals.forEach(referral => {
    //       let job = referral.job;
    //       if (job) {
    //         job = Object.assign(job, JSON.parse(job.referralBonus));
    //       }
    //       var refer = JSON.parse(job.referralBonus);
    //       if (
    //         referral.status === 'hired' &&
    //         referral.job !== null &&
    //         refer &&
    //         referral.referralType !== 'self'
    //       ) {
    //         const isEligible = referral.contact && referral.contact.length >= 10;
    //         let amount = isEligible
    //           ? refer.amount
    //           : refer.amount - referral.company.contactIncentiveBonus;
    //         total += parseInt(amount, 10);
    //       }
    //     });
    //     this.setState({
    //       totalBonus: total,
    //     });
    //     return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //   }
    // }

    fetchDataOnRefresh = () => {
        setTimeout(() => this.fetchData(1), 10);
    };
    filterReferrals(searchTerm) {
        if (searchTerm) {
            return this.state.latestReferrals.filter((ref) => {
                const contactName = ref.contact
                    ? `${ref.contact.firstName} ${ref.contact.lastName}`
                    : null;
                if (contactName) {
                    return (
                        contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
                        ref.job.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                    );
                }
            });
        }
        if (this.state.latestReferrals) {
            return this.state.latestReferrals;
        }
        return null;
    }
    handleSearch = (text) => {
        this.setState({
            searchTerm: text,
        });
        this.fetchData(1);
    };

    handleReferContactDetail = (item) => {

        this.setState({
            viewContactModal: true,
            viewContact: item,
            fullContactData: item?.fullContactData && JSON.parse(item?.fullContactData),
        });
    };
    closeViewContactModal = () => {
        this.setState({ viewContactModal: false });
    };
    render() {
        let width = this.state.width;
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            currentUser: {
                company: { enableGeneralReferrals, symbol, theme },
            },
        } = this.props;
        theme = theme ? JSON.parse(theme) : {};
        if (this.state.pageLoading) {
            return (
                <View style={{ flex: 1 }}>
                    {/* {enableGeneralReferrals && <ReferralModal />} */}
                    {/* <GDPRFlash show={this.props.currentUser.company.confirmCompliance} /> */}
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                </View>
            );
        } else if (!this.state.referrals || !this.state.referrals.length) {
            return (
                <View>
                    {/* {enableGeneralReferrals && <ReferralModal />} */}
                    {/* <GDPRFlash show={this.props.currentUser.company.confirmCompliance} /> */}

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
                                this.setState({ pageLoading: true, latestReferrals: [] });
                                this.getReferrals();
                            }}>
                            <Text style={{ color: '#fff' }}>Refresh</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            const { searchTerm } = this.state;
            return (
                <View style={[styles.container, { flex: 1 }]}>
                    {width > 450 ? (
                        <React.Fragment>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    justifyContent: 'space-between',
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                }}>
                                {/* {enableGeneralReferrals && (
                  <View>
                    <ReferralModal />
                  </View>
                )} */}
                                {this.props.currentUser.company.hideBonus
                                    ? null
                                    : // <View style={{alignSelf: width > 450 ? 'flex-end' : 'auto'}}>
                                    //   <View>
                                    //     <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    //       <View
                                    //         style={{
                                    //           flexDirection: 'row',
                                    //           alignItems: 'center',
                                    //           marginRight: 8,
                                    //         }}>
                                    //         <Text
                                    //           style={{
                                    //             color: COLORS.black,
                                    //             paddingLeft: 0,
                                    //             fontSize: 17,
                                    //             fontWeight: 'bold',
                                    //           }}>
                                    //           {customTranslate('ml_Total')}:{' '}
                                    //         </Text>

                                    //         <Text
                                    //           style={[
                                    //             {color: COLORS.black},
                                    //             {
                                    //               color: 'green',
                                    //               fontSize: 18,
                                    //               fontWeight: 'bold',
                                    //             },
                                    //           ]}>
                                    //           {this.props.currencySymbol}
                                    //           {calculateTotalBonuses(
                                    //             this.props.referralBonuses,
                                    //             false,
                                    //             this.props.currencyRate,
                                    //           )}
                                    //         </Text>
                                    //       </View>
                                    //       <View
                                    //         style={{flexDirection: 'row', alignItems: 'center'}}>
                                    //         <Text
                                    //           style={{
                                    //             color: COLORS.black,
                                    //             fontSize: 17,
                                    //             fontWeight: 'bold',
                                    //           }}>
                                    //           {customTranslate('ml_Referrals_TotalEarned')}:{' '}
                                    //         </Text>

                                    //         <Text
                                    //           style={[
                                    //             {color: COLORS.black},
                                    //             {
                                    //               color: 'green',
                                    //               fontSize: 18,
                                    //               fontWeight: 'bold',
                                    //             },
                                    //           ]}>
                                    //           {this.props.currencySymbol}
                                    //           {calculateTotalBonuses(
                                    //             this.props.referralBonuses,
                                    //             true,
                                    //             this.props.currencyRate,
                                    //           )}
                                    //         </Text>
                                    //       </View>
                                    //     </View>

                                    //     <Text
                                    //       style={{
                                    //         color: COLORS.lightGray,
                                    //         paddingHorizontal: 0,
                                    //         paddingTop: 3,
                                    //       }}>
                                    //       {customTranslate('ml_Referrals_DaysPolicy')}
                                    //     </Text>
                                    //   </View>
                                    // </View>
                                    null}
                            </View>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {/* {enableGeneralReferrals && <ReferralModal />} */}
                            {/* <SearchBar
                placeholder={customTranslate('ml_Search')}
                onChange={(text) => {
                  this.handleSearch(text);
                }}
                styles={SearchBarOverrides}
              /> */}
                        </React.Fragment>
                    )}
                    {
                        width < 450 &&
                            this.props.currentUser.company.hideBonus &&
                            this.props.currentUser.role == 'employee'
                            ? null
                            : null
                        // <View style={Styles.settingCard}>
                        //   <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        //     <View
                        //       style={{
                        //         flexDirection: 'row',
                        //         alignItems: 'center',
                        //         marginRight: 8,
                        //       }}>
                        //       <Text
                        //         style={{
                        //           color: COLORS.black,
                        //           paddingLeft: 0,
                        //           fontSize: 17,
                        //           fontWeight: 'bold',
                        //         }}>
                        //         {customTranslate('ml_Total')}:{' '}
                        //       </Text>

                        //       <Text
                        //         style={[
                        //           {color: COLORS.black},
                        //           {color: 'green', fontSize: 18, fontWeight: 'bold'},
                        //         ]}>
                        //         {this.props.currencySymbol}
                        //         {calculateTotalBonuses(
                        //           this.props.referralBonuses,
                        //           false,
                        //           this.props.currencyRate,
                        //         )}
                        //       </Text>
                        //     </View>
                        //     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        //       <Text
                        //         style={{
                        //           color: COLORS.black,
                        //           fontSize: 17,
                        //           fontWeight: 'bold',
                        //         }}>
                        //         {customTranslate('ml_Referrals_TotalEarned')}:{' '}
                        //       </Text>

                        //       <Text
                        //         style={[
                        //           {color: COLORS.black},
                        //           {color: 'green', fontSize: 18, fontWeight: 'bold'},
                        //         ]}>
                        //         {this.props.currencySymbol}
                        //         {calculateTotalBonuses(
                        //           this.props.referralBonuses,
                        //           true,
                        //           this.props.currencyRate,
                        //         )}
                        //       </Text>
                        //     </View>
                        //   </View>

                        //   <Text
                        //     style={{
                        //       color: COLORS.lightGray,
                        //       paddingHorizontal: 0,
                        //       paddingTop: 3,
                        //     }}>
                        //     {customTranslate('ml_Referrals_DaysPolicy')}
                        //   </Text>
                        // </View>
                    }
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        {/* <GDPRFlash
                            show={this.props.currentUser.company.confirmCompliance}
                        /> */}
                        <FlatList
                            key={this.state.width}
                            numColumns={
                                this.state.width > 450 ? Math.floor(this.state.width / 320) : 1
                            }
                            columnWrapperStyle={
                                width > 450 ? { justifyContent: 'center' } : false
                            }
                            style={{ width: '100%' }}
                            contentContainerStyle={{
                                width: '100%',
                            }}
                            onRefresh={() => {
                                this.setState({ reloading: true, latestReferrals: [] });
                                this.getReferrals();
                            }}
                            refreshing={this.state.reloading}
                            data={this.state.referrals}
                            renderItem={({ item }) => (
                                // <View style={{ borderWidth: 1, height: 50, width: '100%' }}>
                                //     {/* {console.log(item.bonus)} */}
                                //     <Text>{item.id}</Text>
                                // </View>
                                <ReferralCard
                                    client={this.props.client}
                                    referral={item}
                                    handleContactPress={this.handleReferContactDetail}
                                    width={this.state.width}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            onEndReachedThreshold={0.2}
                            onEndReached={() => {
                                if (
                                    this.state.pageNumber + 1 >
                                    this.state.latestReferrals.length / 10 + 1
                                ) {
                                    return;
                                } else {
                                    this.fetchData(this.state.pageNumber + 1);
                                }
                            }}
                        />
                        <ContactDetails
                            visible={this.state.viewContactModal}
                            closeViewContact={this.closeViewContactModal}
                            details={this.state.viewContact}
                            fullData={this.state.fullContactData}
                        />
                    </View>
                </View>
            );
        }
    }
}
export default withApollo(Referrals);

const Styles = StyleSheet.create({
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
});
