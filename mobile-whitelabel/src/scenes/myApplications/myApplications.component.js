import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Dimensions,
    StyleSheet,
    Animated,
    Easing,
    Image,
    TouchableOpacity,
} from 'react-native';
import { withApollo } from 'react-apollo';
import { getJob, queryReferralsByUserIdReferralTypeIndex } from '../../_store/_shared/api/graphql/custom/my-applications';
import { get } from 'lodash';
import { COLORS } from '../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import Steps from '../../_shared/components/steps/steps.component';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';
import { Actions } from 'react-native-router-flux'
import { downloadFromS3 } from '../../common';
import moment from 'moment';

class MyApplications extends Component {
    state = {
        loading: true,
        spinAnim: new Animated.Value(0),
        allReferrals: [],
        referrals: [],
        pageNumber: 1,
        refreshing: false,
        company:"",
        steps: [
            {
                title: customTranslate('ml_Started'),
            },
            {
                title: customTranslate('ml_Interviewing'),
            },
        ],
    };

    componentDidMount() {
        this.getSelfReferrals();
        this.spin();
        // console.log("this.props",this.props.companyId)
    }

    static onEnter() {
        // homeSceneKey needs to be the same key that you use to configure the Scene
        Actions.refs.homeSceneKey.getWrappedInstance().myFunction()
    };

    myFunction = () => {
        // have access to this (props and state) here
        alert("You Rock")
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
    getSelfReferrals = () => {
        try {
            this.props.client.query({
                query: queryReferralsByUserIdReferralTypeIndex,
                variables: { referralType: 'self', userId: this.props.currentUser.id },
                fetchPolicy: 'no-cache',
            })
                .then((res) => {
                    this.setState({ loading: false })
                    this.setState(
                        {
                            allReferrals: get(
                                res,
                                'data.queryReferralsByUserIdReferralTypeIndex.items',
                                [],
                            ).filter((item) => item.job),
                            loading: false,
                        },
                        () => this.fetchData(1)
                    );
                });
        } catch (error) {
            console.log("error")
        }
    };
    getJobData = (jobId) => {
        try {
            this.props.client.query({
                query: getJob,
                variables: {id:jobId },
                fetchPolicy: 'no-cache',
            }).then((res) => {
                let {data:{getJob}}=res;
                Actions.jobDetail({job:getJob,myApplication:true})
                });
        } catch (error) {
            console.log("error",error,this.props.companyId)
        }
    };
    fetchData = (pageNumber) => {
        let fromIndex = (pageNumber - 1) * 10;
        let toIndex = fromIndex + 40;
        let newArr = this.state.allReferrals.slice(fromIndex, toIndex);
        let dupArr = newArr.filter((v, i, a) => a.findIndex(v2 => (v2.job.id === v.job.id)) === i)

        this.setState((prev) => ({
            pageNumber,
            referrals: [...dupArr],
        }));
    };




    refreshing = () => {
        this.setState({ allReferrals: [], referrals: [] });
        this.getSelfReferrals();
    }

    onReload = () => {
        this.spin();
        this.setState({ loading: true, allReferrals: [] });
        this.getSelfReferrals();
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
                    status: customTranslate('ml_Started'),
                    stepIndex: 0,
                };
            case 'interviewing':
                return {
                    status: get(
                        this,
                        'props.currentUser.company.referralStatus',
                        customTranslate('ml_Interviewing'),
                    ),
                    stepIndex: 1,
                };
            case 'hired':
                return {
                    status: customTranslate('ml_Started'),
                    stepIndex: 2,
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
            case 'transferred':
                return {
                    status: customTranslate('ml_Transferred'),
                    stepIndex: 3,
                };
            default:
                return { status: customTranslate('ml_Referred'), stepIndex: 0 };
        }
    };
    referralStatusLabel = (status) => {
        // console.log("status = ",status);
        switch ((status || '').toLowerCase()) {
            case 'accepted':
                return customTranslate('ml_Started');
            case 'hired':
                return customTranslate('ml_Hired');
            case 'referred':
                return customTranslate('ml_Started');
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
                return customTranslate('ml_Transferred');
            default:
                return null;
        }
    };
    handleCardClick = (item) => {
        this.getJobData(item.job.id)
    };
    renderCard = ({ item }) => {
        return (
            <View style={styles.card}>
                {/* <View style={styles.upper}>
                    <Text style={styles.jobTitle}>{get(item, 'job.title', 'Job')}</Text>
                    <Text style={styles.date}>
                        Applied on:{' '}
                        {moment(get(item, 'referralDate', moment())).format('MM/DD/YYYY')}
                    </Text>
                </View> */}
                <TouchableOpacity style={styles.upper} onPress={()=>this.handleCardClick(item)}>
                    <Text style={styles.jobTitle}>{get(item, 'job.title', 'Job')}</Text>
                    <Text style={styles.date}>
                        Applied on:{' '}
                        {moment(get(item, 'referralDate', moment())).format('MM/DD/YYYY')}
                    </Text>
                </TouchableOpacity>
                <View style={styles.lower}>
                    <Text style={styles.status}>
                        Status:{' '}
                        <Text style={{ color: 'black', fontWeight: '600' }}>
                            {this.referralStatusLabel(get(item, 'status', ''))}
                        </Text>
                    </Text>
                    <Steps
                        steps={[
                            { title: 'Started' },
                            { title: 'Interviewing' },
                            {
                                title:
                                    this.referralStatus(get(item, 'status', '')).stepIndex == 0
                                        ? customTranslate('ml_Hired')
                                        : this.referralStatusLabel(get(item, 'status', '')),
                            },
                        ]}
                        status={this.referralStatus(get(item, 'status', ''))}
                        referralStatusLabel="hello"
                    />
                </View>
            </View>
        );
    };

    renderListEmptyComponent = () => {
        return (
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
                    <Text
                        style={{
                            color: '#999999',
                            textAlign: 'center',
                            marginHorizontal: 20,
                            marginTop: 10,
                        }}>
                        You do not have any referrals.
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
                        onPress={() => this.onReload()}>
                        <Text style={{ color: '#fff' }}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    // localPagination = () => {
    //     alert("End Reached")
    //     // if (
    //     //     this.state.pageNumber + 1 >
    //     //     this.state.allReferrals.length / 10 + 1
    //     // ) {
    //     //     return;
    //     // } else {
    //     //     this.fetchData(this.state.pageNumber + 1);
    //     // }
    // }

    render() {
        let {
            currentUser: {
                company: { enableGeneralReferrals, symbol, theme },
            },
        } = this.props;
        theme = theme ? JSON.parse(theme) : {};
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    {this.getSelfReferrals()}
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
        }


        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    onRefresh={() => this.refreshing()}
                    refreshing={this.state.refreshing}
                    data={this.state.referrals}
                    extraData={this.state.refreshing}
                    ListEmptyComponent={() => this.renderListEmptyComponent()}
                    keyExtractor={(item) => item.id}
                    renderItem={this.renderCard}
                />
            </View>
        );
    }
}
export default withApollo(MyApplications);

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('screen').width - 15,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 8,
    },
    upper: {
        padding: 15,
        borderBottomWidth: 0,
        borderBottomColor: COLORS.lightGray3,
        paddingBottom: 0,
    },
    lower: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    jobTitle: {
        fontSize: 14,
        color: COLORS.blue,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 13,
        color: COLORS.grayMedium,
        marginTop: 2,
    },
    status: {
        fontSize: 13,
        color: COLORS.lightGray,
        marginBottom: 15,
    },
});
