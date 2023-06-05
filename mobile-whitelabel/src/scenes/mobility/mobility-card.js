import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, Platform, Linking, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import { COLORS } from '../../_shared/styles/colors';
import JobCard from '../jobs/job-card/job-card.container';
const width = Dimensions.get('window').width
import EvilIcon from 'react-native-vector-icons/SimpleLineIcons';
import { customTranslate } from '../../_shared/services/language-manager';
import Steps from '../../_shared/components/steps/steps.component';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { get } from 'lodash';

const ScreenWidth = Dimensions.get('screen').width;

const MobilityCard = (props) => {

    const currentUser = useSelector(state => state.user.currentUser);


    const referralStatus = (status) => {
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
                    stepIndex: 4,
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
    const parseFinalStatus = (status) => {
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
    const referralStatusLabel = (status) => {
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


    const Interested = () => {
        if (!checkIsAlreadyReferredToJob1()) {
            this.setState({
                Interested: true,
            });
        } else {
            setTimeout(() => {
                this.setState({
                    alreadySubmit: true,
                });
            }, 200);
        }
    }
    const checkIsAlreadyReferredToJob1 = () => {
        // const { currentUser, currentUser1 } = this.props;
        const { job } = this.state;
        let isAlreadyReferredToJob = job.referrals.filter((referral) => {
            if (
                referral.contact &&
                referral.contact.emailAddress != currentUser.emailAddress
            ) {
            } else {
                return referral;
            }
        });
        if (isAlreadyReferredToJob.length > 0) {
            return true;
        } else {
            return false;
        }
    };

   const openUrlButton = async (url) => {
        let supportedUrl = await Linking.canOpenURL(url);

        if (supportedUrl) {
            await Linking.openURL(url);
        }
        else {
            console.log("Url is not supported")
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.cardview}>
                {console.log("props", props)}
                {props?.firstContent != "" &&

                    <View style={{ ...styles.shadow }}>
                        {/* <HTML
                        containerStyle={styles.htmlContainer}
                        numberOfLines={2}
                        html={
                            props.firstContent
                        }
                    > */}
                        {/* </HTML> */}
                        <WebView
                            mixedContentMode='always'
                            androidLayerType={'hardware'}
                            nestedScrollEnabled
                            source={{ html: props.firstContent }}
                            style={{ marginTop: 10, height: 170, backgroundColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowRadius: 0.4, shadowOpacity: 1, elevation: 5,opacity:0.9 }}
                        />

                    </View>}
                {
                    props?.middleContent != "" &&
                    <View style={{ ...styles.shadow }}>
                        {/* <HTML
                        containerStyle={styles.htmlContainer}
                        numberOfLines={2}
                        html={
                            props.middleContent
                        }
                    >
                    </HTML> */}
                        <WebView
                            mixedContentMode='always'
                            androidLayerType={'hardware'}
                            nestedScrollEnabled
                            source={{ html: props.middleContent }}
                            pointerEvents={'none'}
                            directionalLockEnabled
                            style={{ marginTop: 10, height: 170, backgroundColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowRadius: 0.4, shadowOpacity: 1, elevation: 5,opacity:0.9 }}
                        />
                    </View>}
                {
                    // console.log("LAST CONTENT", props?.lastContent),
                    props?.lastContent != "" &&
                    <View style={{ ...styles.shadow }}>
                        <WebView
                            mixedContentMode='always'
                            androidLayerType={'hardware'}
                            nestedScrollEnabled
                            // pointerEvents={'none'}
                            source={{ html: props.lastContent }}
                            style={{ marginTop: 10, height: 170, backgroundColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowRadius: 0.4, shadowOpacity: 1, elevation: 5,opacity:0.9 }}
                        />
                    </View>
                }
                {/* <Text
                    style={{
                        marginVertical: 10,
                        fontSize: 16,
                        fontWeight: 'bold',
                    }}>
                    RECOMMENDED JOBS
                </Text> */}

                {/* <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={props.recommendedJobs}
                    renderItem={(item) => {
                        return (
                            <MobilityJobCard
                                generalReferral={item.isGeneralReferral}
                                jobId={item.id.raw}
                                translatedTitle={item.translatedTitle}
                                job={item}
                                key={item.id}
                                setCurrentUser={props.setCurrentUser}
                                currentUser1={props.currentUser}
                                currentUser={props.currentUser.id}
                                selfReferralValue={props.currentUser.company.allowSelfReferrals}
                                client={props.client}
                                toggleIsSubmitting={toggleIsSubmitting}
                                onDeckRefer={props.onDeckRefer}
                                handleCardClick={handleCardClick}
                                currencyRate={props.currencyRate}
                                currencySymbol={tprops.currencySymbol}
                                width={ScreenWidth}
                                isHotJob={item.isHotJob}
                                subCompanyName={item.subCompanyName}
                            />
                        )
                    }}
                /> */}
                {
                    props.applications.length > 0 &&
                    <Text
                        style={{
                            marginVertical: 10,
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}>
                        YOUR APPLICATIONS
                </Text>
                }

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={props.applications}
                    renderItem={(item) => {

                        return (
                            <View style={{ padding: 10, borderRadius: 10, backgroundColor: '#fff', marginTop: 10, height: 200, width: width - 50, marginLeft: 10 }}>
                                <View style={{ height: 50, width: '100%', justifyContent: 'center' }}>
                                    <Text numberOfLines={2} style={styles.title}>
                                        {item?.item?.job?.title}
                                    </Text>
                                </View>
                                <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ width: '60%', height: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <View style={{ height: '100%', width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>
                                                {'Applied On:'}
                                            </Text>
                                        </View>
                                        <View style={{ height: '100%', width: '50%', justifyContent: 'center' }}>
                                            <Text>
                                                {moment(item.item?.referralDate).format('DD/MM/YYYY')}

                                            </Text>

                                        </View>
                                    </View>

                                </View>

                                <View style={{ width: '100%', marginTop: 20, height: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <Steps
                                        steps={[
                                            { title: 'Started' },
                                            { title: 'Interviewing' },
                                            {
                                                title:
                                                    referralStatus(get(item.item, 'status', '')).stepIndex == 0
                                                        ? customTranslate('ml_Hired')
                                                        : referralStatusLabel(get(item.item, 'status', '')),
                                            },
                                        ]}
                                        status={referralStatus(get(item.item, 'status', ''))}
                                        referralStatusLabel="hello"
                                    />
                                </View>
                            </View>
                        )
                    }}
                />


            </View>





            {/* <Text
                style={{
                    marginVertical: 10,
                    fontSize: 16,
                    fontWeight: 'bold',
                }}>
                YOUR APPLICATIONS
                </Text> */}

        </ScrollView>
    )
}

MobilityCard.defaultProps = {
    firstContent: '',
    middleContent: '',
    lastContent: '',
    recommendedJobs: [],
    applications: [],
    onInterestPress: () => console.log("dff")
}

const styles = StyleSheet.create({
    cardview: {
        width: '100%',
        padding: 10,
        flex: 1
    },
    title: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    textstyles: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000'
    },
    htmlContainer: {
        borderRadius: 6,
        height: 170
    },
    shadow: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 0.4,
        shadowOpacity: 1,
        elevation: 5,
        borderRadius: 10,
        borderWidth: Platform.OS == 'ios' ? 0.5 : 0.2,
        borderColor: Platform.OS == 'ios' ? 'lightgrey' : "black"
    }
})

export default MobilityCard;