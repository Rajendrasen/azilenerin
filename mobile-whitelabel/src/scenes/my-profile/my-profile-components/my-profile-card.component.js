import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import EmployeeJobInfo from './job-info.component';
import Avatar from './avatar.component';
import EmployeeInfo from './employee-info.component';
import { styles } from '../my-profile.styles';
import EditProfileLink from './edit-profile-link.component';
import ResendInvite from './resend-invite.component';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PasswordLink from './password-link.component';
import OneSignal from 'react-native-onesignal';
import { COLORS } from '../../../_shared/styles/colors';
import { getDomain } from '../../../WhiteLabelConfig';
import { getCompanyByHost } from '../../auth/login/login.graphql';
// import ConnectedApps from './connected-apps.component';
import { withApollo } from 'react-apollo';
import { customTranslate } from '../../../_shared/services/language-manager';
import { updateUserQuery } from '../profile.graphql';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { SIGN_OUT } from '../../../_store/_shared/user/user.actions';

const { CardStyles, FlexContainer2, ProfileCardStyles } = styles;
const MyProfileCard = (props) => {
    const dispatch = useDispatch();
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
    const [externalSignup, setExternalSignUp] = useState(true)
    useEffect(() => {
        checkOnesignal();
        checkSignUpStatus();
    }, []);
    const checkOnesignal = async () => {

        //OneSignal.setAppId('66bf4a74-a72f-4309-9ca4-19a9ce6aa7f0');

        const state = await OneSignal.getDeviceState();
        setSubscriptionEnabled(state?.isPushDisabled);
        setEnableNotifications(state?.hasNotificationPermission)



        // Check push notification and OneSignal subscription statuses
        // OneSignal.getPermissionSubscriptionState((status) => {
        //     console.log(status);
        // });
        // OneSignal.getPermissionSubscriptionState((state) => {
        //     setEnableNotifications(state.notificationsEnabled);
        //     setSubscriptionEnabled(state.userSubscriptionEnabled);
        // });
    };

    const handleToggleNotification = () => {

        if (!enableNotifications) {
            alert('Please enable Push Notifications from App Settings');
        }
        else {
            OneSignal.disablePush(!subscriptionEnabled)
            // OneSignal.setSubscription(!subscriptionEnabled);
            checkOnesignal();
        }
    };

    checkSignUpStatus = () => {
        props.client
            .query({
                query: getCompanyByHost,
                variables: {
                    host: getDomain(),
                },
            }).then((response) => {

                var comp = response.data.getCompanyByHost;
                //console.log("externalUserSignUp", comp.whitelabel);
                if (comp?.externalUserSignUp) {
                    setExternalSignUp(true)
                }
            })
    }


    DeleteMyAccount = () => {

        Alert.alert(
            'Delete My Account',
            'Are you sure you want to delete your account. This change cannot be undone.',
            [{ text: 'Delete', onPress: () => onDelete() }, {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            }],
        );
    }

    onDelete = async () => {
        props.client.mutate({
            mutation: updateUserQuery,
            variables: {
                input: {
                    id: props.currentUser.id,
                    active: false
                }
            }
        }).then((response) => {
            console.log(response)
        })
        AsyncStorage.clear();
        props.client.cache.reset();
        await Auth.signOut();
        dispatch({
            type: SIGN_OUT,
            payload: ""
        })
        props.signOut();
        console.log("delete pressed", props.currentUser.active)
    }

    const { currentUser, employeeDetails } = props;
    const {
        firstName,
        lastName,
        avatar,
        id,
        emailAddress,
        lastLogin,
        department,
        role,
        title,
        managedDepartments,
        currency,
        location,
        userGroup,
        // connectedApps,
    } = currentUser;

    return (
        <View style={[CardStyles, ProfileCardStyles]}>
            <View style={FlexContainer2}>
                <Avatar avatar={avatar} firstName={firstName} lastName={lastName} />
                <EmployeeInfo
                    firstName={firstName}
                    lastName={lastName}
                    emailAddress={emailAddress}
                    lastLogin={lastLogin}
                />
            </View>
            <EmployeeJobInfo
                role={role}
                managedDepartments={managedDepartments}
                department={department}
                title={title}
                currency={currency}
                location={location}
                employeeGroup={userGroup ? userGroup.name : null}
            />
            <TouchableOpacity
                onPress={() => handleToggleNotification()}
                style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 15,
                        height: 15,
                        borderWidth: subscriptionEnabled ? 0 : 0.5,
                        borderRadius: 4,
                        marginRight: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: subscriptionEnabled ? COLORS.green : 'transparent',
                    }}>
                    {subscriptionEnabled && (
                        <MaterialIcon color="white" name="check-bold" size={12} />
                    )}
                </View>
                <Text>Receive new job notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleToggleNotification()}
                style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 15,
                        height: 15,
                        // borderWidth: subscriptionEnabled ? 0 : 0.5,
                        borderWidth: 0.5,
                        borderRadius: 4,
                        marginRight: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        // backgroundColor: subscriptionEnabled ? COLORS.green : 'transparent',
                        backgroundColor: 'transparent',
                    }}>
                    {subscriptionEnabled && (
                        <MaterialIcon color="white" name="check-bold" size={12} />
                    )}
                </View>
                <Text>Opt Out of Referral Updates</Text>
            </TouchableOpacity>
            {!employeeDetails && (
                <React.Fragment>
                    {props?.currentUser?.authMethod === 'credentials' ? (
                        <PasswordLink userId={id} />
                    ) : null}
                </React.Fragment>
            )}
            {employeeDetails && !employeeDetails.employeeStatus && (
                <ResendInvite resendInvite={employeeDetails.resendInvite} />
            )}
            <EditProfileLink
                userDetails={currentUser}
                employeeDetails={employeeDetails}
            />
            {
                externalSignup && (
                    <Text style={{
                        color: '#018dd3',
                        fontWeight: '600',
                        fontSize: 16
                    }} onPress={() => DeleteMyAccount()}>{customTranslate('ml_delete_my_account')}</Text>
                )
            }


            {/* <ConnectedApps connectedApps={connectedApps} /> */}
        </View>
    );
};

export default withApollo(MyProfileCard);
