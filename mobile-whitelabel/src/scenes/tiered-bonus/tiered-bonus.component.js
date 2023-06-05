import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import moment from 'moment';
//import Dimensions from 'Dimensions';
import {COLORS} from '../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../_shared/services/language-manager';

const {width, height} = Dimensions.get('window');
const TieredBonusData = [
  {amount: '1000', user: 'Employee', payDate: '12/10/2019'},
  {amount: '1000', user: 'Employee', payDate: '12/10/2020'},
  {amount: '1000', user: 'Employee', payDate: '12/10/2021'},
  {amount: '1000', user: 'Employee', payDate: '12/10/2022'},
  {amount: '2000', user: 'Employee', payDate: '12/10/2023'},
];
class BonusTiered extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      totalAmount: 0,
    };
  }
  componentDidMount() {
    this.setData();
  }
  setData() {
    // this.props.currentTieredBonus.tiers
    let total = 0;
    this.props.currentTieredBonus.tiers.map((item, index) => {
      let itemJson = JSON.parse(item);
      if (
        itemJson.userGroup == this.props.userGroup &&
        itemJson.recipientType === 'employee'
      )
        total += parseInt(itemJson.amount);
      if (index + 1 == this.props.currentTieredBonus.tiers.length) {
        this.setState({totalAmount: total});
      }
    });
  }
  render() {
    let {
      currentTieredBonus: {tiers},
      hireDate,
      currencyRate,
      currencySymbol,
    } = this.props;
    tiers = tiers.filter(
      (item) =>
        JSON.parse(item).userGroup == this.props.userGroup &&
        JSON.parse(item).recipientType === 'employee',
    );
    return (
      <View style={{flex: 1}}>
        <View
          style={[
            styles.container,
            {marginTop: 10, justifyContent: 'space-between'},
          ]}>
          <View style={styles.section}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 13,
                color: COLORS.grayMedium,
              }}>
              {customTranslate('ml_Referrals_TieredBonus')}:
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '300',
                color: COLORS.grayMedium,
                marginTop: 2,
              }}>
              {currencySymbol + parseInt(this.state.totalAmount * currencyRate)}{' '}
              / {tiers.length} {customTranslate('ml_Referrals_payments')}
            </Text>
          </View>
          {this.props.status && this.props.status.stepIndex == 3 && (
            <View>
              {tiers.map((data, index) => {
                let dataJson = JSON.parse(data);
                let date = new Date(hireDate);
                let paymentDate = date.setDate(
                  date.getDate() + parseInt(dataJson.payOutDays),
                );
                // let newDate = new Date(paymentDate);
                let newDate = moment(paymentDate).format('L');
                let todayDate = new Date();
                // alert(todayDate);
                let todayDateMoment = moment(todayDate).format('L');
                // let paymentDate = moment(date).add(parseInt(dataJson.payOutDays), 'days');
                let rowColor =
                  moment(todayDateMoment, 'MM/DD/YYYY').toISOString() >=
                  moment(newDate, 'MM/DD/YYYY').toISOString()
                    ? 'black'
                    : '#939393';
                return (
                  <View style={styles.container2} key={index}>
                    <Text
                      style={[
                        styles.text,
                        {
                          width: (40 / 375) * width,
                          color: rowColor,
                        },
                      ]}>
                      {currencySymbol +
                        parseInt(dataJson.amount * currencyRate)}
                    </Text>
                    {/* <Text
                      style={[
                        styles.text,
                        {
                          width: (60 / 375) * width,
                          color: rowColor,
                        },
                      ]}
                    >
                      {dataJson.recipientType}
                    </Text> */}
                    {/* <Text style={styles.text}>{`${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`}</Text> */}
                    <Text
                      style={[
                        styles.text,
                        {
                          width: (68 / 375) * width,
                          color: rowColor,
                        },
                      ]}>
                      {newDate}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    flexDirection: 'row',
  },
  container2: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'column',
  },
  text: {
    fontSize: 11,
    textAlign: 'center',
    marginLeft: 5.5,
    color: '#939393',
  },
});
export default BonusTiered;
