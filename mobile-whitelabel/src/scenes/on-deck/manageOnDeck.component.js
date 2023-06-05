import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Button,
  SearchBar,
  List,
  InputItem,
  WhiteSpace,
} from '@ant-design/react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {SearchBarOverrides} from '../my-network/my-network.styles';
import {COLORS} from '../../_shared/styles/colors';
import {Actions} from 'react-native-router-flux';
import gql from 'graphql-tag';
import {withApollo} from 'react-apollo';
import _ from 'lodash';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
//import Toast from 'react-native-toast-native';
import Icons from 'react-native-vector-icons/Ionicons';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import {BrowseJobs} from '../jobs/jobs.container';
import {
  queryOnDeckContactsByCompanyIdIndex,
  updateContactQuery,
  listOnDeckContacts,
} from './on-deck.graphql';
import {getErinSquare, getLightGrayLogo} from '../../WhiteLabelConfig';
let {width} = Dimensions.get('window');

class ManageOnDeck extends Component {
  state = {
    searchTerm: '',
    nextToken: null,
    latestReferrals: [],
    pageNumber: 1,
    referrals: [],
    pageLoading: true,
    reloading: false,
    spinAnim: new Animated.Value(0),
    jobsModal: false,
    selectedContact: '',
    selectedUser: '',
    status: 'onDeck',
  };
  handleRemoveReferral = (id) => {
    Alert.alert(
      customTranslate('ml_RemoveFromGeneralReferrals'),
      '',
      [
        {
          text: customTranslate('ml_Cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: customTranslate('ml_Confirm'),
          onPress: () => {
            // Toast.show(customTranslate('ml_Removing') + '...', Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.darkGray,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
              message: customTranslate('ml_Removing') + '...',
              type: 'info',
            });
            this.removeReferral(id);
          },
        },
      ],
      {cancelable: false},
    );
  };
  removeReferral = (id) => {
    // Toast.show('Removing...', Toast.SHORT, Toast.TOP, {
    //   backgroundColor: COLORS.darkGray,
    //   height: 50,
    //   width: 250,
    //   borderRadius: 10,
    // });
    showMessage({
      message: customTranslate('ml_Removing') + '...',
      type: 'info',
    });
    this.props.client
      .mutate({
        mutation: updateContactQuery,
        variables: {
          input: {
            id: id,
            onDeckStatus: 'offDeck',
            onDeckDate: moment(),
          },
        },
      })
      .then((res) => {
        let tempReferrals = [...this.state.latestReferrals];
        let index = tempReferrals.findIndex((item) => item.id == id);
        tempReferrals[index].onDeckStatus = 'offDeck';
        this.setState(
          {
            latestReferrals: tempReferrals,
          },
          () => this.fetchData(1),
        );
      })
      .catch((err) => {
        // Toast.show('Something went wrong.');
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
  };
  activateReferral = (id) => {
    // Toast.show(customTranslate('ml_Adding') + '...', Toast.SHORT, Toast.TOP, {
    //   backgroundColor: COLORS.darkGray,
    //   height: 50,
    //   width: 250,
    //   borderRadius: 10,
    // });
    showMessage({
      message: customTranslate('ml_Adding'),
      type: 'info',
    });
    this.props.client
      .mutate({
        mutation: updateContactQuery,
        variables: {
          input: {
            id: id,
            onDeckStatus: 'onDeck',
            onDeckDate: moment(),
          },
        },
      })
      .then((res) => {
        let tempReferrals = [...this.state.latestReferrals];
        let index = tempReferrals.findIndex((item) => item.id == id);
        tempReferrals[index].onDeckStatus = 'onDeck';
        this.setState(
          {
            latestReferrals: tempReferrals,
          },
          () => this.fetchData(1),
        );
      })
      .catch((err) => {
        // Toast.show('Something went wrong.');
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
  };
  componentDidMount() {
    this.getReferrals();
    this.spin();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.nextToken && prevState.nextToken != this.state.nextToken) {
      this.getReferrals();
    }
  }
  handleSearch = (text) => {
    this.setState(
      {
        searchTerm: text,
      },
      () => this.fetchData(1),
    );
  };
  getReferrals = () => {
    this.props.client
      .query({
        query: listOnDeckContacts,
        variables: {
          filter: {
            companyId: {eq: this.props.currentUser.companyId},
            onDeckStatus: {gt: 0},
          },

          limit: 200000,
          nextToken: this.state.nextToken ? this.state.nextToken : null,
        },
        fetchPolicy: 'network-only',
      })
      .then((res) => {
        if (res.data.listOnDeckContacts && res.data.listOnDeckContacts.items) {
          this.setState(
            {
              latestReferrals: [
                ...this.state.latestReferrals,
                ...res.data.listOnDeckContacts.items,
              ],
              nextToken: res.data.listOnDeckContacts.nextToken,
            },
            () => {
              this.fetchData(1);
              if (!res.data.listOnDeckContacts.nextToken) {
                this.setState({
                  pageLoading: false,
                  reloading: false,
                });
              }
            },
          );
        }
      })
      .catch((err) => {
        console.log('fetching referrals error', err);
        this.setState({pageLoading: false, reloading: false});
      });
  };
  renderReferralRow = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          borderBottomColor: '#ddd',
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          paddingVertical: 3,
        }}
        onPress={() =>
          Actions.onDeckReferralDetail({
            details: {id: item.id},
          })
        }
        key={item.id}>
        <View style={{flex: 4.5}}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
              color: COLORS.blue,
            }}>{`${item.firstName} ${item.lastName}`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1.5,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          {item.onDeckStatus == 'offDeck' ? (
            <MaterialIcon
              name="arrow-left-circle"
              color={COLORS.blue}
              size={33}
              onPress={() => this.activateReferral(item.id)}
            />
          ) : (
            <MaterialIcon
              name="minus-circle"
              color={COLORS.lightGray3}
              size={33}
              onPress={() => this.removeReferral(item.id)}
            />
          )}

          <AntIcon
            name="pluscircle"
            color={COLORS.red}
            size={30}
            onPress={() =>
              this.setState({
                jobsModal: true,
                selectedContact: {
                  id: item.id,
                  name: item.firstName + ' ' + item.lastName,
                  referrals: item.referrals,
                },
                selectedUser: {
                  id: item.userId,
                  name: item.user.firstName + ' ' + item.user.lastName,
                },
              })
            }
          />
        </View>
      </TouchableOpacity>
    );
  };

  fetchData = (pageNumber) => {
    //this.setState({ pageLoading: true });

    let newArr = _.sortBy(
      this.filterJobs(this.state.searchTerm).filter(
        (item) => item.onDeckStatus == this.state.status,
      ),
      'onDeckDate',
    ).reverse();
    let fromIndex = (pageNumber - 1) * 20;
    let toIndex = fromIndex + 20;
    let pageReferrals = newArr.slice(fromIndex, toIndex);
    if (pageNumber == 1) {
      this.setState({pageNumber: pageNumber, referrals: pageReferrals});
    } else {
      this.setState({
        pageNumber: pageNumber,
        referrals: [...this.state.referrals, ...pageReferrals],
        // pageLoading: false,
      });
    }
  };
  filterJobs = (searchTerm) => {
    if (searchTerm) {
      return this.state.latestReferrals.filter((ref) => {
        const contactName = `${ref.firstName} ${ref.lastName}`;
        if (contactName) {
          return (
            contactName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          );
        }
      });
    }
    return this.state.latestReferrals;
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
  handleAfterReferral = (moveOffDeck) => {
    this.setState(
      {
        jobsModal: false,
      },
      () => {
        setTimeout(() => {
          // Toast.show(customTranslate('ml_ReferredSuccessfully'), Toast.LONG, Toast.TOP, {
          //   backgroundColor: COLORS.dashboardGreen,
          //   height: 50,
          //   width: 250,
          //   borderRadius: 10,
          // });
          showMessage({
            message: customTranslate('ml_ReferredSuccessfully'),
            type: 'success',
          });
          if (moveOffDeck) {
            this.removeReferral(this.state.selectedContact.id);
          }
        }, 1000);
      },
    );
  };
  render() {
    let {
      company: {symbol, theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let jobsModal = (
      <Modal visible={this.state.jobsModal} animated animationType="slide">
        <SafeAreaView
          style={{flex: 1, backgroundColor: COLORS.blackTransparent}}>
          <View
            style={[
              {
                flex: 1,
                marginHorizontal: '3%',
                backgroundColor: '#fff',
                //paddingBottom: 24,
                marginBottom: 10,
              },
              {
                backgroundColor: 'white',
                borderRadius: 30,
                marginTop: 10,
              },
            ]}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <View style={{flex: 1}}></View>
              <View style={{flex: 5, justifyContent: 'center', paddingTop: 27}}>
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    color: '#ef3c3f',
                    fontSize: 28,
                    marginBottom: 0,
                    fontWeight: '600',
                  }}>
                  {customTranslate('ml_SelectJob')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({jobsModal: false});
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
            <View
              style={{
                flex: 1,
                backgroundColor: '#ebedf2',
                borderBottomLeftRadius: 30,
                borderBottomRightRadius: 30,
                overflow: 'hidden',
              }}>
              <BrowseJobs
                onDeckRefer={{
                  userId: this.state.selectedUser.id,
                  contactId: this.state.selectedContact.id,
                  contactName: this.state.selectedContact.name,
                  userName: this.state.selectedUser.name,
                  contactPreviousReferrals: this.state.selectedContact
                    .referrals,
                }}
                handleAfterReferral={this.handleAfterReferral}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor: '#EFEFF2'}}>
          {width <= 450 && (
            <SearchBar
              placeholder={customTranslate('ml_Search')}
              value={this.state.searchTerm}
              onChange={(text) => {
                this.handleSearch(text);
              }}
              styles={SearchBarOverrides}
            />
          )}
          <View style={{flexDirection: 'row'}}>
            <ScrollView
              horizontal
              style={{paddingHorizontal: 2.5, paddingTop: 0, paddingBottom: 5}}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  borderRadius: 20,
                  backgroundColor: '#fff',
                  borderWidth: 0.5,
                  borderColor: COLORS.lightGray3,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 30,
                  marginHorizontal: 2.5,
                }}
                onPress={() =>
                  this.setState(
                    (state) => ({
                      status: state.status == 'onDeck' ? 'offDeck' : 'onDeck',
                    }),
                    () => this.fetchData(1),
                  )
                }>
                <Text
                  style={{
                    fontSize: 13,
                    color:
                      this.state.status == 'onDeck'
                        ? COLORS.blue
                        : COLORS.lightGray,
                    fontWeight: '400',
                  }}>
                  {this.state.status == 'onDeck'
                    ? customTranslate('ml_Active')
                    : customTranslate('ml_Inactive')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
            {width > 450 && (
              <View style={{width: 250}}>
                <SearchBar
                  placeholder={customTranslate('ml_Search')}
                  value={this.state.searchTerm}
                  onChange={(text) => {
                    this.handleSearch(text);
                  }}
                  styles={SearchBarOverrides}
                />
              </View>
            )}
          </View>
        </View>
        {this.state.pageLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image
              style={{height: 60, width: 60, transform: [{rotate: spin}]}}
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
        ) : this.state.referrals && this.state.referrals.length > 0 ? (
          <React.Fragment>
            <FlatList
              style={{flex: 1, backgroundColor: '#fff'}}
              data={this.state.referrals}
              renderItem={this.renderReferralRow}
              onEndReached={() => {
                if (
                  this.state.pageNumber + 1 >
                  this.state.latestReferrals.length / 20 + 1
                ) {
                  return;
                } else {
                  // debugger
                  if (!this.state.pageLoading) {
                    this.fetchData(this.state.pageNumber + 1);
                  }
                }
              }}
              onRefresh={() => {
                this.setState({reloading: true, latestReferrals: []});
                this.getReferrals();
              }}
              refreshing={this.state.reloading}
            />
            {jobsModal}
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
                {customTranslate('ml_ThereAreNoReferralsAtThisTime')}
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
                  this.spin();
                  this.setState({pageLoading: true});
                  this.getReferrals();
                }}>
                <Text style={{color: '#fff'}}>{customTranslate('ml_Refresh')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withApollo(ManageOnDeck);
