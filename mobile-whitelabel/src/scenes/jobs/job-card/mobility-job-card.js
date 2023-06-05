import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Modal,
    Share,
    Dimensions,
    Animated,
    Easing,
    Linking,
    Platform,
} from 'react-native';
import _ from 'lodash';
import { TextareaItem } from '@ant-design/react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import RenderHtml from 'react-native-render-html';

import DocumentPicker from 'react-native-document-picker';
import { uploadToS3 } from '../../../common';
import { withApollo } from 'react-apollo';
import { Actions } from 'react-native-router-flux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from '../../../_shared/components/icon';
import EvilIcon from 'react-native-vector-icons/SimpleLineIcons';
import { updateUserQuery } from '../../my-profile/profile.graphql';
import { borderedTile } from '../../../_shared/components/bordered-tile/bordered-tile';
import { GetJob } from '../../../_store/_shared/api/graphql/custom/jobs/job-by-id.graphql';
import { ReferralModal } from '../../../_shared/components/refer-someone/referral-modal.container';
import { getTieredBonus } from '../../../_store/_shared/api/graphql/custom/tiered-bonuses/get-tiered-bonus.graphql';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { COLORS, globalStyle } from '../../../_shared/styles/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialog from 'react-native-dialog';
import gql from 'graphql-tag';
//import Dimensions from 'Dimensions';
import { createContact } from '../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
// import { GetUserByCognitoId } from '../../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
const { width, height } = Dimensions.get('window');
import { calculateReferralBonus } from '../../../_shared/services/utils';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import get from 'lodash/get';
import { debounce } from 'lodash';
import Icons from 'react-native-vector-icons/Ionicons';
import { parseJsonFields } from '../../../_store/_shared/services/parse-api.service';
import { createReferral } from '../../../_store/_shared/api/graphql/custom/referrals/create-referral.graphql';
import ShareIcon from '../../../_shared/components/shareIcon/shareIcon.component';
import { queryReferralQuestionsByCompanyId } from '../../../_store/_shared/api/graphql/custom/referrals/query-referral-questions-by-company-id';
import { ScrollView } from 'react-native-gesture-handler';
import { getAppName } from '../../../WhiteLabelConfig';
import { hpx } from '../../../_shared/constants/responsive';
// import Mixpanel from 'react-native-mixpanel';
const managePointsLog = gql`
  mutation managePointsLog($input: ManagePointsLogInput!) {
    managePointsLog(input: $input) {
      id
      companyId
      userId
      event
      note
      operation
      points
    }
  }
`;
class MobilityJobCard extends React.PureComponent {
    onCreateReferral = (input) => {
        return this.props.client
            .mutate({
                mutation: gql(createReferral),
                variables: input,
            })
            .then((res) => res);
    };

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
            radius: new Animated.Value(3),
            width: new Animated.Value(100),
            showProgress: false,
            progress: 0,
            success: false,
            interestedInternalLink: false,
            referralQuestions: '',
            resume: '',
        };
    }
    componentDidMount() {
        this.getJobDetails();
        this.getReferralQuestions();
    }
    getReferralQuestions = () => {
        this.props.client
            .query({
                query: queryReferralQuestionsByCompanyId,
                variables: {
                    companyId: this.props.currentUser1.companyId,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                this.setState({
                    referralQuestions: _.sortBy(
                        res.data.queryReferralQuestionsByCompanyId.items,
                        ['sortOrder'],
                    ).filter((item) => !item.isCandidate),
                });
                let questions = res.data.queryReferralQuestionsByCompanyId.items;
                for (let i = 0; i < questions.length; i++) {
                    let question = JSON.parse(questions[i].questions);
                    if (
                        question.element &&
                        question.element.toLowerCase() === 'dropdown'
                    ) {
                        this.setState({ [question.field_name + 'drop']: false });
                    }
                }
            })
            .catch((err) => {
                console.log('question error', err);
            });
    };

    renderQuestionComponents = () => {
        let elements = [];
        if (this.state.referralQuestions) {
            let questions = this.state.referralQuestions.filter(
                (item) => item.isInterested,
            );
            elements = questions.map((item, i) => {
                let question = JSON.parse(item.questions);
                if (question['Ask for resume attachment']) {
                    return (
                        <View key={i} style={{ marginBottom: 10 }}>
                            {this.state.resume ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>{this.state.resume.name}</Text>
                                    <FontIcon
                                        onPress={() => this.setState({ resume: '' })}
                                        name="trash-o"
                                        size={17}
                                        color={COLORS.red}
                                        style={{ marginLeft: 5 }}
                                    />
                                </View>
                            ) : (
                                <Text
                                    onPress={() =>
                                        DocumentPicker.pick()
                                            .then((res) => {
                                                if (
                                                    !get(res, 'type', '')
                                                        .toLocaleLowerCase()
                                                        .includes('pdf')
                                                ) {
                                                    alert('Please select a valid pdf file.');
                                                    return;
                                                }
                                                this.setState({ resume: res });
                                            })
                                            .catch((err) => console.log('err', err))
                                    }
                                    key={i}>
                                    <Text style={{ color: COLORS.blue, fontWeight: 'bold' }}>
                                        Click here
                  </Text>{' '}
                  to attach Resume
                                </Text>
                            )}
                        </View>
                    );
                }
                if (!question.element) return null;
                if (question.element.toLowerCase() === 'label') {
                    return (
                        <View
                            key={question.field_name}
                            style={{
                                flexDirection: 'row',
                                marginVertical: 5,
                            }}>
                            <RenderHtml html={question.content.replace('&nbsp;', ' ')} />
                            {/* <Text
                style={{
                  fontWeight: question.bold ? 'bold' : 'normal',
                  fontStyle: question.italic ? 'italic' : 'normal',
                }}>
                {question.content.replace('&nbsp;', ' ')}
              </Text> */}
                        </View>
                    );
                }
                if (question.element.toLowerCase() === 'linebreak') {
                    return (
                        <View
                            key={question.field_name}
                            style={{
                                borderBottomColor: '#d9d9d9',
                                borderBottomWidth: 1,
                                marginVertical: 5,
                            }}
                        />
                    );
                }
                if (question.element.toLowerCase() === 'textinput') {
                    return (
                        <View key={question.field_name}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold', flex: 1 }}>
                                    {question.label.replace('&nbsp;', ' ')}
                                </Text>
                            </View>
                            <View style={styles.FormItemStyles}>
                                {/* <FormItem style={styles.FormItemStyles}> */}
                                <TextareaItem
                                    styles={{
                                        container: {
                                            borderBottomColor: 'white',
                                        },
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#d9d9d9',
                                        borderRadius: 4,
                                        marginVertical: 5,
                                        padding: 1,
                                        fontSize: 15,
                                        paddingBottom: 10,
                                    }}
                                    placeholder={''}
                                    placeholderTextColor={COLORS.lightGray}
                                    onChangeText={(val) =>
                                        this.setState({ [question.field_name]: val })
                                    }
                                    value={this.state[question.field_name]}
                                />
                                {/* </FormItem> */}
                            </View>
                        </View>
                    );
                }
                if (question.element.toLowerCase() === 'textarea') {
                    return (
                        <View key={question.field_name}>
                            <View style={[styles.LabelStyles]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: 'bold', flex: 1 }}>
                                        {question.label.replace('&nbsp;', ' ')}
                                    </Text>
                                </View>
                                <TextareaItem
                                    multiline
                                    styles={{
                                        container: {
                                            borderBottomColor: COLORS.white,
                                        },
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#d9d9d9',
                                        borderRadius: 4,
                                        marginVertical: 5,
                                        padding: 1,
                                        fontSize: 15,
                                    }}
                                    placeholder={''}
                                    scrollEnabled
                                    placeholderTextColor={COLORS.lightGray}
                                    rows={3}
                                    // onFocus={() => {
                                    //   this._autoComplete && this._autoComplete.onBlur();
                                    // }}
                                    onChangeText={(val) =>
                                        this.setState({ [question.field_name]: val })
                                    }
                                    value={this.state[question.field_name]}
                                />
                            </View>
                        </View>
                    );
                }
                if (question.element.toLowerCase() === 'dropdown') {
                    if (!this.state[question.field_name]) {
                        this.setState({ [question.field_name]: question.options[0] });
                    }
                    return (
                        <View key={question.field_name}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    {question.label.replace('&nbsp;', ' ')}
                                </Text>
                            </View>
                            <Menu
                                ref={(ref) => {
                                    this[`${question.field_name}ref`] = ref;
                                }}
                                button={
                                    <TouchableOpacity
                                        onPress={() => this[`${question.field_name}ref`].show()}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#d9d9d9',
                                            height: 45,
                                            padding: 10,
                                            marginVertical: 5,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                        <Text style={{ fontSize: 15 }}>
                                            {this.state[question.field_name]
                                                ? this.state[question.field_name].text
                                                : ''}
                                        </Text>
                                        <FontIcon
                                            name="caret-down"
                                            color={COLORS.darkGray}
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                }>
                                {question.options.map((item) => (
                                    <MenuItem
                                        style={{ width: 350 }}
                                        key={item.value}
                                        onPress={() => {
                                            this.setState({
                                                [question.field_name]: item,
                                            });
                                            this[`${question.field_name}ref`].hide();
                                        }}>
                                        {item.text}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </View>
                    );
                }
                return null;
            });
            return elements;
        }
        return null;
    };
    handleQuestionData = () => {
        let answers = [];
        let errors = false;
        if (this.state.referralQuestions) {
            let questions = this.state.referralQuestions.filter(
                (item) => item.isInterested,
            );
            for (let i = 0; i < questions.length; i++) {
                let question = JSON.parse(questions[i].questions);
                if (question['Resume required'] && !this.state.resume) {
                    alert('Please attach resume');
                    errors = true;
                    break;
                }
                if (
                    question.element &&
                    question.required &&
                    !this.state[question.field_name] &&
                    question.element.toLowerCase() !== 'linebreak' &&
                    question.element.toLowerCase() !== 'label'
                ) {
                    Alert.alert(
                        'Complete Required Fields',
                        question.label,
                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                        { cancelable: false },
                    );
                    errors = true;
                    break;
                }
                if (question.element) {
                    let element = question.element.toLowerCase();
                    if (
                        element === 'dropdown' ||
                        element === 'textarea' ||
                        element === 'textinput'
                    ) {
                        let answer = {
                            name: question.field_name,
                            question: question.label,
                        };
                        if (question.element.toLowerCase() === 'dropdown') {
                            answer.text = this.state[question.field_name].text;
                            answer.value = this.state[question.field_name].value;
                        } else {
                            answer.value = this.state[question.field_name] || '';
                            answer.text = '';
                        }
                        answers.push(answer);
                    }
                }
            }
        }
        return { answers, errors };
    };

    getJobDetails = () => {
        this.props.client
            .query({
                query: GetJob,
                variables: {
                    id: this.props.jobId,
                },
                fetchPolicy: 'network-only',
            })
            .then((res) => {
                let job = get(res, 'data.getJob');
                if (job) {
                    job = Object.assign(
                        job,
                        parseJsonFields(['location', 'salary', 'referralBonus'], job),
                    );
                }
                this.getCurrentTieredBonus(job);
                this.setState({ job });
            });
    };

    getCurrentTieredBonus(job) {
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
            this.setState({ currentTieredBonus: JSON.parse(campaignTieredBonus) });
            return;
        }
        const currentUser = get(this.props, 'currentUser1');
        if (!job.referralBonus) {
            job.referralBonus = {
                tieredBonusId: null,
            };
        }
        const tieredBonusId = get(job, 'referralBonus.tieredBonusId');
        if (tieredBonusId) {
            this.props.client
                .query({
                    query: gql(getTieredBonus),
                    variables: {
                        companyId: currentUser.companyId,
                        id: tieredBonusId || 'skip',
                    },
                })
                .then((res) => {
                    const currentTieredBonus = get(res, 'data.getTieredBonus');
                    this.setState({ currentTieredBonus });
                });
        }
    }

    checkIsAlreadyReferredToJob1 = () => {
        const { currentUser, currentUser1 } = this.props;
        const { job } = this.state;
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

    handleSuccessExpand = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: 100,
                duration: 300,
            }),
            Animated.timing(this.state.radius, {
                toValue: 3,
                duration: 250,
            }),
        ]).start(() =>
            setTimeout(
                () => this.setState({ Interested: false, success: false }),
                1000,
            ),
        );
    };

    closeSuccess = () => {
        this.setState({
            submitSuccess: false,
        });
    };
    shrinkAnimation = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: 10,
                duration: 300,
            }),
            Animated.timing(this.state.radius, {
                toValue: 22.5,
                duration: 250,
            }),
        ]).start(this.handleProgress);
    };

    handleProgress = () => {
        this.setState({ showProgress: true, progress: 80 }, () => {
            this.circularProgress.animate(this.state.progress, 2000, Easing.quad);
        });
    };
    handleReferralSuccess = () => {
        this.setState({ progress: 100 }, () =>
            this.circularProgress.animate(this.state.progress, 800, Easing.quad),
        );
    };

    handleSubmit = async () => {
        let res = this.handleQuestionData();
        if (res.errors) return;
        // this.setState({Interested: false}, () => {
        //   setTimeout(() => this.props.toggleIsSubmitting(), 500);
        // });
        this.setState({ interestedLoading: true });
        //this.shrinkAnimation();

        const { currentUser1, setCurrentUser } = this.props;
        const { job } = this.state;
        const contactExists = this.props.currentUser1.contacts.some((contact) => {
            return contact.emailAddress === currentUser1.emailAddress;
        });
        const contactId = this.props.currentUser1.contacts.find((contact) => {
            return contact.emailAddress === currentUser1.emailAddress
                ? contact.id
                : null;
        });
        const d = new Date();
        const dformat = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;

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
                    if (this.state.resume) {
                        const contactResume = {
                            bucket: 'erin-documents',
                            key: `resumes/${contactId}/${dformat + '-' + this.state.resume.name
                                }`,
                            region: 'us-east-2',
                        };
                        uploadToS3(this.state.resume, contactResume);
                    }
                    let input = {
                        companyId: currentUser1.companyId,
                        contactId: response.data.createContact.id,
                        userId: currentUser1.id,
                        jobId: job.id,
                        status: 'accepted',
                        note: null,
                        message: null,
                        referralType: 'self',
                    };
                    if (this.state.referralQuestions) {
                        input.interestedQuestionsData = JSON.stringify(res.answers);
                    }
                    await this.onCreateReferral({
                        input: input,
                    });

                    //setTimeout(() => this.props.toggleIsSubmitting(), 6000);
                    this.setState({ interestedLoading: false, Interested: false }, () =>
                        this.setState({ submitSuccess: true }),
                    );
                    // this.handleReferralSuccess();
                    // setTimeout(() => {
                    //   this.setState({submitSuccess: true});
                    // }, 8000);
                });
        } else {
            if (this.state.resume) {
                const contactResume = {
                    bucket: 'erin-documents',
                    key: `resumes/${contactId.id}/${dformat + '-' + this.state.resume.name
                        }`,
                    region: 'us-east-2',
                };
                uploadToS3(this.state.resume, contactResume);
            }

            let input = {
                companyId: currentUser1.companyId,
                contactId: contactId.id,
                userId: currentUser1.id,
                jobId: job.id,
                status: 'accepted',
                note: null,
                message: null,
                referralType: 'self',
            };
            if (this.state.referralQuestions) {
                input.interestedQuestionsData = JSON.stringify(res.answers);
            }
            await this.onCreateReferral({
                input: input,
            });
            //setTimeout(() => this.props.toggleIsSubmitting(), 6000);
            this.setState({ interestedLoading: false, Interested: false }, () =>
                this.setState({ submitSuccess: true }),
            );
            // this.handleReferralSuccess();
            // setTimeout(() => {
            //   this.setState({submitSuccess: true});
            // }, 8000);
        }
    };

    afterAnimation = () => {
        if (this.state.progress == 100) {
            this.setState(
                { showProgress: false, progress: 0, success: true },
                this.handleSuccessExpand,
            );
        }
    };

    handleCardClick = (job, selfReferralValue, currentUser, onCreateReferral) => {
        // Mixpanel.trackWithProperties('Job View', {jobId: job.id, title: job.title});
        Actions.jobDetail({
            job: job,
            referalPolicyText: selfReferralValue,
            currentUser1: currentUser,
            onCreateReferral: onCreateReferral,
            subCompanyName: this.props.subCompanyName,
            propsJob: this.props.job,
        });
    };

    render() {
        if (this.state.job) {
            let {
                currentUser1: { incentiveEligible, userGroupId, company },
                currencyRate,
                width,
                isHotJob,
                hideBonusAmount,
            } = this.props;
            let {
                job,
                job: {
                    title,
                    department,
                    description,
                    referralBonus,
                    location,
                    status,
                    id,
                    publicLink,
                    company: { contactIncentiveBonus, disableShareLink },
                },
                currentTieredBonus,
            } = this.state;

            let translatedTitle = this.props.job.translatedTitle;
            let parsedReferralBonus;
            if (typeof location === 'string') {
                location = JSON.parse(location);
            }
            if (typeof referralBonus === 'string') {
                parsedReferralBonus = JSON.parse(referralBonus);
            } else {
                parsedReferralBonus = referralBonus;
            }
            if (!parsedReferralBonus) {
                parsedReferralBonus = { amount: 0 };
            }

            const refBonus = parsedReferralBonus || referralBonus;
            const { matches } = this.state;
            let {
                company: { theme },
            } = this.props.currentUser1;
            theme = theme ? JSON.parse(theme) : {};
            let showIAmIntereseted = false;
            if (this.props.selfReferralValue) {
                if (
                    this.props.currentUser1.company.allowSelfReferralsInternalLink &&
                    !this.state.job.internalJobLink
                ) {
                    showIAmIntereseted = false;
                } else {
                    showIAmIntereseted = true;
                }
            }
            if (this.state.job.hideImInterested) {
                showIAmIntereseted = false;
            }
            let showReferSomeOne = true;
            if (company.disableReferrals && !this.state.job.publicLink) {
                showReferSomeOne = false;
            }
            let isExtendedUser =
                get(this, 'props.currentUser1.role', '') == 'extendedUser';
            let hideShareLinkForDepartment = get(
                this,
                'props.currentUser1.company.hideShareLinkForDepartment',
                '',
            );
            let hideDepartmentShareLink = false;
            if (hideShareLinkForDepartment) {
                const jsonData = JSON.parse(hideShareLinkForDepartment);
                //  console.log("jsonData ==== ",jsonData);
                hideDepartmentShareLink =
                    jsonData.filter((val) => {
                        return val.id === department.id;
                    }).length > 0;
            }
            return (

                <TouchableOpacity
                    style={
                        this.props.onDeckRefer
                            ? [
                                styles.tile,
                                { width: getAppName() != 'allied' && (width > 450 ? width / 2 - 15 : width - 40), height: Platform.OS == "android" ? hpx(220) : hpx(200) },

                                width > 450 && getAppName() != 'allied' && { maxWidth: 300 },
                                getAppName() == 'allied' && { width: width > 400 ? 360 : Platform.OS == 'android' ? 310 : 340 },
                                isHotJob == 'true' && {
                                    borderWidth: 1.5,
                                    borderColor: COLORS.dashboardLightOrange,
                                },
                            ]
                            : [
                                styles.tile,
                                { width: getAppName() != 'allied' && (width > 450 ? width / 2 - 15 : width - 15), height: Platform.OS == "android" ? hpx(220) : hpx(200) },
                                width > 450 && getAppName() != 'allied' && { maxWidth: 300 },
                                getAppName() == 'allied' && { width: width > 400 ? 360 : Platform.OS == 'android' ? 310 : 340 },
                                isHotJob == 'true' && {
                                    borderWidth: 1.5,
                                    borderColor: COLORS.dashboardLightOrange,
                                },
                            ]
                    }
                    onPress={() =>
                        this.props.onDeckRefer
                            ? this.props.handleCardClick({
                                jobId: id,
                                bonus: calculateReferralBonus(
                                    contactIncentiveBonus,
                                    parsedReferralBonus?.amount,
                                    incentiveEligible,
                                    currentTieredBonus,
                                    'employee',
                                    userGroupId,
                                    currencyRate,
                                ),
                                title: title,
                                location: location,
                                department: department,
                            })
                            : this.handleCardClick(
                                this.state.job,
                                this.props.selfReferralValue,
                                this.props.currentUser1,
                                this.onCreateReferral,
                            )
                    }>
                    {/* self animated modal */}
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.selfAnimatedModal}
                        // visible={true}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                        }}>
                        <View
                            style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                style={{
                                    width: Dimensions.get('window').width - 40,
                                    height: Dimensions.get('window').height / 2,
                                }}
                                source={require('../../../_shared/assets/makingreferral300.gif')}
                            />
                        </View>
                    </Modal>

                    <View style={styles.headerRow}>
                        <View style={{ flex: 2.5 }}>
                            <Text numberOfLines={2} style={styles.title}>
                                {translatedTitle ? translatedTitle : title}
                            </Text>
                        </View>

                        <View style={styles.amountContainer}>
                            {/* {refBonus && refBonus.amount && (
              <Text style={styles.referalText}>${refBonus.amount || '0'}</Text>
            )} */}
                            {isHotJob == 'true' && (
                                <MaterialIcon
                                    name="fire"
                                    color={COLORS.dashboardLightOrange}
                                    size={25}
                                    style={{ marginTop: -5 }}
                                />
                            )}
                            {this.props.generalReferral == 'true' ? (
                                <View
                                    style={{
                                        padding: 5,
                                        backgroundColor: COLORS.lightGreen,
                                        borderRadius: 5,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            color: COLORS.green,
                                        }}>
                                        General Job
                  </Text>
                                </View>
                            ) : (
                                <Text style={styles.referalText}>
                                    {!hideBonusAmount &&
                                        `${calculateReferralBonus(
                                            contactIncentiveBonus,
                                            parsedReferralBonus?.amount,
                                            incentiveEligible,
                                            currentTieredBonus,
                                            'employee',
                                            userGroupId,
                                            currencyRate,
                                        ) == 0
                                            ? ''
                                            : this.props.currencySymbol +
                                            parseInt(
                                                calculateReferralBonus(
                                                    contactIncentiveBonus,
                                                    parsedReferralBonus?.amount,
                                                    incentiveEligible,
                                                    currentTieredBonus,
                                                    'employee',
                                                    userGroupId,
                                                    currencyRate,
                                                ),
                                            )
                                            }`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </Text>
                            )}
                        </View>
                        <View />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                            marginBottom: 10,
                        }}>
                        {this.props.subCompanyName ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 10,
                                }}>
                                <Image
                                    source={require('../../../_shared/assets/building.png')}
                                    style={{ tintColor: COLORS.lightGray, height: 20, width: 20 }}
                                />
                                <Text style={{ color: COLORS.lightGray, fontSize: 12 }}>
                                    {this.props.subCompanyName}
                                </Text>
                            </View>
                        ) : null}

                        {/* {job && job.externalJobId ? (
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: COLORS.lightGray,
                                }}>
                                Req ID#: {job.externalJobId}
                            </Text>
                        ) : null} */}
                    </View>
                    <View
                        style={[
                            styles.row,
                            {
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            },
                        ]}>
                        <View style={styles.row}>
                            <View style={styles.department}>
                                <EvilIcon
                                    name="folder"
                                    color={COLORS.darkGray}
                                    size={15}
                                    style={styles.folder}
                                />
                                <Text style={styles.deptext}>
                                    {department && department?.name}
                                </Text>
                            </View>
                            <View style={[styles.department, { marginTop: 5 }]}>
                                <EvilIcon
                                    name="location-pin"
                                    size={15}
                                    color={COLORS.darkGray}
                                />
                                <Text style={styles.deptext} numberOfLines={3}>
                                    {!location.isRemote && (location.city || location.state)
                                        ? `${location.city || ''}, ${location.state || ''}`
                                        : customTranslate('ml_Remote')}
                                </Text>
                            </View>
                        </View>
                        {/* {!get(company, 'disableShareLink') &&
                            job.status === 'open' &&
                            !isExtendedUser &&
                            !hideDepartmentShareLink && (
                                <ShareIcon
                                    job={job}
                                    currentUser={this.props.currentUser1}
                                    setCurrentUser={this.props.setCurrentUser}
                                />
                            )} */}
                    </View>
                    {status !== 'closed' && !this.props.onDeckRefer && (
                        <View style={styles.buttonRow}>
                            {/* <View style={{ width: '100%' }}>
                                {!this.props.hideReferSomeone && (
                                    <ReferralModal
                                        job={job}
                                        clicked={this.state.clicked}
                                        style={{ flex: 1, width: '100%' }}
                                        getJobDetails={this.getJobDetails}
                                        propsJob={this.props.job}
                                        disabled={!showReferSomeOne}
                                    />
                                )}
                            </View> */}

                            {showIAmIntereseted && (
                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        this.state.job.hideImInterested &&
                                        globalStyle.disabledButton,
                                    ]}
                                    onPress={() => {
                                        if (this.state.job.hideImInterested) return;
                                        if (
                                            this.props.currentUser1.company
                                                .allowSelfReferralsInternalLink &&
                                            this.state.job.internalJobLink
                                        ) {
                                            this.setState(
                                                { interestedInternalLink: true },
                                                this.Interested(),
                                            );
                                            // Linking.openURL(this.state.job.internalJobLink);
                                        } else {
                                            this.Interested();
                                        }
                                    }}>
                                    {/* <Icon name="checkmark_circle" color={COLORS.white} /> */}
                                    <Text
                                        style={[
                                            styles.buttontext,
                                            this.state.job.hideImInterested &&
                                            globalStyle.disabledButtonText,
                                        ]}>
                                        {this.state.job.hideImInterested
                                            ? customTranslate('ml_InterestedNotAvailable')
                                            : customTranslate('ml_IAmInterested')}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <Modal
                                transparent
                                visible={this.state.Interested}
                                animationType="fade">
                                <ScrollView
                                    contentContainerStyle={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexGrow: 1,
                                    }}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.40)',
                                    }}>
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            marginTop: 50,
                                            borderRadius: 10,
                                            padding: 10,
                                            paddingTop: 15,
                                            width: Dimensions.get('window').width - 20,
                                            maxWidth: 450,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 10,
                                            }}>
                                            <View style={{ flex: 1 }} />
                                            <View style={{ flex: 5 }}>
                                                <Text
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'center',
                                                        color: theme.enabled
                                                            ? theme.buttonColor
                                                            : COLORS.red,
                                                        fontSize: 28,
                                                        marginBottom: 0,
                                                        fontWeight: '600',
                                                        alignSelf: 'center',
                                                    }}>
                                                    {customTranslate('ml_Interested')}
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
                                                }}>
                                                <Icons
                                                    name="ios-close"
                                                    size={40}
                                                    color="#8f99a2"></Icons>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginHorizontal: '3%', marginBottom: 10 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontWeight: '300',
                                                    fontWeight: '400',
                                                    textAlign: 'center',
                                                }}>
                                                {this.state.interestedInternalLink
                                                    ? customTranslate('ml_redirectedInterested')
                                                    : customTranslate('ml_LetUsKnow')}
                                            </Text>
                                        </View>
                                        <View style={{ marginVertical: 10 }}>
                                            {this.renderQuestionComponents()}
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            {this.state.interestedLoading ? (
                                                <ActivityIndicator size="small" color={COLORS.blue} />
                                            ) : (
                                                <TouchableOpacity
                                                    style={{ width: '100%' }}
                                                    onPress={() => {
                                                        if (this.state.interestedInternalLink) {
                                                            Linking.openURL(this.state.job.internalJobLink);
                                                            this.setState(
                                                                { interestedLoading: false, Interested: false },
                                                                () => this.setState({ submitSuccess: true }),
                                                            );
                                                            return;
                                                        }
                                                        this.handleSubmit();
                                                    }}>
                                                    <View
                                                        style={{
                                                            height: 45,
                                                            backgroundColor: theme
                                                                ? theme.buttonColor || COLORS.primary
                                                                : COLORS.primary,
                                                            marginVertical: 3,
                                                            borderRadius: 3,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                textAlign: 'center',
                                                                fontSize: 14,
                                                                borderRadius: 5,
                                                                marginRight: 0,
                                                            }}>
                                                            {this.state.interestedInternalLink
                                                                ? customTranslate('ml_ApplyOnJobSite')
                                                                : customTranslate('ml_SubmitMe')}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </ScrollView>
                            </Modal>

                            <Modal
                                transparent
                                visible={this.state.submitSuccess}
                                animationType="fade">
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.40)',
                                    }}>
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            padding: 10,
                                            paddingTop: 15,
                                            width: Dimensions.get('window').width - 20,
                                            maxWidth: 450,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 10,
                                            }}>
                                            <View style={{ flex: 1 }} />
                                            <View style={{ flex: 5 }}>
                                                <Text
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'center',
                                                        color: COLORS.green,
                                                        fontSize: 28,
                                                        marginBottom: 0,
                                                        fontWeight: '600',
                                                        alignSelf: 'center',
                                                    }}>
                                                    {'Success!'}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={this.closeSuccess}
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-end',
                                                    marginTop: -15,
                                                }}>
                                                <Icons
                                                    name="ios-close"
                                                    size={40}
                                                    color="#8f99a2"></Icons>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginHorizontal: '3%' }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontWeight: '300',
                                                    fontWeight: '400',
                                                    marginBottom: 10,
                                                }}>
                                                {customTranslate('ml_Success')}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                                backgroundColor: theme
                                                    ? theme.buttonColor || COLORS.primary
                                                    : COLORS.primary,
                                                marginVertical: 3,
                                                borderRadius: this.state.radius,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={this.closeSuccess}>
                                            <Text
                                                style={{
                                                    color: COLORS.white,
                                                    textAlign: 'center',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                }}>
                                                Close
                      </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                transparent
                                visible={this.state.alreadySubmit}
                                animationType="fade">
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.40)',
                                    }}>
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 10,
                                            padding: 10,
                                            paddingTop: 15,
                                            width: Dimensions.get('window').width - 20,
                                            maxWidth: 450,
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 10,
                                            }}>
                                            <View style={{ flex: 1 }} />
                                            <View style={{ flex: 5 }}>
                                                <Text
                                                    style={{
                                                        width: '100%',
                                                        textAlign: 'center',
                                                        color: theme.enabled
                                                            ? theme.buttonColor
                                                            : COLORS.green,
                                                        fontSize: 28,
                                                        marginBottom: 0,
                                                        fontWeight: '600',
                                                        alignSelf: 'center',
                                                    }}>
                                                    {'Success!'}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        alreadySubmit: false,
                                                    });
                                                }}
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'flex-start',
                                                    alignItems: 'flex-end',
                                                    marginTop: -15,
                                                }}>
                                                <Icons
                                                    name="ios-close"
                                                    size={40}
                                                    color="#8f99a2"></Icons>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginHorizontal: '3%' }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontWeight: '300',
                                                    fontWeight: '400',
                                                    marginBottom: 10,
                                                }}>
                                                {customTranslate('ml_Success')}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{
                                                height: 45,
                                                backgroundColor: COLORS.primary,
                                                marginVertical: 3,
                                                borderRadius: this.state.radius,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => {
                                                this.setState({
                                                    alreadySubmit: false,
                                                });
                                            }}>
                                            <Text
                                                style={{
                                                    color: COLORS.white,
                                                    textAlign: 'center',
                                                    fontSize: 18,
                                                    borderRadius: 5,
                                                }}>
                                                Close
                      </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )}
                </TouchableOpacity>
            );
        } else {
            return (
                <View
                    style={
                        this.props.onDeckRefer
                            ? [
                                styles.tile,
                                { width: getAppName() != 'allied' && (width > 450 ? width / 2 - 15 : width - 40) },
                                width > 450 && getAppName() != 'allied' && { maxWidth: 300 },
                                getAppName() == 'allied' && { width: width > 400 ? 360 : Platform.OS == 'android' ? 310 : 340, height: Platform.OS == "android" ? hpx(220) : hpx(200) },
                            ]
                            : [
                                styles.tile,
                                { width: getAppName() != 'allied' && (width > 450 ? width / 2 - 15 : width - 15) },
                                width > 450 && getAppName() != 'allied' && { maxWidth: 300 },
                                getAppName() == 'allied' && { width: width > 400 ? 340 : Platform.OS == 'android' ? 310 : 340, height: Platform.OS == "android" ? hpx(220) : hpx(200) },
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
}

const styles = StyleSheet.create({
    container: {
        width: width - 70,
        paddingVertical: (16 / 812) * height,
        // paddingLeft: 5,
    },
    htmlContainer: {
        width: '100%',
        flex: 0,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    title: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 25,
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
        marginTop: 5,
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
        //justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 15,
        flex: 1,


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

        marginLeft: 2,
        //paddingLeft: 22,
        //paddingRight: 22,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: (10 / 375) * width,
        borderRadius: 5,
        //width: (146 / 375) * width,
        borderWidth: 0.5,
        borderColor: COLORS.buttonGrayOutline,
        width: '100%',
        marginTop: 5,
    },
    buttontext: {
        fontSize: 12,
        color: COLORS.buttonGrayText,
        marginLeft: 8,
    },
    tile: {
        marginVertical: 8,
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 4,

    },
});
//export default JobCard = borderedTile(JobCard);
export default withApollo(MobilityJobCard);
