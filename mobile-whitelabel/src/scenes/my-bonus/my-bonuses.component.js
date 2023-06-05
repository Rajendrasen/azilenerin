/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {
  Button,
  SearchBar,
  List,
  InputItem,
  WhiteSpace,
} from '@ant-design/react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
const Item = List.Item;
import {
  View,
  ScrollView,
  FlatList,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Animated,
  ActivityIndicator,
  Easing,
} from 'react-native';
import _, {get} from 'lodash';
import {withApollo} from 'react-apollo';
import {queryBonusByUserIdIndex} from '../../_store/_shared/api/graphql/custom/bonuses/query-bonus-by-user-id.graphql';
const {width, height} = Dimensions.get('window');
import {COLORS} from '../../_shared/styles/colors';
import {calculateTotalBonuses} from '../../_shared/services/utils';
import MyBonusCard from './my-bonus-card.component';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {downloadFromS3} from '../../common';
import {getErinSquare} from '../../WhiteLabelConfig';
class MyBonusesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinAnim: new Animated.Value(0),
      loading: true,
      bonuses: [],
      showBonsuModal: false,
      statusFilter: [],
      bonusPage: [],
    };
  }

  componentDidMount() {
    this.spin();
    this.getBonuses();
  }

  getBonuses = () => {
    this.props.client
      .query({
        query: queryBonusByUserIdIndex,
        variables: {
          userId: this.props.currentUser.id,
        },
      })
      .then((res) => {
        console.log('rs', res);
        this.setState({loading: false});
        this.setState({
          bonuses: _.orderBy(
            get(res, 'data.queryBonusByUserIdIndex.items', []),
            ['earnedDate'],
            ['desc'],
          ).filter((item) => item.recipientType == 'employee'),
          bonusPage: _.orderBy(
            get(res, 'data.queryBonusByUserIdIndex.items', []),
            ['earnedDate'],
            ['desc'],
          ).filter((item) => item.recipientType == 'employee'),
        });
      })
      .catch((err) => this.setState({loading: false}));
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
  renderCard = ({item}) => {
    return <MyBonusCard bonus={item} {...this.props} />;
  };
  formatBonusStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'earned':
        return 'Eligible';
      case 'paid':
        return 'Paid';
      default:
        return 'Ineligible';
    }
  };
  applyStatusFilter = () => {
    if (!this.state.statusFilter.length) {
      this.setState({showBonsuModal: false, bonusPage: this.state.bonuses});
      return this.state.bonuses;
    }
    let bonuses = [...this.state.bonuses];
    let map = {};
    this.state.statusFilter.map((item) => (map[item] = true));
    bonuses = bonuses.filter((item) => {
      if (map[this.formatBonusStatus(get(item, 'bonusStatus', null))]) {
        return true;
      } else {
        return false;
      }
    });

    this.setState({bonusPage: bonuses, showBonsuModal: false});
  };
  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let {
      currentUser: {
        company: {theme, symbol, confirmCompliance},
      },
    } = this.props;
    theme = theme ? JSON.parse(theme) : {};
    return (
      <View style={{flex: 1}}>
        {this.state.loading ? (
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 120,
              position: 'absolute',
              top: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.77)',
            }}>
            <Animated.Image
              style={{height: 60, width: 60, transform: [{rotate: spin}]}}
              source={
                theme.enabled && symbol && symbol.key
                  ? {
                      uri: downloadFromS3(symbol.key),
                    }
                  : getErinSquare()
              }
            />
          </View>
        ) : !this.state.bonuses || !this.state.bonuses.length ? (
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height - 120,
              position: 'absolute',
              top: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.77)',
            }}>
            <Text
              style={{
                color: '#999999',
                textAlign: 'center',
                marginHorizontal: 20,
                marginTop: 10,
              }}>
              {'There are no Bonuses, Make referrals to earn Bonuses.'}
            </Text>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                alignSelf: width > 450 ? 'flex-end' : 'auto',
                padding: 15,
              }}>
              <View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 8,
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        paddingLeft: 0,
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}>
                      {customTranslate('ml_Total')}:{' '}
                    </Text>

                    <Text
                      style={[
                        {color: COLORS.black},
                        {
                          color: 'green',
                          fontSize: 18,
                          fontWeight: 'bold',
                        },
                      ]}>
                      {this.props.currencySymbol}
                      {calculateTotalBonuses(
                        this.state.bonuses,
                        false,
                        this.props.currencyRate,
                      )}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}>
                      {customTranslate('ml_Referrals_TotalEarned')}:{' '}
                    </Text>

                    <Text
                      style={[
                        {color: COLORS.black},
                        {
                          color: 'green',
                          fontSize: 18,
                          fontWeight: 'bold',
                        },
                      ]}>
                      {this.props.currencySymbol}
                      {calculateTotalBonuses(
                        this.state.bonuses,
                        true,
                        this.props.currencyRate,
                      )}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color: COLORS.lightGray,
                    paddingHorizontal: 0,
                    paddingTop: 3,
                  }}>
                  {customTranslate('ml_Referrals_DaysPolicy')}
                </Text>
              </View>
            </View>
            <View style={{width: '90%', alignSelf: 'center'}}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  backgroundColor: '#fff',
                  borderWidth: 0.5,
                  borderColor: this.state.statusFilter.length
                    ? COLORS.blue
                    : COLORS.lightGray3,
                  alignItems: 'center',
                  borderRadius: 15,
                  height: 30,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
                onPress={() => this.setState({showBonsuModal: true})}>
                <Text
                  style={{
                    fontSize: 13,
                    color: this.state.statusFilter.length
                      ? COLORS.blue
                      : COLORS.lightGray,
                    fontWeight: '700',
                  }}>
                  Filter by Status
                </Text>
                <IonIcon
                  name={'md-arrow-dropdown'}
                  size={20}
                  color={COLORS.buttonGrayOutline}
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>
            </View>
            {this.state.bonusPage && this.state.bonusPage.length ? (
              <FlatList
                renderItem={this.renderCard}
                data={this.state.bonusPage}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#999999',
                    textAlign: 'center',
                    marginHorizontal: 20,
                    marginTop: 10,
                  }}>
                  {'No Bonus matching the filter'}
                </Text>
              </View>
            )}
          </View>
        )}
        <Modal visible={this.state.showBonsuModal} transparent>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 30,
                maxHeight: height - 150,
                backgroundColor: '#fff',
                borderRadius: 5,
                maxWidth: 450,
              }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.setState((state) => ({
                    showBonsuModal: false,
                  }))
                }>
                <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
              </TouchableOpacity>
              <ScrollView style={{padding: 10}}>
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
                  {['Pending', 'Ineligible', 'Eligible', 'Paid'].map((b, i) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: this.state.statusFilter.find(
                          (item) => item == b,
                        )
                          ? 'rgb(189, 249, 189)'
                          : 'transparent',
                        height: 40,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        marginBottom: 5,
                        marginRight: 3,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: this.state.statusFilter.find(
                          (item) => item == b,
                        )
                          ? 0
                          : 1,
                        borderColor: '#888',
                      }}
                      onPress={() => {
                        let statuses = [...this.state.statusFilter];
                        if (statuses.find((item) => item == b)) {
                          statuses = statuses.filter((item) => item != b);
                        } else {
                          statuses.push(b);
                        }
                        this.setState({statusFilter: statuses});
                      }}
                      key={i}>
                      <Text
                        style={{
                          color: this.state.statusFilter.find(
                            (item) => item == b,
                          )
                            ? 'rgb(29, 134, 29)'
                            : '#777',
                        }}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      statusFilter: [],
                      bonusPage: this.state.bonuses,
                    })
                  }
                  style={{
                    paddingVertical: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    //backgroundColor: COLORS.red,
                    borderRadius: 5,
                    flexDirection: 'row',
                    margin: 5,
                    flex: 1,
                    borderWidth: 0.5,
                    borderColor: COLORS.buttonGrayOutline,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: '300',
                      marginRight: 5,
                      color: COLORS.buttonGrayText,
                      textTransform: 'capitalize',
                    }}>
                    {customTranslate('ml_Clear')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.applyStatusFilter}
                  style={{
                    paddingVertical: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    backgroundColor: COLORS.blue,
                    borderRadius: 5,
                    flexDirection: 'row',
                    margin: 5,
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: '300',
                      marginRight: 5,
                      textTransform: 'capitalize',
                    }}>
                    {customTranslate('ml_Apply')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  candidateName: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    color: COLORS.lightGray,
  },
  jobTitle: {
    // width: 200,
    flexWrap: 'wrap',
    color: COLORS.blue,
    fontWeight: 'bold',
  },
  referralCardContainer: {
    width: width > 450 ? width / 2 - 15 : width - 15,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    padding: 15,
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    height: 50,
  },
});

export default withApollo(MyBonusesComponent);
