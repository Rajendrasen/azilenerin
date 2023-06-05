import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Alert,
    Animated,
    Easing,
    Modal,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Image,
    Clipboard,
} from 'react-native';
import { WhiteSpace } from '@ant-design/react-native';
import _ from 'lodash';
import get from 'lodash/get';
import format from 'date-fns/format';
import { Actions } from 'react-native-router-flux';
import Steps from '../../../_shared/components/steps/steps.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { styles } from './referral-card.styles';
import { COLORS } from '../../../_shared/styles/colors';
import { withApollo } from 'react-apollo';
import { JobMatchesByJobId } from '../../../_store/_shared/api/graphql/custom/jobMatch/jobmatch-by-jobId-graphql';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { ListJobs } from '../../../_store/_shared/api/graphql/custom/jobs/jobs-by-companyId.graphql.js';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
//import Dimensions from 'Dimensions';
import { compose } from '../../../_shared/services/utils';
import { withGetTieredBonus } from '../../../_store/_shared/api/components/tiered-bonuses';
import { queryBonusByReferralIdIndex } from '../../../_store/_shared/api/graphql/custom/bonuses/query-bonus-by-referral-id.graphql';
const { width, height } = Dimensions.get('window');
import { calculateReferralBonus } from '../../../_shared/services/utils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import BonusTiered from '../../tiered-bonus/tiered-bonus.component';
import gql from 'graphql-tag';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { getDomain, getErinSquare } from '../../../WhiteLabelConfig';
var referralBonus = '';

class ReferralCard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                {
                    title: customTranslate('ml_Referred'),
                },
                {
                    title: customTranslate('ml_Accepted'),
                },
            ],
            referralBonus: '',
            totalReferralAmount: '',
            spinAnim: new Animated.Value(0),
            startDate: moment(),
            hireModal: false,
            closeJob: false,
            updateAsNotHired: false,
            radius: new Animated.Value(3),
            width: new Animated.Value(width - 50),
            showProgress: false,
            progress: 0,
            success: false,
            bonusDetailModal: false,
            bonusDetails: '',
        };
    }

    _menu = null;

    setMenuRef = (ref) => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
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

    componentDidMount() {
        // console.log('props of referral card', this.props);
        this.spin();
        // var refer = JSON.parse(this.props.referral.job.referralBonus);
        // const programActive =
        //   this.props.referral.company.contactIncentiveBonus &&
        //   this.props.referral.company.contactIncentiveBonus > 0;
        // const isEligible = this.props.referral.contact && this.props.referral.contact.length >= 10;
        // if (!refer.amount || refer.amount === 0) {
        // } else if (!programActive) {
        //   this.setState({
        //     totalReferralAmount: refer.amount,
        //   });
        // } else if (programActive && isEligible) {
        //   this.setState({
        //     totalReferralAmount: refer.amount,
        //   });
        // } else if (programActive && !isEligible) {
        //   this.setState({
        //     totalReferralAmount: Math.max(
        //       0,
        //       refer.amount - this.props.referral.company.contactIncentiveBonus
        //     ),
        //   });
        // }
    }

    referralStatus = (status) => {
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
                    status: get(
                        this,
                        'props.currentUser.company.referralStatus',
                        customTranslate('ml_Interviewing'),
                    ),
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
                    stepIndex: 3,
                };
            case 'inactive':
                return {
                    status: customTranslate('ml_NotHired'),
                    stepIndex: 3,
                };
            case 'noresponse':
                return {
                    status: customTranslate('ml_NotHired'),
                    stepIndex: 3,
                };
            case 'declined':
                return {
                    status: customTranslate('ml_Declined'),
                    stepIndex: 3,
                };
            case 'noresponse':
                return {
                    status: customTranslate('ml_NoResponse'),
                    stepIndex: 3,
                };
            case 'ineligible':
                return {
                    status: customTranslate('ml_Ineligible'),
                    stepIndex: 3,
                };
            default:
                return { status: customTranslate('ml_Referred'), stepIndex: 0 };
        }
    };

    updateReferral = (status) => {
        if (status == 'hired') {
            this.setState({ hireModal: true });
        } else {
            Alert.alert(customTranslate('ml_ConfirmUpdate'), '', [
                {
                    text: customTranslate('ml_Cancel'),
                    onPress: () => {
                        return;
                    },
                },
                {
                    text: customTranslate('ml_Confirm'),
                    onPress: () => {
                        let input = {
                            input: {
                                status: status,
                                hireDate: status == 'hired' ? moment().toISOString() : null,
                            },
                        };
                        this.props.onUpdateReferral(input);
                        // Toast.show('Updating...', Toast.LONG, Toast.TOP, {
                        //   backgroundColor: COLORS.darkGray,
                        //   height: 50,
                        //   width: 250,
                        //   borderRadius: 10,
                        // });
                        showMessage({
                            message: 'Updating...',
                            type: 'info',
                        });
                    },
                },
            ]);
        }
    };
    shrinkAnimation = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: 45,
                duration: 250,
            }),
            Animated.timing(this.state.radius, {
                toValue: 22.5,
                duration: 250,
            }),
        ]).start(this.handleProgress);
    };
    circularProgress;

    handleProgress = () => {
        this.setState({ showProgress: true, progress: 80 }, () => {
            this.circularProgress.animate(this.state.progress, 800, Easing.quad);
        });
    };

    afterAnimation = () => {
        if (this.state.progress == 100) {
            this.setState(
                { showProgress: false, progress: 0, success: true },
                this.handleSuccessExpand,
            );
        }
    };
    handleSuccessExpand = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: width - 50,
                duration: 250,
            }),
            Animated.timing(this.state.radius, {
                toValue: 3,
                duration: 250,
            }),
        ]).start(() => {
            setTimeout(() => {
                this.setState({
                    hireModal: false,
                    startDate: moment(),
                    closeJob: false,
                    updateAsNotHired: false,
                    showProgress: false,
                    progress: 0,
                    success: false,
                });
            }, 1000);
        });
        this.props.refetchReferralBonuses();
    };

    handleReferralSuccess = () => {
        this.setState({ progress: 100 }, () =>
            this.circularProgress.animate(this.state.progress, 800, Easing.quad),
        );
    };
    getPayments = (currentTieredBonus) => {
        try {
            const { referralDetails } = this.props;
            let referral = referralDetails;
            const { startDate } = this.state;
            const contactIncentiveBonus = get(
                referral,
                'job.company.contactIncentiveBonus'
            );
            // const contactIncentiveBonus = 0
            let referralBonus = get(referral, 'job.referralBonus');
            referralBonus =
                typeof referralBonus === 'string'
                    ? JSON.parse(referralBonus)
                    : referralBonus;
            const amount = get(referralBonus, 'amount');
            const incentiveEligible = get(referral, 'user.incentiveEligible');
            let tieredBonuses = [];
            let tieredBonus = get(currentTieredBonus, 'tiers');
            if (tieredBonus)
                tieredBonus.forEach((bonus) => {
                    const tier = typeof bonus === 'string' ? JSON.parse(bonus) : bonus;
                    tieredBonuses.push(tier);
                });
            const userGroup = get(referral, 'user.userGroupId');
            let payments = [];
            let hireDate = moment().toISOString();
            if (!tieredBonus) {
                let bonus = {
                    jobId: get(referral, 'job.id'),
                    referralId: get(referral, 'id'),
                    companyId: get(referral, 'companyId'),
                    contactId: get(referral, 'contactId'),
                    userId: get(referral, 'userId'),
                    bonusStatus: 'pending',
                    hireDate,
                    startDate,
                };
                bonus.amountDue = calculateReferralBonus(
                    contactIncentiveBonus,
                    amount,
                    incentiveEligible,
                    null,
                    'employee',
                    userGroup,
                );
                const waitingPeriod = get(
                    referral,
                    'job.company.referralBonusWaitingPeriod',
                    0,
                );
                const earnedDate = moment(startDate)
                    .add(waitingPeriod, 'days')
                    .toISOString();
                bonus.earnedDate = earnedDate;
                bonus.recipientType = 'employee';
                bonus.payment = '1 of 1';
                payments.push(bonus);
            }

            if (tieredBonus) {
                let bonusRange = 0;
                tieredBonuses.forEach((tier) => {
                    if (get(tier, 'userGroup') === userGroup) {
                        bonusRange++;
                    }
                });
                let bonusIndex = 0;
                tieredBonuses.forEach((tier) => {
                    if (userGroup === tier.userGroup) {
                        bonusIndex++;
                        let newTieredBonus = {
                            jobId: get(referral, 'job.id'),
                            referralId: get(referral, 'id'),
                            companyId: get(referral, 'companyId'),
                            contactId: get(referral, 'contactId'),
                            userId: get(referral, 'userId'),
                            bonusStatus: 'pending',
                            hireDate,
                            startDate,
                        };
                        const amountDue = calculateReferralBonus(
                            contactIncentiveBonus,
                            get(tier, 'amount'),
                            incentiveEligible,
                            null,
                            'employee',
                            userGroup,
                        );
                        newTieredBonus.amountDue = amountDue;
                        const waitingPeriod = get(tier, 'payOutDays', 0);
                        const earnedDate = moment(startDate)
                            .add(waitingPeriod, 'days')
                            .toISOString();
                        newTieredBonus.earnedDate = earnedDate;
                        newTieredBonus.recipientType = get(tier, 'recipientType', 'employee');
                        newTieredBonus.payment = `${bonusIndex} of ${bonusRange}`;
                        payments.push(newTieredBonus);
                    }
                });
            }
            return payments;
        } catch (error) {
            console.log("Error", error.message)

        }
    };

    handleSubmit = () => {
        //e.preventDefault();
        this.shrinkAnimation();
        const {
            referralDetails,
            onCreateBonus,
            onDeleteBonus,
            onUpdateReferral,
            onUpdateJob,
            handleError,
            handleCancel,
            currentTieredBonus,
        } = this.props;
        let referral = referralDetails;
        let job = referral.job;
        const { startDate } = this.state;
        const currentReferral = get(referral, 'id');
        const jobReferrals = get(referral, 'job.referrals');
        const otherReferrals = jobReferrals.filter((r) => r.id !== currentReferral);

        this.setState({ buttonState: 'loading' });
        const payments = this.getPayments(currentTieredBonus);
        let ref = referral;
        ref.bonuses = payments;
        // if (this.props.handleHired) {
        //   this.props.handleHired (ref);
        // }
        const hireDate = moment().toISOString();
        try {
            // onUpdateReferral({
            //   input: {
            //     id: currentReferral,
            //     status: 'hired',
            //     bonusStatus: 'pending',
            //     hireDate,
            //     startDate,
            //   },
            // });
            if (this.state.closeJob) {
                onUpdateJob({
                    id: job.id,
                    status: 'closed',
                    jobType: job.jobType,
                });
            }
            if (this.state.updateAsNotHired) {
                otherReferrals.forEach((referral) => {
                    onUpdateReferral({
                        input: {
                            id: get(referral, 'id'),
                            status: 'notHired',
                            bonusStatus: 'ineligibleEmployee',
                        },
                    });
                });
            }
            this.props.client
                .query({
                    query: gql(queryBonusByReferralIdIndex),
                    variables: {
                        referralId: get(referral, 'referralId', get(referral, 'id')),
                    },
                })
                .then((data) => {
                    const existingBonuses = get(
                        data,
                        'data.queryBonusByReferralIdIndex.items',
                    );
                    if (existingBonuses) {
                        existingBonuses.forEach((bonus) => {
                            const id = get(bonus, 'id');
                            const input = {
                                input: { id: id },
                            };
                            onDeleteBonus(input);
                        });
                    }
                })
                .then(() => {
                    let referralBonus = get(referral, 'job.referralBonus');
                    if (typeof referralBonus === 'string')
                        referralBonus = JSON.parse(referralBonus);
                    //const tieredBonusId = get(referralBonus, 'tieredBonusId');
                    const currentTieredBonus = get(this.props, 'currentTieredBonus');
                    const payments = this.getPayments(currentTieredBonus);
                    if (payments) {
                        payments.forEach((payment) => {
                            const input = { input: payment };
                            onCreateBonus(input);
                        });
                    }
                    onUpdateReferral({
                        input: {
                            id: currentReferral,
                            status: 'hired',
                            bonusStatus: 'pending',
                            hireDate,
                            startDate: startDate.toISOString(),
                        },
                    }).then((res) => {
                        this.handleReferralSuccess();
                    });
                    // setTimeout(() => {
                    //   this.setState({ buttonState: 'success' });
                    // }, 5000);
                    //this.setState({ buttonState: 'success' });

                    // this.props.client
                    //   .query({
                    //     query: gql(getTieredBonus),
                    //     variables: {
                    //       companyId: referral.companyId,
                    //       id: tieredBonusId,
                    //     },
                    //   })
                    //   .then(result => {
                    //     const currentTieredBonus = get(result, 'data.getTieredBonus');
                    //     const payments = this.getPayments(currentTieredBonus);
                    //     // let ref = referral;
                    //     // ref.bonuses = payments;
                    //     // console.log(ref);
                    //     // if (this.props.handleHired) {
                    //     //   this.props.handleHired(ref);
                    //     // }
                    //     if (payments) {
                    //       payments.forEach(payment => {
                    //         const input = { input: payment };
                    //         onCreateBonus(input);
                    //       });
                    //     }
                    //   })
                    //   .then(() =>
                    //     onUpdateReferral({
                    //       input: {
                    //         id: currentReferral,
                    //         status: 'hired',
                    //         bonusStatus: 'pending',
                    //         hireDate,
                    //         startDate,
                    //       },
                    //     })
                    //   );
                });

            //handleCancel();
        } catch (err) {
            console.error(err);
        }
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
    handleStepPress = (title) => {
        this.hideMenu();

        let status = '';
        switch (title) {
            case customTranslate('ml_Referred'):
                status = 'referred';
                break;
            case customTranslate('ml_Accepted'):
                status = 'accepted';
                break;
            case customTranslate('ml_Interviewing'):
                status = 'interviewing';
                break;
            case customTranslate('ml_Hired'):
                status = 'hired';
                break;
            case customTranslate('ml_NotHired'):
                status = 'notHired';
                break;
            default:
                break;
        }
        setTimeout(() => {
            this.updateReferral(status);
        }, 500);
    };
    setBonusDetail = (
        job,
        referredCandidate,
        totalBonus,
        hiredDate,
        payments,
    ) => {
        this.setState(
            {
                bonusDetails: {
                    job,
                    referredCandidate,
                    totalBonus,
                    hiredDate,
                    payments,
                },
            },
            () => this.setState({ bonusDetailModal: true }),
        );
    };
    resendReferral = (referral) => {
        //aus code
        let url =
            'https://ngo43v9gs9.execute-api.us-east-2.amazonaws.com/default/resend-referral'; //erin url
        //let url = 'https://x2sbuya0y9.execute-api.us-east-2.amazonaws.com/default/allied-resend-referral'; //aus url
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                referral: referral,
                company: this.props.currentUser.company,
            }),
        })
            .then((res) => {
                console.log('resend referral res', res);
                showMessage({
                    message: 'The Referral was successfully sent',
                    type: 'success',
                });
            })
            .catch((err) => {
                console.log('resend referral error', err);
                showMessage({
                    message: 'Something went wrong.',
                    type: 'danger',
                });
            });
    };
    referralStatusLabel = (status) => {
        // console.log("status = ",status);
        switch (status) {
            case 'accepted':
                return customTranslate('ml_Accepted');
            case 'hired':
                return customTranslate('ml_Hired');
            case 'referred':
                return customTranslate('ml_Referred');
            case 'notHired':
                return customTranslate('ml_NotHired');
            case 'interviewing':
                return get(
                    this,
                    'props.currentUser.company.referralStatus',
                    customTranslate('ml_Interviewing'),
                );
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
                return null;
        }
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
        let {
            company: { theme, symbol, disableManagerPermissions },
        } = this.props.currentUser;
        theme = theme ? JSON.parse(theme) : {};
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let referral = this.props.noJob ? 'referralDetails' : 'referral';
        //let referral = 'referralDetails';
        if (this.props[referral]) {
            var refer = this.props[referral].job
                ? JSON.parse(this.props[referral].job.referralBonus)
                : null;
            const {
                [referral]: {
                    contact,
                    referralDate,
                    job,
                    status,
                    customStatus,
                    referralType,
                    hireDate,
                    user,
                    bonusStatus,
                    company,
                    dateCreated,
                    type,
                    id,
                },
                currencyRate,
                currencySymbol,
                currentTieredBonus,
                width,
            } = this.props;
            let contactIncentiveBonus = get(company, 'contactIncentiveBonus', 0) || 0;

            const referralStatus = this.referralStatus(status);
            // if (!contact) return null;
            let { referralBonuses } = this.props;
            let { bonusDetails } = this.state;
            refer = refer || {};
            let interviewingText = customStatus
                ? customStatus
                : get(this, 'props.currentUser.company.referralStatus') === null
                    ? customTranslate('ml_Interviewing')
                    : get(
                        this,
                        'props.currentUser.company.referralStatus',
                        customTranslate('ml_Interviewing'),
                    );
            let steps = [
                ...this.state.steps,
                { title: interviewingText },
                { title: this.parseFinalStatus(status) },
            ];
            return (
                <View
                    style={[
                        styles.referralCardContainer,
                        { minHeight: 160 },
                        width > 450 && { maxWidth: 320 },
                    ]}>
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            {/* {this.props.currentUser==this.render.props} */}
                            {this.props.jobDetail || contact ? (
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (type === 'gdprReferralCreated') return;
                                            this.props.jobDetail
                                                ? Actions.jobDetail({ job })
                                                : this.props.noJob
                                                    ? Actions.referralDetail({
                                                        referralId: this.props.referral.id,
                                                    })
                                                    : this.props.handleContactPress(
                                                        this.props.referral.contact,
                                                    );
                                        }}
                                        style={{ flex: 1 }}>
                                        <Text
                                            style={[
                                                styles.candidateName,
                                                this.props.noJob && { color: COLORS.blue },
                                                { fontSize: width > 450 ? 16 : 18 },
                                            ]}>
                                            {this.props.jobDetail
                                                ? `${job ? job.title : ''}`
                                                : `${contact.firstName} ${contact.lastName}`}
                                        </Text>
                                    </TouchableOpacity>
                                    {this.props.jobDetail ? (
                                        <Text style={{ marginTop: 3, color: COLORS.lightGray }}>
                                            {customTranslate('ml_ReferredBy')}{' '}
                                            <Text
                                                style={{
                                                    fontWeight: '500',
                                                    color: COLORS.blue,
                                                }}>{`${user.firstName} ${user.lastName}`}</Text>
                                        </Text>
                                    ) : null}
                                </View>
                            ) : (
                                <Text
                                    style={[
                                        styles.candidateName,
                                        type == 'gdprReferralCreated' && { color: COLORS.lightGray },
                                    ]}>
                                    {this.props.jobDetail
                                        ? `${job ? job.title : ''}`
                                        : type == 'gdprReferralCreated'
                                            ? 'Pending Acceptance'
                                            : `${user.firstName} ${user.lastName}`}
                                </Text>
                            )}
                            {!this.props.noJob ? (
                                referralType == 'self' ? (
                                    <Text style={[styles.jobTitle, { color: '#FE9A2E' }]}>
                                        {customTranslate('ml_SelfReferred')}
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            styles.jobTitle,
                                            { color: 'green', fontSize: width > 450 ? 12 : 14 },
                                        ]}>
                                        {job &&
                                            calculateReferralBonus(
                                                contactIncentiveBonus,
                                                refer.amount,
                                                user.incentiveEligible,
                                                currentTieredBonus,
                                                'employee',
                                                user.userGroupId,
                                                currencyRate,
                                            ) != 0
                                            ? `${currencySymbol}${parseInt(
                                                calculateReferralBonus(
                                                    contactIncentiveBonus,
                                                    refer.amount,
                                                    user.incentiveEligible,
                                                    currentTieredBonus,
                                                    'employee',
                                                    user.userGroupId,
                                                    currencyRate,
                                                ),
                                            )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            : ''}
                                    </Text>
                                )
                            ) : (
                                <Text style={styles.date}>
                                    {referralDate
                                        ? format(referralDate, 'M/D/YYYY')
                                        : format(dateCreated, 'M/D/YYYY')}
                                </Text>
                            )}
                        </View>
                        {/* {!this.props.noJob && (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginRight: 2,
                }}
              >
                {job ? (
                  <TouchableOpacity onPress={() => Actions.jobDetail({ job })}>
                    <Text
                      numberOfLines={2}
                      style={[styles.jobTitle, { width: (200 / 375) * width }]}
                    >
                      {job.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <Text style={styles.date}>{format(referralDate, 'M/D/YYYY')}</Text>
              </View>
            )} */}
                        {!this.props.noJob && (
                            <View style={{ width: '100%', flexDirection: 'row' }}>
                                {job ? (
                                    <TouchableOpacity
                                        style={{ flex: 2.1 }}
                                        onPress={() => {
                                            if (type == 'gdprReferralCreated') return;
                                            Actions.jobDetail({ job });
                                        }}>
                                        <Text
                                            numberOfLines={2}
                                            style={[
                                                styles.jobTitle,
                                                { fontSize: width > 450 ? 12 : 14 },
                                            ]}>
                                            {job.title}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text
                                        style={[styles.date, { fontSize: width > 450 ? 12 : 14 }]}>
                                        {referralDate
                                            ? format(referralDate, 'M/D/YYYY')
                                            : format(dateCreated, 'M/D/YYYY')}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {/* <View style={{ width: '100%', borderWidth: 1, height: 30, flexDirection: 'row' }}>
              <View style={{ flex: 2, backgroundColor: 'red' }}></View>
              <View style={{ flex: 0.9 }}></View>
            </View> */}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{ marginTop: 3, color: COLORS.grayMedium, fontSize: 13 }}>
                            {customTranslate('ml_Status')}:{' '}
                        </Text>
                        {this.props.noJob && !disableManagerPermissions ? (
                            <Menu
                                ref={this.setMenuRef}
                                button={
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text
                                            onPress={this.showMenu}
                                            style={{
                                                color: 'black',
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                marginRight: 5,
                                                fontSize: 13,
                                            }}>
                                            {status.toLowerCase() == 'noresponse'
                                                ? customTranslate('ml_NoResponse')
                                                : status.toLowerCase() == 'nothired'
                                                    ? customTranslate('ml_NotHired')
                                                    : this.referralStatus(status).status}
                                        </Text>
                                        <FontIcon color={'black'} name="angle-down" size={20} />
                                    </TouchableOpacity>
                                }>
                                {this.state.steps.map((el) => (
                                    <MenuItem
                                        key={el.title}
                                        onPress={() => this.handleStepPress(el.title)}>
                                        {el.title}
                                    </MenuItem>
                                ))}
                            </Menu>
                        ) : (
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                }}>
                                {status === 'interviewing' && customStatus
                                    ? customStatus
                                    : this.referralStatusLabel(status)}
                            </Text>
                        )}
                        {type == 'gdprReferralCreated' && (
                            <TouchableOpacity
                                onPress={() => {
                                    Clipboard.setString(
                                        'https://' + getDomain() + '/newreferral/' + id + '/EN',
                                    );
                                    showMessage({
                                        message: 'Copied to Clipboard.',
                                        type: 'success',
                                    });
                                }}>
                                <Image
                                    style={{
                                        height: 12,
                                        width: 12,
                                        marginLeft: 5,
                                        tintColor: COLORS.blue,
                                    }}
                                    source={require('../../../_shared/assets/copy.png')}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <WhiteSpace size="md" />
                    {!this.props.noJob && !this.props.jobDetail && status === 'referred' && (
                        <React.Fragment>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {contact && contact.emailAddress && (
                                    <TouchableOpacity
                                        style={{ padding: 5 }}
                                        onPress={() => {
                                            Alert.alert(
                                                'Resend Referral',
                                                `Resend Referral to ${contact.emailAddress}?`,
                                                [
                                                    {
                                                        text: 'CANCEL',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'CONFIRM',
                                                        onPress: () => {
                                                            this.resendReferral(this.props[referral]);
                                                        },
                                                    },
                                                ],
                                                { cancelable: false },
                                            );
                                        }}>
                                        <Image
                                            style={{ height: 25, width: 25 }}
                                            source={require('../../../_shared/assets/ERIN-resendemail.png')}
                                        />
                                    </TouchableOpacity>
                                )}
                                {contact && contact.phoneNumber && (
                                    <TouchableOpacity
                                        style={{ padding: 5 }}
                                        onPress={() => {
                                            Alert.alert(
                                                'Resend Referral',
                                                `Resend Referral to ${contact.phoneNumber}?`,
                                                [
                                                    {
                                                        text: 'CANCEL',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'CONFIRM',
                                                        onPress: () => {
                                                            this.resendReferral(this.props[referral]);
                                                        },
                                                    },
                                                ],
                                                { cancelable: false },
                                            );
                                        }}>
                                        <Image
                                            style={{ height: 25, width: 25 }}
                                            source={require('../../../_shared/assets/ERIN-resendphone.png')}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </React.Fragment>
                    )}
                    <WhiteSpace size="md" />
                    <Steps
                        steps={steps}
                        status={referralStatus}
                        updateStatus={this.updateReferral}
                        noJob={this.props.noJob}
                        referralStatusLabel={this.props.currentUser.company.referralStatus}
                        disableManagerPermissions={disableManagerPermissions}
                    />
                    {referralStatus.stepIndex == 3 &&
                        referralType != 'self' &&
                        referralStatus.status.toLowerCase() == 'hired' && (
                            <Text
                                onPress={() =>
                                    this.setBonusDetail(
                                        job,
                                        contact,
                                        job
                                            ? calculateReferralBonus(
                                                contactIncentiveBonus,
                                                refer.amount,
                                                user.incentiveEligible,
                                                currentTieredBonus,
                                                'employee',
                                                user.userGroupId,
                                                currencyRate,
                                            )
                                            : '',
                                        hireDate,
                                        referralBonuses,
                                    )
                                }
                                style={{
                                    fontSize: width > 450 ? 11 : 13,
                                    color: COLORS.blue,
                                    marginTop: 10,
                                    alignSelf: 'center',
                                }}>
                                {customTranslate('ml_ViewBonusDetails')}
                            </Text>
                        )}

                    {/* {referralStatus.stepIndex == 3 && (
            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 13, color: COLORS.grayMedium }}>
                {customTranslate('ml_Bonus')} {customTranslate('ml_Status')}:{' '}
                <Text style={{ fontWeight: '300' }}>{this.parseBonusStatus(bonusStatus)}</Text>
              </Text>
              <Text
                onPress={() =>
                  this.setBonusDetail(
                    job,
                    contact,
                    calculateReferralBonus(
                      contactIncentiveBonus,
                      refer.amount,
                      user.incentiveEligible,
                      currentTieredBonus,
                      'employee',
                      user.userGroupId,
                      currencyRate
                    ),
                    hireDate,
                    referralBonuses
                  )
                }
                style={{ fontSize: 13, color: COLORS.blue }}
              >
                View Bonus Details
              </Text>
            </View>
          )} */}

                    {/* {this.props.currentTieredBonus && (
            <BonusTiered
              currentTieredBonus={this.props.currentTieredBonus}
              status={referralStatus}
              hireDate={hireDate}
              userGroup={user.userGroupId}
              currencyRate={currencyRate}
              currencySymbol={currencySymbol}
            />
          )} */}
                    <Modal visible={this.state.hireModal} transparent>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.blackTransparent,
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    width: width - 30,
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View style={{ flex: 5 }}>
                                        <Text
                                            style={[
                                                styles1.title,
                                                theme.enabled && { color: theme.buttonColor },
                                            ]}>
                                            {customTranslate('ml_GreatWork')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{ flex: 1, alignItems: 'center' }}
                                        onPress={() =>
                                            this.setState({
                                                hireModal: false,
                                                closeJob: false,
                                                updateAsNotHired: false,
                                                startDate: moment(),
                                            })
                                        }>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            marginTop: 5,
                                            marginBottom: 10,
                                            fontWeight: '600',
                                            color: COLORS.darkGray,
                                        }}>
                                        {customTranslate('ml_YoureOneClickAwayFromFillingThisPosition')}
                                    </Text>
                                    <View
                                        style={{
                                            width: '85%',
                                            borderRadius: 10,
                                            backgroundColor: COLORS.lightGreen,
                                            alignItems: 'center',
                                            paddingVertical: 10,
                                        }}>
                                        <Text
                                            style={{
                                                marginBottom: 20,
                                                fontSize: 20,
                                                fontWeight: '500',
                                            }}>
                                            {customTranslate('ml_SelectAStartDate')}
                                        </Text>
                                     <DatePicker
                                            style={{ width: 200 }}
                                            date={this.state.startDate}
                                            mode="date"
                                            placeholder="select date"
                                            format="MM-DD-YYYY"
                                            minDate={moment().format('MM/DD/YYYY')}
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
                                                    startDate: moment(date, 'MM-DD-YYYY'),
                                                });
                                            }}
                                        />
                                    </View>
                                    <Text
                                        style={{
                                            marginVertical: 10,
                                            fontWeight: '400',
                                            fontSize: 17,
                                            fontStyle: 'italic',
                                            textTransform: 'capitalize',
                                        }}>
                                        {customTranslate('ml_optional')}:
                                    </Text>
                                    <View>
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState((state) => ({
                                                    updateAsNotHired: !state.updateAsNotHired,
                                                }))
                                            }
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                height: 30,
                                            }}>
                                            <View
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderWidth: this.state.updateAsNotHired ? 0 : 1,
                                                    borderColor: COLORS.lightGray,
                                                    borderRadius: 3,
                                                    backgroundColor: this.state.updateAsNotHired
                                                        ? COLORS.dashboardGreen
                                                        : 'transparent',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                {this.state.updateAsNotHired ? (
                                                    <IonIcon
                                                        name="md-checkmark"
                                                        color="white"
                                                        size={17}
                                                    />
                                                ) : null}
                                            </View>
                                            <Text style={{ color: COLORS.darkGray, marginLeft: 5 }}>
                                                {customTranslate('ml_UpdateOtherReferralsAs')}{' '}
                                                <Text style={{ fontWeight: '500' }}>
                                                    {customTranslate('ml_NotHired')}
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: 10,
                                            }}
                                            onPress={() =>
                                                this.setState((state) => ({ closeJob: !state.closeJob }))
                                            }>
                                            <View
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderWidth: this.state.closeJob ? 0 : 1,
                                                    borderColor: COLORS.lightGray,
                                                    borderRadius: 3,
                                                    backgroundColor: this.state.closeJob
                                                        ? COLORS.dashboardGreen
                                                        : 'transparent',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                {this.state.closeJob ? (
                                                    <IonIcon
                                                        name="md-checkmark"
                                                        color="white"
                                                        size={17}
                                                    />
                                                ) : null}
                                            </View>
                                            <Text style={{ color: COLORS.darkGray, marginLeft: 5 }}>
                                                {customTranslate('ml_CloseThisJob')}{' '}
                                                <Text style={{ fontStyle: 'italic' }}>
                                                    {customTranslate('ml_NoMoreReferrals')}
                                                </Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        {this.state.showProgress ? (
                                            <AnimatedCircularProgress
                                                style={{ marginVertical: 3 }}
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
                                                    width: this.state.width,
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
                                                onPress={() => {
                                                    this.handleSubmit();
                                                }}>
                                                <Animated.View
                                                    style={{
                                                        width: this.state.width,
                                                        height: 45,
                                                        backgroundColor: COLORS.blue,
                                                        marginVertical: 3,
                                                        borderRadius: this.state.radius,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text style={[{ fontSize: 20, color: 'white' }]}>
                                                        {customTranslate('ml_SubmitAsHired')}
                                                    </Text>
                                                </Animated.View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
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
                                    maxHeight: 500,
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
                                        onPress={() => this.setState({ bonusDetailModal: false })}>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView>
                                    {this.state.bonusDetails ? (
                                        <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
                                            {/* <View style={Styles.row}>
                      <Text style={Styles.key}>{customTranslate('ml_RecipientName')}:</Text>
                      <Text style={Styles.value}>
                        {bonusDetail.recipientType == 'employee'
                          ? bonusDetail.user.firstName + ' ' + bonusDetail.user.lastName
                          : bonusDetail.contact.firstName + ' ' + bonusDetail.contact.lastName}
                      </Text>
                    </View>
                    <View style={Styles.row}>
                      <Text style={Styles.key}>{customTranslate('ml_RecipientType')}:</Text>
                      <Text style={Styles.value}>{bonusDetail.recipientType}</Text>
                    </View> */}
                                            <View style={[Styles.row, { marginTop: 15 }]}>
                                                <Text style={Styles.key}>{customTranslate('ml_Job')}:</Text>
                                                <Text style={Styles.value}>
                                                    {bonusDetails.job ? bonusDetails.job.title : ''}
                                                </Text>
                                            </View>
                                            {/* <View style={[Styles.row]}>
                      <Text style={Styles.key}>
                        {bonusDetail.recipientType == 'employee'
                          ? customTranslate('ml_ReferredCandidate')
                          : customTranslate('ml_ReferredBy')}
                        :
                      </Text>
                      <Text style={Styles.value}>
                        {bonusDetail.recipientType == 'employee'
                          ? bonusDetail.contact.firstName + ' ' + bonusDetail.contact.lastName
                          : bonusDetail.user.firstName + ' ' + bonusDetail.user.lastName}
                      </Text>
                    </View> */}
                                            <View style={[Styles.row]}>
                                                <Text style={Styles.key}>
                                                    {customTranslate('ml_ReferredCandidate')}
                                                </Text>
                                                <Text style={Styles.value}>
                                                    {bonusDetails.referredCandidate.firstName +
                                                        ' ' +
                                                        bonusDetails.referredCandidate.lastName}
                                                </Text>
                                            </View>
                                            {/* <View style={Styles.row}>
                        <Text style={Styles.key}>
                          {customTranslate('ml_BonusAmount')}:
                        </Text>
                        <Text
                          style={[
                            Styles.value,
                            {color: COLORS.green, fontWeight: '500'},
                          ]}>
                          {currencySymbol + parseInt(bonusDetails.totalBonus)}
                        </Text>
                      </View> */}
                                            <View style={[Styles.row, { marginTop: 15 }]}>
                                                <Text style={Styles.key}>
                                                    {customTranslate('ml_HiredDate')}:
                                                </Text>
                                                <Text style={Styles.value}>
                                                    {moment(bonusDetails.hiredDate).format('MM/DD/YYYY')}
                                                </Text>
                                            </View>
                                            <View style={Styles.row}>
                                                <Text style={Styles.key}>
                                                    {customTranslate('ml_Startdate')}:
                                                </Text>
                                                <Text style={Styles.value}>
                                                    {bonusDetails.payments.length
                                                        ? moment(bonusDetails.payments[0].startDate).format(
                                                            'MM/DD/YYYY',
                                                        )
                                                        : ''}
                                                </Text>
                                            </View>
                                            {/* <View style={Styles.row}>
                      <Text style={Styles.key}>{customTranslate('ml_Status')}:</Text>
                      <Text style={Styles.value}>{bonusDetail.bonusStatus}</Text>
                    </View> */}
                                            <View style={[{ flexDirection: 'column', marginTop: 15 }]}>
                                                <Text style={[Styles.key, { marginBottom: 3 }]}>
                                                    {'Bonus Payments'}:
                                                </Text>
                                                {_.sortBy(
                                                    bonusDetails.payments.filter(
                                                        (pay) => pay.recipientType === 'employee',
                                                    ),
                                                    'earnedDate',
                                                ).map((item) => (
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text
                                                            style={[
                                                                Styles.value,
                                                                {
                                                                    marginRight: 10,
                                                                    color: COLORS.green,
                                                                    fontWeight: '500',
                                                                },
                                                            ]}>
                                                            {currencySymbol +
                                                                parseInt(item.amountDue) * currencyRate}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                Styles.value,
                                                                { marginRight: 10, color: COLORS.grayMedium },
                                                            ]}>
                                                            {moment(item.earnedDate).format('MM/DD/YYYY')}
                                                        </Text>
                                                        <Text
                                                            style={[
                                                                Styles.value,
                                                                { color: COLORS.grayMedium },
                                                            ]}>
                                                            {item.bonusStatus}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                            {/* <View style={[{flexDirection: 'column', marginTop: 15}]}>
                        <Text style={Styles.key}>
                          {customTranslate('ml_BonusNotes')}:
                        </Text>
                        <Text
                          style={[
                            Styles.value,
                            {marginTop: 3, fontSize: 15, textTransform: 'none'},
                          ]}>
                          {bonusDetails.payments.length
                            ? bonusDetails.payments[0].notes
                            : ''}
                        </Text>
                      </View> */}
                                            {/* <TouchableOpacity
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
                        }}
                      >
                        <Text
                          style={{
                            color: COLORS.white,
                            fontSize: 20,
                            fontWeight: '300',
                          }}
                        >
                          {customTranslate('ml_Close')}
                        </Text>
                      </TouchableOpacity> */}
                                        </View>
                                    ) : null}
                                </ScrollView>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
            );
        } else {
            return (
                <View
                    style={[
                        styles.referralCardContainer,
                        { justifyContent: 'center' },
                        width > 450 && { maxWidth: 320 },
                    ]}>
                    <Animated.Image
                        style={{
                            height: 30,
                            width: 30,
                            transform: [{ rotate: spin }],
                            alignSelf: 'center',
                        }}
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
            );
        }
    }
}

const styles1 = StyleSheet.create({
    title: {
        width: '100%',
        textAlign: 'center',
        color: COLORS.red,
        fontSize: 28,
        marginBottom: 0,
        fontWeight: '600',
        marginTop: 15,
    },
});
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

export default withApollo(ReferralCard);
