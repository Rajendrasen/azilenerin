import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import {COLORS} from '../../_shared/styles/colors';
import {get} from 'lodash';
import moment from 'moment';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import IonIcon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

class MyBonusCard extends Component {
  state = {
    showModal: false,
  };
  formatBonusStatus = () => {
    let status = this.props?.bonus?.bonusStatus || '';
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
  colorResolver = () => {
    let status = this.props?.bonus?.bonusStatus || '';
    switch (status) {
      case 'pending':
        return {
          background: COLORS.dashboardLightOrange,
          dollar: COLORS.dashboardDarkOrange,
        };
      case 'earned':
        return {
          background: COLORS.dashboardGreen,
          dollar: COLORS.green,
        };
      case 'paid':
        return {
          background: COLORS.dashboardGreen,
          dollar: COLORS.green,
        };
      default:
        return {
          background: '#f74f4f',
          dollar: '#a10303',
        };
    }
  };
  render() {
    let {bonus} = this.props;
    return (
      <TouchableOpacity style={styles.referralCardContainer}>
        <View
          style={[
            styles.left,
            {backgroundColor: this.colorResolver().background},
          ]}>
          <Image
            resizeMode="contain"
            style={{
              width: 60,
              tintColor: this.colorResolver().dollar,
            }}
            source={require('../../_shared/assets/dollar-currency-symbol.png')}
          />
        </View>
        <View style={styles.right}>
          <View
            style={{
              padding: 10,
              borderBottomColor: COLORS.lightGray3,
              borderBottomWidth: 0.5,
            }}>
            <Text
              style={{fontSize: 16, color: COLORS.blue, fontWeight: 'bold'}}>
              {get(bonus, 'contact.firstName')} {get(bonus, 'contact.lastName')}
              <Text style={{color: COLORS.lightGray}}> Referral</Text>
            </Text>
          </View>
          <View style={{flexDirection: 'row', padding: 10}}>
            <View style={{flex: 1}}>
              <Text
                style={{fontSize: 17, color: this.colorResolver().background}}>
                {this.formatBonusStatus(get(bonus, 'status', null))}
              </Text>
              <Text
                style={{fontSize: 13, color: COLORS.grayMedium, marginTop: 15}}>
                {get(bonus, 'payment')}
              </Text>
              <Text
                onPress={() => this.setState({showModal: true})}
                style={{
                  fontSize: 13,
                  color: COLORS.blue,
                  fontWeight: 'bold',
                  marginTop: 3,
                }}>
                View Details
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 17, color: COLORS.green, fontWeight: 'bold'}}>
                {`${this.props.currencySymbol} ${get(
                  bonus,
                  'amountDue',
                )}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
              {this.formatBonusStatus().toLowerCase() != 'ineligible' && (
                <Text style={{fontSize: 13, color: COLORS.buttonGrayText}}>
                  Eligible on:{' '}
                  <Text style={{color: 'black'}}>
                    {moment(get(bonus, 'earnedDate')).format('MM/DD/YYYY')}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>
        <Modal transparent visible={this.state.showModal}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderRadius: 10,
                backgroundColor: 'white',
                width: width > 450 ? 450 : width - 30,
                paddingBottom: 20,
                maxHeight: 500,
              }}>
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <View style={{flex: 1}}></View>
                <View
                  style={{
                    flex: 5,
                    paddingVertical: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: COLORS.black,
                      alignSelf: 'center',
                      fontWeight: '600',
                    }}>
                    {customTranslate('ml_BonusDetails')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.setState({showModal: false})}>
                  <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {bonus ? (
                  <View style={{paddingHorizontal: 15, marginTop: 15}}>
                    <View style={[Styles.row, {marginTop: 15}]}>
                      <Text style={Styles.key}>{customTranslate('ml_Job')}:</Text>
                      <Text style={Styles.value}>
                        {get(bonus, 'job.title')}
                      </Text>
                    </View>

                    <View style={[Styles.row]}>
                      <Text style={Styles.key}>
                        {customTranslate('ml_ReferredCandidate')}
                      </Text>
                      <Text style={Styles.value}>
                        {get(bonus, 'contact.firstName')}{' '}
                        {get(bonus, 'contact.lastName')}
                      </Text>
                    </View>

                    <View style={[Styles.row, {marginTop: 15}]}>
                      <Text style={Styles.key}>{customTranslate('ml_HiredDate')}:</Text>
                      <Text style={Styles.value}>
                        {moment(bonus.hireDate).format('MM/DD/YYYY')}
                      </Text>
                    </View>
                    <View style={Styles.row}>
                      <Text style={Styles.key}>{customTranslate('ml_Startdate')}:</Text>
                      <Text style={Styles.value}>
                        {moment(bonus.startDate).format('MM/DD/YYYY')}
                      </Text>
                    </View>
                    {this.formatBonusStatus().toLowerCase() != 'ineligible' && (
                      <View style={[Styles.row, {marginTop: 15}]}>
                        <Text style={Styles.key}>
                          {customTranslate('ml_EligibleDate')}:
                        </Text>
                        <Text style={Styles.value}>
                          {moment(bonus.earnedDate).format('MM/DD/YYYY')}
                        </Text>
                      </View>
                    )}

                    <View style={[{flexDirection: 'column', marginTop: 15}]}>
                      <Text style={[Styles.key, {marginBottom: 3}]}>
                        {'Bonus Payments'}:
                      </Text>

                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            Styles.value,
                            {
                              marginRight: 10,
                              color: COLORS.green,
                              fontWeight: '500',
                            },
                          ]}>
                          {this.props.currencySymbol + get(bonus, 'amountDue')}
                          {' - '}
                          <Text style={{color: COLORS.grayMedium}}>
                           {this.formatBonusStatus()}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 4,
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
    alignSelf: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
    minHeight: 100,
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
const Styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  value: {
    fontWeight: '300',
    fontSize: 16,
    textTransform: 'capitalize',
    flex: 1,
  },
  key: {fontSize: 16, fontWeight: '600', marginRight: 5},
  settingCard: {
    minHeight: 50,
    width: Dimensions.get('window').width - 30,
    paddingTop: 8,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  settingCardText: {
    fontSize: 18,
    marginLeft: 8,
    // color: 'black'
  },
  activeFilterText: {
    fontSize: 13,
    color: COLORS.blue,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  inactiveFilterText: {
    fontSize: 13,
    color: COLORS.lightGray,
    fontWeight: '400',
  },
  filterButton: {
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: COLORS.lightGray3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginHorizontal: 2.5,
  },
});

export default MyBonusCard;
