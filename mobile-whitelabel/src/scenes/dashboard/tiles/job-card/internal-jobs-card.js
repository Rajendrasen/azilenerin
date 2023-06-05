import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, globalStyle } from '../../../../_shared/styles/colors';
const { width, height } = Dimensions.get('window');
import EvilIcon from 'react-native-vector-icons/SimpleLineIcons';
import { customTranslate } from '../../../../_shared/services/language-manager';


class InternalJobCard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.headerRow}>

                <View
                    style={{

                        alignItems: 'center',
                        marginTop: 5,
                        marginBottom: 10,
                        paddingHorizontal: 10,

                    }}>

                    <View
                        style={{

                            alignSelf: 'center',
                            height: 180,
                            width: Dimensions.get('window').width - 20,

                            backgroundColor: '#fff',
                            borderRadius: 8,
                            marginTop: 10,
                            paddingHorizontal: 5,
                            paddingVertical: 5
                        }}>
                        <View style={{ height: 50, width: '100%', justifyContent: 'center' }}>
                            <Text numberOfLines={2} style={styles.title}>
                                {this.props?.title}
                            </Text>
                            <View style={styles.row}>
                                <View style={[styles.department, { marginTop: 5 }]}>
                                    <EvilIcon
                                        name="location-pin"
                                        size={15}
                                        color={COLORS.darkGray}
                                    />
                                    <Text style={styles.deptext} numberOfLines={3}>
                                        {this.props?.location}
                                        {/* {!location.isRemote && (location.city || location.state)
                                            ? `${location.city || ''}, ${location.state || ''}`
                                            : customTranslate('ml_Remote')} */}
                                    </Text>
                                </View>
                                <View style={styles.department}>
                                    <EvilIcon
                                        name="folder"
                                        color={COLORS.darkGray}
                                        size={15}
                                        style={styles.folder}
                                    />
                                    <Text style={styles.deptext}>
                                        {this.props?.department}
                                    </Text>
                                </View>

                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 10,
                                marginTop: 10
                            }}>
                            <Image
                                source={require('../../../../_shared/assets/building.png')}
                                style={{ tintColor: COLORS.lightGray, height: 20, width: 20 }}
                            />
                            <Text style={{ color: COLORS.lightGray, fontSize: 12 }}>
                                {this.props?.sub_company_name}
                            </Text>

                        </View>

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




                        {/* <TouchableOpacity style={{ marginTop: 20, alignSelf: 'center', borderWidth: 1, height: 50, width: '90%', borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => props.onInterestPress(item)}
                        >
                            <Text
                            >

                                {customTranslate('ml_IAmInterested')}
                            </Text>
                        </TouchableOpacity> */}

                    </View>

                </View>
            </View>
        )
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
        alignItems: 'center',

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

export default InternalJobCard;