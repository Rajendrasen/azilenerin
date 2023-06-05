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
    // AsyncStorage,
    ScrollView,
    Share,
    Animated,
    Easing,
    Linking,
    ActivityIndicator,
} from 'react-native';
import { TextareaItem } from '@ant-design/react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import RenderHtml from 'react-native-render-html';

import FontIcon from 'react-native-vector-icons/FontAwesome';
import DocumentPicker from 'react-native-document-picker';
import { Actions } from 'react-native-router-flux';
import ShareIcon from '../../../_shared/components/shareIcon/shareIcon.component';
import { translateString } from '../../../_shared/services/language-manager';
import _ from 'lodash';
import HTML from 'react-native-render-html';
import { FormattedCurrency } from 'react-native-globalize';
import Icon from '../../../_shared/components/icon';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { ReferralModal } from '../../../_shared/components/refer-someone/referral-modal.container';
import ReferralCard from '../../../_shared/components/referral-card/referral-card';
import { COLORS, globalStyle } from '../../../_shared/styles/colors';
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
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import Icons from 'react-native-vector-icons/Ionicons';
import { ContactDetails } from '../../../_shared/components/viewContact/ViewContactContainer';
import { downloadFromS3, uploadToS3 } from '../../../common';
import { queryReferralQuestionsByCompanyId } from '../../../_store/_shared/api/graphql/custom/referrals/query-referral-questions-by-company-id';
import { getErinSquare, getLightGrayLogo } from '../../../WhiteLabelConfig';
import { wpx } from '../../../_shared/constants/responsive';
import AsyncStorage from '@react-native-community/async-storage';

class JobDetail extends React.PureComponent {
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
            interestedLoading: false,
            interestedInternalLink: false,
            referralQuestions: '',
            resume: '',
        };
    }
    ShowHideTextComponentView = () => {
        if (this.state.status == true) {
            this.setState({ status: false });
        } else {
            this.setState({ status: true });
        }
    };

    getReferralQuestions = () => {
        this.props.client
            .query({
                query: queryReferralQuestionsByCompanyId,
                variables: {
                    companyId: this.props.currentUser.companyId,
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
                        <View style={{ marginBottom: 10 }}>
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
    handleSubmit = () => {
        let res = this.handleQuestionData();
        if (res.errors) return;
        this.setState({ interestedLoading: true });
        const { job, onCreateReferral, currentUser1, setCurrentUser } = this.props;
        // this.setState({ Interested: false });
        const contactExists = currentUser1.contacts.some((contact) => {
            return contact.emailAddress === currentUser1.emailAddress;
        });
        const contactId = currentUser1.contacts.find((contact) => {
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
                .then((response) => {
                    //first time condition
                    //when user contact is created then set it into local current user state
                    let obj = {
                        firstName: response.data.createContact.firstName,
                        lastName: response.data.createContact.lastName,
                        id: response.data.createContact.id,
                        importMethod: response.data.createContact.importMethod,
                        emailAddress: response.data.createContact.emailAddress,
                    };
                    let newUser = currentUser1;
                    newUser.contacts.push(obj);

                    const contactId = get(response, 'data.createContact.id');
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
                        contactId,
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
                    return onCreateReferral({
                        input: input,
                    })
                        .then((response) => {
                            this.setState(
                                {
                                    buttonColor: true,
                                    interestedLoading: false,
                                    Interested: false,
                                },
                                () => this.setState({ submitSuccess: true }),
                            );
                        })
                        .catch((err) => { });
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
            onCreateReferral({
                input: input,
            });

            this.setState(
                {
                    buttonColor: true,
                    interestedLoading: false,
                    Interested: false,
                },
                () => this.setState({ submitSuccess: true }),
            );
        }
    };

    closeSuccess = () => {
        this.setState({
            submitSuccess: false,
        });
    };

    // onShare() {
    //   const {
    //     currentJob: {title, publicLink},
    //     currentUser: {
    //       company: {name},
    //     },
    //   } = this.props;
    //   Share.share(
    //     {
    //       message: `https://app.erinapp.com/share?referredBy=${this.props.currentUser.id}&jobId=${this.props.job.id}&languageCode=EN`,
    //       // message: i18n
    //       //   .t('ml_MyCompanyHiring')
    //       //   .replace('Techahead', name)
    //       //   .replace('tester', title)
    //       //   .replace('google', publicLink),
    //       //message: `My company, ${name}, is hiring a ${title}! Check out the job description here: ${publicLink} . Interested? Contact me if you’d like me to refer you!`,
    //       title: customTranslate('ml_ShareThisJob'),
    //     },
    //     {
    //       // Android only:
    //       dialogTitle: customTranslate('ml_ShareThisJob'),
    //       // iOS only:
    //       excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
    //     },
    //   )
    // }
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
        console.log("jobDetail",this.props.myApplication)
        this.spin();
        this.gettingLocale();
        this.getReferralQuestions();
        setTimeout(() => {
            this.fetchData();
        }, 800);
    }

    gettingLocale = async () => {
        await AsyncStorage.getItem('appLocale').then((code) => {
            if (code != 'us' && code != 'en' && code != null) {
                this.translateJob();
            }
        })
    }

    translateJob = () => {
        let { title, description } = this.props.job;
        translateString([title, description]).then((res) => {
            this.setState({
                translatedDesc: res[1].translatedText,
                translatedJobTitle: res[0].translatedText,
            });
        });
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

    setTranslatedJobTitle = (str) => {
        translateString(str).then((res) => {
            this.setState({ translatedJobTitle: res });
        });
    };

    renderDetails() {
        let {
            job: { contactIncentiveBonus, publicLink, externalJobId },
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
            currentUser: { incentiveEligible, userGroupId, company, role },
            currentTieredBonus,
        } = this.props;
        let htmlData = JSON.stringify(description).split('\\n').join(' ')
        console.log("description", description)
        let isExtendedUser = role == 'extendedUser';
        let propsJob = this.props.propsJob || {};
        let {
            campaignId,
            campaignStartDate,
            campaignEndDate,
            campaignTieredBonus,
            campaignTieredBonusId,
            campaignName,
        } = propsJob;
        // debugger
        let isCampaignActive = false;
        if (
            campaignId &&
            new Date(campaignStartDate) <= new Date() <= new Date(campaignEndDate) &&
            !campaignTieredBonus.archived
        ) {
            isCampaignActive = true;
            currentTieredBonus = JSON.parse(campaignTieredBonus);
        }
        let {
            company: { theme, disableShareLink },
        } = this.props.currentUser;
        theme = theme ? JSON.parse(theme) : {};
        let parsedReferralBonus;

        // referralBonus is coming in as a json string for admin@bestco.com

        if (typeof referralBonus === 'string') {
            parsedReferralBonus = JSON.parse(referralBonus);
        } else {
            parsedReferralBonus = referralBonus;
        }
        if (!parsedReferralBonus) {
            parsedReferralBonus = {
                amount: 0,
            };
        }

        const refBonus = parsedReferralBonus || referralBonus;
        const formattedJobType =
            jobType === 'fulltime'
                ? customTranslate('ml_Fulltime')
                : customTranslate('ml_Parttime');
        description = this.state.translatedDesc
            ? this.state.translatedDesc
            : description;
        let hideShareLinkForDepartment = get(
            company,
            'hideShareLinkForDepartment',
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
        let showReferSomeOne = true;
        if (company.disableReferrals && !this.props.job.publicLink) {
            showReferSomeOne = false;
        }
        let showIAmIntereseted = false;
        if (company.allowSelfReferrals) {
            if (
                company.allowSelfReferralsInternalLink &&
                !this.props.job.internalJobLink
            ) {
                showIAmIntereseted = false;
            } else {
                showIAmIntereseted = true;
            }
        }
        if (this.props.job.hideImInterested) {
            showIAmIntereseted = false;
        }
        return (
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <View style={[styles.titleContainer, { flex: 1.5 }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.title}>
                                {this.state.translatedJobTitle
                                    ? this.state.translatedJobTitle
                                    : title}
                            </Text>
                            {/* <TouchableOpacity
                onPress={() => this.setTranslatedJobTitle(title)}>
                <Image
                  style={{width: 15, height: 15, marginLeft: 5, marginTop: 3}}
                  source={require('../../../_shared/assets/google.png')}
                />
              </TouchableOpacity> */}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 5,
                                marginBottom: 10,
                                justifyContent: 'space-between',
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
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
                                            style={{
                                                tintColor: COLORS.lightGray,
                                                height: 20,
                                                width: 20,
                                            }}
                                        />
                                        <Text style={{ color: COLORS.lightGray, fontSize: 12 }}>
                                            {this.props.subCompanyName}
                                        </Text>
                                    </View>
                                ) : null}
                                {externalJobId ? (
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: COLORS.lightGray,
                                        }}>
                                        Req ID#: {externalJobId}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {width > 450 && (
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                <View style={styles.department}>
                                    <SimpleIcon
                                        name="folder"
                                        size={15}
                                        color={COLORS.darkGray}
                                        style={styles.folder}
                                    />
                                    <Text numberOfLines={3} multiline={true} style={{ ...styles.deptext }}>
                                        {department && department.name}
                                    </Text>
                                </View>
                                <View style={[styles.department]}>
                                    <Image
                                        style={styles.location}
                                        source={require('../../../_shared/assets/location.png')}
                                    />
                                    <Text
                                        style={[styles.deptext]}
                                        numberOfLines={3} multiline={true}>
                                        {location && location.city && location.state
                                            ? `${location.city}, ${location.state}`
                                            : 'Remote'}
                                    </Text>
                                    <View>
                                        <Text style={[styles.jobType, { marginRight: 10 }]}>
                                            {formattedJobType}
                                        </Text>
                                    </View>
                                    {!get(company, 'disableShareLink') &&
                                        get(this, 'props.job.status', '') === 'open' &&
                                        !isExtendedUser &&
                                        !hideDepartmentShareLink && (
                                            <ShareIcon
                                                job={this.props.job}
                                                currentUser={this.props.currentUser}
                                                setCurrentUser={this.props.setCurrentUser}
                                            />
                                        )}
                                </View>
                            </View>
                        )}
                    </View>
                    {width > 450 && (
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                }}>
                                <View style={{ marginRight: 5, flex: 1 }}>
                                    <ReferralModal
                                        job={this.props.job}
                                        propsJob={this.props.propsJob}
                                        disabled={!showReferSomeOne}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    {showIAmIntereseted && (
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                this.props.job.hideImInterested &&
                                                globalStyle.disabledButton,
                                                {
                                                    marginTop: 0,
                                                },
                                            ]}
                                            onPress={() => {
                                                if (this.props.job.hideImInterested) return;
                                                if (
                                                    company.allowSelfReferralsInternalLink &&
                                                    this.props.job.internalJobLink
                                                ) {
                                                    this.setState(
                                                        { interestedInternalLink: true },
                                                        this.Interested(),
                                                    );
                                                } else {
                                                    this.Interested();
                                                }
                                            }}>
                                            <Text
                                                style={[
                                                    styles.buttontext,
                                                    this.props.job.hideImInterested &&
                                                    globalStyle.disabledButtonText,
                                                ]}>
                                                {this.props.job.hideImInterested
                                                    ? customTranslate('ml_InterestedNotAvailable')
                                                    : customTranslate('ml_IAmInterested')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: COLORS.grayMedium,
                                    marginTop: 5,
                                    alignSelf: 'flex-end',
                                }}>
                                Referral Bonus:{' '}
                                <Text style={styles.referalText}>
                                    {parseInt(
                                        calculateReferralBonus(
                                            contactIncentiveBonus,
                                            parsedReferralBonus?.amount,
                                            incentiveEligible,
                                            currentTieredBonus,
                                            'employee',
                                            userGroupId,
                                            currencyRate,
                                        ),
                                    ) == 0
                                        ? ''
                                        : `${currencySymbol}${parseInt(
                                            calculateReferralBonus(
                                                contactIncentiveBonus,
                                                parsedReferralBonus?.amount,
                                                incentiveEligible,
                                                currentTieredBonus,
                                                'employee',
                                                userGroupId,
                                                currencyRate,
                                            ),
                                        )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </Text>
                            </Text>
                            <Text
                                style={{
                                    alignSelf: 'flex-end',
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: COLORS.blue,
                                }}>
                                <Text onPress={() => this.onShare()}>
                                    {customTranslate('ml_Share')}
                                </Text>{' '}
                                <Text style={{ color: COLORS.darkGray }}>or</Text>{' '}
                                <Text
                                    onPress={() => {
                                        Linking.openURL(publicLink);
                                    }}>
                                    {customTranslate('ml_ViewPublicJobPosting')}
                                </Text>
                            </Text>
                        </View>
                    )}

                    {width <= 450 && (
                        <View style={styles.amountContainer}>
                            {/* {refBonus && refBonus.amount && (
              <Text style={styles.referalText}>${refBonus.amount || '0'}</Text>
            )} */}
                            <Text style={styles.referalText}>
                                {parseInt(
                                    calculateReferralBonus(
                                        contactIncentiveBonus,
                                        parsedReferralBonus?.amount,
                                        incentiveEligible,
                                        currentTieredBonus,
                                        'employee',
                                        userGroupId,
                                        currencyRate,
                                    ),
                                ) == 0
                                    ? ''
                                    : `${currencySymbol}${parseInt(
                                        calculateReferralBonus(
                                            contactIncentiveBonus,
                                            parsedReferralBonus?.amount,
                                            incentiveEligible,
                                            currentTieredBonus,
                                            'employee',
                                            userGroupId,
                                            currencyRate,
                                        ),
                                    )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </Text>
                        </View>
                    )}

                    <View />
                </View>
                {width <= 450 && (
                    <View
                        style={[
                            styles.row,
                            { alignItems: 'center', justifyContent: 'space-between' },
                        ]}>
                        <View style={styles.department}>
                            <SimpleIcon
                                size={15}
                                name="folder"
                                color={COLORS.darkGray}
                                style={styles.folder}
                            />
                            <Text numberOfLines={3} multiline={true} style={{ ...styles.deptext }}>
                                {department && department.name}
                            </Text>
                        </View>
                        <View style={[styles.department]}>
                            <Image
                                style={styles.location}
                                source={require('../../../_shared/assets/location.png')}
                            />
                            <Text style={{ ...styles.deptext }} numberOfLines={3} multiline={true}>
                                {location && location.city && location.state
                                    ? `${location.city}, ${location.state}`
                                    : 'Remote'}
                            </Text>
                        </View>
                        {/* job type */}
                        <View>
                            <Text style={styles.jobType}>{formattedJobType}</Text>
                        </View>
                        {!get(company, 'disableShareLink') &&
                            get(this, 'props.job.status', '') === 'open' &&
                            !isExtendedUser &&
                            !hideDepartmentShareLink && (
                                <ShareIcon
                                    job={this.props.job}
                                    currentUser={this.props.currentUser}
                                    setCurrentUser={this.props.setCurrentUser}
                                />
                            )}
                    </View>
                )}

                <View style={[styles.buttonRow, { marginBottom: 10 }]}>
                    {!this.props.myApplication&&width <= 450 && (
                        <View style={{ flex: 1, width: '100%' }}>
                            <ReferralModal
                                job={this.props.job}
                                style={{ flex: 1, width: '100%' }}
                                propsJob={this.props.propsJob}
                                disabled={!showReferSomeOne}
                            />
                        </View>
                    )}
                    {!this.props.myApplication&&width <= 450 && (
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    !showIAmIntereseted && globalStyle.disabledButton,
                                ]}
                                onPress={() => {
                                    if (!showIAmIntereseted) return;
                                    if (
                                        company.allowSelfReferralsInternalLink &&
                                        this.props.job.internalJobLink
                                    ) {
                                        this.setState(
                                            { interestedInternalLink: true },
                                            this.Interested(),
                                        );
                                    } else {
                                        this.Interested();
                                    }
                                }}>
                                <Text
                                    style={[
                                        styles.buttontext,
                                        !showIAmIntereseted && globalStyle.disabledButtonText,
                                    ]}>
                                    {!showIAmIntereseted
                                        ? customTranslate('ml_InterestedNotAvailable')
                                        : customTranslate('ml_IAmInterested')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Modal
                        transparent
                        visible={this.state.Interested}
                        animationType="fade">
                        <ScrollView
                            contentContainerStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                            }}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0, 0, 0, 0.40)',
                            }}>
                            <View
                                style={{
                                    marginTop: 50,
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
                                                color: theme.enabled ? theme.buttonColor : COLORS.red,
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
                                        <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
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
                                {this.state.interestedLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={COLORS.blue}
                                        styles={{ alignSelf: 'center' }}
                                    />
                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: theme
                                                ? theme.buttonColor || COLORS.blue
                                                : COLORS.blue,
                                            padding: 10,
                                            height: 45,
                                            borderRadius: 5,
                                        }}
                                        onPress={() => {
                                            if (this.state.interestedInternalLink) {
                                                Linking.openURL(this.props.job.internalJobLink);
                                                this.setState(
                                                    { interestedLoading: false, Interested: false },
                                                    () => this.setState({ submitSuccess: true }),
                                                );
                                                return;
                                            }
                                            this.handleSubmit();
                                        }}>
                                        <Text
                                            style={{
                                                color: 'white',
                                                textAlign: 'center',
                                                fontSize: 14,
                                                borderRadius: 5,
                                                marginRight: 10,
                                            }}>
                                            {this.state.interestedInternalLink
                                                ? customTranslate('ml_ApplyOnJobSite')
                                                : customTranslate('ml_SubmitMe')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>
                    </Modal>
                </View>

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
                                    <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
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
                                            color: theme.enabled ? theme.buttonColor : COLORS.green,
                                            fontSize: 28,
                                            marginBottom: 0,
                                            fontWeight: '600',
                                            alignSelf: 'center',
                                        }}>
                                        {'Success!'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.setState({ alreadySubmit: false })}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-end',
                                        marginTop: -15,

                                    }}>
                                    <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
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
                                onPress={() => this.setState({ alreadySubmit: false })}>
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
                {salary && salary.from && (
                    <Text style={styles.label}>
                        {customTranslate('ml_SalaryRange')}:{' '}
                        <Text style={styles.body}>
                            {/* <FormattedCurrency
                value={salary.from}
                currency="USD"
                style={styles.body}
                maximumFractionDigits={0}
              /> */}
                            {this.props.currencySymbol + salary.from}
                            {salary.to ? ' - ' + this.props.currencySymbol + salary.to : ''}
                        </Text>{' '}
                    </Text>
                )}
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
                                p: { fontSize: 13, color: COLORS.lightGray, marginBottom: 10 },
                                ul: { fontSize: 13, color: COLORS.lightGray },
                            }}
                            containerStyle={styles.htmlContainer}
                            html={(htmlData.split(''))[0] == '"' && (htmlData.split(''))[((htmlData.split('')).length) - 1] == '"' ? htmlData.substring(1, htmlData.length - 1) : htmlData}
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
                                html={htmlData.substr(0, width > 450 ? 1000 : 1000)}
                            />
                        </View>
                    )}

                    {JSON.stringify(description).split('\\n').join(' ').replace(/<[^>]*>?/gm, '').length > 200 ? (
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
                    {width <= 450 && (
                        <View style={{ alignItems: 'flex-end' }}>
                            {publicLink ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL(publicLink);
                                    }}
                                    style={{ marginTop: 5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: COLORS.blue, fontSize: 12 }}>
                                            {customTranslate('ml_ViewPublicJobPosting')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    )}
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
                                ? customTranslate('ml_Dashboard_PersonMatch').replace(
                                    'Match',
                                    'matches',
                                )
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
        if (this.state.referralMatches && !this.state.referralMatches.length) {
            // console.log("ref match >>>>", typeof this.state.referralMatches.length);
            return (
                <View style={styles.noReferrals}>
                    <Image
                        source={getLightGrayLogo()}
                        resizeMode="contain"
                        style={{ width: 180, height: 180, marginBottom: 5 }}
                    />
                    {/* <Text style={{ color: '#999999' }}>There are no Smart Referrals for this job</Text> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '80%',
                        }}>
                        <Text style={{ color: '#999999', textAlign: 'center' }}>
                            {customTranslate('ml_NoSmartReferrals')}{' '}
                            <Text
                                style={{ fontWeight: '600', color: COLORS.blue }}
                                onPress={() => Actions.contacts()}>
                                {customTranslate('ml_Contacts')}.
              </Text>{' '}
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                }}>
                {this.state.referralMatches.map((item) => (
                    <ReferralCard
                        onUpdateMatch={this.props.onUpdateMatch}
                        job={this.props.currentJob}
                        matchId={item.contactId}
                        match={item}
                        noRefer={(a, b) => this.noRefer(a, b)}
                        key={item.contactId}
                        client={this.props.client}
                        clickName={this.handleContactNameClick}
                        propsJob={this.props.propsJob}
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
        let { currentUser } = this.props;
        let {
            company: { symbol, theme },
        } = currentUser;
        theme = theme ? JSON.parse(theme) : {};
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
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
                                    uri: downloadFromS3(symbol.key),
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
                                            uri: downloadFromS3(symbol.key),
                                        }
                                        : getErinSquare()
                                }
                            />
                        </View>
                    )}
                </View>
                {!this.props.currentUser.company.disableSmartReferrals || this.state.referralMatches.length > 0 ? (
                    <React.Fragment>
                        <Text style={styles.referralHeader}>
                            {customTranslate('ml_Dashboard_ReferralsRecommended')}
                        </Text>
                        { this.renderRecs()}
                    </React.Fragment>
                ) : null}
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
        marginLeft: 15,
        marginTop: 30,
        marginBottom: 10,
        fontWeight: '600',
        alignSelf: 'flex-start',
    },
    noReferrals: {
        width: width - 15,
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
        paddingLeft: 0,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        color: COLORS.darkGray,
        alignItems: 'center',
        width: wpx(110)
    },
    deptext: {
        fontSize: 12,
        marginHorizontal: wpx(5),
        color: COLORS.darkGray,
        width: wpx(90)
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
        width: wpx(375),
        marginVertical: 5,
        flexDirection: 'row',
        backgroundColor: COLORS.transparent,
    },
    buttonRow: {
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
        //paddingLeft: 22,
        //paddingRight: 22,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        //marginRight: (10 / 375) * width,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: COLORS.buttonGrayOutline,
        //width: (146 / 375) * width,
        width: '100%',
        marginTop: 5,
    },
    buttontext: {
        fontSize: 12,
        color: COLORS.buttonGrayText,
        marginLeft: 8,
    },
});
export default withApollo(JobDetail);
