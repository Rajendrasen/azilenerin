import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Text,
    Linking,
    ScrollView,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    Dimensions,
} from 'react-native';
import { COLORS } from '../../../_shared/styles/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import moment from 'moment';
import OnDeckModal from './onDeck.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import ReferredCard from '../../referrals/referral-items/referral-card.container';
import { getErinSquare, getLightGrayLogo } from '../../../WhiteLabelConfig';
let { width } = Dimensions.get('window');

class ManageReferralDetail extends Component {
    state = {
        width: Dimensions.get('window').width,
        showJobHistory: false,
        spinAnim: new Animated.Value(0),
        details: {
            firstName: 'Mike',
            lastName: 'Stafiej',
            emailAddress: 'test@mailinator.com',
            phoneNumber: '9999999999',
        },
        fullData: {
            linkedin: 'www.linkedin.com',
            details: {
                employment: [
                    {
                        title: 'React Dev',
                        name: 'Techaheadcorp',
                        start: {
                            month: '3',
                            year: '2011',
                        },
                        end: {
                            month: '3',
                            year: '2011',
                        },
                    },
                ],
            },
        },
    };
    componentDidMount() {
        this.spin();
    }
    componentDidUpdate(prevProps) {
        if (
            !this.props.loading &&
            this.props.referralDetails &&
            this.props.loading != prevProps.loading
        ) {
            this.setState({
                details: this.props.referralDetails.contact
                    ? this.props.referralDetails.contact
                    : {},
                fullData: this.props.referralDetails.contact
                    ? JSON.parse(this.props.referralDetails.contact.fullContactData)
                    : {},
            });
        }
    }
    handleJobHistory = () => {
        this.setState((state) => ({ showJobHistory: !state.showJobHistory }));
    };
    handleSocialClick = (url) => {
        Linking.openURL(url);
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
    renderRecs() {
        if (
            !this.props.referralDetails.contact ||
            !this.props.referralDetails.contact.referrals ||
            !this.props.referralDetails.contact.referrals.length
        ) {
            return (
                <View style={styles.noReferrals}>
                    <Image
                        source={getLightGrayLogo()}
                        resizeMode="contain"
                        style={{ width: 180, height: 180, marginBottom: 5 }}
                    />
                    <Text style={{ color: '#999999' }}>
                        There are no Referrals for this contact.
                    </Text>
                </View>
            );
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                }}>
                {this.props.referralDetails.contact.referrals.map((item) => (
                    <ReferredCard
                        referral={item}
                        //handleContactPress={this.handleReferContactDetail}
                        noJob
                        key={item.id}
                        jobDetail
                        width={this.state.width}
                    />
                ))}
            </View>
        );
    }
    render() {
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let {
            currentUser: {
                company: { enableGeneralReferrals, symbol, theme },
            },
            referralDetails,
        } = this.props;
        theme = theme ? JSON.parse(theme) : {};
        let questionsData = referralDetails ? referralDetails.questionsData : null;
        let questions = questionsData ? JSON.parse(questionsData) : null;
        return (
            <View style={{ flex: 1 }}>
                {this.props.referralDetails && !this.props.loading ? (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ alignItems: 'center' }}>
                        <View style={styles.tile} elevation={0}>
                            <View style={{ width: '100%', flexDirection: 'row' }}>
                                <View style={{ flex: 2 }}>
                                    <Text
                                        style={{
                                            fontSize: 28,
                                            marginVertical: 5,
                                            fontWeight: '700',
                                            color: '#424242',
                                        }}>
                                        {`${_.get(this.state.details, 'firstName') ||
                                            _.get(this.state.details, 'name', '')
                                            } ${_.get(this.state.details, 'lastName') ||
                                            _.get(this.state.details, 'name', '')
                                            }`}
                                    </Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    {this.props.referralDetails.contact &&
                                        enableGeneralReferrals && (
                                            <OnDeckModal
                                                contact={this.props.referralDetails.contact}
                                                company={this.props.currentUser.company}
                                            />
                                        )}
                                </View>
                            </View>

                            {this.state.details.emailAddress && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcon
                                        size={18}
                                        name="email"
                                        color="gray"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        style={{
                                            color: '#018dd3',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 5,
                                        }}>
                                        {this.state.details.emailAddress}
                                    </Text>
                                </View>
                            )}
                            {this.state.details.phoneNumber && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcon
                                        size={18}
                                        name="phone"
                                        color="gray"
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        style={{
                                            color: '#018dd3',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            marginBottom: 5,
                                        }}>
                                        {this.state.details.phoneNumber}
                                    </Text>
                                </View>
                            )}
                            {/* {this.state.fullData.title && (
            <Text style={{ fontSize: 16, color: '#424242' }}>
              {this.state.fullData.title}
              {` @ `}
              {this.state.fullData.organization ? this.state.fullData.organization : null}
            </Text>
          )} */}
                            {/* {this.state.fullData.location && (
            <Text style={{ fontSize: 16, color: '#424242' }}>{this.state.fullData.location}</Text>
          )} */}

                            <View>
                                {/* <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 5, color: '#454545' }}>
              Social
            </Text> */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                    }}>
                                    {this.state.fullData &&
                                        (this.state.fullData.linkedin ||
                                            this.state.fullData.facebook ||
                                            this.state.fullData.twitter) ? (
                                        <React.Fragment>
                                            {this.state.fullData.twitter && (
                                                <MaterialIcon
                                                    size={35}
                                                    name="twitter-box"
                                                    color="#018dd3"
                                                    onPress={() =>
                                                        this.handleSocialClick(this.state.fullData.twitter)
                                                    }
                                                />
                                            )}
                                            {this.state.fullData.facebook && (
                                                <MaterialIcon
                                                    size={35}
                                                    name="facebook-box"
                                                    color="#018dd3"
                                                    onPress={() =>
                                                        this.handleSocialClick(this.state.fullData.facebook)
                                                    }
                                                />
                                            )}
                                            {this.state.fullData.linkedin && (
                                                <MaterialIcon
                                                    size={35}
                                                    name="linkedin-box"
                                                    color="#018dd3"
                                                    onPress={() =>
                                                        this.handleSocialClick(this.state.fullData.linkedin)
                                                    }
                                                />
                                            )}
                                            {/* <MaterialIcon size={35} name="facebook-box" color="#018dd3" />
                    <MaterialIcon size={35} name="linkedin-box" color="#018dd3" /> */}
                                        </React.Fragment>
                                    ) : null}
                                </View>
                            </View>
                            {this.props.referralDetails.contactResume ? (
                                <View style={{ marginVertical: 10 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', color: '#454545' }}>
                                        {customTranslate('ml_Resume')}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            Linking.openURL(
                                                'https://erin-documents.s3.us-east-2.amazonaws.com/' +
                                                this.props.referralDetails.contactResume.key,
                                            )
                                        }
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcon
                                            size={18}
                                            name="file-document"
                                            color="gray"
                                            style={{ marginRight: 3 }}
                                        />
                                        <Text style={{ fontWeight: '500', color: COLORS.blue }}>
                                            {customTranslate('ml_DownloadResume')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.props.referralDetails.message ? (
                                <View style={{ marginVertical: 10 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', color: '#454545' }}>
                                        {customTranslate('ml_ReferralComments')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcon
                                            size={18}
                                            name="chat"
                                            color="gray"
                                            style={{ marginRight: 3 }}
                                        />
                                        <View>
                                            <Text style={{ color: COLORS.lightGray }}>
                                                <Text style={{ color: COLORS.blue }}>
                                                    {this.props.referralDetails.job.title}
                                                </Text>{' '}
                                                {customTranslate('ml_By')}{' '}
                                                <Text style={{ color: COLORS.blue }}>
                                                    {this.props.referralDetails.user
                                                        ? this.props.referralDetails.user.firstName
                                                        : this.props.currentUser.firstName +
                                                            ' ' +
                                                            this.props.referralDetails.user
                                                            ? this.props.referralDetails.user.lastName
                                                            : this.props.currentUser.lastName}
                                                </Text>{' '}
                                                {customTranslate('ml_On')}{' '}
                                                {moment(this.props.referralDetails.referralDate).format(
                                                    'M/D/YYYY',
                                                )}
                                            </Text>
                                            <Text
                                                style={{ color: COLORS.lightGray, fontStyle: 'italic' }}>
                                                {this.props.referralDetails.message}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : null}

                            {this.state.fullData &&
                                this.state.fullData.title &&
                                this.state.fullData.organization ? (
                                <View style={{ marginVertical: 10 }}>
                                    <Text
                                        style={{ fontSize: 18, fontWeight: '700', color: '#454545' }}>
                                        {customTranslate('ml_SmartReferralInfo')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ color: COLORS.lightGray, flex: 1 }}>
                                                {this.state.fullData.title + ' '}@{' '}
                                                <Text style={{ fontWeight: '700' }}>
                                                    {this.state.fullData.organization}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : null}

                            {/* <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 5, color: '#454545' }}>
              Bio
            </Text>
            {this.state.fullData.bio ? (
              <Text style={{ fontSize: 16, color: '#424242' }}>{this.state.fullData.bio}</Text>
            ) : (
              <Text>N/A</Text>
            )}
          </View> */}
                            {questions && (
                                <View style={{ marginTop: 5 }}>
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            color: COLORS.grayMedium,
                                            fontWeight: '700',
                                        }}>
                                        Referral Questions
                                    </Text>
                                    {questions.map((item, i) => (
                                        <View style={{ marginVertical: 5 }} key={item.name}>
                                            <Text
                                                style={{ fontWeight: '600', color: COLORS.grayMedium }}>
                                                Ques {i}.{' '}
                                                <Text
                                                    style={{
                                                        fontweight: 'normal',
                                                        color: COLORS.lightGray,
                                                    }}>
                                                    {item.question}
                                                </Text>
                                            </Text>
                                            <Text
                                                style={{ fontWeight: '600', color: COLORS.grayMedium }}>
                                                Ans.{' '}
                                                <Text
                                                    style={{
                                                        fontweight: 'normal',
                                                        color: COLORS.lightGray,
                                                    }}>
                                                    {item.text ? item.text : item.value}
                                                </Text>
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={{ marginTop: 5 }}>
                                <TouchableOpacity
                                    style={{
                                        padding: 5,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        marginBottom: this.state.showJobHistory ? 10 : 5,
                                        borderStyle: 'dashed',
                                        borderColor: COLORS.lightGray,
                                        alignSelf: 'flex-start',
                                    }}
                                    onPress={this.handleJobHistory}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: '400',
                                            color: COLORS.lightGray,
                                        }}>
                                        {customTranslate('ml_ShowJobHistory')}
                                    </Text>
                                </TouchableOpacity>

                                {this.state.showJobHistory && this.state.fullData ? (
                                    this.state.fullData.details &&
                                        this.state.fullData.details.employment &&
                                        this.state.fullData.details.employment.length > 0 ? (
                                        this.state.fullData.details.employment.map((emp, i) => (
                                            <View
                                                key={i}
                                                style={{
                                                    borderBottomWidth: 0.5,
                                                    borderBottomColor: '#ddd',
                                                    paddingBottom: 5,
                                                    marginBottom: 10,
                                                }}
                                                key={i}>
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        color: '#8e98a2',
                                                    }}>
                                                    {customTranslate('ml_Position')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}>
                                                        {emp.title ? emp.title : 'N/A'}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        marginTop: 3,
                                                        color: '#8e98a2',
                                                    }}>
                                                    {customTranslate('ml_Organization')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}>
                                                        {emp.name ? emp.name : 'N/A'}
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        color: 'grey',
                                                        fontSize: 17,
                                                        marginTop: 3,
                                                        color: '#8e98a2',
                                                    }}>
                                                    {customTranslate('ml_Dates')}:{' '}
                                                    <Text
                                                        style={{
                                                            marginLeft: 3,
                                                            fontWeight: 'normal',
                                                            fontSize: 16,
                                                            color: '#424242',
                                                        }}>
                                                        {emp.start
                                                            ? `${emp.start.month}/${emp.start.year}`
                                                            : 'N/A'}
                                                        {' - '}
                                                        {emp.end
                                                            ? `${emp.end.month}/${emp.end.year}`
                                                            : emp.start
                                                                ? customTranslate('Present')
                                                                : 'N/A'}
                                                    </Text>
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text>N/A</Text>
                                    )
                                ) : null}
                            </View>
                        </View>
                        <Text style={styles.referralHeader}>{customTranslate('ml_Referrals')}</Text>
                        <View style={{ width: '100%' }}>{this.renderRecs()}</View>
                    </ScrollView>
                ) : (
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
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        marginBottom: 5,
        borderRadius: 10,
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
});

export default ManageReferralDetail;
