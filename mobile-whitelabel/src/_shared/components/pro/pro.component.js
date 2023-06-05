import React, { Component } from 'react';
import {
    Modal,
    SafeAreaView,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
    Linking,
} from 'react-native';
import { COLORS } from '../../styles/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import {
    setLanguage,
    languageCodeResolver,
} from '../../../_shared/services/language-manager';
import { getErinLogo } from '../../../WhiteLabelConfig';
const { width, height } = Dimensions.get('window');

export class Pro extends Component {
    render() {
        return (
            <React.Fragment>
                <Modal visible={this.props.visible} transparent>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>

                                <View
                                    style={{
                                        flex: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginTop: 15,
                                            marginBottom: 10,
                                        }}>
                                        Upgrade To
                  </Text>
                                    <Image
                                        style={{
                                            height: 40,
                                            width: 70,
                                            marginLeft: 5,
                                            marginTop: 3,
                                        }}
                                        resizeMode="contain"
                                        source={getErinLogo()}
                                    />
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: COLORS.darkGray,
                                            marginTop: 15,
                                            marginBottom: 10,
                                            marginLeft: 3,
                                        }}>
                                        PRO
                  </Text>
                                </View>

                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        let locale = languageCodeResolver(i18n.currentLocale());
                                        console.log("LOCALE FROM PRO", locale)
                                        setLanguage(locale);
                                        this.props.close();
                                    }}>
                                    <IonIcon
                                        name="md-close"
                                        color={COLORS.buttonGrayOutline}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 15 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.grayMedium,
                                        fontWeight: '600',
                                    }}>
                                    This feature is only available on ERIN Pro. Upgrade to Erin
                                    Pro and Unlock features that engage employees to make more
                                    referrala and fully automated your employee referral
                                    administration.
                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 15,
                                        marginHorizontal: 10,
                                    }}>
                                    <View
                                        style={{
                                            width: 5,
                                            height: 15,
                                            backgroundColor: COLORS.red,
                                            marginRight: 10,
                                        }}></View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: COLORS.darkGray,
                                            fontWeight: '600',
                                        }}>
                                        Employee can browse jobs, make referrals and track referrals
                                        and bonus
                  </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 15,
                                        marginHorizontal: 10,
                                    }}>
                                    <View
                                        style={{
                                            width: 5,
                                            height: 15,
                                            backgroundColor: COLORS.red,
                                            marginRight: 10,
                                        }}></View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: COLORS.darkGray,
                                            fontWeight: '600',
                                        }}>
                                        Employee can browse jobs, make referrals and track referrals
                                        and bonus
                  </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginTop: 15,
                                        marginHorizontal: 10,
                                    }}>
                                    <View
                                        style={{
                                            width: 5,
                                            height: 15,
                                            backgroundColor: COLORS.red,
                                            marginRight: 10,
                                        }}></View>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: COLORS.darkGray,
                                            fontWeight: '600',
                                        }}>
                                        Employee can browse jobs, make referrals and track referrals
                                        and bonus
                  </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('https://erinapp.com/upgrade')}
                                style={{
                                    padding: 10,
                                    paddingHorizontal: 25,
                                    backgroundColor: COLORS.blue,
                                    alignSelf: 'center',
                                    borderRadius: 10,
                                    marginBottom: 10,
                                }}>
                                <Text style={{ fontWeight: '600', color: 'white' }}>
                                    Learn More
                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </React.Fragment>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        width: width - 30,
        maxWidth: 450,
        maxHeight: 700,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingBottom: 8,
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.blackTransparent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        padding: 8,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowText: { fontSize: 16, fontWeight: '400', color: COLORS.grayMedium },
});

export default Pro;
