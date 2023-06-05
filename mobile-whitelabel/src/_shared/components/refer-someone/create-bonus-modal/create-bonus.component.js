import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Easing,
    Animated,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../styles/colors';
import { styles } from '../referral-modal.styles';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { Dropdown } from 'react-native-material-dropdown';
import { updateTieredBonus } from '../../../../_store/_shared/api/graphql/custom/tiered-bonuses/update-tiered-bonus.graphql';
import uuid from 'uuid/v4';
import { withApollo } from 'react-apollo';
import { showMessage } from 'react-native-flash-message';
import gql from 'graphql-tag';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';

export class CreateBonus extends Component {
    state = {
        modalVisible: false,
        tiers: [{ amount: 0, recipientType: '', payOutDays: '', userGroup: '' }],
        name: '',
        radius: new Animated.Value(3),
        width: new Animated.Value(100),
        showProgress: false,
        progress: 0,
        success: false,
    };
    shrinkAnimation = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: 10,
                duration: 300,
            }),
            Animated.timing(this.state.radius, {
                toValue: 22.5,
                duration: 250,
            }),
        ]).start(this.handleProgress);
    };
    handleProgress = () => {
        this.setState({ showProgress: true, progress: 80 }, () => {
            this.circularProgress.animate(this.state.progress, 1000, Easing.quad);
        });
    };

    afterAnimation = () => {
        if (this.state.progress == 100) {
            this.setState(
                { showProgress: false, progress: 0, success: true },
                this.handleSuccessExpand,
            );
        }
    };

    handleReferralSuccess = () => {
        this.setState({ progress: 100 }, () =>
            this.circularProgress.animate(this.state.progress, 800, Easing.quad),
        );
    };

    handleSuccessExpand = () => {
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: 100,
                duration: 300,
            }),
            Animated.timing(this.state.radius, {
                toValue: 3,
                duration: 250,
            }),
        ]).start(() =>
            setTimeout(() => this.setState({ modalVisible: false }), 1000),
        );
    };

    handleSubmit = () => {
        if (this.validator()) {
            this.shrinkAnimation()
            //showMessage({message: 'Creating Bonus', type: 'info'});
            let tiers = [...this.state.tiers];
            let userGroupId = this.props.userGroups.filter(
                (item) => item.name.toLowerCase() === 'default',
            )[0].id;

            let newTiers = tiers.map((item) => {
                item.userGroup = userGroupId;
                return JSON.stringify(item);
            });

            this.updateBonus(newTiers);
        }
    };

    updateBonus = (tiers) => {
        let input = {
            companyId: this.props.currentUser.company.id,
            id: uuid(),
            name: this.state.name,
            tiers,
        };
        console.log('input', input);
        this.props.client
            .mutate({
                mutation: gql(updateTieredBonus),
                variables: {
                    input,
                },
            })
            .then((res) => {
                console.log('update', res);
                setTimeout(() => {
                    this.props.getBonus();
                    //showMessage({message: 'Bonus Created', type: 'success'});
                    this.handleReferralSuccess();
                }, 1000);
            });
    };

    validator = () => {
        if (!this.state.name) {
            alert('Please enter bonus name');
            return false;
        }
        let tiers = [...this.state.tiers];

        for (let i = 0; i < tiers.length; i++) {
            let t = tiers[0];
            if (!t.amount) {
                alert('Please enter bonus amount');
                return false;
            }
            if (!t.payOutDays) {
                alert('Please enter payout days');
                return false;
            }
            if (!t.recipientType) {
                alert('Please select recipient type');
                return false;
            }
        }

        return true;
    };

    render() {
        let theme = this.props.theme;
        return (
            <View>
                <Text
                    style={{ color: COLORS.blue, fontSize: 17 }}
                    onPress={() => this.setState({ modalVisible: true })}>
                    Create Bonus
        </Text>
                <Modal visible={this.state.modalVisible} transparent>
                    <SafeAreaView
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,.4)',
                        }}>
                        <KeyboardAwareScrollView
                            style={[
                                {
                                    height: '100%',
                                    width: '100%',
                                    backgroundColor: '#fff',
                                },
                                {
                                    backgroundColor: 'transparent',
                                },
                            ]}
                            extraScrollHeight={200}>
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
                                        maxWidth: 450,
                                        alignSelf: 'center',
                                    },
                                ]}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}></View>
                                    <View
                                        style={{
                                            flex: 6,
                                            justifyContent: 'center',
                                            paddingTop: 20,
                                        }}>
                                        <Text
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                color: theme.enabled ? theme.buttonColor : '#ef3c3f',
                                                fontSize: 28,
                                                marginBottom: 0,
                                                fontWeight: '600',
                                            }}>
                                            Create A New Bonus
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

                                        <Icons
                                            name="ios-close"
                                            size={40}
                                            color={COLORS.grayMedium}></Icons>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ padding: 10, paddingBottom: 5 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Bonus Name</Text>
                                    <TextInput
                                        style={Styles.input}
                                        placeholder={'Enter Candidate Name'}
                                        value={this.state.name}
                                        onChangeText={(val) => this.setState({ name: val })}
                                    />
                                    {this.state.tiers.map((t, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                backgroundColor: '#ebf3ff',
                                                padding: 3,
                                                borderRadius: 5,
                                                alignItems: 'center',
                                                marginVertical: 3,
                                            }}>
                                            <View
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', marginRight: 2 }}>
                                                    $
                        </Text>
                                                <TextInput
                                                    style={[Styles.input, { width: 100 }]}
                                                    placeholder={'Enter Bonus Name'}
                                                    value={this.state.name}
                                                    value={this.state.tiers[i].amount}
                                                    onChangeText={(val) => {
                                                        let tiers = [...this.state.tiers];
                                                        tiers[i].amount = val;
                                                        this.setState({ tiers: tiers });
                                                    }}
                                                />
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', marginHorizontal: 2 }}>
                                                    After
                        </Text>
                                                <TextInput
                                                    style={[Styles.input, { width: 100 }]}
                                                    placeholder={'Enter Candidate Name'}
                                                    value={this.state.tiers[i].payOutDays}
                                                    onChangeText={(val) => {
                                                        let tiers = [...this.state.tiers];
                                                        tiers[i].payOutDays = val;
                                                        this.setState({ tiers: tiers });
                                                    }}
                                                />
                                                <Text style={{ fontWeight: 'bold', marginLeft: 2 }}>
                                                    days,{' '}
                                                </Text>
                                            </View>
                                            <View
                                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', marginRight: 2 }}>
                                                    payable to
                        </Text>
                                                {/* <TextInput
                          style={Styles.input}
                          placeholder={'Enter Candidate Name'}
                          value={this.state.name}
                        /> */}
                                                <Dropdown
                                                    label="Favorite Fruit"
                                                    data={[
                                                        {
                                                            value: 'employee',
                                                        },
                                                        {
                                                            value: 'candidate',
                                                        },
                                                    ]}
                                                    renderBase={() => (
                                                        <TouchableOpacity
                                                            style={[Styles.input, { width: 100 }]}
                                                            onPress={this.showMenu}>
                                                            {this.state.tiers[i].recipientType ? (
                                                                <Text style={{ textTransform: 'capitalize' }}>
                                                                    {this.state.tiers[i].recipientType}
                                                                </Text>
                                                            ) : null}
                                                        </TouchableOpacity>
                                                    )}
                                                    onChangeText={(val) => {
                                                        let tiers = [...this.state.tiers];
                                                        tiers[i].recipientType = val;
                                                        this.setState({ tiers: tiers });
                                                    }}
                                                />
                                                {/* <Menu
                          ref={this.setMenuRef}
                          button={
                            <TouchableOpacity
                              style={[Styles.input, {width: 100}]}
                              onPress={this.showMenu}>
                              {this.state.tiers[i].recipientType ? (
                                <Text style={{textTransform: 'capitalize'}}>
                                  {this.state.tiers[i].recipientType}
                                </Text>
                              ) : null}
                            </TouchableOpacity>
                          }>
                          <MenuItem
                            onPress={() => {
                              let tiers = [...this.state.tiers];
                              tiers[i].recipientType = 'employee';
                              this.setState({tiers: tiers});
                              this._menu.hide();
                            }}>
                            Employee
                          </MenuItem>
                        </Menu> */}
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    let tiers = [...this.state.tiers];
                                                    console.log('ooo', tiers, i);
                                                    tiers.splice(i, 1);
                                                    console.log('pppp', tiers);
                                                    this.setState({ tiers: tiers });
                                                }}
                                                style={{
                                                    backgroundColor: COLORS.red,
                                                    padding: 3,
                                                    borderRadius: 5,
                                                    marginLeft: 5,
                                                }}>
                                                <EvilIcon name="trash" color="white" size={30} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}

                                    <TouchableOpacity
                                        onPress={() => {
                                            let tiers = [...this.state.tiers];
                                            tiers.push({
                                                amount: 0,
                                                recipientType: '',
                                                payOutDays: '',
                                                userGroup: '',
                                            });
                                            this.setState({ tiers: tiers });
                                        }}
                                        style={[{ alignSelf: 'flex-start', marginVertical: 5 }]}>
                                        <Text style={{ fontWeight: '600', color: COLORS.blue }}>
                                            + Add Bonus Tier
                    </Text>
                                    </TouchableOpacity>
                                    <View style={{ alignItems: 'center' }}>
                                        {this.state.showProgress ? (
                                            <AnimatedCircularProgress
                                                style={{ marginVertical: 3 }}
                                                size={45}
                                                width={6}
                                                fill={0}
                                                tintColor={COLORS.blue}
                                                onAnimationComplete={this.afterAnimation}
                                                backgroundColor={COLORS.lightGray3}
                                                ref={(ref) => (this.circularProgress = ref)}
                                            />
                                        ) : this.state.success ? (
                                            <Animated.View
                                                style={{
                                                    width: this.state.width.interpolate({
                                                        inputRange: [10, 90],
                                                        outputRange: ['10%', '90%'],
                                                    }),
                                                    height: 45,
                                                    backgroundColor: COLORS.dashboardGreen,
                                                    marginVertical: 3,
                                                    borderRadius: this.state.radius,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}>
                                                <FontIcon size={30} color="#fff" name="check" />
                                            </Animated.View>
                                        ) : (
                                            <TouchableOpacity
                                                style={{ width: '100%', alignItems: 'center' }}
                                                onPress={() => {
                                                    this.handleSubmit();
                                                }}>
                                                <Animated.View
                                                    style={{
                                                        width: this.state.width.interpolate({
                                                            inputRange: [10, 90],
                                                            outputRange: ['10%', '90%'],
                                                        }),
                                                        height: 45,
                                                        backgroundColor: COLORS.blue,
                                                        marginVertical: 3,
                                                        borderRadius: this.state.radius,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: COLORS.white,
                                                            fontSize: 20,
                                                            fontWeight: '300',
                                                        }}>
                                                        Add Referral
                          </Text>
                                                </Animated.View>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    absoluteView: {
        maxHeight: 200,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#d9d9d9',
    },
    input: {
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 4,
        marginVertical: 5,
        padding: 1,
        fontSize: 12,
        padding: 10,
        height: 40,
    },
});

export default withApollo(CreateBonus);
