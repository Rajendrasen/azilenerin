import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {showMessage, hideMessage} from 'react-native-flash-message';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {getTotalReferrals, getTotalUsers} from './queries';
import {COLORS} from '../../_shared/styles/colors';
import {
  listUserGroups,
  queryUsersByCompanyIdRoleIndex,
} from '../../_store/_shared/api/graphql/custom/users/list-users-with-all.graphql';
import {listDepartments} from '../../_store/_shared/api/graphql/custom/departments/list-departments.graphql';
import {withApollo} from 'react-apollo';
import gql from 'graphql-tag';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {getErinSquare} from '../../WhiteLabelConfig';

export class messageCenter extends Component {
  state = {
    userGroups: [],
    departments: [],
    radius: 0,
    jobs: [],
    current: 0,
    total_pages: 0,
    jobModal: false,
    selectedJob: '',
    deptModal: false,
    groupModal: false,
    group: '',
    selectedDept: {},
    users: [],
    selectedGroup: {},
    subject: '',
    message: '',
    selectedUsers: [],
    locationModal: false,
    pageLoading: true,
    spinAnim: new Animated.Value(0),
    paginatedJobs: [],
    searchTerm: '',
    pageNumber: 1,
    paginatedDepartments: [],
    departmentSearchTerm: '',
    totalUserCount: '',
    totalUsers: [],
    userType: 'employee',
    totalReferrals: [],
    totalReferralCount: '',
    tempLocation: {},
    sendPush: false,
    pushMessage: '',
  };
  componentDidMount() {
    this.spin();
    this.getJobs();
    this.getUserGroups();
    this.getDepartments();
    //this.getUsers();
    this.getTotalUsers();
    this.getTotalReferrals();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.current != this.state.current &&
      this.state.current < this.state.total_pages
    ) {
      this.getJobs();
    }
  }
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = (val) => {
    this.setState({radius: val});
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  getDepartments = () => {
    this.props.client
      .query({
        query: gql(listDepartments),
        variables: {
          filter: {
            companyId: {
              eq: this.props.currentUser.companyId,
            },
            active: {
              eq: true,
            },
          },
          limit: 1000,
        },
      })
      .then((res) => {
        console.log('dept res', res);
        this.setState({
          departments: res.data.listDepartments.items,
          paginatedDepartments: res.data.listDepartments.items,
        });
      });
  };
  getUserGroups = () => {
    this.props.client
      .query({
        query: listUserGroups,
        variables: {
          filter: {
            companyId: {
              eq: this.props.currentUser.companyId,
            },
            active: {
              eq: true,
            },
          },
          limit: 1000,
        },
      })
      .then((res) => {
        console.log('group res', res);
        this.setState({userGroups: res.data.listUserGroups.items});
      });
  };
  getTotalUsers = () => {
    this.props.client
      .query({
        query: getTotalUsers,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        this.setState({
          totalUsers: JSON.parse(res.data.getTotalUsers.finalResult).totalUsr,
          totalUserCount: JSON.parse(res.data.getTotalUsers.finalResult)
            .TotalUserCount,
          users: JSON.parse(res.data.getTotalUsers.finalResult).totalUsr,
          selectedUsers: JSON.parse(res.data.getTotalUsers.finalResult)
            .totalUsr,
        });
      });
  };
  getTotalReferrals = () => {
    this.props.client
      .query({
        query: getTotalReferrals,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        this.setState({
          totalReferrals: JSON.parse(res.data.getTotalReferrals.finalResult)
            .totalRef,
          totalReferralCount: JSON.parse(res.data.getTotalReferrals.finalResult)
            .TotalJobReferralCount,
        });
      });
  };
  getUsers = () => {
    this.props.client
      .query({
        query: queryUsersByCompanyIdRoleIndex,
        variables: {
          companyId: this.props.currentUser.companyId,
          role: 'employee',
        },
      })
      .then((res) => {
        console.log('user res', res);
        this.setState({
          users: res.data.queryUsersByCompanyIdRoleIndex.items,
          selectedUsers: res.data.queryUsersByCompanyIdRoleIndex.items,
        });
      });
  };
  getJobs = () => {
    let query = {
      query: '',
      filters: {
        all: [
          {
            record_type: 'Job',
          },
          {
            company_id: this.props.currentUser.companyId,
          },
        ],
      },
      page: {
        size: 1000,
        current: this.state.current ? this.state.current + 1 : 1,
      },
    };
    fetch(
      'https://host-b93sm9.api.swiftype.com/api/as/v1/engines/erin-job/search',
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer search-c8iq6284cm17eu79wu8podg7',
        },
        body: JSON.stringify(query), // body data type must match "Content-Type" header
      },
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('jobs ', json);
        this.setState(
          (state) => ({
            jobs: [...state.jobs, ...json.results],
            current: json.meta.page.current,
            total_pages: json.meta.page.total_pages,
            pageLoading: false,
          }),
          () => {
            if (!this.state.paginatedJobs.length) {
              this.paginateJobs(1);
            }
          },
        );
      })
      .catch((err) => {
        this.setState({pageLoading: false});
      });
  };
  paginateJobs = async (pageNumber) => {
    let searchTerm = this.state.searchTerm;
    let filteredJobs = this.state.jobs;
    if (searchTerm) {
      filteredJobs = filteredJobs.filter((item) => {
        if (item.title) {
          return (
            item.title.raw.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
          );
        }
      });
    }
    //let newArr = _.sortBy(filteredJobs, 'dateCreated').reverse();
    let newArr = filteredJobs;
    let fromIndex = (pageNumber - 1) * 20;
    let toIndex = fromIndex + 20;
    let pageJobs = newArr.slice(fromIndex, toIndex);
    if (pageNumber == 1) {
      this.setState({
        pageNumber: pageNumber,
        paginatedJobs: pageJobs,
      });
    } else {
      this.setState({
        pageNumber: pageNumber,
        paginatedJobs: [...this.state.paginatedJobs, ...pageJobs],
      });
    }
  };
  paginateDepartments = async (pageNumber) => {
    let searchTerm = this.state.departmentSearchTerm;
    let filteredJobs = this.state.departments;
    console.log('serch term', searchTerm);
    if (searchTerm) {
      filteredJobs = filteredJobs.filter((item) => {
        if (item.name) {
          return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }
      });
    }
    //let newArr = _.sortBy(filteredJobs, 'dateCreated').reverse();
    this.setState({
      paginatedDepartments: filteredJobs,
    });
  };
  setSelectedUsers = () => {
    console.log('slkfdlskf', this.state);
    let userGroups = Object.keys(this.state.selectedGroup);
    let departments = Object.keys(this.state.selectedDept);

    let filteredUsers = [...this.state.users];
    if (userGroups.length) {
      console.log('if one', userGroups);
      filteredUsers = filteredUsers.filter((user) => {
        if (this.state.selectedGroup[user.userGroupId]) {
          return true;
        }
      });
    }
    if (departments.length) {
      console.log('if two', departments);
      filteredUsers = filteredUsers.filter((user) => {
        if (this.state.selectedDept[user.departmentId]) {
          return true;
        }
        if (user.job && this.state.selectedDept[user.job.departmentId]) {
          return true;
        }
      });
    }
    console.log('ssss', filteredUsers);
    this.setState({selectedUsers: filteredUsers}, () => {
      console.log('iii', this.state.selectedUsers);
    });
  };
  handleSubmitEmployee = () => {
    if (this.state.subject.length > 60) {
      alert('Subject cannot be more than 60 characters');
      return;
    }
    let {currentUser} = this.props;
    let messageTemplate = {
      companyId: currentUser.companyId,
      senderId: currentUser.id,
      subject: this.state.subject,
      message: '<p>' + this.state.message + '</p>',
      senderFirstName: currentUser.firstName,
      senderLastName: currentUser.lastName,
      brandColor: currentUser.company.brandColor,
      brandLogo: currentUser.company.logo,
      company: currentUser.company.name,
      users: this.state.selectedUsers,
      jobId: this.state.selectedJob ? this.state.selectedJob.id.raw : '',
      jobTitle: this.state.selectedJob ? this.state.selectedJob.title.raw : '',
      jobLocation: this.state.selectedJob
        ? this.state.selectedJob.location_text.raw
        : '',
      sendPush: this.state.sendPush,
      mode: 'prod',
      pushMsg: this.state.pushMessage,
    };
    fetch(
      'https://t7rrxwsg6e.execute-api.us-east-2.amazonaws.com/default/message-center-email-trigger',
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({messageTemplate}),
      },
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('senemploye', json);
        showMessage({
          message: 'Message sent successfully.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log('send em error', err);
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
    if (this.state.sendPush) {
      this.sendPush();
    }
  };
  sendPush = () => {
    let {currentUser} = this.props;
    let template = {
      companyId: currentUser.companyId,
      companyName: currentUser.company.name,
      message: '<p>' + this.state.message + '</p>',
      mode: 'prod',
      pushMsg: this.state.pushMessage,
      users: this.state.selectedUsers,
    };
    fetch(
      'https://lncud41nnj.execute-api.us-east-2.amazonaws.com/default/message-center-push-notification',
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({template}),
      },
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('senemploye', json);
        showMessage({
          message: 'Push Notification sent successfully.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log('send em error', err);
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
  };
  handleSubmit = () => {
    if (this.state.subject.length > 60) {
      alert('Subject cannot be more than 60 characters');
      return;
    }
    let {currentUser} = this.props;
    let messageTemplate = {
      companyId: currentUser.companyId,
      senderId: currentUser.id,
      subject: this.state.subject,
      message: '<p>' + this.state.message + '</p>',
      toAddress: currentUser.emailAddress,
      senderFirstName: currentUser.firstName,
      senderLastName: currentUser.lastName,
      brandColor: currentUser.company.brandColor,
      brandLogo: currentUser.company.logo,
      company: currentUser.company.name,
      jobId: this.state.selectedJob ? this.state.selectedJob.id.raw : '',
      jobTitle: this.state.selectedJob ? this.state.selectedJob.title.raw : '',
      jobLocation: this.state.selectedJob
        ? this.state.selectedJob.location_text.raw
        : '',
    };
    fetch(
      'https://je5z5ry91i.execute-api.us-east-2.amazonaws.com/default/dev-message-center-email',
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({messageTemplate}),
      },
    )
      .then((res) => res.json())
      .then((json) => {
        console.log('senemploye', json);
        showMessage({
          message: 'Message sent successfully.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log('send em error', err);
        showMessage({
          message: 'Something went wrong',
          type: 'danger',
        });
      });
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
  handleAddressSelect = (val) => {
    console.log('lskdf', val);
    if (val) {
      let addArray = val.formatted_address.split(',');
      let country = addArray[addArray.length - 1];
      let state = addArray[addArray.length - 2];
      let city = addArray[0];
      this.getLatLngFromAddress(city, state);
      this.setState({
        tempLocation: {country: country, state: state, city: city},
        locationModal: false,
        showLocationModal: true,
      });
    }
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
        console.log('lst', lati, longi);
        this.setState({
          lat: lati,
          lng: longi,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  checkLocation = (locationFilter, user) => {
    const filteredDistance = locationFilter.filteredDistance;
    const location = locationFilter.location;
    const {lat, long} = location;

    if (lat === '' && long === '') return true;
    let userLocation = null,
      userLat = null,
      userLong = null;
    if (user !== null) {
      userLocation = user.location
        ? JSON.parse(get(user, 'location', null))
        : null;
      userLat = get(userLocation, 'lat', null);
      userLong = get(userLocation, 'long', null);
    }
    // console.log(lat, long, userLat, userLong, Number(filteredDistance), this.calcCrow(lat, long, userLat, userLong))
    if (lat && long && userLat && userLong && Number(filteredDistance)) {
      const candidateDis = this.calcCrow(lat, long, userLat, userLong);
      if (candidateDis <= Number(filteredDistance)) {
        return true;
      } else {
        return false;
      }
    } else if (Number(filteredDistance) == 0) {
      return true;
    } else {
      return false;
    }
  };

  calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  render() {
    let {
      company: {symbol, theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    let {userType} = this.state;
    return (
      <View style={{flex: 1}}>
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
        ) : (
          <KeyboardAwareScrollView
            style={{flex: 1, paddingTop: 10}}
            contentContainerStyle={{alignItems: 'center'}}>
            <View
              style={{
                width: '95%',
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 10,
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 15,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState(
                      {userType: 'employee', users: this.state.totalUsers},
                      this.setSelectedUsers,
                    )
                  }
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 0.5,
                    borderColor: COLORS.lightGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    backgroundColor:
                      userType == 'employee' ? COLORS.lightGray : 'white',
                  }}>
                  <Text
                    style={{
                      color:
                        userType == 'employee' ? 'white' : COLORS.grayMedium,
                    }}>
                    To Employees
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.setState(
                      {userType: 'candidate', users: this.state.totalReferrals},
                      this.setSelectedUsers,
                    )
                  }
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 0.5,
                    borderColor: COLORS.lightGray,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      userType == 'candidate' ? COLORS.lightGray : 'white',
                  }}>
                  <Text
                    style={{
                      color:
                        userType == 'candidate' ? 'white' : COLORS.grayMedium,
                    }}>
                    To Candidates
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={{fontSize: 17, fontWeight: '600'}}>
                    Select {userType == 'employee' ? 'Employees' : 'Candidates'}
                  </Text>
                  <Text style={{fontSize: 13, marginVertical: 10}}>
                    Who will this message go to?
                  </Text>
                </View>
                <View
                  style={{
                    height: '100%',
                    backgroundColor: COLORS.dashboardGreen,
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: 'green'}}>
                    {this.state.selectedUsers.length}
                  </Text>
                  <Text
                    style={{color: 'white', fontWeight: 'bold', fontSize: 12}}>
                    {userType == 'employee' ? 'Employees' : 'Candidates'}{' '}
                    Selected
                  </Text>
                </View>
              </View>
              {this.state.userType === 'employee' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: '600'}}>In Group:</Text>
                  <TouchableOpacity
                    onPress={() => this.setState({groupModal: true})}
                    style={{
                      height: 30,
                      borderWidth: 0.5,
                      marginTop: 5,
                      borderRadius: 3,
                      flex: 1,
                      marginLeft: 10,
                      padding: 5,
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: COLORS.darkGray}}>
                      {Object.keys(this.state.selectedGroup).length
                        ? Object.keys(this.state.selectedGroup).length +
                          ' ' +
                          'Groups'
                        : 'All'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: '600'}}>and in Department:</Text>
                <TouchableOpacity
                  onPress={() => this.setState({deptModal: true})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    flex: 1,
                    marginLeft: 10,
                    padding: 5,
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: COLORS.darkGray}}>
                    {Object.keys(this.state.selectedDept).length
                      ? Object.keys(this.state.selectedDept).length +
                        ' ' +
                        'Departments'
                      : 'All'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: '600'}}>Location:</Text>
                <View style={{flex: 1}}>
                  <Menu
                    ref={this.setMenuRef}
                    button={
                      <TouchableOpacity
                        onPress={this.showMenu}
                        style={{
                          height: 30,
                          borderWidth: 0.5,
                          marginTop: 5,
                          borderRadius: 3,
                          flex: 1,
                          marginLeft: 10,
                          padding: 5,
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: COLORS.darkGray}}>
                          {this.state.radius == 0
                            ? 'All locations'
                            : `Within ${this.state.radius} Miles`}
                        </Text>
                      </TouchableOpacity>
                    }>
                    <MenuItem onPress={() => this.hideMenu(0)}>
                      All Locations
                    </MenuItem>
                    <MenuItem onPress={() => this.hideMenu(25)}>
                      Within 25 Miles
                    </MenuItem>
                    <MenuItem onPress={() => this.hideMenu(50)}>
                      Within 50 Miles
                    </MenuItem>
                    <MenuItem onPress={() => this.hideMenu(100)}>
                      Within 100 Miles
                    </MenuItem>
                    <MenuItem onPress={() => this.hideMenu(200)}>
                      Within 200 Miles
                    </MenuItem>
                  </Menu>
                </View>
                <Text style={{fontWeight: '600', marginLeft: 5}}>of</Text>
                <TouchableOpacity
                  onPress={() => this.setState({locationModal: true})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    flex: 1,
                    marginLeft: 10,
                    padding: 5,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color:
                        this.state.tempLocation.city ||
                        this.state.tempLocation.state
                          ? 'black'
                          : 'grey',
                    }}>
                    {this.state.tempLocation.city ||
                    this.state.tempLocation.state
                      ? `${this.state.tempLocation.city}, ${this.state.tempLocation.state}`
                      : 'ex: New York'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={{fontSize: 17, fontWeight: '600', marginTop: 10}}>
                Job <Text style={{fontSize: 13}}>(optional)</Text>
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginVertical: 10,
                  color: COLORS.darkGray,
                }}>
                Do you want to include a link to a job in the top of a message?
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: '600'}}>Select A Job:</Text>
                <TouchableOpacity
                  onPress={() => this.setState({jobModal: true})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    flex: 1,
                    marginLeft: 10,
                    padding: 5,
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: COLORS.darkGray}}>
                    {this.state.selectedJob
                      ? this.state.selectedJob.title.raw
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={{fontSize: 17, fontWeight: '600', marginTop: 10}}>
                Message 
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  marginVertical: 10,
                  color: COLORS.darkGray,
                }}>
                The message will include the default company header and logo.
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: '600'}}>Subject:</Text>
                <TextInput
                  value={this.state.subject}
                  onChangeText={(val) => this.setState({subject: val})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    flex: 1,
                    marginLeft: 10,
                    paddingHorizontal: 5,
                  }}
                />
              </View>
              <View style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Message:</Text>
                <TextInput
                  multiline
                  scrollEnabled
                  textAlignVertical="top"
                  value={this.state.message}
                  onChangeText={(val) => this.setState({message: val})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    height: 100,
                    padding: 10,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.setState((prev) => ({sendPush: !prev.sendPush}))
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 30,
                  marginTop: 10,
                }}>
                <View>
                  {this.state.sendPush ? (
                    <Icon
                      name="ios-checkbox"
                      size={22}
                      color={COLORS.blue}></Icon>
                  ) : (
                    <Icon
                      name="ios-square-outline"
                      size={25}
                      color={COLORS.darkGray}></Icon>
                  )}
                </View>
                <Text style={{marginLeft: 5}}>Send a Push Notification</Text>
              </TouchableOpacity>
              <View style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Push Message:</Text>
                <TextInput
                  value={this.state.pushMessage}
                  onChangeText={(val) => this.setState({pushMessage: val})}
                  style={{
                    height: 30,
                    borderWidth: 0.5,
                    marginTop: 5,
                    borderRadius: 3,
                    padding: 10,
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={this.handleSubmit}
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderRadius: 5,
                  width: '100%',
                  marginTop: 10,
                  borderColor: this.state.subject
                    ? COLORS.grayMedium
                    : COLORS.lightGray,
                }}>
                <Text
                  style={{
                    color: this.state.subject
                      ? COLORS.grayMedium
                      : COLORS.lightGray,
                  }}>
                  Send Me A Test Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleSubmitEmployee()}
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth:
                    this.state.subject && this.state.selectedUsers.length
                      ? 0
                      : 1,
                  borderRadius: 5,
                  width: '100%',
                  marginTop: 5,
                  borderColor: COLORS.lightGray,
                  backgroundColor:
                    this.state.subject && this.state.selectedUsers.length
                      ? COLORS.dashboardBlue
                      : 'transparent',
                }}>
                <Text
                  style={{
                    color:
                      this.state.subject && this.state.selectedUsers.length
                        ? 'white'
                        : COLORS.lightGray,
                  }}>
                  Email {this.state.selectedUsers.length} Employees
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        )}
        <Modal transparent visible={this.state.jobModal}>
          <View style={{flex: 1, backgroundColor: COLORS.blackTransparent}}>
            <SafeAreaView
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  width: '90%',
                  maxWidth: 450,
                  backgroundColor: 'white',
                  height: '90%',
                  maxHeight: 650,
                }}>
                <View style={{alignItems: 'flex-end', padding: 5}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({jobModal: false, searchTerm: ''}, () =>
                        this.paginateJobs(1),
                      )
                    }>
                    <AntIcon name="close" size={30} color={COLORS.lightGray} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={{
                    height: 30,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    width: '95%',
                    alignSelf: 'center',
                    padding: 5,
                    marginVertical: 5,
                  }}
                  value={this.state.searchTerm}
                  placeholder={'Search'}
                  onChangeText={(val) => {
                    this.setState({searchTerm: val}, () =>
                      this.paginateJobs(1),
                    );
                  }}
                />
                <FlatList
                  data={this.state.paginatedJobs}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({jobModal: false, selectedJob: job})
                      }>
                      <Text
                        style={{
                          fontSize: 16,
                          marginHorizontal: 10,
                          marginVertical: 10,
                        }}>
                        {item.title.raw}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.raw}
                  onEndReachedThreshold={0.1}
                  onEndReached={() => {
                    if (
                      this.state.pageNumber + 1 >
                      this.state.jobs.length / 20 + 1
                    ) {
                      //this.setState({onEndloading: true});
                      //this.newFetchData(1);
                    } else {
                      this.paginateJobs(this.state.pageNumber + 1);
                    }
                  }}
                />
                {/* <ScrollView style={{flex: 1}}>
                  {this.state.paginatedJobs.map((job) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({jobModal: false, selectedJob: job})
                      }>
                      <Text
                        style={{
                          fontSize: 16,
                          marginHorizontal: 10,
                          marginVertical: 10,
                        }}>
                        {job.title.raw}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView> */}
              </View>
            </SafeAreaView>
          </View>
        </Modal>
        <Modal transparent visible={this.state.deptModal}>
          <View style={{flex: 1, backgroundColor: COLORS.blackTransparent}}>
            <SafeAreaView
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <View
                style={{
                  width: '90%',
                  maxWidth: 450,
                  backgroundColor: 'white',
                  height: 500,
                }}>
                <TextInput
                  style={{
                    height: 30,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    width: '95%',
                    alignSelf: 'center',
                    padding: 5,
                    marginVertical: 5,
                    marginTop: 10,
                  }}
                  value={this.state.departmentSearchTerm}
                  placeholder={'Search'}
                  onChangeText={(val) => {
                    this.setState({departmentSearchTerm: val}, () =>
                      this.paginateDepartments(),
                    );
                  }}
                />
                <ScrollView>
                  {this.state.paginatedDepartments.map((dept) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        let depts = {...this.state.selectedDept};
                        if (depts[dept.id]) {
                          delete depts[dept.id];
                        } else {
                          depts[dept.id] = dept;
                        }
                        this.setState(
                          {selectedDept: depts},
                          this.setSelectedUsers,
                        );
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: this.state.selectedDept[dept.id]
                            ? 'green'
                            : 'black',
                        }}>
                        {dept.name}
                      </Text>
                      {this.state.selectedDept[dept.id] && (
                        <AntIcon name="check" size={18} color="green" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={() =>
                    this.setState(
                      {deptModal: false, departmentSearchTerm: ''},
                      this.paginateDepartments,
                    )
                  }
                  style={{
                    backgroundColor: COLORS.dashboardBlue,
                    width: '95%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <Text style={{fontSize: 16, color: 'white'}}>Apply</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
        <Modal transparent visible={this.state.groupModal}>
          <View style={{flex: 1, backgroundColor: COLORS.blackTransparent}}>
            <SafeAreaView
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <View
                style={{
                  width: '90%',
                  maxWidth: 450,
                  backgroundColor: 'white',
                  maxHeight: 650,
                  padding: 10,
                }}>
                <ScrollView>
                  {this.state.userGroups.map((group) => (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        let groups = {...this.state.selectedGroup};
                        if (groups[group.id]) {
                          delete groups[group.id];
                        } else {
                          groups[group.id] = group.name;
                        }
                        this.setState(
                          {
                            group: group,
                            selectedGroup: groups,
                          },
                          this.setSelectedUsers,
                        );
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: this.state.selectedGroup[group.id]
                            ? 'green'
                            : 'black',
                        }}>
                        {group.name}
                      </Text>
                      {this.state.selectedGroup[group.id] && (
                        <AntIcon name="check" size={18} color="green" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={() => this.setState({groupModal: false})}
                  style={{
                    backgroundColor: COLORS.dashboardBlue,
                    width: '95%',
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <Text style={{fontSize: 16, color: 'white'}}>Apply</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
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
                      this.setState({
                        locationModal: false,
                        showLocationModalFilter: true,
                      })
                    }>
                    <Text style={{color: '#fff'}}>{customTranslate('ml_Cancel')}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

export default withApollo(messageCenter);
