import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Icon } from '@ant-design/react-native';
import { COLORS } from '../../styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager'
let { width } = Dimensions.get('window');
export default class StepItem extends Component {
    setStatusColor(stepIndex, index) {
        if (index <= stepIndex) {
            if (stepIndex <= 1) {
                return COLORS.dashboardLightOrange;
            } else if (stepIndex < 3) {
                return COLORS.dashboardLightOrange;
            } else if (stepIndex === 3) {
                return this.getLastStepColor();
            }
        }
        return COLORS.lightGray;
    }
    getLastStepColor = () => {
        switch (this.props.status.status) {
            case customTranslate('ml_Hired'):
                return COLORS.dashboardGreen;
            case customTranslate('ml_Transferred'):
                return COLORS.lightGray
            default:
                return COLORS.red;
        }
    };
    handleStepPress = () => {
        let status = '';
        switch (this.props.item.title) {
            case customTranslate('ml_Referred'):
                status = 'referred';
                break;
            case customTranslate('ml_Accepted'):
                status = 'accepted';
                break;
            case customTranslate('ml_Interviewing'):
                status = 'interviewing';
                break;
            case customTranslate('ml_Hired'):
                status = 'hired';
                break;
            case customTranslate('ml_NotHired'):
                status = 'notHired';
                break;
            default:
                break;
        }
        this.props.updateStatus(status);
    };
    render() {
        const {
            item,
            index,
            totalSteps,
            status,
            disableManagerPermissions,
        } = this.props;
        const stepColor = status
            ? this.setStatusColor(status.stepIndex, index)
            : COLORS.red;
        const nextStepColor =
            status && index < totalSteps
                ? this.setStatusColor(status.stepIndex, index + 1)
                : COLORS.red;
        const stepBorder =
            status && stepColor !== COLORS.lightGray
                ? { borderColor: stepColor, borderWidth: 2 }
                : !status
                    ? { borderColor: COLORS.red, borderWidth: 2 }
                    : {};

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.lineContainer}>
                        <View
                            style={[
                                styles.line,
                                { backgroundColor: index !== 0 ? stepColor : COLORS.transparent },
                            ]}
                        />
                    </View>
                    {this.props.noJob && !disableManagerPermissions ? (
                        <TouchableOpacity
                            style={[styles.iconContainer, stepBorder]}
                        // onPress={this.handleStepPress}
                        >
                            {status && index <= status.stepIndex ? (
                                <Icon type="check" color={stepColor} size={12} />
                            ) : null}
                        </TouchableOpacity>
                    ) : (
                        <View
                            style={[styles.iconContainer, stepBorder]}
                        // onPress={this.handleStepPress}
                        >
                            {status && index <= status.stepIndex ? (
                                <Icon type="check" color={stepColor} size={12} />
                            ) : null}
                        </View>
                    )}

                    <View style={styles.lineContainer}>
                        <View
                            style={[
                                styles.line,
                                {
                                    backgroundColor:
                                        index !== totalSteps ? nextStepColor : COLORS.transparent,
                                },
                            ]}
                        />
                    </View>
                </View>
                <Text style={[styles.title, { fontSize: width > 450 ? 8 : 10 }]}>
                    {item.title == customTranslate('ml_Interviewing') &&
                        this.props.referralStatusLabel
                        ? this.props.referralStatusLabel
                        : item.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    topContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    lineContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    line: {
        height: 2,
        width: '100%',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLORS.lightGray,
        height: 20,
        width: 20,
    },
    title: {
        fontSize: 10,
        marginTop: 5,
        flex: 1,
        textAlign: 'center',
    },
});
