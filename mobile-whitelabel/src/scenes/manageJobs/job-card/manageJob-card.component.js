import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Share,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import get from 'lodash/get';

import Icon from '../../../_shared/components/icon';
import { borderedTile } from '../../../_shared/components/bordered-tile/bordered-tile';
import { ReferralModal } from '../../../_shared/components/refer-someone/referral-modal.container';
import { COLORS } from '../../../_shared/styles/colors';
import Dialog from 'react-native-dialog';
import gql from 'graphql-tag';
//import Dimensions from 'Dimensions';
import { parseJsonFields } from '../../../_store/_shared/services/parse-api.service';
import { createContact } from '../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
// import { GetUserByCognitoId } from '../../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
const { width, height } = Dimensions.get('window');
import { calculateReferralBonus } from '../../../_shared/services/utils';
import { debounce } from 'lodash';
import Icons from 'react-native-vector-icons/Ionicons';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';

class ManageJobCard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            allowSelfReferrals: '',
            Interested: false,
            interestedArr: [],
            buttonColor: false,
            contactId: '',
            clicked: true,
            selfAnimatedModal: false,
            submitSuccess: false,
            alreadySubmit: false,
        };
    }
    componentDidMount() {
        //performance improvement
        // if (this.props.job) {
        //   const job = this.props.job;
        //   this.props.client
        //     .query({
        //       query: JobMatchesByJobId,
        //       variables: {
        //         jobId: job.id,
        //         first: 100,
        //         after: '',
        //       },
        //     })
        //     .then(data => {
        //       const newData = data;
        //       if (newData.data.queryJobMatchesByJobIdIndex) {
        //         const matchResults = newData.data.queryJobMatchesByJobIdIndex.items.filter(
        //           jobMatch =>
        //             jobMatch.userId === this.props.currentUser &&
        //             jobMatch.relevance >= 30 &&
        //             jobMatch.matchStatus !== false
        //         );
        //         if (matchResults.length > 0 && matchResults[0].contactId) {
        //           this.setState({
        //             contactId: matchResults[0].contactId
        //           })
        //           // AsyncStorage.setItem('contactId', matchResults[0].contactId);
        //         }
        //       }
        //     });
        // }
        //performance improvement
        this.getJobDetails();
    }

    getJobDetails = () => {
        this.props.client
            .query({
                query: gql`
          query GetJob($id: ID!) {
            getJob(id: $id) {
              id
              companyId
              externalJobId
              internalJobLink
              lat
              lng
              company {
                id
                name
                defaultBonusAmount
                contactIncentiveBonus
              }
              departmentId
              department {
                id
                name
              }
              referrals {
                id
                company {
                  id
                  defaultBonusAmount
                  contactIncentiveBonus
                }
                companyId
                contactId
                contact {
                  id
                  emailAddress
                  lastName
                  firstName
                  socialMediaAccounts
                  phoneNumber
                  jobHistory
                  fullContactData
                }
                userId
                user {
                  id
                  firstName
                  lastName
                  incentiveEligible
                }
                jobId
                job {
                  id
                  title
                  departmentId
                  referralBonus
                  department {
                    id
                    name
                  }
                }
                note
                message
                referralDate
                referralType
                status
                hireDate
              }
              title
              referralBonus
              description
              publicLink
              location
              shares
              views
              status
              dateCreated
            }
          }
        `,
                variables: {
                    id: this.props.jobId,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                console.log('job detail', res);
                let job = get(res, 'data.getJob');
                if (job) {
                    job = Object.assign(
                        job,
                        parseJsonFields(['location', 'salary', 'referralBonus'], job),
                    );
                }
                // this.getCurrentTieredBonus(job);
                this.setState({ job });
            });
    };

    checkIsAlreadyReferredToJob1 = () => {
        const { job, currentUser, currentUser1 } = this.props;
        let isAlreadyReferredToJob = job.referrals.filter((referral) => {
            if (
                referral.contact &&
                referral.contact.emailAddress != currentUser1.emailAddress
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

    Interested() {
        if (!this.checkIsAlreadyReferredToJob1()) {
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

    handleSubmit = async () => {
        this.setState({ Interested: false }, () => {
            setTimeout(() => this.props.toggleIsSubmitting(), 500);
        });

        const { job, onCreateReferral, currentUser1, setCurrentUser } = this.props;
        const contactExists = this.props.currentUser1.contacts.some((contact) => {
            return contact.emailAddress === currentUser1.emailAddress;
        });
        const contactId = this.props.currentUser1.contacts.find((contact) => {
            return contact.emailAddress === currentUser1.emailAddress
                ? contact.id
                : null;
        });

        if (!contactExists) {
            this.props.client
                .mutate({
                    mutation: gql(createContact),
                    variables: {
                        input: {
                            firstName: currentUser1.firstName,
                            lastName: currentUser1.lastName,
                            emailAddress: currentUser1.emailAddress,
                            socialMediaAccounts: null,
                            userId: currentUser1.id,
                            companyId: currentUser1.companyId,
                            jobHistory: null,
                            importMethod: 'email',
                        },
                    },
                })
                .then(async (response) => {
                    await onCreateReferral({
                        input: {
                            companyId: currentUser1.companyId,
                            contactId: response.data.createContact.id,
                            userId: currentUser1.id,
                            jobId: job.id,
                            status: 'accepted',
                            note: null,
                            message: null,
                            referralType: 'self',
                        },
                    });

                    setTimeout(() => this.props.toggleIsSubmitting(), 6000);
                    setTimeout(() => {
                        this.setState({ submitSuccess: true });
                    }, 8000);
                });
        } else {
            await onCreateReferral({
                input: {
                    companyId: currentUser1.companyId,
                    contactId: contactId.id,
                    userId: currentUser1.id,
                    jobId: job.id,
                    status: 'accepted',
                    note: null,
                    message: null,
                    referralType: 'self',
                },
            });
            setTimeout(() => this.props.toggleIsSubmitting(), 6000);
            setTimeout(() => {
                this.setState({ submitSuccess: true });
            }, 8000);
        }
    };

    render() {
        let {
            job,
            job: { title, department, description, referralBonus, status, id },
            currencySymbol,
            currencyRate,
            currentTieredBonus,
        } = this.props;
        let {
            campaignId,
            campaignStartDate,
            campaignEndDate,
            campaignTieredBonus,
            campaignTieredBonusId,
            campaignName,
        } = this.props.job;
        if (
            campaignId &&
            new Date(campaignStartDate) <= new Date() <= new Date(campaignEndDate) &&
            !campaignTieredBonus.archived
        ) {
            currentTieredBonus = JSON.parse(campaignTieredBonus);
        }
        let contactIncentiveBonus = this.state.job
            ? this.state.job?.company?.contactIncentiveBonus
            : 0;
        // let contactIncentiveBonus = 0
        let location = this.state.job ? this.state.job.location : null;
        if (typeof location === 'string') {
            location = JSON.parse(location);
        }
        let parsedReferralBonus;
        if (typeof referralBonus === 'string') {

            parsedReferralBonus = JSON.parse(referralBonus);
        } else {
            parsedReferralBonus = referralBonus;
        }

        const refBonus = parsedReferralBonus || referralBonus;
        const { matches } = this.state;
        if (!parsedReferralBonus) {
            parsedReferralBonus = {};
        }
        return this.state.job ? (
            <TouchableOpacity
                style={styles.container}
                onPress={() =>
                    Actions.manageJobDetail({
                        job: this.state.job,
                        referalPolicyText: this.props.selfReferralValue,
                        currentUser1: this.props.currentUser1,
                        onCreateReferral: this.props.onCreateReferral,
                        propsJob: this.props.job,
                    })
                }>
                <View style={styles.headerRow}>
                    <View style={{ width: 200 }}>
                        <Text numberOfLines={2} style={styles.title}>
                            {title}
                        </Text>
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
                                        parsedReferralBonus.amount,
                                        this.props.currentUser1.incentiveEligible,
                                        currentTieredBonus,
                                        'employee',
                                    ) * currencyRate,
                                )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        </Text>
                    </View>
                    <View />
                </View>
                <View style={styles.row}>
                    <View style={styles.department}>
                        <Icon name="folder" color={COLORS.darkGray} style={styles.folder} />
                        <Text style={styles.deptext}>{department && department.name}</Text>
                    </View>
                    <View style={[styles.department, { width: 200 }]}>
                        <Icon name="placeholder" color={COLORS.darkGray} />
                        <Text style={styles.deptext} numberOfLines={3}>
                            {!location.isRemote && (location.city || location.state)
                                ? `${location.city}, ${location.state}`
                                : customTranslate('ml_Remote')}
                        </Text>
                    </View>
                </View>
                {/* {status !== 'closed' && (
          <View style={styles.buttonRow}>
            <ReferralModal job={job} clicked={this.state.clicked} />
            {this.props.selfReferralValue ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.Interested();
                }}
              >
                <Icon name="checkmark_circle" color={COLORS.white} />
                <Text style={[styles.buttontext]}>I'm Interested</Text>
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
                      {' '}
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

            <Dialog.Container
              visible={this.state.submitSuccess}
              style={{ width: Dimensions.get('window').width - 50, marginHorizontal: 25 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: -10,
                  marginRight: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.closeSuccess();
                  }}
                >
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
                <Text style={{ color: 'black', fontWeight: '300', fontWeight: '400' }}>
                  {' '}
                  Success! Your information has been submitted for this position.
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
                }}
              >
                <Text
                  style={{
                    color: COLORS.blue,
                    textAlign: 'center',
                    fontSize: 18,
                    borderRadius: 5,
                  }}
                >
                  Close This Window{' '}
                </Text>
              </TouchableOpacity>
            </Dialog.Container>
            <Dialog.Container
              visible={this.state.alreadySubmit}
              style={{ width: Dimensions.get('window').width - 50, marginHorizontal: 25 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: -10,
                  marginRight: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      alreadySubmit: false,
                    });
                  }}
                >
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
                <Text style={{ color: 'black', fontWeight: '300', fontWeight: '400' }}>
                  {' '}
                  Success! Your information has been submitted for this position.
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
                }}
              >
                <Text
                  style={{
                    color: COLORS.blue,
                    textAlign: 'center',
                    fontSize: 18,
                    borderRadius: 5,
                  }}
                >
                  Close This Window{' '}
                </Text>
              </TouchableOpacity>
            </Dialog.Container>
          </View>
        )} */}
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        marginTop: 5,
                        justifyContent: 'space-between',
                        borderBottomWidth: 0.5,
                        paddingBottom: 10,
                        borderBottomColor: COLORS.lightGray,
                    }}>
                    <View>
                        <Text style={{ fontSize: 16, color: COLORS.lightGray }}>
                            <Text style={{ color: '#000', fontWeight: '700' }}>
                                {
                                    this.state.job.referrals.filter(
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
                                {this.state.job.referrals.length}
                            </Text>{' '}
                            {customTranslate('ml_Referrals')}
                        </Text>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Text style={{ fontSize: 16, color: COLORS.lightGray }}>
                            <Text style={{ color: '#000', fontWeight: '700' }}>
                                {this.props.job.views}
                            </Text>{' '}
              Views
            </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: COLORS.lightGray }}>
                        Job Shares:{' '}
                        <Text style={{ color: '#000', fontWeight: '700' }}>
                            {this.props.job.views}
                        </Text>{' '}
                    </Text>
                    <Text style={{ fontSize: 14, color: COLORS.lightGray, marginLeft: 10 }}>
                        Smart Referrals:{' '}
                        <Text style={{ color: '#000', fontWeight: '700' }}>
                            {this.props.job.views}
                        </Text>{' '}
                    </Text>
                </View>
            </TouchableOpacity>
        ) : (
            <View
                style={
                    this.props.onDeckRefer
                        ? [
                            styles.tile,
                            { width: width > 450 ? width / 2 - 15 : width - 40 },
                            width > 450 && { maxWidth: 300 },
                        ]
                        : [
                            styles.tile,
                            { width: width > 450 ? width / 2 - 15 : width - 15 },
                            width > 450 && { maxWidth: 300 },
                        ]
                }>
                <SkeletonPlaceholder>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                marginLeft: 0,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            <View style={{ width: 180, height: 23, borderRadius: 4 }} />
                            <View
                                style={{
                                    width: 50,
                                    height: 23,
                                    borderRadius: 4,
                                    alignSelf: 'flex-end',
                                }}
                            />
                        </View>
                        <View
                            style={{ width: 180, height: 12, borderRadius: 4, marginTop: 5 }}
                        />
                        <View
                            style={{ width: 180, height: 13, borderRadius: 4, marginTop: 18 }}
                        />
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <View
                                style={{
                                    width: '100%',
                                    height: 35,
                                    borderRadius: 4,
                                    marginTop: 5,
                                }}
                            />
                            <View
                                style={{
                                    width: '100%',
                                    height: 35,
                                    borderRadius: 4,
                                    marginTop: 5,
                                }}
                            />
                        </View>
                    </View>
                </SkeletonPlaceholder>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tile: {
        marginVertical: 8,
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 4,
    },
    container: {
        //width: width - 70,
        paddingVertical: (16 / 812) * height,
        width: width > 450 ? width / 2 - 15 : width - 15,
        marginVertical: 8,
        backgroundColor: COLORS.white,
        marginHorizontal: 4,
        padding: 15,
        borderRadius: 10,
        // paddingLeft: 5,
    },
    htmlContainer: {
        width: '100%',
        flex: 0,
    },
    headerRow: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: (12 / 736) * height,
        width: '100%',
    },
    title: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
        height: 200,
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
    tick: {
        width: 15,
        height: 15,
        tintColor: COLORS.green,
        marginLeft: 5,
    },
    row: {
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
        paddingRight: 5,
        maxHeight: 100,
        overflow: 'hidden',
        marginTop: 10,
    },
    referral: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        // flexDirection: 'row',
        // backgroundColor: COLORS.blue,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingLeft: 22,
        // paddingRight: 22,
        // paddingTop: 7,
        // flex: 1,
        // paddingBottom: 7,
        // borderRadius: 5,

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
export default ManageJobCard;
// export default JobCard;
