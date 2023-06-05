import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { borderedTile } from '../../../../_shared/components/bordered-tile/bordered-tile.component';
import styles from './top-departments.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
import { COLORS } from '../../../../_shared/styles/colors';
import { translateString } from '../../../../_shared/services/language-manager';
import AsyncStorage from '@react-native-community/async-storage';


class BaseTopDepartments extends React.PureComponent {
    state = {
        topDepartments: this.props.topDepartments,
    };
    componentDidMount() {
        this.translateDepts();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.topDepartments != this.props.topDepartments) {
            this.setState(
                { topDepartments: this.props.topDepartments },
                this.translateDepts,
            );
        }
    }
    translateDepts = async () => {
        let depts = this.state.topDepartments;
        let names = depts.map((el) => el.name);
        let language_code = ''

        await AsyncStorage.getItem('appLocale').then((code) => {
            language_code = code
        })
        if (language_code != 'us' && language_code != 'en' && language_code != null) {
            let translatedNames = await translateString(names);
            translatedNames = translatedNames.map((el) => el.translatedText);

            this.setState({
                topDepartments: this.state.topDepartments.map((el, i) => {
                    el.name = translatedNames[i];
                    return el;
                }),
            });
        }


    };
    render() {
        const { title, jobs, jobMatches } = this.props;
        let goodMatches = [];
        if (typeof jobMatches !== 'undefined' && jobMatches !== null) {
            goodMatches = jobMatches.filter(
                (jobMatch) =>
                    jobMatch.relevance >= 10 && jobMatch.matchStatus !== false,
            );
        }

        return (
            <View>
                <Text style={styles.title}>{title}</Text>
                {this.state.topDepartments && this.state.topDepartments.length ? (
                    <View style={{ paddingHorizontal: 10 }}>
                        {this.state.topDepartments.map((el, i) => (
                            <View
                                key={i}
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text
                                    onPress={() => Actions.profile()}
                                    style={{
                                        fontWeight: 'bold',
                                        color: COLORS.lightGray,
                                        marginBottom: 5,
                                    }}>
                                    {i + 1}. {el.name}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        color: COLORS.darkGray,
                                        marginBottom: 5,
                                    }}>
                                    {el.totalUsers} {customTranslate('ml_Users')}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View
                        style={{
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: COLORS.grayMedium }}>No data available</Text>
                    </View>
                )}
            </View>
        );
    }
}
export const TopDepartments = borderedTile(BaseTopDepartments);
