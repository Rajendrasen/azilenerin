import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    Dimensions,
    AsyncStorage,
    ScrollView,
    Share,
    Animated,
    Easing,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ActivityIndicator } from '@ant-design/react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import _ from 'lodash';
import HTML from 'react-native-render-html';
import { FormattedCurrency } from 'react-native-globalize';
import Icon from '../../../_shared/components/icon';
import { ReferralModal } from '../../../_shared/components/refer-someone/referral-modal.container';
import ReferralCard from '../../../_shared/components/referral-card/referral-card';
import { COLORS } from '../../../_shared/styles/colors';
import Dialog from 'react-native-dialog';
import { JobMatchesByJobId } from '../../../_store/_shared/api/graphql/custom/jobMatch/jobmatch-by-jobId-graphql';
import { createReferral } from '../../../_store/_shared/api/graphql/custom/referrals/create-referral.graphql';
import gql from 'graphql-tag';
const { width, height } = Dimensions.get('screen');
import { get } from 'lodash';
//import ViewMoreText from 'react-native-view-more-text';
import { withApollo } from 'react-apollo';
import BonusTiered from '../../tiered-bonus/tiered-bonus.component';
import { calculateReferralBonus } from '../../../_shared/services/utils';
import Icons from 'react-native-vector-icons/Ionicons';
import { ContactDetails } from '../../../_shared/components/viewContact/ViewContactContainer';
import ReferredCard from '../../referrals/referral-items/referral-card.container';
import { getErinSquare, getLightGrayLogo } from '../../../WhiteLabelConfig';

class ManageJobDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            viewContactModal: false,
            viewContactId: '',
            referralMatches: [],
            allowSelfReferrals: Number,
            Interested: false,
            alreadyInterested: false,
            buttonColor: false,
            selfAnimatedModal: false,
            submitSuccess: false,
            alreadySubmit: false,
            numOfLines: 0,
            status: false,
            spinAnim: new Animated.Value(0),
            loading: true,
            viewContactModal: false,
            viewContact: '',
            fullContactData: '',
        };
    }
    ShowHideTextComponentView = () => {
        if (this.state.status == true) {
            this.setState({ status: false });
        } else {
            this.setState({ status: true });
        }
    };

    checkIsAlreadyReferredToJob = () => {
        const { job, currentUser } = this.props;
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

    handleReferContactDetail = (item) => {
        this.setState({
            viewContactModal: true,
            viewContact: item,
            fullContactData: JSON.parse(item.fullContactData),
        });
    };
    closeViewContactModal = () => {
        this.setState({ viewContactModal: false });
    };

    Interested() {
        if (!this.checkIsAlreadyReferredToJob()) {
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
    handleCancel = () => {
        this.setState({ Interested: false });
    };

    closeSuccess = () => {
        this.setState({
            submitSuccess: false,
        });
    };

    onShare() {
        const {
            currentJob: { title, publicLink },
            currentUser: {
                company: { name },
            },
        } = this.props;
        Share.share(
            {
                message: i18n
                    .t('ml_MyCompanyHiring')
                    .replace('Techahead', name)
                    .replace('tester', title)
                    .replace('google', publicLink),
                //message: `My company, ${name}, is hiring a ${title}! Check out the job description here: ${publicLink} . Interested? Contact me if you’d like me to refer you!`,
                title: 'Share This Job',
            },
            {
                // Android only:
                dialogTitle: 'Share This Job',
                // iOS only:
                excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
            },
        );
    }
    fetchData = () => {
        const { currentJob, onUpdateJob, jobMatches } = this.props;
        let matches = [...jobMatches];
        //console.log(matches);
        // if (jobMatches) {
        //   this.findRecommended(matches, currentJob);
        // }
        if (currentJob) {
            // onUpdateJob({
            //   id: currentJob.id,
            //   views: currentJob.views + 1,
            // })
            //   .then((res) => {
            //     // alert('done');
            //     this.setState({ loading: false });
            //   })
            //   .catch(err => {
            //     alert('something went wrong!')
            //     console.error('Update Job View Error:', err)
            //   });
            if (jobMatches) {
                this.findRecommended(matches, currentJob);
                this.setState({ loading: false });
            }
        } else {
            this.setState({ loading: false });
        }
    };
    componentDidMount() {
        this.spin();
        setTimeout(() => {
            this.fetchData();
        }, 800);
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
    // componentDidUpdate(prevProps) {

    //   if (prevProps.currentJob && prevProps.currentJob.id !== this.props.currentJob.id) {
    //     this.findRecommended(this.props.jobMatches, this.props.currentJob);
    //     this.setState({
    //       currentJob: this.props.currentJob,
    //       jobMatches: this.props.jobMatches,
    //     });
    //   }
    // }

    componentWillUnmount() {
        // this.setState({ referralMatches: [] })
    }
    findRecommended = (matches, currentJob) => {
        const goodMatches = _.filter(matches, function (n) {
            return (
                n.relevance >= 30 &&
                n.jobId === currentJob.id &&
                n.matchStatus !== false
            );
        });
        goodMatches.sort(
            (a, b) => parseFloat(b.relevance) - parseFloat(a.relevance),
        );
        var allMatches = goodMatches.slice(0, 3);
        this.setState({
            referralMatches: allMatches,
        });
    };

    noRefer(onUpdateMatch, match) {
        const input = {
            input: {
                id: match.id,
                matchStatus: false,
            },
        };
        const { referralMatches } = this.state;
        onUpdateMatch(input);
        const updatedMatches = referralMatches.filter((n) => n.id !== match.id);
        var allMatches = updatedMatches.slice(0, 3);
        this.setState({ referralMatches: allMatches });
    }

    renderDetails() {
        let {
            job: { contactIncentiveBonus },
            currentJob: {
                title,
                salary,
                department,
                description,
                _matches,
                referralBonus,
                location,
                jobType,
            },
            currencyRate,
            currencySymbol,
            currentTieredBonus,
            currentUser: {
                company: { disableShareLink },
            },
        } = this.props;
        let {
            campaignId,
            campaignStartDate,
            campaignEndDate,
            campaignTieredBonus,
            campaignTieredBonusId,
            campaignName,
        } = this.props.propsJob;
        if (
            campaignId &&
            new Date(campaignStartDate) <= new Date() <= new Date(campaignEndDate) &&
            !campaignTieredBonus.archived
        ) {
            currentTieredBonus = JSON.parse(campaignTieredBonus);
        }

        let parsedReferralBonus;

        // referralBonus is coming in as a json string for admin@bestco.com
        if (typeof referralBonus === 'string') {
            parsedReferralBonus = JSON.parse(referralBonus);
        } else {
            parsedReferralBonus = referralBonus;
        }

        const refBonus = parsedReferralBonus || referralBonus;
        const formattedJobType =
            jobType === 'fulltime' ? customTranslate('ml_Fulltime') : customTranslate('ml_Parttime');

        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View style={[styles.titleContainer]}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        {/* {refBonus && refBonus.amount && (
              <Text style={styles.referalText}>${refBonus.amount || '0'}</Text>
            )} */}
                        <Text style={styles.referalText}>
                            {currentTieredBonus
                                ? currentTieredBonus.name
                                : `${currencySymbol}${parseInt(
                                    calculateReferralBonus(
                                        contactIncentiveBonus,
                                        parsedReferralBonus?.amount,
                                        this.props.currentUser.incentiveEligible,
                                        this.props.currentTieredBonus,
                                        'employee',
                                    ) * currencyRate,
                                )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                    </View>
                    <View />
                </View>
                <View
                    style={[
                        styles.row,
                        { alignItems: 'center', justifyContent: 'space-between' },
                    ]}>
                    <View style={styles.department}>
                        <Icon name="folder" color={COLORS.darkGray} style={styles.folder} />
                        <Text style={styles.deptext}>{department && department.name}</Text>
                    </View>
                    <View style={[styles.department]}>
                        <Image
                            style={styles.location}
                            source={require('../../../_shared/assets/location.png')}
                        />
                        <Text style={styles.deptext} numberOfLines={3}>
                            {location && location.city && location.state
                                ? `${location.city}, ${location.state}`
                                : customTranslate('ml_Remote')}
                        </Text>
                    </View>
                    {/* job type */}
                    <View>
                        <Text style={styles.jobType}>{formattedJobType}</Text>
                    </View>
                </View>
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        marginTop: 5,
                        marginBottom: 10,
                    }}>
                    <View>
                        <Text style={{ fontSize: 16, color: COLORS.lightGray }}>
                            <Text style={{ color: '#000', fontWeight: '700' }}>
                                {
                                    this.props.job.referrals.filter(
                                        (item) => item.status != 'referred',
                                    ).length
                                }
                            </Text>{' '}
                            {customTranslate('ml_Accepted')}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ fontSize: 16, color: COLORS.lightGray }}>
                            <Text style={{ color: '#000', fontWeight: '700' }}>
                                {this.props.job.referrals.length}
                            </Text>{' '}
                            {customTranslate('ml_Referrals')}
                        </Text>
                    </View>
                </View>
                {/* <View style={[styles.buttonRow, { marginBottom: 10 }]}>
          <ReferralModal job={this.props.job} />
          {this.props.referalPolicyText ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.Interested();
              }}
            >
              <Icon name="checkmark_circle" color={COLORS.white} />
              <Text style={styles.buttontext}>I'm Interested</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.onShare();
              }}
            >
              <Icon name="share" color={COLORS.white} />
              <Text style={styles.buttontext}>Share</Text>
            </TouchableOpacity>
          )}
          <Modal transparent visible={this.state.Interested} animationType="fade">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.40)',
              }}
            >
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 10,
                  paddingTop: 15,
                  width: Dimensions.get('window').width - 20,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 5 }}>
                    <Text
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        color: COLORS.red,
                        fontSize: 28,
                        marginBottom: 0,
                        fontWeight: '600',
                        alignSelf: 'center',
                      }}
                    >
                      Interested?
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        Interested: false,
                      });
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'flex-start',
                      alignItems: 'flex-end',
                      marginTop: -15,
                    }}
                  >
                    <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
                  </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: '3%' }}>
                  <Text style={{ color: 'black', fontWeight: '300', fontWeight: '400' }}>
                    Let us know that you are interested in this position and we will be in touch!.
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.red,
                    padding: 10,
                    margin: 15,
                    height: 40,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    this.handleSubmit();
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 14,
                      borderRadius: 5,
                      marginRight: 10,
                    }}
                  >
                    {' '}
                    Submit Me For This Position
                  </Text>
                  <Icon name="checkmark_circle" color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View> */}

                <Dialog.Container
                    visible={this.state.submitSuccess}
                    style={{
                        width: Dimensions.get('window').width - 50,
                        marginHorizontal: 25,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: -10,
                            marginRight: 20,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeSuccess();
                            }}>
                            <Image
                                style={{ width: 20, height: 20, borderRadius: 10 }}
                                source={require('../../../_shared/assets/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="checkmark_circle" color={COLORS.green} size={100} />
                    </View>
                    <View style={{ marginHorizontal: '3%' }}>
                        <Text
                            style={{ color: 'black', fontWeight: '300', fontWeight: '400' }}>
                            {' '}
                            {customTranslate('ml_Success')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            margin: 15,
                            height: 40,
                            borderRadius: 5,
                        }}
                        onPress={() => {
                            this.closeSuccess();
                        }}>
                        <Text
                            style={{
                                color: COLORS.blue,
                                textAlign: 'center',
                                fontSize: 18,
                                borderRadius: 5,
                            }}>
                            {customTranslate('ml_CloseThisWindow')}{' '}
                        </Text>
                    </TouchableOpacity>
                </Dialog.Container>
                <Dialog.Container
                    visible={this.state.alreadySubmit}
                    style={{
                        width: Dimensions.get('window').width - 50,
                        marginHorizontal: 25,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginTop: -10,
                            marginRight: 20,
                        }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    alreadySubmit: false,
                                });
                            }}>
                            <Image
                                style={{ width: 20, height: 20, borderRadius: 10 }}
                                source={require('../../../_shared/assets/close.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="checkmark_circle" color={COLORS.green} size={100} />
                    </View>
                    <View style={{ marginHorizontal: '3%' }}>
                        <Text
                            style={{ color: 'black', fontWeight: '300', fontWeight: '400' }}>
                            {' '}
                            {customTranslate('ml_Success')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            padding: 10,
                            margin: 15,
                            height: 40,
                            borderRadius: 5,
                        }}
                        onPress={() => {
                            this.setState({
                                alreadySubmit: false,
                            });
                        }}>
                        <Text
                            style={{
                                color: COLORS.blue,
                                textAlign: 'center',
                                fontSize: 18,
                                borderRadius: 5,
                            }}>
                            {customTranslate('ml_CloseThisWindow')}{' '}
                        </Text>
                    </TouchableOpacity>
                </Dialog.Container>
                {salary && salary.from ? (
                    <Text style={styles.label}>
                        {customTranslate('ml_SalaryRange')}:{' '}
                        <Text style={styles.body}>
                            <FormattedCurrency
                                value={salary.from}
                                currency="USD"
                                style={styles.body}
                                maximumFractionDigits={0}
                            />
                            {salary.to && ' - '}
                            {salary.to && (
                                <FormattedCurrency
                                    value={salary.to}
                                    currency="USD"
                                    style={styles.body}
                                    maximumFractionDigits={0}
                                />
                            )}
                        </Text>{' '}
                    </Text>
                ) : null}
                <View style={styles.description}>
                    {this.state.status ? (
                        <HTML
                            numberOfLines={this.state.numOfLines}
                            onLayout={(e) => {
                                this.setState({
                                    numOfLines: e.nativeEvent.layout.height > 20 ? 2 : 1,
                                });
                            }}
                            tagsStyles={{
                                p: { fontSize: 13, color: COLORS.lightGray },
                                ul: { fontSize: 13, color: COLORS.lightGray },
                            }}
                            containerStyle={styles.htmlContainer}
                            html={description}
                        />
                    ) : (
                        <View>
                            <HTML
                                numberOfLines={1}
                                tagsStyles={{
                                    p: { fontSize: 13, color: COLORS.lightGray },
                                    ul: { fontSize: 13, color: COLORS.lightGray },
                                }}
                                containerStyle={styles.htmlContainer}
                                html={description.substr(0, 100)}
                            />
                        </View>
                    )}

                    {description.replace(/<[^>]*>?/gm, '').length > 100 ? (
                        this.state.status ? (
                            <TouchableOpacity onPress={this.ShowHideTextComponentView}>
                                <Text style={{ color: COLORS.blue, fontWeight: 'bold' }}>
                                    {customTranslate('ml_seeLess')}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={this.ShowHideTextComponentView}>
                                <Text
                                    style={{
                                        color: COLORS.blue,
                                        fontWeight: 'bold',
                                        textTransform: 'lowercase',
                                    }}>
                                    {customTranslate('ml_Jobs_SeeMore')}
                                </Text>
                            </TouchableOpacity>
                        )
                    ) : null}

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {this.props.referalPolicyText && !disableShareLink ? (
                            <TouchableOpacity
                                onPress={() => {
                                    this.onShare();
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="share" color={COLORS.blue} />
                                    <Text style={{ color: COLORS.blue }}>{customTranslate('ml_Share')}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>

                {_matches && (
                    <View style={styles.referral}>
                        <Image
                            style={styles.tick}
                            source={require('../../../_shared/assets/tick-inside-circle.png')}
                        />
                        <TouchableOpacity onPress={() => Actions.contacts()}>
                            <Text style={styles.network}>{`${_matches} ${_matches > 1 ? customTranslate('ml_People') : 'Person'
                                }`}</Text>
                        </TouchableOpacity>
                        <Text style={styles.match}>
                            {_matches === 1
                                ? customTranslate('ml_Dashboard_PersonMatch').replace('Match', 'matches')
                                : customTranslate('ml_Dashboard_PersonMatch')}
                        </Text>
                    </View>
                )}
                <ContactDetails
                    visible={this.state.viewContactModal}
                    closeViewContact={this.closeViewContactModal}
                    details={{ id: this.state.viewContactId }}
                />
            </View>
        );
    }

    renderRecs() {
        if (this.props.job.referrals && !this.props.job.referrals.length) {
            return (
                <View style={styles.noReferrals}>
                    <Image
                        source={getLightGrayLogo()}
                        resizeMode="contain"
                        style={{ width: 180, height: 180, marginBottom: 5 }}
                    />
                    <Text style={{ color: '#999999' }}>{customTranslate('ml_NoReferrals')}</Text>
                </View>
            );
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginHorizontal: 5,
                    justifyContent: 'space-between',
                }}>
                {this.props.job.referrals.map((item) => (
                    <ReferredCard
                        referral={item}
                        handleContactPress={this.handleReferContactDetail}
                        noJob
                        key={item.id}
                    />
                ))}
            </View>
        );
    }
    closeViewContactModal = () => {
        this.setState({
            viewContactModal: false,
        });
    };
    handleContactNameClick = (id) => {
        this.setState({ viewContactId: id, viewContactModal: true });
    };

    render() {
        // var rAndR = this.state.referralMatches
        //console.log('.....', this.state);
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            company: { symbol, theme },
        } = this.props.currentUser;
        theme = theme ? JSON.parse(theme) : {};
        if (this.state.loading) {
            return (
                // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                <View
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        zIndex: 4,
                        elevation: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        bottom: 0,
                    }}>
                    <Animated.Image
                        style={{
                            height: 50,
                            width: 50,
                            top: '50%',
                            left: width / 2 - 25,
                            transform: [{ rotate: spin }],
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
        return (
            <ScrollView
                style={styles.outerContainer}
                contentContainerStyle={styles.outerContentContainer}>
                <View elevation={0} style={styles.tile}>
                    {this.props.currentJob && !this.state.loading ? (
                        this.renderDetails()
                    ) : (
                        <View
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Animated.Image
                                style={{ height: 40, width: 40, transform: [{ rotate: spin }] }}
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
                    )}
                </View>
                <Text style={styles.referralHeader}>{customTranslate('ml_Referrals')}</Text>
                <View style={{ width: '100%' }}>{this.renderRecs()}</View>
                <ContactDetails
                    visible={this.state.viewContactModal}
                    closeViewContact={this.closeViewContactModal}
                    details={this.state.viewContact}
                    fullData={this.state.fullContactData}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        width: 200,
    },
    referralHeader: {
        fontSize: 16,
        letterSpacing: 1.5,
        marginLeft: 20,
        marginTop: 30,
        marginBottom: 10,
        fontWeight: '600',
        alignSelf: 'flex-start',
    },
    noReferrals: {
        width: '90%',
        marginBottom: 15,
        marginTop: 10,
        marginLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tile: {
        width: width - 15,
        marginTop: 10,
        backgroundColor: COLORS.white,
        // shadowColor: COLORS.lightGray,
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 1,
        //   width: 1,
        // },
        padding: 15,
        borderRadius: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.lightGray,
        marginVertical: 1,
    },
    body: {
        fontWeight: 'normal',
        color: COLORS.darkGray,
    },
    container: {
        flex: 0,
        paddingLeft: 5,
    },
    outerContainer: {
        flex: 1,
    },
    outerContentContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    htmlContainer: {
        width: '100%',
        flex: 0,
    },
    headerRow: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    title: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    referalText: {
        fontSize: 15,
        color: COLORS.green,
        fontWeight: 'bold',
    },
    department: {
        flexDirection: 'row',
        marginRight: 10,
        color: COLORS.darkGray,
        alignItems: 'center',
    },
    deptext: {
        fontSize: 12,
        marginLeft: 3,
        color: COLORS.darkGray,
    },
    jobType: {
        color: '#8d99a3',
        fontSize: 12,
    },
    folder: {
        bottom: 1,
    },
    network: {
        color: COLORS.blue,
        fontSize: 11,
        marginLeft: 5,
    },
    match: {
        color: COLORS.lightGray,
        fontSize: 11,
        marginLeft: 2,
    },
    location: {
        width: 15,
        height: 19,
        // tintColor: COLORS.lightGray,
    },
    tick: {
        width: 15,
        height: 15,
        tintColor: COLORS.green,
        marginLeft: 5,
    },
    row: {
        width: '100%',
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: COLORS.transparent,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
    },
    description: {
        // marginTop: 0,
        overflow: 'hidden',
        width: '100%',
    },
    referral: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: COLORS.blue,
        paddingLeft: 22,
        paddingRight: 22,
        paddingTop: 7,
        paddingBottom: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: (10 / 375) * width,
        borderRadius: 5,
        height: (38 / 812) * height,
        width: (146 / 375) * width,
    },
    buttontext: {
        fontSize: 11,
        color: COLORS.white,
        marginLeft: 8,
    },
});
export default withApollo(ManageJobDetail);
