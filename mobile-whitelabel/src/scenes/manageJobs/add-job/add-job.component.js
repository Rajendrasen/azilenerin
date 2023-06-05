import React, {Component} from 'react';
import {
  View,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import {COLORS} from '../../../_shared/styles/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {createJob} from '../../../_store/_shared/api/graphql/custom/jobs/create-job.graphql';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import gql from 'graphql-tag';
import {withApollo} from 'react-apollo';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../../_shared/services/language-manager';
let {width, height} = Dimensions.get('window');
export class AddJob extends Component {
  state = {
    addJobModal: false,
    formPage: 0,
    jobTypes: [
      {value: 'fulltime', name: customTranslate('ml_Fulltime')},
      {value: 'commmission', name: customTranslate('ml_Commision')},
      {value: 'parttime', name: customTranslate('ml_Parttime')},
      {value: 'contract', name: customTranslate('ml_Contract')},
      {value: 'internship', name: customTranslate('ml_Internship')},
    ],
    jobType: {value: 'fulltime', name: customTranslate('ml_Fulltime')},
    salaryFrom: '',
    salaryTo: '',
    intervals: [
      customTranslate('ml_peryear'),
      customTranslate('ml_permonth'),
      customTranslate('ml_perweek'),
      customTranslate('ml_perday'),
      customTranslate('ml_perhour'),
    ],
    interval: customTranslate('ml_peryear'),
    isLocationForCreateJob: false,
    jobTitle: '',
    description: '',
    link: '',
    hiringContact: '',
    notificationType: 'ALL',
    showHiringConctacts: false,
    hiringContact: '',
    bonus: '',
    showDepts: false,
    department: '',
    tempLocation: {},
    locationModal: false,
    noBonus: false,
    bonusAmount: '',
    lat: null,
    lng: null,
    radius: new Animated.Value(3),
    width: new Animated.Value(width - 50),
    showProgress: false,
    progress: 0,
    success: false,
    remoteJob: false,
  };
  jobTypeMenu = null;
  intervalMenu = null;
  bonusMenu = null;

  selectJobType = (item) => {
    this.setState({jobType: item});
    this.jobTypeMenu.hide();
  };
  selectInterval = (item) => {
    this.setState({interval: item});
    this.intervalMenu.hide();
  };
  selectBonus = (item) => {
    this.setState({bonus: item, bonusAmount: '', noBonus: false});
    this.bonusMenu.hide();
  };

  resetState = () => {
    this.setState({
      addJobModal: false,
      formPage: 0,
      jobType: {value: 'fulltime', name: customTranslate('ml_Fulltime')},
      salaryFrom: '',
      salaryTo: '',
      interval: customTranslate('ml_peryear'),
      isLocationForCreateJob: false,
      jobTitle: '',
      description: '',
      link: '',
      hiringContact: '',
      notificationType: 'ALL',
      showHiringConctacts: false,
      hiringContact: '',
      bonus: '',
      showDepts: false,
      department: '',
      tempLocation: {},
      locationModal: false,
      noBonus: false,
      bonusAmount: '',
      lat: null,
      lng: null,
      radius: new Animated.Value(3),
      width: new Animated.Value(width - 50),
      showProgress: false,
      progress: 0,
      success: false,
    });
  };

  handleNext = () => {
    let re = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    let page = this.state.formPage;
    if (page == 1) {
      if (!this.state.jobTitle) {
        alert(customTranslate('ml_PleaseEnterJobTitle'));
        return;
      }
      if (!this.state.department) {
        alert(customTranslate('ml_PleaseSelectDepartment'));
        return;
      }
      if (!this.state.description) {
        alert(customTranslate('ml_PleaseEnterDescription'));
        return;
      }
    }
    if (page == 2) {
      if (this.state.link && !re.test(this.state.link)) {
        alert(customTranslate('ml_PleaseEnterAValidUrl'));
        return;
      }
      if (!this.state.hiringContact) {
        alert(customTranslate('ml_PleaseSelectAHiringContact'));
        return;
      }
      if (!this.state.noBonus && !this.state.bonus && !this.state.bonusAmount) {
        alert(customTranslate('ml_PleaseSelectBonus'));
        return;
      }
    }
    this.setState((state) => ({
      formPage: state.formPage === 3 ? 0 : state.formPage + 1,
    }));
  };

  getLatLngFromAddress = async (city, state) => {
    try {
      const key = 'AIzaSyDA9bz4iuSAItrIUdJI8KiASKgLHGcUkjg';
      const response = await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          city +
          ',' +
          state +
          '&key=' +
          key,
      );
      const responseJson = await response.json();
      if (responseJson.status === 'OK') {
        const result = responseJson.results[0].geometry.location;
        const lati = result.lat;
        const longi = result.lng;
        this.setState({
          lat: lati,
          lng: longi,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  renderJobInfo = () => {
    return (
      <View style={{marginVertical: 15, paddingHorizontal: 10}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Text style={{flex: 1.5, fontWeight: '500'}}>
            {customTranslate('ml_JobType')}:{' '}
          </Text>
          <View style={[styles.inputContainer, {flex: 5}]}>
            <Menu
              ref={(ref) => (this.jobTypeMenu = ref)}
              button={
                <TouchableOpacity
                  style={{
                    height: 40,

                    justifyContent: 'center',
                  }}
                  onPress={() => this.jobTypeMenu.show()}>
                  <Text style={{color: COLORS.black}}>
                    {this.state.jobType.name}
                  </Text>
                </TouchableOpacity>
              }>
              {this.state.jobTypes.map((item) => (
                <MenuItem
                  onPress={() => this.selectJobType(item)}
                  style={{width: 200}}>
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </View>
        </View>
        <Text style={{marginTop: 15, fontWeight: '500'}}>
          {customTranslate('ml_SalaryRange')}{' '}
          <Text style={{color: COLORS.buttonGrayText, fontSize: 13}}>
            {customTranslate('ml_Optional')}{' '}
          </Text>
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <View
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 2,
                height: 30,
                flex: 1,
              },
            ]}>
            <Text style={{color: COLORS.black, flex: 1}}>$</Text>
            <TextInput
              style={{flex: 7, height: 35, fontSize: 12, fontWeight: '300'}}
              placeholder={'From'}
              keyboardType="number-pad"
              onChangeText={(val) => this.setState({salaryFrom: val})}
              value={this.state.salaryFrom}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 2,
                height: 30,
                flex: 1,
              },
            ]}>
            <Text style={{color: COLORS.black, flex: 1}}>$</Text>
            <TextInput
              style={{flex: 7, height: 35, fontSize: 12, fontWeight: '300'}}
              placeholder={'To'}
              keyboardType="number-pad"
              onChangeText={(val) => this.setState({salaryTo: val})}
              value={this.state.salaryTo}
            />
          </View>
          <View
            style={[
              styles.inputContainer,
              {height: 30, marginHorizontal: 2, flex: 1},
            ]}>
            <Menu
              ref={(ref) => (this.intervalMenu = ref)}
              button={
                <TouchableOpacity
                  onPress={() => this.intervalMenu.show()}
                  style={{
                    height: 30,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: COLORS.black, fontSize: 12}}>
                    {this.state.interval}
                  </Text>
                  <IonIcon name="ios-arrow-down" color={'black'} size={15} />
                </TouchableOpacity>
              }>
              {this.state.intervals.map((item) => (
                <MenuItem key={item} onPress={() => this.selectInterval(item)}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text style={{fontWeight: '500'}}>
            {customTranslate('ml_Location')}{' '}
            <Text style={{color: COLORS.buttonGrayText, fontSize: 13}}>
              {customTranslate('ml_Optional')}{' '}
            </Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                alignItems: 'center',
                borderColor: this.state.remoteJob
                  ? COLORS.blue
                  : COLORS.borderColor,
                marginHorizontal: 2,
                height: 30,
              },
            ]}
            onPress={() =>
              this.setState((state) => ({
                remoteJob: !state.remoteJob,
                tempLocation: {},
              }))
            }>
            <Text
              style={{
                color: this.state.remoteJob ? COLORS.blue : COLORS.borderColor,
                fontSize: 12,
              }}>
              {customTranslate('ml_RemotePosition')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingLeft: 10}}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Text style={{flex: 1.5}}>{customTranslate('ml_City')}: </Text>
            <TouchableOpacity
              style={[styles.inputContainer, {flex: 5}]}
              onPress={() =>
                this.setState({locationModal: true, addJobModal: false})
              }>
              <Text>{this.state.tempLocation.city}</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Text style={{flex: 1.5}}>{customTranslate('ml_State')}: </Text>
            <View style={[styles.inputContainer, {flex: 5}]}>
              <Text>{this.state.tempLocation.state}</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <Text style={{flex: 1.5}}>{customTranslate('ml_Country')}: </Text>
            <View style={[styles.inputContainer, {flex: 5}]}>
              <Text>{this.state.tempLocation.country}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  renderDescription = () => {
    return (
      <View style={{marginVertical: 15, paddingHorizontal: 10}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Text style={{flex: 1.5, fontWeight: '500'}}>
            {customTranslate('ml_JobTitle')}:{' '}
          </Text>
          <TextInput
            style={[styles.inputContainer, {flex: 4}]}
            onChangeText={(val) => this.setState({jobTitle: val})}
            value={this.state.jobTitle}></TextInput>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
          <Text style={{flex: 1.5, fontWeight: '500'}}>
            {customTranslate('ml_Department')}:{' '}
          </Text>
          <TouchableOpacity
            style={[styles.inputContainer, {flex: 4}]}
            onPress={() => this.setState({showDepts: true})}>
            <Text
              style={{
                color: this.state.department ? COLORS.black : COLORS.lightGray,
              }}>
              {this.state.department
                ? this.state.department.name
                : customTranslate('ml_SelectDepartment')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{fontWeight: '500', marginTop: 15}}>
          {customTranslate('ml_JobDetailDescription')}
        </Text>
        <TextInput
          multiline
          style={[
            {
              minHeight: 70,
              marginTop: 5,
              fontSize: 12,
              padding: 10,
              maxHeight: 130,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor: COLORS.borderColor,
            },
          ]}
          placeholder={customTranslate('ml_DescribeResponsibility')}
          placeholderTextColor={COLORS.lightGray}
          scrollEnabled
          onChangeText={(val) => this.setState({description: val})}
          value={this.state.description}></TextInput>
      </View>
    );
  };
  renderReferralInfo = () => {
    let {notificationType} = this.state;
    return (
      <View style={{marginVertical: 15, paddingHorizontal: 10}}>
        <Text style={{fontWeight: '500', marginTop: 5}}>
          {customTranslate('ml_PublicJobPostingLink')}
        </Text>
        <TextInput
          style={[styles.inputContainer, {marginTop: 5}]}
          placeholder={'http://linkToYourJob.org/post?id=12345'}
          placeholderTextColor={COLORS.lightGray}
          onChangeText={(val) => this.setState({link: val})}
          value={this.state.link}></TextInput>
        <Text style={{fontWeight: '500', marginTop: 15}}>
          {customTranslate('ml_HiringContact')}
        </Text>
        <Text style={{fontSize: 11, color: COLORS.lightGray, marginTop: 2}}>
          {customTranslate('ml_HiringContactLabel')}
        </Text>
        <TouchableOpacity
          style={[styles.inputContainer, {marginTop: 5}]}
          onPress={() => this.setState({showHiringConctacts: true})}>
          {this.state.hiringContact ? (
            <Text
              style={{
                color: COLORS.black,
              }}>{`${this.state.hiringContact.firstName} ${this.state.hiringContact.lastName}`}</Text>
          ) : (
            <Text style={{color: COLORS.lightGray, fontSize: 12}}>
              Ex: James Smith
            </Text>
          )}
        </TouchableOpacity>
        <Text style={{marginTop: 15, fontWeight: '500'}}>
          {customTranslate('ml_ReferralBonus')}
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <View
            style={[
              styles.inputContainer,
              {
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                marginHorizontal: 2,
                height: 30,
              },
            ]}>
            <Text style={{color: COLORS.black, flex: 1}}>$</Text>
            <TextInput
              style={{flex: 7, height: 35, fontSize: 12, fontWeight: '300'}}
              placeholder={'Ex: 3000'}
              keyboardType="number-pad"
              onChangeText={(val) =>
                this.setState({bonusAmount: val, noBonus: false})
              }
              value={this.state.bonusAmount}
            />
          </View>
          {/* <TouchableOpacity
            style={[
              styles.salaryContainer,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}
          >
            <Text style={{ color: COLORS.black, fontSize: 12 }}>Choose</Text>
            <IonIcon
              name="ios-arrow-down"
              color={COLORS.black}
              size={15}
              style={{ marginRight: 3 }}
            />
          </TouchableOpacity> */}
          <View
            style={[
              styles.inputContainer,
              {flex: 1, marginHorizontal: 2, height: 30},
            ]}>
            <Menu
              ref={(ref) => (this.bonusMenu = ref)}
              button={
                <TouchableOpacity
                  style={{
                    height: 30,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => this.bonusMenu.show()}>
                  <Text style={{color: COLORS.black, fontSize: 12}}>
                    {this.state.bonus ? this.state.bonus.name : 'Choose'}
                  </Text>
                  <IonIcon
                    name="ios-arrow-down"
                    color={COLORS.black}
                    size={15}
                    style={{marginRight: 3}}
                  />
                </TouchableOpacity>
              }>
              {this.props.bonuses.map((item) => (
                <MenuItem onPress={() => this.selectBonus(item)}>
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </View>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                alignItems: 'center',
                borderColor: this.state.noBonus
                  ? COLORS.blue
                  : COLORS.borderColor,
                flex: 1,
                marginHorizontal: 2,
                height: 30,
              },
            ]}
            onPress={() =>
              this.setState({bonus: '', bonusAmount: '', noBonus: true})
            }>
            <Text
              style={{
                color: this.state.noBonus ? COLORS.blue : COLORS.borderColor,
                fontSize: 12,
              }}>
              {customTranslate('ml_DontPayBonus')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{fontWeight: '500', marginTop: 15}}>
          {customTranslate('ml_Notifications')}
        </Text>
        <Text style={{fontSize: 11, color: COLORS.lightGray, marginTop: 2}}>
          {customTranslate('ml_NotificationLabel')}
        </Text>
        <View style={{flexDirection: 'row', marginTop: 5}}>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                alignItems: 'center',
                borderColor:
                  notificationType == 'ALL' ? COLORS.blue : COLORS.borderColor,
                flex: 1,
                marginHorizontal: 2,
                height: 30,
              },
            ]}
            onPress={() => this.setState({notificationType: 'ALL'})}>
            <Text
              style={{
                color:
                  notificationType == 'ALL' ? COLORS.blue : COLORS.borderColor,
                fontSize: 12,
              }}>
              {customTranslate('ml_NotifyAllEmployees')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                alignItems: 'center',
                borderColor:
                  notificationType == 'DEPARTMENT'
                    ? COLORS.blue
                    : COLORS.borderColor,
                flex: 1,
                marginHorizontal: 2,
                height: 30,
              },
            ]}
            onPress={() => this.setState({notificationType: 'DEPARTMENT'})}>
            <Text
              style={{
                color:
                  notificationType == 'DEPARTMENT'
                    ? COLORS.blue
                    : COLORS.borderColor,
                fontSize: 12,
              }}>
              {customTranslate('ml_NotifyDepartmentOnly')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.inputContainer,
              {
                alignItems: 'center',
                borderColor:
                  notificationType == 'NONE' ? COLORS.blue : COLORS.borderColor,
                flex: 1,
                marginHorizontal: 2,
                height: 30,
              },
            ]}
            onPress={() => this.setState({notificationType: 'NONE'})}>
            <Text
              style={{
                color:
                  notificationType == 'NONE' ? COLORS.blue : COLORS.borderColor,
                fontSize: 12,
              }}>
              {customTranslate('ml_NoNotifications')}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.showHiringConctacts && (
          <View style={styles.popup}>
            <ScrollView style={styles.popupScroll}>
              {this.props.hiringContacts.map((item) => (
                <TouchableOpacity
                  style={{padding: 10, paddingHorizontal: 15}}
                  onPress={() =>
                    this.setState({
                      hiringContact: item,
                      showHiringConctacts: false,
                    })
                  }>
                  <Text
                    style={{
                      fontSize: 15,
                      color: COLORS.grayMedium,
                    }}>{`${item.firstName} ${item.lastName}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  renderReview = () => {
    let {
      jobType,
      salaryFrom,
      salaryTo,
      tempLocation,
      jobTitle,
      department,
      description,
      link,
      hiringContact,
      bonus,
      bonusAmount,
      noBonus,
      notificationType,
      interval,
      remoteJob,
    } = this.state;
    return (
      <View style={{marginVertical: 15, paddingHorizontal: 10}}>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_JobType')}:{' '}
          <Text style={{fontWeight: '300'}}>{jobType.name}</Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_Salary')}:{' '}
          <Text style={{fontWeight: '300'}}>
            {salaryTo && salaryFrom
              ? `$${salaryFrom} - $${salaryTo} ${interval}`
              : ''}
          </Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_Location')}:{' '}
          <Text style={{fontWeight: '300'}}>
            {tempLocation.city && tempLocation.state
              ? tempLocation.city + ', ' + tempLocation.state
              : remoteJob
              ? 'Remote'
              : ''}
          </Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 15, fontSize: 16}}>
          {customTranslate('ml_JobTitle')}:{' '}
          <Text style={{fontWeight: '300'}}>{jobTitle}</Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_Department')}:{' '}
          <Text style={{fontWeight: '300'}}>{department.name}</Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_JobDetailDescription')}:
        </Text>
        <Text
          style={{
            fontWeight: '300',
            marginTop: 2,
            textAlign: 'justify',
            fontSize: 12,
          }}>
          {description}
        </Text>
        <Text style={{fontWeight: '500', marginTop: 15, fontSize: 16}}>
          {customTranslate('ml_PublicJobPostingLink')}:
        </Text>
        {link ? (
          <Text
            style={{
              fontWeight: '300',
              marginTop: 2,
              textAlign: 'justify',
              fontSize: 14,
            }}>
            {link}
          </Text>
        ) : null}

        <Text style={{fontWeight: '500', marginTop: 15, fontSize: 16}}>
          {customTranslate('ml_HiringContact')}:{' '}
          <Text style={{fontWeight: '300'}}>
            {hiringContact.firstName + ' ' + hiringContact.lastName}
          </Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_ReferralBonus')}:{' '}
          <Text style={{fontWeight: '300', color: COLORS.dashboardGreen}}>
            {noBonus
              ? 'No Bonus'
              : bonusAmount
              ? `$${bonusAmount}`
              : bonus.name}
          </Text>
        </Text>
        <Text style={{fontWeight: '500', marginTop: 5, fontSize: 16}}>
          {customTranslate('ml_Notifications')}:{' '}
          <Text style={{fontWeight: '300'}}>
            {notificationType.toLowerCase() === 'all'
              ? customTranslate('ml_NotifyAllEmployees')
              : notificationType.toLowerCase() === 'department'
              ? customTranslate('ml_NotifyDepartmentOnly')
              : customTranslate('ml_NoNotifications')}
          </Text>
        </Text>
      </View>
    );
  };

  handleClose = () => {
    Alert.alert(
      'Alert',
      customTranslate('ml_AreYouSure'),
      [
        {
          text: customTranslate('ml_ContinueJob'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: customTranslate('ml_DiscardJob'),
          onPress: () => {
            this.resetState();
            this.setState({addJobModal: false});
          },
        },
      ],
      {cancelable: false},
    );
  };
  renderFormPage = () => {
    switch (this.state.formPage) {
      case 0:
        return this.renderJobInfo();
      case 1:
        return this.renderDescription();
      case 2:
        return this.renderReferralInfo();
      case 3:
        return this.renderReview();
      default:
        break;
    }
  };
  handleAddressSelect = (val) => {
    if (val) {
      let addArray = val.formatted_address.split(',');
      let country = addArray[addArray.length - 1];
      let state = addArray[addArray.length - 2];
      let city = addArray[0];
      this.setState({
        tempLocation: {country: country, state: state, city: city},
        locationModal: false,
        addJobModal: true,
        remoteJob: false,
      });
      this.getLatLngFromAddress(city, state);
    }
  };
  shrinkAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: 45,
        duration: 250,
      }),
      Animated.timing(this.state.radius, {
        toValue: 22.5,
        duration: 250,
      }),
    ]).start(this.handleProgress);
  };
  circularProgress;

  handleProgress = () => {
    this.setState({showProgress: true, progress: 80}, () => {
      this.circularProgress.animate(this.state.progress, 800, Easing.quad);
    });
  };

  afterAnimation = () => {
    if (this.state.progress == 100) {
      this.setState(
        {showProgress: false, progress: 0, success: true},
        this.handleSuccessExpand,
      );
    }
  };
  handleSuccessExpand = () => {
    Animated.parallel([
      Animated.timing(this.state.width, {
        toValue: width - 50,
        duration: 250,
      }),
      Animated.timing(this.state.radius, {
        toValue: 3,
        duration: 250,
      }),
    ]).start(() => {
      setTimeout(() => {
        this.resetState();
        this.setState({addJobModal: false});
      }, 1000);
    });
  };

  handleReferralSuccess = () => {
    this.setState({progress: 100}, () =>
      this.circularProgress.animate(this.state.progress, 800, Easing.quad),
    );
  };
  handleSubmit = () => {
    this.shrinkAnimation();
    let {
      jobType,
      salaryFrom,
      salaryTo,
      tempLocation,
      jobTitle,
      department,
      description,
      link,
      hiringContact,
      bonus,
      bonusAmount,
      noBonus,
      notificationType,
      interval,
      remoteJob,
      lat,
      lng,
    } = this.state;
    let referralBonus = {hasBonus: !noBonus};
    if (bonusAmount) referralBonus.amount = bonusAmount;
    if (bonus) referralBonus.tieredBonusId = bonus.id;
    let input = {
      companyId: this.props.currentUser.companyId,
      departmentId: department.id,
      jobType: jobType.value,
      title: jobTitle,
      description: description,
      publicLink: link || null,
      salary: JSON.stringify({
        from: salaryFrom || null,
        to: salaryTo || null,
        interval: interval || null,
      }),
      location: JSON.stringify({
        city: tempLocation.city || null,
        state: tempLocation.state || null,
        isRemote: remoteJob || null,
      }),
      hiringManagerId: hiringContact.id,
      createdById: this.props.currentUser.id,
      status: 'open',
      referralBonus: JSON.stringify(referralBonus),
      notificationType,
      shares: 0,
      views: 0,
      lat,
      lng,
    };
    this.props.client
      .mutate({
        mutation: gql(createJob),
        variables: {input},
      })
      .then((res) => {
        this.handleReferralSuccess();
      });
  };
  render() {
    let {
      company: {theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    return (
      <React.Fragment>
        {width > 450 ? (
          <TouchableOpacity
            onPress={() => this.setState({addJobModal: true})}
            style={[
              // styles1.addContact,
              {
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  width <= 450
                    ? theme.enabled
                      ? theme.addButtonColor
                      : COLORS.red
                    : 'transparent',
              },
            ]}>
            <AntIcon
              style={{marginRight: 5, marginTop: 3}}
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
              {customTranslate('ml_AddJob')}{' '}
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
            onPress={() => this.setState({addJobModal: true})}>
            <Text
              style={{
                color: 'white',
                fontSize: this.props.referContact ? 14 : 18,
              }}>
              {customTranslate('ml_AddJob')}
            </Text>
          </TouchableOpacity>
        )}

        <Modal visible={this.state.addJobModal} transparent>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  width: width - 30,
                  maxWidth: 450,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
                  <View style={{flex: 5}}>
                    <Text
                      style={[
                        styles.title,
                        theme.enabled && {color: theme.buttonColor},
                      ]}>
                      {customTranslate('ml_CreateNewJob')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={this.handleClose}
                    style={{flex: 1, alignItems: 'center'}}>
                    <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                  </TouchableOpacity>
                </View>
                {this.renderFormPage()}
                {this.state.formPage == 3 ? (
                  <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
                    <Text
                      style={{
                        fontSize: 17,
                        color: COLORS.blue,
                        marginBottom: 5,
                      }}
                      onPress={() => this.setState({formPage: 2})}>
                      {'<<'}
                      {customTranslate('ml_Back')}
                    </Text>
                    {/* <TouchableOpacity
                      style={[styles.nextButton, { height: 45 }]}
                      onPress={this.handleSubmit}
                    >
                      <Text style={[styles.nextText, { fontSize: 20 }]}>Create Job</Text>
                    </TouchableOpacity> */}
                    <View style={{alignItems: 'center'}}>
                      {this.state.showProgress ? (
                        <AnimatedCircularProgress
                          style={{marginVertical: 3}}
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
                            width: this.state.width,
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
                          onPress={() => {
                            this.handleSubmit();
                          }}>
                          <Animated.View
                            style={{
                              width: this.state.width,
                              height: 45,
                              backgroundColor: COLORS.blue,
                              marginVertical: 3,
                              borderRadius: this.state.radius,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={[styles.nextText, {fontSize: 20}]}>
                              {customTranslate('ml_CreateJob')}
                            </Text>
                          </Animated.View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.buttonRow}>
                    <View>
                      {this.state.formPage > 0 && (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() =>
                            this.setState((state) => ({
                              formPage:
                                state.formPage === 0 ? 0 : state.formPage - 1,
                            }))
                          }>
                          <Text style={styles.backText}>
                            {customTranslate('ml_Back')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={this.handleNext}>
                      <Text style={styles.nextText}>{customTranslate('ml_Next')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              {this.state.showDepts && (
                <View style={[styles.popup, {maxHeight: 600}]}>
                  <ScrollView style={styles.popupScroll}>
                    {this.props.departments.map((item) => (
                      <TouchableOpacity
                        style={{padding: 10, paddingHorizontal: 15}}
                        onPress={() =>
                          this.setState({department: item, showDepts: false})
                        }>
                        <Text style={{fontSize: 15, color: COLORS.grayMedium}}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>
        <Modal visible={this.state.locationModal}>
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <GooglePlacesAutocomplete
                placeholder={customTranslate('ml_Search')}
                minLength={1} // minimum length of text to search
                autoFocus={true}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed="auto" // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  this.handleAddressSelect(details);
                }}
                getDefaultValue={() => ''}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyBFPKs7Ueh6G-5TqgsFKCaJagKwizTvDlY',
                  language: 'en', // language of the results
                  types: '(cities)', // default: 'geocode'
                }}
                styles={{
                  textInputContainer: {
                    width: '100%',
                  },
                  description: {
                    fontWeight: 'bold',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GooglePlacesDetailsQuery={{
                  // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                  fields: 'formatted_address',
                }}
                debounce={100} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                renderLeftButton={() => (
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.red,
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      margin: 5,
                      borderRadius: 5,
                    }}
                    onPress={() =>
                      this.setState({locationModal: false, addJobModal: true})
                    }>
                    <Text style={{color: '#fff'}}>{customTranslate('ml_Cancel')}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    color: COLORS.red,
    fontSize: 28,
    marginBottom: 0,
    fontWeight: '600',
    marginTop: 15,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 0.5,
    height: 40,
    padding: 4,
    justifyContent: 'center',
    borderColor: COLORS.borderColor,
  },
  nextButton: {
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  backButton: {
    height: 35,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: COLORS.buttonGrayOutline,
  },
  nextText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '300',
  },
  backText: {
    color: COLORS.buttonGrayText,
    fontSize: 17,
    fontWeight: '300',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  popup: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    alignSelf: 'center',
  },
  popupScroll: {
    width: '80%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLORS.borderColor,
    paddingVertical: 5,
  },
});

export default withApollo(AddJob);
