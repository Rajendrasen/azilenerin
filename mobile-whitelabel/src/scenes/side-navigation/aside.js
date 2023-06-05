import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    AsyncStorage,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Auth } from 'aws-amplify';
import styles from './aside.component.style';
import { withApollo } from 'react-apollo';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import SelectLanguage from '../../_shared/components/language/select-language.component';
import { downloadFromS3 } from '../../common';
import Pro from '../../_shared/components/pro/pro.component';
import InviteModal from './inviteModal';
import { getAppName, getDomain, getWhiteLogo } from '../../WhiteLabelConfig';
import { get } from 'lodash';
import { getCompanyByHost } from '../auth/login/login.graphql';
import { hpx } from '../../_shared/constants/responsive';
let { width } = Dimensions.get('window');


class Aside extends Component {
    state = {
        visible: false,
        proVisible: false,
        showMobilityOptions: false,
        showPoweredByErin: false,
        showInternalMobility: false,

    };
    closeLanguageModal = () => {
        this.setState({ visible: false });
    };
    closeProModal = () => {
        this.setState({ proVisible: false });
    };
    languageResolver = (locale) => {
        let code = locale.toLowerCase();
        if (code.includes('en')) return 'English';
        if (code.includes('pt')) return 'Português';
        if (code.includes('fr')) return 'Français';
        if (code.includes('ru')) return 'русский';
        if (code.includes('de')) return 'Deutsche';
        if (code.includes('es')) return 'Español';
        if (code.includes('zh')) return '中国人';
        if (code.includes('ja')) return '日本';
        if (code.includes('nl')) return 'Nederlands';
        if (code.includes('it')) return 'italiano';
        else return 'English';
    };

    componentDidMount() {
        console.log("Props", this.props.currentUser);

        this.setState({ showInternalMobility: this.props.currentUser?.company?.allowInternalMobility })

        try {
            this.props.client
                .query({
                    query: getCompanyByHost,
                    variables: {
                        host: getDomain(),
                    },
                }).then(async (res) => {
                    this.setState({ showPoweredByErin: res.data.getCompanyByHost?.showPoweredByErin })
                    console.log("aside call", res.data.getCompanyByHost?.showPoweredByErin)
                    console.log("aside call res", res)

                })
        } catch (error) {
            console.log("Error Message ===>", error.message)
        }

    }



    render() {
        let {
            currentUser: {
                role,
                company: {
                    logo,
                    theme,
                    accountType,
                    enableExtendedNetwork,
                    enableCareerProfile,
                    enableCustomPage,
                    customPageTitle,
                },
            },
        } = this.props;
        // console.log("logo is here", role)
        if (get(this.props, 'currentUser.company.logo', '')) {

            logo = this.props.currentUser.company.logo;
            // console.log("logo is now", logo)
        }
        let pointsSettings = JSON.parse(
            this.props.currentUser?.company?.pointsSettings,
        );
        theme = theme ? JSON.parse(theme) : {};
        return (
            <SafeAreaView
                style={[
                    styles.sidenav,
                    theme.enabled && { backgroundColor: theme.menuColor },
                ]}>
                <ScrollView
                    style={[
                        styles.sidenav,
                        { paddingBottom: Platform.OS == 'android' ? hpx(10) : 0 },
                        theme.enabled && { backgroundColor: theme.menuColor },
                    ]}>
                    {
                        getAppName() == 'talentreef' ?
                            <Image
                                // resizeMode="contain"
                                source={
                                    getWhiteLogo()
                                }
                                style={{ resizeMode: 'contain', height: 70, width: 200, alignSelf: 'center' }}
                            />
                            : <View>
                                <Image
                                    // resizeMode="contain"
                                    source={
                                        logo && logo.key
                                            ? {
                                                uri: downloadFromS3(logo.key),
                                            }
                                            : getWhiteLogo()
                                    }
                                    style={styles.logo}
                                />
                                {
                                    (this.state.showPoweredByErin && (role == 'superAdmin')) && <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 10,
                                        }}>
                                        <Text style={{ fontSize: 14, color: '#fff', marginRight: 5 }}>
                                            Powered by
              </Text>
                                        <Image
                                            source={require('../../_shared/assets/erinwhite.png')}
                                            resizeMode="contain"
                                            style={{ width: 80, height: 40 }}
                                        />
                                    </View>
                                }
                            </View>
                    }

                    {!theme.enabled && logo && logo.key && this.state.showPoweredByErin ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}>
                            <Text style={{ fontSize: 14, color: '#fff', marginRight: 5 }}>
                                Powered by
              </Text>
                            <Image
                                source={require('../../_shared/assets/erinwhite.png')}
                                resizeMode="contain"
                                style={{ width: 80, height: 40 }}
                            />
                        </View>
                    ) : (
                        // <View style={{ marginBottom: 10 }} />
                        //aus code
                        <View style={{ marginBottom: 10 }} />
                    )}
                    {/* {this.state.showPoweredByErin ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 10,
                            }}>
                            <Text style={{ fontSize: 11, color: '#fff', marginRight: 5 }}>
                                Powered by
              </Text>
                            <Image
                                source={getWhiteLogo()}
                                resizeMode="contain"
                                style={{ width: 80, height: 40 }}
                            />
                            {/* <Text style={{ fontSize: 11, color: '#fff', marginRight: 5 }}>Erin</Text> */}
                    {/* </View>
                    ) : (
                        // <View style={{ marginBottom: 10 }} />
                        //aus code
                        <View style={{ marginBottom: 10 }} />
                    )} */}
                    {/* -----------------------aus code disable admin features--------------------------- */}

                    {(getAppName() == 'erin' || getAppName() == 'heartland') &&
                        accountType !== 'free' &&
                        (role == 'admin' || role == 'manager') ? (
                        <View style={{ marginBottom: 15 }}>
                            <Text
                                style={[
                                    styles.list,
                                    {
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        fontSize: width > 450 ? 16 : 18,
                                    },
                                ]}>
                                {customTranslate('ml_Admin')}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.manageJobs()}>
                                <Image
                                    source={require('../../_shared/assets/id.png')}
                                    style={{
                                        height: width > 450 ? 20 : 22,
                                        width: width > 450 ? 20 : 22,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0 }]}>
                                    {customTranslate('ml_ManageJobs')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.manageReferrals()}>
                                <Image
                                    source={require('../../_shared/assets/icongroup.png')}
                                    style={{
                                        height: width > 450 ? 20 : 22,
                                        width: width > 450 ? 20 : 22,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0 }]}>
                                    {customTranslate('ml_AllReferrals')}
                                </Text>
                            </TouchableOpacity>
                            { this.props.currentUser?.company?.allowInternalMobility &&
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 30,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => Actions.MobilityStack()}>
                                    <Image
                                        source={require('../../_shared/assets/plant.png')}
                                        style={{
                                            height: width > 450 ? 20 : 22,
                                            width: width > 450 ? 20 : 22,
                                            marginRight: 7,
                                            marginTop: 2,
                                            tintColor: '#fff',
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.list, { marginLeft: 0 }]}>
                                        {customTranslate('ml_Internal_Mobility')}
                                    </Text>
                                </TouchableOpacity>}
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.manageOnDeck()}>
                                <Image
                                    source={require('../../_shared/assets/add-user.png')}
                                    style={{
                                        height: width > 450 ? 18 : 20,
                                        width: width > 450 ? 18 : 20,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0 }]}>
                                    {customTranslate('ml_GeneralReferrals')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.bonusStack()}>
                                <Image
                                    source={require('../../_shared/assets/money-bag.png')}
                                    style={{
                                        height: width > 450 ? 18 : 20,
                                        width: width > 450 ? 18 : 20,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0 }]}>
                                    {customTranslate('ml_AllBonuses')}
                                </Text>
                            </TouchableOpacity>
                            {role === 'admin' && (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 30,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => Actions.bonusBuilderStack()}>
                                    <Image
                                        source={require('../../_shared/assets/construction.png')}
                                        style={{
                                            height: width > 450 ? 18 : 20,
                                            width: width > 450 ? 18 : 20,
                                            marginRight: 7,
                                            marginTop: 2,
                                            tintColor: '#fff',
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.list, { marginLeft: 0 }]}>
                                        {customTranslate('ml_BonusBuilder')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {role === 'admin' && (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 30,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => Actions.messageCenterStack()}>
                                    <Image
                                        source={require('../../_shared/assets/mail.png')}
                                        style={{
                                            height: width > 450 ? 18 : 20,
                                            width: width > 450 ? 18 : 20,
                                            marginRight: 7,
                                            marginTop: 2,
                                            tintColor: '#fff',
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.list, { marginLeft: 0 }]}>
                                        {customTranslate('ml_MessageCenter')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {role === 'admin' && (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        marginLeft: 30,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => Actions.manageEmployees()}>
                                    <Image
                                        source={require('../../_shared/assets/users.png')}
                                        style={{
                                            height: width > 450 ? 17 : 19,
                                            width: width > 450 ? 17 : 19,
                                            marginRight: 7,
                                            marginTop: 2,
                                            tintColor: '#fff',
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.list, { marginLeft: 0, flex: 1 }]}>
                                        {customTranslate('ml_Employees')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : null}
                    {accountType == 'free' && (
                        <View style={{ marginBottom: 15 }}>
                            <Text
                                style={[
                                    styles.list,
                                    {
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        fontSize: width > 450 ? 16 : 18,
                                    },
                                ]}>
                                {customTranslate('ml_Admin')}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.manageEmployees()}>
                                <Image
                                    source={require('../../_shared/assets/users.png')}
                                    style={{
                                        height: width > 450 ? 17 : 19,
                                        width: width > 450 ? 17 : 19,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0, flex: 1 }]}>
                                    {customTranslate('ml_Employees')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => Actions.bonusBuilderStack()}>
                                <Image
                                    source={require('../../_shared/assets/construction.png')}
                                    style={{
                                        height: width > 450 ? 18 : 20,
                                        width: width > 450 ? 18 : 20,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: '#fff',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.list, { marginLeft: 0 }]}>
                                    {customTranslate('ml_BonusBuilder')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 30,
                                    alignItems: 'center',
                                }}
                                onPress={() => this.setState({ proVisible: true })}>
                                <Image
                                    source={require('../../_shared/assets/mail.png')}
                                    style={{
                                        height: width > 450 ? 18 : 20,
                                        width: width > 450 ? 18 : 20,
                                        marginRight: 7,
                                        marginTop: 2,
                                        tintColor: 'rgb(114, 125, 145)',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={[
                                        styles.list,
                                        { marginLeft: 0, color: 'rgb(114, 125, 145)' },
                                    ]}>
                                    {customTranslate('ml_MessageCenter')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View>
                        <Text
                            style={[
                                styles.list,
                                {
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    fontSize: width > 450 ? 16 : 18,
                                },
                            ]}>
                            {customTranslate('ml_MyAccount')}
                        </Text>
                        <TouchableOpacity onPress={() => Actions.AnnouncementStack()}>
                            <Text style={styles.list}>{customTranslate('ml_Announcements')}</Text>
                        </TouchableOpacity>
                        {/* {(role == 'extendedUser' || enableCareerProfile) && (
                            <TouchableOpacity onPress={() => Actions.careerProfileStack()}>
                                <Text style={styles.list}>Career Profile</Text>
                            </TouchableOpacity>
                        )} */}
                        {this.props.currentUser?.company?.allowInternalMobility && (
                            <TouchableOpacity onPress={() => this.setState({ showMobilityOptions: !this.state.showMobilityOptions })}>
                                <Text style={styles.list}>{customTranslate('ml_Internal_Mobility')}</Text>
                            </TouchableOpacity>
                        )}
                        {
                            this.state.showMobilityOptions && (
                                <View>
                                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => Actions.MobilityStack()}>
                                        <Text style={styles.list}>{customTranslate('ml_Internal_Mobility')}</Text>
                                    </TouchableOpacity>
                                    {   (role == 'admin') && (
                                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => Actions.MobilityOpenRoles()}>
                                            <Text style={styles.list}>{customTranslate('ml_open_to_new_roles')}</Text>
                                        </TouchableOpacity>
                                    )
                                    }
                                    {(this.props.currentUser?.company?.enableCareerProfile) && (
                                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => Actions.careerProfileStack()}>
                                            <Text style={styles.list}>Career Profile</Text>
                                        </TouchableOpacity>
                                    )}

                                </View>
                            )
                        }

                        {/* Actions.MobilityStack() */}
                        {(getAppName() == 'erin' || 'talentreef') && pointsSettings?.isStoreEnabled == true ? (
                            <TouchableOpacity onPress={() => Actions.giftStoreStack()}>
                                <Text style={styles.list}>Store</Text>
                            </TouchableOpacity>
                        ) : null}
                        {(enableCustomPage && getAppName() == 'allied') ? (
                            <TouchableOpacity onPress={() => Actions.customPageStack()}>
                                <Text style={styles.list}>{customPageTitle}</Text>
                            </TouchableOpacity>
                        ) : null}
                        <TouchableOpacity onPress={() => Actions.profile()}>
                            <Text style={styles.list}>{customTranslate('ml_MyProfile')}</Text>
                        </TouchableOpacity>
                        {this.props.currentUser?.company?.enableExtendedNetwork &&
                            <TouchableOpacity onPress={() => Actions.contactsStack()}>
                                <Text style={styles.list}>
                                    {customTranslate('ml_referral_network')}
                                </Text>
                            </TouchableOpacity>
                        }
                        {(enableCustomPage && getAppName() != 'allied') ? (
                            <TouchableOpacity onPress={() => Actions.customPageStack()}>
                                <Text style={styles.list}>{customPageTitle}</Text>
                            </TouchableOpacity>
                        ) : null}
                        {/* {enableExtendedNetwork && (
                            <InviteModal currentUser={this.props.currentUser} width={width} />
                        )} */}

                        {/* <TouchableOpacity onPress={() => Actions.contacts()}>
            <Text style={styles.list}>Contacts</Text>
          </TouchableOpacity> */}
                        {accountType === 'free' && (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({ proVisible: true });
                                }}>
                                <Text style={styles.list}>{'Upgrade to pro'}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://erinapp.com/support')}>
                            <Text style={styles.list}>{customTranslate('ml_Support')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://erinapp.com/privacy-policy/')}>
                            <Text style={styles.list}>{customTranslate('ml_MyProfile_Privacy')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() => this.setState({ visible: true })}>
                            <Text style={[styles.list]}>
                                {this.languageResolver(i18n.currentLocale().toLowerCase())}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                AsyncStorage.clear();
                                this.props.client.cache.reset();
                                await Auth.signOut();
                                this.props.signOut();
                            }}>
                            <Text style={styles.list}>{customTranslate('ml_SignOut')}</Text>
                        </TouchableOpacity>
                        <SelectLanguage
                            visible={this.state.visible}
                            close={this.closeLanguageModal}
                        />
                        <Pro visible={this.state.proVisible} close={this.closeProModal} />
                    </View>
                </ScrollView>
                {/* <View style={styles.footerContainer}>
        <Text style={styles.navfooter}>Get the full experience online:</Text>
        <Text style={styles.navlink} onPress={() => Linking.openURL('http://app.erinapp.com')}>
          app.erinapp.com
        </Text>
      </View> */}
            </SafeAreaView>
        );
    }
}
export default withApollo(Aside);
