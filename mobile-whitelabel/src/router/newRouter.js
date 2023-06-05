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
import { Aside } from '../scenes/side-navigation/aside.container';
import { Dashboard } from '../scenes/dashboard/dashboard.container';
import { MyContacts } from '../scenes/my-network/my-network.container';
import { BrowseJobs } from '../scenes/jobs/jobs.container';
import { ManageJobs } from '../scenes/manageJobs/manageJobs.container';
import { ManageReferrals } from '../scenes/manageReferrals/manageReferrals.container';
import { ManageJobDetails } from '../scenes/manageJobs/job-detail/manageJob-detail.container';
import { ManageReferralDetails } from '../scenes/manageReferrals/referral-detail/manageReferral-details.container';
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
import { MyProfile } from '../scenes/my-profile';
import { userActions } from '../_store/actions';
import myTheme from '../amplify-theme';
import { debounce } from 'lodash';
import Bell from './bell';

class Routes extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // console.log('========router ', this.props);
        if (
            this.props.user.currentUser.cognitoId != null &&
            this.props.user.currentUser.cognitoId != ''
        ) {
            Actions.tabbar();
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
        return (
            <View style={styles.dashboard}>
                <TouchableOpacity>
                    {currentUser && currentUser.company && (
                        <Text style={styles.company}>{currentUser.company.name}</Text>
                    )}
                    <Text style={styles.title}>{props.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderRightButton() {
        const { firstName, lastName, avatar } = this.props.user.currentUser;
        // return (
        //   <View style={styles.rightbutton}>
        //     <TouchableOpacity style={styles.avatarContainer} onPress={Actions.alerts}>
        //       {/* {avatar && (
        //         <Image
        //           resizeMode="contain"
        //           style={styles.image}
        //           source={{
        //             uri: avatar,
        //           }}
        //         />
        //       )}
        //       {!avatar && (
        //         <Text style={styles.initials}>
        //           {firstName ? firstName[0] : ''}
        //           {lastName ? lastName[0] : ''}
        //         </Text>
        //       )} */}
        //       <Image
        //         source={require('../_shared/assets/ring.png')}
        //         style={{ width: 20, height: 20 }}
        //         resizeMode="contain"
        //       />
        //     </TouchableOpacity>
        //   </View>
        // );
        return <Bell {...this.props} />;
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
            <TouchableOpacity hitSlop={{ right: 40 }} onPress={() => Actions.pop()}>
                <View style={styles.leftModalButton}>
                    {/* <Icon type="down" size="md" color={COLORS.blue} /> */}
                    <Icon name="ios-arrow-back" size={30} color={COLORS.blue} />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        // if (!this.props.user.currentUser.companyId)
        // return <ActivityIndicator size="large" color="black" style={styles.loading} />;
        return (
            <Router panHandlers={null}>
                <Modal>
                    <Lightbox key="lightbox" hideNavBar>
                        <Scene key="root">
                            <Stack key="authScreens" hideNavBar>
                                <Scene key="signIn" component={Login} hideNavBar initial />
                                <Scene
                                    key="forgotPassword"
                                    component={ForgotPasswordScene}
                                    hideNavBar
                                />
                            </Stack>
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
                                        title="Dashboard"
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
                                        key="jobs"
                                        title="Jobs"
                                        icon={TabIcon}
                                        iconName={require('../_shared/assets/id.png')}
                                        renderTitle={(props) => this.renderTitle(props)}
                                        renderRightButton={() => this.renderRightButton()}
                                        leftTitle="&#9776;"
                                        leftButtonTextStyle={styles.leftbutton}>
                                        <Scene
                                            key="jobsScene"
                                            title="Jobs"
                                            renderRightButton={() => this.renderRightButton()}
                                            renderTitle={(props) => this.renderTitle(props)}
                                            leftTitle="&#9776;"
                                            leftButtonTextStyle={styles.leftbutton}
                                            component={BrowseJobs}
                                        />
                                        <Scene
                                            key="jobDetail"
                                            title="Job Detail"
                                            renderTitle={(props) => this.renderTitle(props)}
                                            renderRightButton={() => this.renderRightButton()}
                                            renderLeftButton={() => this.renderBackButton()}
                                            component={JobDetails}
                                        // clone
                                        />
                                    </Stack>

                                    <Stack
                                        key="referrals"
                                        title="Referrals"
                                        icon={TabIcon}
                                        iconName={require('../_shared/assets/icongroup.png')}
                                        renderTitle={(props) => this.renderTitle(props)}
                                        renderRightButton={() => this.renderRightButton()}
                                        leftTitle="&#9776;"
                                        leftButtonTextStyle={styles.leftbutton}>
                                        <Scene
                                            key="referralsScene"
                                            title="Referrals"
                                            icon={TabIcon}
                                            iconName={require('../_shared/assets/icongroup.png')}
                                            renderTitle={(props) => this.renderTitle(props)}
                                            renderRightButton={() => this.renderRightButton()}
                                            leftTitle="&#9776;"
                                            leftButtonTextStyle={styles.leftbutton}
                                            component={Referrals}
                                        />
                                    </Stack>

                                    <Stack
                                        tabs={false}
                                        title="Contacts"
                                        icon={TabIcon}
                                        iconName={require('../_shared/assets/contact-book.png')}>
                                        {/* <Scene
                      title="Alerts"
                      icon={TabIcon}
                      iconName={require('../_shared/assets/ring.png')}
                      renderTitle={props => this.renderTitle(props)}
                      renderRightButton={() => this.renderRightButton()}
                      leftTitle="&#9776;"
                      leftButtonTextStyle={styles.leftbutton}
                      component={Notifications}
                    /> */}
                                        <Scene
                                            key="contacts"
                                            icon={TabIcon}
                                            iconName={require('../_shared/assets/contact-book.png')}
                                            renderTitle={(props) => this.renderTitle(props)}
                                            component={MyContacts}
                                            title="My Contacts"
                                            leftTitle="&#9776;"
                                            leftButtonTextStyle={styles.leftbutton}
                                            renderRightButton={() => this.renderRightButton()}
                                        />
                                    </Stack>
                                </Scene>
                                <Stack
                                    key="manageJobs"
                                    title="Manage Jobs"
                                    icon={TabIcon}
                                    iconName={require('../_shared/assets/id.png')}
                                    renderTitle={(props) => this.renderTitle(props)}
                                    renderRightButton={() => this.renderRightButton()}
                                    leftTitle="&#9776;"
                                    leftButtonTextStyle={styles.leftbutton}>
                                    <Scene
                                        key="manageJobss"
                                        title="Manage Jobs"
                                        renderRightButton={() => this.renderRightButton()}
                                        renderTitle={(props) => this.renderTitle(props)}
                                        renderLeftButton={() => this.renderBackButton()}
                                        component={ManageJobs}
                                    />
                                    <Scene
                                        key="manageJobDetail"
                                        title="Manage Jobs"
                                        renderRightButton={() => this.renderRightButton()}
                                        renderTitle={(props) => this.renderTitle(props)}
                                        renderLeftButton={() => this.renderBackButton()}
                                        component={ManageJobDetails}
                                    />
                                </Stack>
                                <Stack
                                    key="manageReferrals"
                                    title="Referrals"
                                    icon={TabIcon}
                                    iconName={require('../_shared/assets/icongroup.png')}
                                    renderTitle={(props) => this.renderTitle(props)}
                                    renderRightButton={() => this.renderRightButton()}
                                    leftTitle="&#9776;"
                                    leftButtonTextStyle={styles.leftbutton}>
                                    <Scene
                                        key="manageReferralss"
                                        title="Manage Referrals"
                                        //renderRightButton={() => this.renderRightButton()}
                                        renderTitle={(props) => this.renderTitle(props)}
                                        renderLeftButton={() => this.renderBackButton()}
                                        component={ManageReferrals}
                                    />
                                    <Scene
                                        key="referralDetail"
                                        title="Manage Referrals"
                                        renderTitle={(props) => this.renderTitle(props)}
                                        //renderRightButton={() => this.renderRightButton()}
                                        renderLeftButton={() => this.renderBackButton()}
                                        component={ManageReferralDetails}
                                    // clone
                                    />
                                </Stack>
                            </Drawer>
                        </Scene>
                    </Lightbox>
                    <Lightbox key="profile" title="Profile" hideNavBar>
                        <Stack key="profileStack">
                            <Scene
                                key="profileScene"
                                title="Profile"
                                renderTitle={(props) => this.renderTitle(props)}
                                renderLeftButton={() => this.renderLeftModalButton()}
                                leftButtonTextStyle={styles.leftbutton}
                                component={MyProfile}
                            />
                            <Scene
                                key="editProfileScene"
                                title="Edit Profile"
                                renderRightButton={() => this.renderRightButton()}
                                renderTitle={(props) => this.renderTitle(props)}
                                leftButtonTextStyle={styles.leftbutton}
                                component={EditProfile}
                            />
                            <Scene
                                key="resetPasswordScene"
                                title="Reset Password"
                                renderRightButton={() => this.renderRightButton()}
                                renderTitle={(props) => this.renderTitle(props)}
                                leftButtonTextStyle={styles.leftbutton}
                                component={ResetPassword}
                            />
                        </Stack>
                    </Lightbox>
                    <Lightbox key="alerts" title="Alerts" hideNavBar>
                        <Stack key="profileStack">
                            <Scene
                                title="Alerts"
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
const mapStateToProps = ({ user }) => {
    return { user };
};
//to send the signOutAction in aside as props
const mapDispatchToProps = (dispatch) => {
    return {
        signOutAction(token = '') {
            dispatch(userActions.signOut(token));
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
