import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Modal,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { withApollo } from 'react-apollo';
import Icons from 'react-native-vector-icons/Ionicons';
import { List, Button, TextareaItem } from '@ant-design/react-native';
import { styles } from '../../../_shared/components/refer-someone/referral-modal.styles';
import Icon from '../../../_shared/components/icon/index';
import moment from 'moment';
import { COLORS } from '../../../_shared/styles/colors';
import gql from 'graphql-tag';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { updateContactQuery } from './refer-contact.graphql';

export class OnDeck extends Component {
    state = {
        modalVisible: false,
    };
    handleSubmit = () => {
        // Toast.show('updating...', Toast.LONG, Toast.TOP, {
        //   backgroundColor: COLORS.darkGray,
        //   height: 50,
        //   width: 250,
        //   borderRadius: 10,
        // });
        showMessage({
            message: "updating...",
            type: "info",
        });
        this.props.client
            .mutate({
                mutation: updateContactQuery,
                variables: {
                    input: {
                        id: this.props.contact.id,
                        onDeckStatus: 'onDeck',
                        onDeckDate: moment(),
                    },
                },
            })
            .then((res) => {
                this.setState({ modalVisible: false }, () => {
                    setTimeout(() => {
                        // Toast.show('Added to On Deck', Toast.LONG, Toast.TOP, {
                        //   backgroundColor: COLORS.dashboardGreen,
                        //   height: 50,
                        //   width: 250,
                        //   borderRadius: 10,
                        // });
                        showMessage({
                            message: "Added to On Deck",
                            type: "success",
                        });
                    }, 300);
                });
            })
            .catch((err) => {
                this.setState({ modalVisible: false }, () => {
                    setTimeout(() => {
                        // Toast.show('Something went wrong', Toast.LONG, Toast.TOP, {
                        //   backgroundColor: COLORS.darkGray,
                        //   height: 50,
                        //   width: 250,
                        //   borderRadius: 10,
                        // });
                        showMessage({
                            message: "Something went wrong",
                            type: "danger",
                        });
                    }, 300);
                });
            });
    };
    render() {
        if (this.props.contact.onDeckStatus == 'onDeck') {
            return null;
        }
        return (
            <React.Fragment>
                <TouchableOpacity
                    style={{
                        // backgroundColor: '#ef3c3f',
                        width: '100%',
                        borderRadius: 5,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 0.5,
                        borderColor: COLORS.buttonGrayOutline,
                        paddingVertical: 5,
                    }}
                    onPress={() => this.setState({ modalVisible: true })}>
                    <Text
                        style={{
                            color: COLORS.buttonGrayText,
                            fontSize: 12,
                            textAlign: 'center',
                        }}>
                        {customTranslate('ml_AddGeneralReferral')}
                    </Text>
                </TouchableOpacity>
                <Modal visible={this.state.modalVisible} transparent>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)' }}>
                        <ScrollView style={{ flex: 1 }}>
                            <View
                                style={[
                                    {
                                        flex: 1,
                                        height: '96%',
                                        width: '94%',
                                        marginHorizontal: '3%',
                                        backgroundColor: '#fff',
                                        paddingBottom: 24,
                                    },
                                    {
                                        backgroundColor: 'white',
                                        borderRadius: 30,
                                        marginTop: 20,
                                    },
                                ]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View
                                        style={{ flex: 6, justifyContent: 'center', paddingTop: 20 }}>
                                        <Text
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                color: '#ef3c3f',
                                                fontSize: 28,
                                                marginBottom: 0,
                                                fontWeight: '600',
                                            }}>
                                            {customTranslate('ml_AddGeneralReferral')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ modalVisible: false });
                                        }}
                                        style={[
                                            {
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            },
                                        ]}>
                                        {/* close button */}
                                        {/* change to without circle  */}

                                        <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
                                    </TouchableOpacity>
                                </View>
                                <Text
                                    style={[
                                        {
                                            fontSize: 14,
                                            fontWeight: '300',
                                            width: '100%',
                                            textAlign: 'center',
                                            marginVertical: 15,
                                        },
                                        { paddingHorizontal: 35 },
                                    ]}>
                                    Would{' '}
                                    {this.props.contact.firstName +
                                        ' ' +
                                        this.props.contact.lastName}{' '}
                                    thrive at {this.props.company.name}? Add them to On Deck and
                                    have them available for upcoming opportunities.
                                </Text>
                                <View
                                    style={{
                                        justifyContent: 'space-around',
                                        flexDirection: 'row',
                                        backgroundColor: 'rgb(189, 249, 189)',
                                        width: '90%',
                                        alignSelf: 'center',
                                        borderRadius: 5,
                                        paddingVertical: 20,
                                        marginBottom: 10,
                                    }}>
                                    <View>
                                        <Text style={{ marginBottom: 5 }}>
                                            {customTranslate('ml_Candidate')}:
                                        </Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                            {this.props.contact.firstName +
                                                ' ' +
                                                this.props.contact.lastName}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={{ marginBottom: 5 }}>
                                            {customTranslate('ml_ReferredBy')}:
                                        </Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                            {this.props.contact.user.firstName +
                                                ' ' +
                                                this.props.contact.user.lastName}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.SubmitBtnContainer}>
                                    <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
                                        <Text style={styles.SubmitBtnText}>
                                            {customTranslate('ml_SubmitReferral')}{' '}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </Button>
                                    {/* <Button style={styles.SubmitBtn}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
            </React.Fragment>
        );
    }
}

export default withApollo(OnDeck);
