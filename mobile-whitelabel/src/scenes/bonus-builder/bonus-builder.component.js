import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
    SafeAreaView,
    TextInput,
    FlatList,
    Dimensions,
    Animated,
    Easing,
    Image,
    Alert,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import { COLORS } from '../../_shared/styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-material-dropdown';
const { width, height } = Dimensions.get('window');
import uuid from 'uuid/v4';
import { getErinSquare, getLightGrayLogo } from '../../WhiteLabelConfig';
import { nf, wpx } from '../../_shared/constants/responsive';

export class BonusBuilder extends Component {
    state = {
        visible: false,
        bonusName: '',
        bonusId: '',
        tiers: [],
        companyId: '',
        spinAnim: new Animated.Value(0),
    };
    componentDidMount = () => {
        this.spin();
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
    renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.row}
                onPress={() => this.handleBonusPress(item)}
                key={item.id}>
                <Text
                    multiline={true}
                    style={{ fontWeight: 'bold', color: COLORS.grayMedium, fontSize: nf(16), width: wpx(250) }}>
                    {item.name}
                </Text>
                <TouchableOpacity
                    onPress={() => this.handleDelete(item)}
                    style={styles.button}>
                    <Text style={{ color: 'white' }}>{customTranslate('ml_DeleteBonus')}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };
    handleNewBonus = () => {
        let userGroup = this.props.usersGroups.filter(
            (group) => group.name.toLowerCase() === 'default',
        );
        let userGroups = this.props.usersGroups;
        let tempData = {};
        for (let i = 0; i < userGroups.length; i++) {
            if (userGroups[i].name.toLowerCase() == 'default') {
                tempData[userGroups[i].id] = [
                    {
                        amount: '',
                        recipientType: 'employee',
                        payOutDays: '',
                        userGroup: userGroups[i].id,
                    },
                ];
                continue;
            }
            tempData[userGroups[i].id] = [];
        }
        this.setState({
            bonusId: uuid(),
            tempBonusName: '',
            bonusName: '',
            companyId: this.props.currentUser.companyId,
            ...tempData,
            visible: true,
        });
    };
    handleBonusPress = (item) => {
        let tiers = item.tiers.map((item) => JSON.parse(item));
        let userGroups = this.props.usersGroups;
        let tempData = {};
        for (let i = 0; i < userGroups.length; i++) {
            tempData[userGroups[i].id] = tiers.filter(
                (t) => t.userGroup == userGroups[i].id,
            );
        }
        this.setState(
            {
                bonusName: item.name,
                tempBonusName: item.name,
                bonusId: item.id,
                tiers: tiers,
                companyId: item.companyId,
                ...tempData,
            },
            () => this.setState({ visible: true }),
        );
    };
    handleValueChange = (val, field, userGroup, index) => {
        let tempTiers = [...this.state[userGroup.id]];
        tempTiers[index][field] = val;
        this.setState({ [userGroup.id]: tempTiers });
    };
    handleSubmit = () => {
        let { companyId, tempBonusName, bonusId } = this.state;
        let tiers = [];
        for (let i = 0; i < this.props.usersGroups.length; i++) {
            tiers = [...tiers, ...this.state[this.props.usersGroups[i].id]];
        }
        let newTieres = [];
        for (let i = 0; i < tiers.length; i++) {
            let tier = tiers[i];
            if (!tier.amount) {
                alert(customTranslate('ml_PleaseEnterAmount'));
                return;
            }
            if (!tier.payOutDays) {
                alert(customTranslate('ml_PleaseEnterPayOutDays'));
                return;
            }
            newTieres.push(JSON.stringify(tier));
        }
        let input = {
            companyId,
            name: tempBonusName,
            id: bonusId,
            tiers: newTieres,
        };
        this.props.onUpdateTieredBonus(input);
        this.setState({ visible: false });
    };
    handleDelete = (item) => {
        Alert.alert(
            'Are you sure ?',
            `${customTranslate('ml_Delete')} ${item.name} ?`,
            [
                {
                    text: customTranslate('ml_Cancel'),
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        item.archived = true;
                        let input = {
                            archived: true,
                            name: item.name,
                            companyId: item.companyId,
                            id: item.id,
                            tiers: item.tiers,
                        };
                        this.props.onUpdateTieredBonus(input);
                    },
                },
            ],
            { cancelable: false },
        );
    };
    render() {
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        let { bonuses, bonusLoading, usersGroups, userGroupsLoading } = this.props;
        let { bonusName, tiers, tempBonusName } = this.state;
        let {
            company: { theme, symbol },
        } = this.props.currentUser;
        theme = theme ? JSON.parse(theme) : {};
        return (
            <View style={{ flex: 1 }}>
                {bonusLoading || userGroupsLoading ? (
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Animated.Image
                            style={{ height: 60, width: 60, transform: [{ rotate: spin }] }}
                            source={
                                theme.enabled && symbol && symbol.key
                                    ? {
                                        uri:
                                            'https://s3.us-east-2.amazonaws.com/erin-avatars/' +
                                            symbol.key,
                                    }
                                    : getErinSquare()
                            }
                        />
                    </View>
                ) : (
                    <React.Fragment>
                        {width > 450 ? (
                            <TouchableOpacity
                                onPress={this.handleNewBonus}
                                style={[
                                    // styles1.addContact,
                                    {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 10,
                                        backgroundColor:
                                            width <= 450
                                                ? theme.enabled
                                                    ? theme.addButtonColor
                                                    : COLORS.red
                                                : 'transparent',
                                    },
                                ]}>
                                <AntIcon
                                    style={{ marginRight: 5, marginTop: 3 }}
                                    size={35}
                                    color={COLORS.red}
                                    name="pluscircle"
                                />
                                <Text
                                    style={{
                                        color: COLORS.darkGray,
                                        fontSize: 18,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                    }}>
                                    {customTranslate('ml_AddBonus')}{' '}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{
                                    height: 42,
                                    backgroundColor: theme.enabled
                                        ? theme.addButtonColor
                                        : COLORS.red,
                                    width: '99.5%',
                                    borderRadius: 3,
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={this.handleNewBonus}>
                                <Text style={{ color: 'white', fontSize: 18 }}>
                                    {customTranslate('ml_AddBonus')}
                                </Text>
                                <Icons
                                    name="ios-add-circle-outline"
                                    color="#fff"
                                    size={22}
                                    style={{ marginLeft: 5 }}
                                />
                            </TouchableOpacity>
                        )}

                        {bonuses && bonuses.length > 0 ? (
                            <React.Fragment>
                                <FlatList
                                    data={bonuses}
                                    renderItem={this.renderItem}
                                    keyExtractor={(item) => item.id}
                                />
                            </React.Fragment>
                        ) : (
                            <View>
                                <View
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        alignItems: 'center',
                                        padding: 20,
                                        paddingTop: Dimensions.get('window').height / 8,
                                    }}>
                                    <Image
                                        source={getLightGrayLogo()}
                                        style={{
                                            height: Dimensions.get('window').width / 2,
                                            width: Dimensions.get('window').width / 2,
                                            marginBottom: 30,
                                        }}
                                    />
                                    {this.props.children}
                                    <Text
                                        style={{
                                            color: '#999999',
                                            textAlign: 'center',
                                            marginHorizontal: 20,
                                            marginTop: 10,
                                        }}>
                                        {customTranslate('ml_UnableToGetBonuses')}
                                    </Text>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.red,
                                            borderRadius: 5,
                                            paddingVertical: 10,
                                            marginTop: 10,
                                            width: 100,
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                        }}
                                        onPress={() => {
                                            this.props.refetch();
                                        }}>
                                        <Text style={{ color: '#fff' }}>{customTranslate('ml_Refresh')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <Modal visible={this.state.visible}>
                            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                        }}>
                                        <TouchableOpacity
                                            style={{
                                                padding: 3,
                                                borderWidth: 1,
                                                borderColor: '#018dd3',
                                                borderRadius: 5,
                                            }}
                                            onPress={() => this.handleSubmit()}>
                                            <Text style={{ color: '#018dd3' }}>
                                                {customTranslate('ml_Save')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 5, justifyContent: 'center' }}>
                                        <Text
                                            style={{
                                                fontWeight: '600',
                                                fontSize: 23,
                                                textAlign: 'center',
                                            }}>
                                            {bonusName}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ visible: false })}
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
                                    </TouchableOpacity>
                                </View>
                                <KeyboardAwareScrollView style={{ paddingHorizontal: 10 }}>
                                    <View>
                                        <Text style={styles.inputTitle}>
                                            <Text style={{ color: COLORS.red }}>* </Text>
                                            {customTranslate('ml_BonusName')}
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            value={tempBonusName}
                                            onChangeText={(val) =>
                                                this.setState({ tempBonusName: val })
                                            }
                                        />
                                    </View>
                                    <Text
                                        style={{ fontWeight: '600', fontSize: 20, marginTop: 15 }}>
                                        {customTranslate('ml_BonusPayments')}
                                    </Text>
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontWeight: '500', fontSize: 16, marginRight: 10 }}>
                      Choose an Employee Group:
                    </Text>
                    <View
                      style={[
                        styles.input,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 10,
                          height: 30,
                        },
                      ]}
                    >
                      <Text style={{ color: COLORS.buttonGrayText, marginRight: 10 }}>Default</Text>
                      <Icons name="ios-arrow-down" color={COLORS.buttonGrayText} size={15} />
                    </View>
                  </View> */}
                                    {usersGroups.map((userGroup) => (
                                        <View style={{ marginTop: 10 }} key={userGroup.id}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontWeight: '500',
                                                        fontSize: 16,
                                                        marginRight: 10,
                                                    }}>
                                                    {userGroup.name} {customTranslate('ml_Group')}:
                        </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 3,
                                                        borderWidth: 1,
                                                        borderColor: '#018dd3',
                                                        borderRadius: 5,
                                                    }}
                                                    onPress={() => {
                                                        let tier = {
                                                            amount: '',
                                                            recipientType: 'employee',
                                                            payOutDays: '',
                                                            userGroup: userGroup.id,
                                                        };
                                                        let tempTiers = [...this.state[userGroup.id]];
                                                        tempTiers.unshift(tier);
                                                        this.setState({ [userGroup.id]: tempTiers });
                                                    }}>
                                                    <Text style={{ color: '#018dd3' }}>
                                                        {customTranslate('ml_AddBonus')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {this.state[userGroup.id] &&
                                                this.state[userGroup.id].map((item, index) => (
                                                    <View
                                                        style={{
                                                            backgroundColor: '#f0f0f0',
                                                            marginTop: 10,
                                                            padding: 10,
                                                            borderRadius: 10,
                                                            paddingVertical: 15,
                                                        }}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                flexWrap: 'wrap',
                                                            }}>
                                                            <Text style={{ fontSize: 17, marginRight: 5 }}>
                                                                $
                              </Text>
                                                            <TextInput
                                                                style={[styles.input, { width: 70 }]}
                                                                keyboardType="number-pad"
                                                                value={item.amount.toString()}
                                                                onChangeText={(val) => {
                                                                    this.handleValueChange(
                                                                        val,
                                                                        'amount',
                                                                        userGroup,
                                                                        index,
                                                                    );
                                                                }}
                                                            />

                                                            <Text
                                                                style={{
                                                                    fontSize: 17,
                                                                    marginHorizontal: 10,
                                                                    textTransform: 'lowercase',
                                                                }}>
                                                                {customTranslate('ml_After')}
                                                            </Text>
                                                            <TextInput
                                                                style={[
                                                                    styles.input,
                                                                    {
                                                                        width: 50,
                                                                        marginRight: 10,
                                                                        marginBottom: 10,
                                                                    },
                                                                ]}
                                                                keyboardType="number-pad"
                                                                value={item.payOutDays.toString()}
                                                                onChangeText={(val) => {
                                                                    this.handleValueChange(
                                                                        val,
                                                                        'payOutDays',
                                                                        userGroup,
                                                                        index,
                                                                    );
                                                                }}
                                                            />
                                                            <Text style={{ fontSize: 17 }}>
                                                                {customTranslate('ml_Days')}{' '}
                                                            </Text>

                                                            <Dropdown
                                                                label="Favorite Fruit"
                                                                data={[
                                                                    {
                                                                        value: 'Employee',
                                                                    },
                                                                    {
                                                                        value: 'Candidate',
                                                                    },
                                                                ]}
                                                                onChangeText={(val) => {
                                                                    this.handleValueChange(
                                                                        val,
                                                                        'recipientType',
                                                                        userGroup,
                                                                        index,
                                                                    );
                                                                }}
                                                                renderBase={() => (
                                                                    <View
                                                                        style={[
                                                                            styles.input,
                                                                            {
                                                                                flexDirection: 'row',
                                                                                alignItems: 'center',
                                                                                paddingHorizontal: 10,
                                                                                flex: 1,
                                                                                justifyContent: 'space-between',
                                                                            },
                                                                        ]}>
                                                                        <Text
                                                                            style={{
                                                                                color: COLORS.buttonGrayText,
                                                                                marginRight: 10,
                                                                                textTransform: 'capitalize',
                                                                            }}>
                                                                            {item.recipientType}
                                                                        </Text>
                                                                        <Icons
                                                                            name="ios-arrow-down"
                                                                            color={COLORS.buttonGrayText}
                                                                            size={15}
                                                                        />
                                                                    </View>
                                                                )}
                                                            />
                                                        </View>

                                                        <TouchableOpacity
                                                            style={{
                                                                paddingVertical: 10,
                                                                borderRadius: 5,
                                                                borderWidth: 0.5,
                                                                borderColor: 'red',
                                                                alignItems: 'center',
                                                                marginTop: 10,
                                                                backgroundColor: COLORS.red,
                                                            }}
                                                            onPress={() => {
                                                                let tempTiers = [...this.state[userGroup.id]];
                                                                if (
                                                                    userGroup.name.toLowerCase() == 'default' &&
                                                                    tempTiers.length == 1
                                                                ) {
                                                                    return;
                                                                }
                                                                tempTiers.splice(index, 1);
                                                                this.setState({ [userGroup.id]: tempTiers });
                                                            }}>
                                                            <Text style={{ color: 'white' }}>
                                                                {customTranslate('ml_DeletePayment')}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                        </View>
                                    ))}
                                </KeyboardAwareScrollView>
                            </SafeAreaView>
                        </Modal>
                    </React.Fragment>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        height: 50,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.lightGray3,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: COLORS.red,
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    inputTitle: { marginBottom: 5, fontSize: 15, fontWeight: '600' },
    input: {
        borderRadius: 5,
        borderWidth: 0.5,
        height: 40,
        padding: 4,
        borderColor: COLORS.buttonGrayOutline,
    },
});

export default BonusBuilder;
