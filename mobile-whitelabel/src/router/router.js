import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    ActivityIndicator,
    Alert,
    BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import {
    Router,
    Scene,
    Drawer,
    Stack,
    Modal,
    Lightbox,
    Actions,
} from 'react-native-router-flux';
import {
    withAuthenticator,
    SignIn,
    ForgotPassword,
} from 'aws-amplify-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MyBonuses } from '../scenes/my-bonus/my-bonuses.container';
import { Aside } from '../scenes/side-navigation/aside.container';
import { Dashboard } from '../scenes/dashboard/dashboard.container';
import { MyContacts } from '../scenes/my-network/my-network.container';
import { MessageCenter } from '../scenes/message-center/message-center.container';
import { BrowseJobs } from '../scenes/jobs/jobs.container';
import { Settings } from '../scenes/settings/settings.container';
import { ManageJobs } from '../scenes/manageJobs/manageJobs.container';
import { CareerProfile } from '../scenes/careerProfile/careerProfile.container';
import { ManageReferrals } from '../scenes/manageReferrals/manageReferrals.container';
import { ManageEmployees } from '../scenes/manageEmployees/manageEmployees.container';
import { AllBonuses } from '../scenes/bonus/bonus.container';
import { BonusBuilder } from '../scenes/bonus-builder/bonus-builder.container';
import { ManageOnDeck } from '../scenes/on-deck/manageOnDeck.container';
import { ManageJobDetails } from '../scenes/manageJobs/job-detail/manageJob-detail.container';
import { EmployeeDetails } from '../scenes/manageEmployees/employee-detail/employee-detail.container';
import { ManageReferralDetails } from '../scenes/manageReferrals/referral-detail/manageReferral-details.container';
import { ReferralDetails } from '../scenes/on-deck/on-deck-detail/on-deck-detail.container';
import { JobDetails } from '../scenes/jobs/job-detail/job-detail.container';

import { Referrals } from '../scenes/referrals';
import { Notifications } from '../scenes/notifications';
import { COLORS } from '../_shared/styles/colors';
import { TabIcon } from './tab-icon.component';
import styles from './router.component.style';
import { Login } from '../scenes/auth/login/login.container';
import { ForgotPasswordScene } from '../scenes/auth/forgot-password';
import { ResetPassword } from '../scenes/auth/reset-password/reset-password.component';
import EditProfile from '../scenes/my-profile/my-profile-components/edit-profile.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../_shared/services/language-manager';
import { MyProfile } from '../scenes/my-profile';
import { userActions } from '../_store/actions';
import myTheme from '../amplify-theme';
import { debounce } from 'lodash';
import Bell from './bell';
import OneSignal from 'react-native-onesignal';
import { MyApplications } from '../scenes/myApplications';
import CustomPage from '../scenes/custom-page/custom-page';
import { get } from 'lodash';
import GiftStore from '../scenes/gift-store/giftStore.component';
import { getAppName } from '../WhiteLabelConfig';
import AnnouncementsComponent from '../scenes/announcements/announcements.component';
import Mobility from '../scenes/mobility/mobility.component';
import MobilityJobroles from '../scenes/mobility/mobility.jobroles';

class Routes extends Component {

    state = {
        transition: true,
    };

    componentDidMount() {
        // OneSignal.addEventListener('received', (not) => {
        //   this.props.setNewNotification(not);
        // });
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // console.log('========router ', this.props);
        if (
            this.props.user.currentUser.cognitoId != null &&
            this.props.user.currentUser.cognitoId != ''
        ) {
            Actions.tabbar();
        }
    }
    shouldComponentUpdate(nextProps) {
        if (
            this.props.user.currentUser.cognitoId &&
            nextProps.user.currentUser.cognitoId
        ) {
            return false;
        } else {
            return true;
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        if (Actions.currentScene == '_dashboard') {
            Alert.alert('Confirm exit', 'Do you want to exit App?', [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        BackHandler.exitApp();
                    },
                },
            ]);
            return true;
        }
        if (Actions.currentScene == 'signIn') {
            Alert.alert('Confirm exit', 'Do you want to exit App?', [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        BackHandler.exitApp();
                    },
                },
            ]);
            // return true;
        }
    }
    renderTitle(props) {
        const {
            user: { currentUser },
        } = this.props;
        // console.log("sub company name", currentUser)
        return (
            <View style={styles.dashboard}>
                <TouchableOpacity>
                    {currentUser && currentUser.company && (
                        <Text style={styles.company}>
                            {get(currentUser, 'subCompany.name', '')
                                ? currentUser.subCompany.name
                                : currentUser.company.name}
                        </Text>
                    )}
                    <Text style={styles.title}>{props.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderRightButton(type) {
        const { firstName, lastName, avatar } = this.props.user.currentUser;

        if (type == 'Profile') { }
        return (
            <View style={styles.rightbutton}>
                {/* <TouchableOpacity style={styles.avatarContainer} onPress={Actions.alerts}> */}
                {/* {avatar && (
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={{
                    uri: avatar,
                  }}
                />
              )}
              {!avatar && (
                <Text style={styles.initials}>
                  {firstName ? firstName[0] : ''}
                  {lastName ? lastName[0] : ''}
                </Text>
              )} */}
                {/* <Image
                        source={require('../_shared/assets/ring.png')}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                    /> */}
                {/* </TouchableOpacity> */}
            </View>
        );
        // return <Bell {...this.props} />;
    }

    renderLeftModalButton() {
        return (
            <TouchableOpacity onPress={() => Actions.pop()}>
                <View style={styles.leftModalButton}>
                    {/* <Icon type="down" size="md" color={COLORS.blue} /> */}
                    <Icon name="ios-arrow-down" size={30} color={COLORS.blue} />
                </View>
            </TouchableOpacity>
        );
    }

    renderBackButton() {
        return (
            <TouchableOpacity hitSlop={{ right: 40 }} onPress={() => Actions.dashboard()}>
                <View style={styles.leftModalButton}>
                    {/* <Icon type="down" size="md" color={COLORS.blue} /> */}
                    <Icon name="ios-arrow-back" size={30} color={COLORS.blue} />
                </View>
            </TouchableOpacity>
        );
    }

    renderJobDetailsBackButton(props) {
        return (
            <TouchableOpacity hitSlop={{ right: 40 }} 
            // onPress={() => props.myApplication?Actions.myApplications():Actions.pop()}
            onPress={() => Actions.pop()}
            >
                <View style={styles.leftModalButton}>
                    {/* <Icon type="down" size="md" color={COLORS.blue} /> */}
                    <Icon name="ios-arrow-back" size={30} color={COLORS.blue} />
                </View>
            </TouchableOpacity>
        );
    }

    renderReferralBackButton() {
        return (
            <TouchableOpacity hitSlop={{ right: 40 }} onPress={() => Actions.manageReferralss()}>
                <View style={styles.leftModalButton}>
                    {/* <Icon type="down" size="md" color={COLORS.blue} /> */}
                    <Icon name="ios-arrow-back" size={30} color={COLORS.blue} />
                </View>
            </TouchableOpacity>
        );
    }

    renderProUserRoutes = () => {
        let isFree = false;
        let role = 'admin';
        let hideJobs = false;
        let hideBonus = false;
        let hideReferrals = false;
        if (this.props.user.currentUser.company) {
            isFree =
                this.props.user.currentUser.company.accountType === 'free'
                    ? true
                    : false;
            hideJobs = this.props.user.currentUser.company.hideJobsPage;
            role = this.props.user.currentUser.role;
            hideBonus = this.props.user?.currentUser?.company?.hideBonus || false;
            hideReferrals = this.props.user?.currentUser?.company?.allowSelfReferrals;
        }
        let customPageTitle = '';
        if (this.props?.user?.currentUser?.company?.customPageTitle) {
            customPageTitle = this.props.user.currentUser.company.customPageTitle;
        }
        return !isFree ? (
            <Drawer
                key="aside"
                contentComponent={() => (
                    <Aside
                        signOut={this.props.signOutAction}
                        rerender={() => this.props.rerender()}
                    />
                )}
                drawerWidth={250}
                hideNavBar>
                <Scene
                    key="tabbar"
                    tabBarStyle={styles.tabbar}
                    activeTintColor={COLORS.white}
                    tabs
                // initial
                >
                    <Scene
                        key="dashboard"
                        title={customTranslate('ml_Dashboard')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/dashboard.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}
                        component={Dashboard}
                    // gesturesEnabled={false}
                    />
                    {
                        role.toLowerCase() == 'employee' && hideJobs ? null : (
                            <Stack
                                key="jobs"
                                title={customTranslate('ml_Jobs')}
                                icon={TabIcon}
                                iconName={require('../_shared/assets/id.png')}
                                renderTitle={(props) => this.renderTitle(props)}
                                renderRightButton={() => this.renderRightButton()}
                                leftTitle="&#9776;"
                                leftButtonTextStyle={styles.leftbutton}>
                                <Scene
                                    key="jobsScene"
                                    title={customTranslate('ml_Jobs')}
                                    renderRightButton={() => this.renderRightButton()}
                                    renderTitle={(props) => this.renderTitle(props)}
                                    leftTitle="&#9776;"
                                    leftButtonTextStyle={styles.leftbutton}
                                    component={BrowseJobs}
                                />
                                <Scene
                                    key="jobDetail"
                                    title={customTranslate('ml_JobDetails')}
                                    renderTitle={(props) => this.renderTitle(props)}
                                    renderRightButton={() => this.renderRightButton()}
                                    // renderLeftButton={() => this.renderJobDetailsBackButton()}
                                    renderLeftButton={this.renderJobDetailsBackButton}
                                    component={JobDetails}
                                // clone
                                />
                            </Stack>
                        )}

                    <Stack
                        key="referrals"
                        title={customTranslate('ml_Referrals')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/icongroup.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}>
                        <Scene
                            key="referralsScene"
                            title={customTranslate('ml_Referrals')}
                            icon={TabIcon}
                            iconName={require('../_shared/assets/icongroup.png')}
                            renderTitle={(props) => this.renderTitle(props)}
                            renderRightButton={() => this.renderRightButton()}
                            leftTitle="&#9776;"
                            leftButtonTextStyle={styles.leftbutton}
                            component={Referrals}
                        />
                    </Stack>
                    {hideReferrals && (
                        <Stack
                            tabs={false}
                            title={'Applications'}
                            icon={TabIcon}
                            iconStyle={{ width: 22, height: 22 }}
                            iconName={require('../_shared/assets/profile.png')}>
                            <Scene
                                key="myApplications"
                                icon={TabIcon}
                                iconName={require('../_shared/assets/money-bag.png')}
                                renderTitle={(props) => this.renderTitle(props)}
                                component={this.state.transition ? MyApplications : <></>}
                                title={'My Applications'}
                                iconStyle={{ width: 22, height: 22 }}
                                leftTitle="&#9776;"
                                leftButtonTextStyle={styles.leftbutton}
                                renderRightButton={() => this.renderRightButton()}
                                onExit={() => this.setState({ transition: false })}
                                onEnter={() => this.setState({ transition: true })}
                            // lazy={true}
                            />
                            <Scene
                                    key="jobDetail"
                                    title={customTranslate('ml_JobDetails')}
                                    renderTitle={(props) => this.renderTitle(props)}
                                    renderRightButton={() => this.renderRightButton()}
                                    // renderLeftButton={() => this.renderJobDetailsBackButton()}
                                    renderLeftButton={this.renderJobDetailsBackButton}
                                    component={JobDetails}
                                // clone
                                />
                        </Stack>
                    )}

                    {!hideBonus && (
                        <Stack
                            tabs={false}
                            title={'Bonuses'}
                            icon={TabIcon}
                            iconStyle={{ width: 22, height: 22 }}
                            iconName={require('../_shared/assets/money-bag.png')}>
                            <Scene
                                key="myBonuses"
                                icon={TabIcon}
                                iconName={require('../_shared/assets/money-bag.png')}
                                renderTitle={(props) => this.renderTitle(props)}
                                component={MyBonuses}
                                title={'My Bonuses'}
                                iconStyle={{ width: 22, height: 22 }}
                                leftTitle="&#9776;"
                                leftButtonTextStyle={styles.leftbutton}
                                renderRightButton={() => this.renderRightButton()}
                            />
                        </Stack>
                    )}
                </Scene>
                <Stack
                    key="manageJobs"
                    title={customTranslate('ml_ManageJobs')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="manageJobss"
                        title={customTranslate('ml_ManageJobs')}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageJobs}
                    />
                    <Scene
                        key="manageJobDetail"
                        title={customTranslate('ml_ManageJobs')}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageJobDetails}
                    />
                </Stack>
                <Stack
                    key="AnnouncementStack"
                    title={'Announcements'}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="Announcements"
                        title={'Announcements'}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={AnnouncementsComponent}
                    />
                </Stack>
                <Stack
                    key="MobilityStack"
                    title={'Mobility'}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="Mobility"
                        title={customTranslate('ml_Internal_Mobility')}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={Mobility}
                    />
                </Stack>
                <Stack
                    key="MobilityOpenRoles"
                    title={'MobilityOpenRoles'}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="MobilityOpenRoles"
                        title={'Open To New Roles'}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={MobilityJobroles}
                    />
                </Stack>
                <Stack
                    key="careerProfileStack"
                    title={'Career Profile'}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="careerProfile"
                        title={'Career Profile'}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={CareerProfile}
                    />
                </Stack>
                <Stack
                    key="giftStoreStack"
                    title={'Gifts'}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/id.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="giftStore"
                        title={'Gifts'}
                        renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={GiftStore}
                    />
                </Stack>
                <Stack
                    key="manageReferrals"
                    title={customTranslate('ml_Referrals')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/icongroup.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="manageReferralss"
                        title={customTranslate('ml_AllReferrals')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageReferrals}
                    />
                    <Scene
                        key="referralDetail"
                        title={customTranslate('ml_ManageReferrals')}
                        renderTitle={(props) => this.renderTitle(props)}
                        //renderRightButton={() => this.renderRightButton()}
                        renderLeftButton={() => this.renderReferralBackButton()}
                        component={ManageReferralDetails}
                    // clone
                    />
                </Stack>
                <Stack
                    key="manageOnDeck"
                    title={customTranslate('ml_GeneralReferrals')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="onDeck"
                        title={customTranslate('ml_GeneralReferrals')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageOnDeck}
                    />
                    <Scene
                        key="onDeckReferralDetail"
                        title={customTranslate('ml_ReferralDetails')}
                        renderTitle={(props) => this.renderTitle(props)}
                        //renderRightButton={() => this.renderRightButton()}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ReferralDetails}
                    // clone
                    />
                </Stack>
                <Stack
                    key="manageEmployees"
                    title={customTranslate('ml_Employees')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="employees"
                        title={customTranslate('ml_Employees')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageEmployees}
                    />
                    <Scene
                        key="employeeDetails"
                        title="Employee Details"
                        renderTitle={(props) => this.renderTitle(props)}
                        //renderRightButton={() => this.renderRightButton()}
                        renderLeftButton={() => this.renderBackButton()}
                        component={EmployeeDetails}
                    // clone
                    />
                    <Scene
                        key="editProfileScene"
                        title="Edit Employee"
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={EditProfile}
                    />
                </Stack>
                <Stack
                    key="bonusStack"
                    title={customTranslate('ml_AllBonuses')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="bonus"
                        title={customTranslate('ml_AllBonuses')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={AllBonuses}
                    />
                </Stack>
                <Stack
                    key="bonusBuilderStack"
                    title={customTranslate('ml_BonusBuilder')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="bonusBuilder"
                        title={customTranslate('ml_BonusBuilder')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={BonusBuilder}
                    />
                </Stack>
                <Stack
                    key="messageCenterStack"
                    title={customTranslate('ml_MessageCenter')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="messageCenter"
                        title={'Send A Message'}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={MessageCenter}
                    />
                </Stack>
                <Stack
                    key="settingsStack"
                    title={customTranslate('ml_Settings')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="settings"
                        title={customTranslate('ml_Settings')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={Settings}
                    />
                    {/* <Scene
          key="onDeckReferralDetail"
          title="Referral Details"
          renderTitle={props => this.renderTitle(props)}
          //renderRightButton={() => this.renderRightButton()}
          renderLeftButton={() => this.renderBackButton()}
          component={ReferralDetails}
          // clone
        /> */}
                </Stack>
                {role != 'extendedUser' && (
                    <Stack
                        key="contactsStack"
                        tabs={false}
                        title={customTranslate('ml_Contacts_Contacts')}>
                        <Scene
                            key="contacts"
                            icon={TabIcon}
                            iconName={require('../_shared/assets/contact-book.png')}
                            renderTitle={(props) => this.renderTitle(props)}
                            component={MyContacts}
                            title={customTranslate('ml_referral_network')}
                            leftButtonTextStyle={styles.leftbutton}
                            renderLeftButton={() => this.renderBackButton()}
                            renderRightButton={() => this.renderRightButton()}
                        />
                    </Stack>
                )}
                <Stack key="customPageStack" tabs={false} title={customPageTitle}>
                    <Scene
                        key="customPage"
                        icon={TabIcon}
                        iconName={require('../_shared/assets/contact-book.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        component={CustomPage}
                        title={customPageTitle}
                        leftButtonTextStyle={styles.leftbutton}
                        renderLeftButton={() => this.renderBackButton()}
                        renderRightButton={() => this.renderRightButton()}
                    />
                </Stack>
            </Drawer>
        ) : (
            <Drawer
                key="aside"
                contentComponent={() => (
                    <Aside
                        signOut={this.props.signOutAction}
                        rerender={() => this.props.rerender()}
                    />
                )}
                drawerWidth={250}
                hideNavBar>
                <Scene
                    key="tabbar"
                    tabBarStyle={styles.tabbar}
                    activeTintColor={COLORS.white}
                    tabs
                // initial
                >
                    <Scene
                        key="dashboard"
                        title={customTranslate('ml_Dashboard')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/dashboard.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}
                        component={Dashboard}
                    // gesturesEnabled={false}
                    />
                    <Stack
                        key="manageReferrals"
                        title={customTranslate('ml_Referrals')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/icongroup.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}>
                        <Scene
                            key="manageReferralss"
                            title={customTranslate('ml_AllReferrals')}
                            //renderRightButton={() => this.renderRightButton()}
                            renderTitle={(props) => this.renderTitle(props)}
                            component={ManageReferrals}
                        />
                        <Scene
                            key="referralDetail"
                            title={customTranslate('ml_ManageReferrals')}
                            renderTitle={(props) => this.renderTitle(props)}
                            //renderRightButton={() => this.renderRightButton()}
                            renderLeftButton={() => this.renderBackButton()}
                            component={ManageReferralDetails}
                        // clone
                        />
                    </Stack>

                    <Stack
                        key="bonusStack"
                        title={customTranslate('ml_Bonuses')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/money-bag.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}>
                        <Scene
                            key="bonus"
                            title={customTranslate('ml_AllBonuses')}
                            //renderRightButton={() => this.renderRightButton()}
                            renderTitle={(props) => this.renderTitle(props)}
                            // renderLeftButton={() => this.renderBackButton()}
                            component={AllBonuses}
                        />
                        {/* <Scene
          key="onDeckReferralDetail"
          title="Referral Details"
          renderTitle={props => this.renderTitle(props)}
          //renderRightButton={() => this.renderRightButton()}
          renderLeftButton={() => this.renderBackButton()}
          component={ReferralDetails}
          // clone
        /> */}
                    </Stack>
                    <Stack
                        key="manageJobs"
                        title={customTranslate('ml_Jobs')}
                        icon={TabIcon}
                        iconName={require('../_shared/assets/id.png')}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderRightButton={() => this.renderRightButton()}
                        leftTitle="&#9776;"
                        leftButtonTextStyle={styles.leftbutton}>
                        <Scene
                            key="manageJobss"
                            title={customTranslate('ml_ManageJobs')}
                            renderRightButton={() => this.renderRightButton()}
                            renderTitle={(props) => this.renderTitle(props)}
                            component={ManageJobs}
                        />
                        <Scene
                            key="manageJobDetail"
                            title={customTranslate('ml_ManageJobs')}
                            renderRightButton={() => this.renderRightButton()}
                            renderTitle={(props) => this.renderTitle(props)}
                            renderLeftButton={() => this.renderBackButton()}
                            component={ManageJobDetails}
                        />
                    </Stack>
                </Scene>
                <Stack
                    key="bonusBuilderStack"
                    title={customTranslate('ml_BonusBuilder')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="bonusBuilder"
                        title={customTranslate('ml_BonusBuilder')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={BonusBuilder}
                    />
                    {/* <Scene
          key="onDeckReferralDetail"
          title="Referral Details"
          renderTitle={props => this.renderTitle(props)}
          //renderRightButton={() => this.renderRightButton()}
          renderLeftButton={() => this.renderBackButton()}
          component={ReferralDetails}
          // clone
        /> */}
                </Stack>
                <Stack
                    key="manageEmployees"
                    title={customTranslate('ml_Employees')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="employees"
                        title={customTranslate('ml_Employees')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={ManageEmployees}
                    />
                    <Scene
                        key="employeeDetails"
                        title="Employee Details"
                        renderTitle={(props) => this.renderTitle(props)}
                        //renderRightButton={() => this.renderRightButton()}
                        renderLeftButton={() => this.renderBackButton()}
                        component={EmployeeDetails}
                    // clone
                    />
                    <Scene
                        key="editProfileScene"
                        title="Edit Employee"
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={EditProfile}
                    />
                </Stack>
                <Stack
                    key="settingsStack"
                    title={customTranslate('ml_Settings')}
                    icon={TabIcon}
                    iconName={require('../_shared/assets/add-user.png')}
                    renderTitle={(props) => this.renderTitle(props)}
                    renderRightButton={() => this.renderRightButton()}
                    leftTitle="&#9776;"
                    leftButtonTextStyle={styles.leftbutton}>
                    <Scene
                        key="settings"
                        title={customTranslate('ml_Settings')}
                        //renderRightButton={() => this.renderRightButton()}
                        renderTitle={(props) => this.renderTitle(props)}
                        renderLeftButton={() => this.renderBackButton()}
                        component={Settings}
                    />
                    {/* <Scene
        key="onDeckReferralDetail"
        title="Referral Details"
        renderTitle={props => this.renderTitle(props)}
        //renderRightButton={() => this.renderRightButton()}
        renderLeftButton={() => this.renderBackButton()}
        component={ReferralDetails}
        // clone
      /> */}
                </Stack>
            </Drawer>
        );
    };

    render() {
        // if (!this.props.user.currentUser.companyId)
        // return <ActivityIndicator size="large" color="black" style={styles.loading} />;
        return (
            <Router panHandlers={null} sceneStyle={{ backgroundColor: '#e9e9ef' }}>
                <Modal>
                    <Lightbox headerMode="screen" key="lightbox" hideNavBar>
                        <Scene key="root">
                            <Stack key="authScreens" hideNavBar>
                                <Scene key="signIn" component={Login} hideNavBar initial />
                                <Scene
                                    key="forgotPassword"
                                    component={ForgotPasswordScene}
                                    hideNavBar
                                />
                            </Stack>
                            {this.renderProUserRoutes()}
                        </Scene>
                    </Lightbox>
                    <Lightbox key="resetPasswordSingle" title="Profile" hideNavBar>
                        <Stack key="restPassword">
                            <Scene
                                title={customTranslate('ml_ResetPassword')}
                                renderLeftButton={() => this.renderLeftModalButton()}
                                renderTitle={(props) => this.renderTitle(props)}
                                leftButtonTextStyle={styles.leftbutton}
                                component={ResetPassword}
                            />
                        </Stack>
                    </Lightbox>
                    <Lightbox key="profile" title="Profile" hideNavBar>
                        <Stack key="profileStack">
                            <Scene
                                key="profileScene"
                                title={customTranslate('ml_MyProfile')}
                                renderRightButton={() => this.renderRightButton("go")}
                                renderTitle={(props) => this.renderTitle(props)}
                                renderLeftButton={() => this.renderBackButton()}
                                leftButtonTextStyle={{ ...styles.leftbutton }}
                                component={MyProfile}
                            />
                            <Scene
                                key="editProfileScene"
                                title={customTranslate('ml_EditProfile')}
                                renderRightButton={() => this.renderRightButton()}
                                renderTitle={(props) => this.renderTitle(props)}
                                leftButtonTextStyle={styles.leftbutton}
                                component={EditProfile}
                            />
                            <Scene
                                key="resetPasswordScene"
                                title={customTranslate('ml_ResetPassword')}
                                renderRightButton={() => this.renderRightButton()}
                                renderTitle={(props) => this.renderTitle(props)}
                                leftButtonTextStyle={styles.leftbutton}
                                component={ResetPassword}
                            />
                        </Stack>
                    </Lightbox>
                    <Lightbox
                        key="alerts"
                        title={customTranslate('ml_Alerts')}
                        hideNavBar>
                        <Stack key="profileStack">
                            <Scene
                                title={customTranslate('ml_Alerts')}
                                renderTitle={(props) => this.renderTitle(props)}
                                renderLeftButton={() => this.renderLeftModalButton()}
                                leftButtonTextStyle={styles.leftbutton}
                                component={Notifications}
                            />
                        </Stack>
                    </Lightbox>
                </Modal>
            </Router>
        );
    }
}
const mapStateToProps = (state) => {
    return { user: state.user };
};
//to send the signOutAction in aside as props
const mapDispatchToProps = (dispatch) => {
    return {
        signOutAction(token = '') {
            dispatch(userActions.signOut(token));
        },
        setNewNotification(notification) {
            dispatch(userActions.setNewNotificationAction(notification));
        },
    };
};
const connected = connect(mapStateToProps, mapDispatchToProps)(Routes);
export default function routes(props) {
    // const AppComponent = withAuthenticator(
    //   connected,
    //   false,
    //   [
    //     <Login override={SignIn} key="signIn" />,
    //     <ForgotPasswordScene override={ForgotPassword} key="forgotPassword" />,
    //   ],
    //   null,
    //   myTheme
    // );
    const AppComponent = connected;
    return <AppComponent {...props} />;
}
