import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {styles} from '../referral-modal.styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../../styles/colors';
import {withApollo} from 'react-apollo';
import {queryContactsByUserIdIndex} from '../../../../_store/_shared/api/graphql/custom/contacts/contacts-by-userId-graphql';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ListUsers} from '../../../../_store/_shared/api/graphql/custom/dashboard/list-users.graphql';
import {queryJobsByCompanyIdDateIndex} from '../../../../_store/_shared/api/graphql/custom/jobs/jobs-by-companyId.graphql';
import {listUserGroups} from '../../../../_store/_shared/api/graphql/custom/users/list-users-with-all.graphql';
import {listDepartments} from '../../../../_store/_shared/api/graphql/custom/departments/list-departments.graphql';
import {createContact} from '../../../../_store/_shared/api/graphql/custom/contacts/create-contact.graphql';
import {createReferral} from '../../../../_store/_shared/api/graphql/custom/referrals/create-referral.graphql';
import {createJob} from '../../../../_store/_shared/api/graphql/custom/jobs/create-job.graphql';
import {createUser} from '../../../../_store/_shared/api/graphql/mutations';
import {showMessage} from 'react-native-flash-message';
import CreateBonus from '../create-bonus-modal/create-bonus.component';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import _ from 'lodash';
import FontIcon from 'react-native-vector-icons/FontAwesome';

import gql from 'graphql-tag';

export class AddReferral extends Component {
  state = {
    modalVisible: false,
    showSuggestion: false,
    contactOptions: [{id: 1, firstName: 'first', lastName: 'last'}],
    bonusPop: false,
    selectedBonus: '',
    contacts: [],
    users: [],
    jobs: [],
    departments: [],
    userGroups: [],
    name: '',
    email: '',
    jobTitle: '',
    selectedContact: '',
    selectedJob: '',
    selectedUser: '',
    showUsersSuggestion: false,
    suggestedUsers: [],
    userName: '',
    suggestedContacts: [],
    showContactsSuggestion: false,
    suggestedJobs: [],
    showJobsSuggestion: false,
    radius: new Animated.Value(3),
    width: new Animated.Value(100),
    showProgress: false,
    progress: 0,
    success: false,
  };
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  componentDidMount() {
    this.getContacts();
    this.getUsers();
    this.getJobs();
    this.getDepartments();
    this.listUserGroups();
  }
  listUserGroups = () => {
    this.props.client
      .query({
        query: listUserGroups,
        variables: {
          filter: {
            companyId: {eq: this.props.currentUser.company.id},
            active: {eq: true},
          },
          limit: 10000,
        },
      })
      .then((res) => {
        console.log('user group res', res.data.listUserGroups);
        this.setState({userGroups: res.data.listUserGroups.items});
      });
  };
  handleUserNameChange = (val) => {
    this.setState({userName: val, selectedUser: ''}, () => {
      let matches = [];
      this.state.users.forEach((u) => {
        let fMatch =
          u.firstName && u.firstName.toLowerCase().includes(val.toLowerCase());
        let lMatch =
          u.lastName && u.lastName.toLowerCase().includes(val.toLowerCase());
        let eMatch =
          u.emailAddress &&
          u.emailAddress.toLowerCase().includes(val.toLowerCase());
        let flMatch = false;
        if (u.firstName && u.lastName) {
          let fl = u.firstName + ' ' + u.lastName;
          flMatch = fl.toLocaleLowerCase().includes(val.toLowerCase());
        }
        if (fMatch || lMatch || eMatch || flMatch) {
          matches.push(u);
        }
      });
      this.setState({
        showUsersSuggestion: matches.length ? true : false,
        suggestedUsers: matches,
      });
    });
  };
  handleJobNameChange = (val) => {
    this.setState(
      {jobTitle: val, showJobsSuggestion: true, suggestedJobs: this.state.jobs},
      () => {
        let matches = [];
        this.state.jobs.forEach((u) => {
          let fMatch =
            u.title && u.title.toLowerCase().includes(val.toLowerCase());
          if (fMatch) {
            matches.push(u);
          }
        });
        this.setState({
          showJobsSuggestion: matches.length ? true : false,
          suggestedJobs: matches,
          selectedJob: '',
        });
      },
    );
  };
  handleCandidateNameChange = (val) => {
    this.setState({name: val, selectedContact: '', email: ''}, () => {
      let matches = [];
      this.state.contacts.forEach((u) => {
        let fMatch =
          u.firstName && u.firstName.toLowerCase().includes(val.toLowerCase());
        let lMatch =
          u.lastName && u.lastName.toLowerCase().includes(val.toLowerCase());
        let eMatch =
          u.emailAddress &&
          u.emailAddress.toLowerCase().includes(val.toLowerCase());
        let flMatch = false;
        if (u.firstName && u.lastName) {
          let fl = u.firstName + ' ' + u.lastName;
          flMatch = fl.toLocaleLowerCase().includes(val.toLowerCase());
        }
        if (fMatch || lMatch || eMatch || flMatch) {
          matches.push(u);
        }
      });
      this.setState({
        showContactsSuggestion: matches.length ? true : false,
        suggestedContacts: matches,
      });
    });
  };
  createReferral = () => {
    this.props.client
      .mutate({
        mutation: gql(createReferral),
        variables: {
          input: {
            companyId: this.props.currentUser.company.id,
            contactId: this.state.selectedContact.id,
            jobId: this.state.selectedJob.id,
            message: null,
            note: null,
            referralType: 'email',
            status: 'referred',
            userId: this.state.selectedUser
              ? this.state.selectedUser.id
              : this.props.currentUser.id,
          },
        },
      })
      .then((res) => {
        console.log('create referrr', res);

        this.handleReferralSuccess();
        //showMessage({message: 'Referral added successfuly', type: 'success'});
      })
      .catch((err) => {
        showMessage({
          message: 'Something went wrong, Please try again later',
          type: 'danger',
        });
        this.setState({
          name: '',
          userName: '',
          jobTitle: '',
          selectedContact: '',
          selectedUser: '',
          selectedJob: '',
          selectedBonus: '',
        });
      });
  };
  getJobs = (token = null) => {
    this.props.client
      .query({
        query: queryJobsByCompanyIdDateIndex,
        variables: {companyId: this.props.currentUser.company.id, afer: token},
      })
      .then((res) => {
        console.log('jobs res', res);
        this.setState(
          {
            jobs: [
              ...this.state.jobs,
              ...res.data.queryJobsByCompanyIdDateIndex.items,
            ],
          },
          () => {
            if (res.data.queryJobsByCompanyIdDateIndex.nextToken) {
              this.getContacts(
                res.data.queryJobsByCompanyIdDateIndex.nextToken,
              );
            }
          },
        );
      });
  };
  getContacts = (token = null) => {
    this.props.client
      .query({
        query: gql(queryContactsByUserIdIndex),
        variables: {userId: this.props.currentUser.id, after: token},
      })
      .then((res) => {
        console.log('cotac res', res);
        this.setState(
          {
            contacts: _.sortBy(
              [
                ...this.state.contacts,
                ...res.data.queryContactsByUserIdIndex.items,
              ],
              'firstName',
            ),
          },
          () => {
            if (res.data.queryContactsByUserIdIndex.nextToken) {
              this.getContacts(res.data.queryContactsByUserIdIndex.nextToken);
            }
          },
        );
      });
  };
  getUsers = (token = null) => {
    this.props.client
      .query({
        query: ListUsers,
        variables: {
          filter: {
            companyId: {eq: this.props.currentUser.company.id},
            role: {eq: 'employee'},
          },
          limit: 10000,
          nextToken: token,
        },
      })
      .then((res) => {
        console.log('user res', res);
        this.setState(
          {
            users: _.sortBy(
              [...this.state.users, ...res.data.listUsers.items],
              'firstName',
            ),
          },
          () => {
            if (res.data.listUsers.nextToken) {
              this.getUsers(res.data.listUsers.nextToken);
            }
          },
        );
      });
  };
  getDepartments = (token = null) => {
    this.props.client
      .query({
        query: gql(listDepartments),
        variables: {
          filter: {
            companyId: {eq: this.props.currentUser.company.id},
            active: {eq: true},
          },
          limit: 1000,
          fetchPolicy: 'network-only',
          nextToken: token,
        },
      })
      .then((res) => {
        console.log('dept res', res);
        this.setState(
          {
            departments: [
              ...this.state.departments,
              ...res.data.listDepartments.items,
            ],
          },
          () => {
            if (res.data.listDepartments.nextToken) {
              this.getDepartments(res.data.listDepartments.nextToken);
            }
          },
        );
      });
  };
  createUser = () => {
    let names = this.state.userName.split(' ');
    let firstName = names[0];
    let lastName = names.length > 1 ? names.slice(1).join(' ') : '';
    let dprtsId = null;
    let dprts = (this.state.departments || []).filter(
      (element) => element.name === 'Other',
    );
    if (dprts.length > 0) {
      dprtsId = dprts[0].id;
    }
    let userGroupId = null;
    let usrGrp = (this.state.userGroups || []).filter(
      (element) => element.name === 'ERIN Free',
    );
    if (usrGrp.length > 0) {
      userGroupId = usrGrp[0].id;
    } else {
      (this.state.userGroups || []).filter(
        (element) => element.name === 'erin-admin',
      );
      if (usrGrp.length > 0) {
        userGroupId = usrGrp[0].id;
      }
    }
    console.log('user groups', this.state.userGroups);
    let input = {
      cognitoId: this.props.currentUser.id,
      companyId: this.props.currentUser.company.id,
      emailAddress: `${names.join('')}@erinfree.com`,
      role: 'employee',
      firstName,
      lastName,
      title: '',
      departmentId: dprtsId,
      avatar: null,
      lastLogin: null,
      active: true,
      createdById: this.props.currentUser.id,
      userGroupId: userGroupId,
      location: null,
      currency: 'USD',
      languageCode: null,
    };
    return this.props.client
      .mutate({
        mutation: gql(createUser),
        variables: {
          input: input,
        },
      })
      .then((res) => {
        console.log('create user res', res);
        this.setState({selectedUser: res.data.createUser});
        this.getUsers();
        return res;
      })
      .catch((err) => {
        console.log('create user err', err);
        showMessage({message: 'Something went wrong, Please try again later.'});
      });
  };
  createContact = () => {
    let names = this.state.name.split(' ');
    let firstName = names[0];
    let lastName = names.length > 1 ? names.slice(1).join(' ') : '';
    return this.props.client
      .mutate({
        mutation: gql(createContact),
        variables: {
          input: {
            firstName: firstName,
            lastName: lastName,
            emailAddress: this.state.email,
            userId: this.props.currentUser.id,
            companyId: this.props.currentUser.company.id,
          },
        },
      })
      .then((res) => {
        console.log('create contact res', res);
        this.setState({selectedContact: res.data.createContact});
        this.getContacts();
        return res;
      })
      .catch((err) => console.log('create contact err', err));
  };
  createJob = () => {
    return this.props.client
      .mutate({
        mutation: gql(createJob),
        variables: {
          input: {
            companyId: this.props.currentUser.company.id,
            createdById: this.props.currentUser.id,
            departmentId: 'erin-admin',
            description:
              'THIS IS AUTO GENERATED JOB DESCRIPTION. PLEASE ALTER THE DESCRIPTION',
            hiringManagerId: this.props.currentUser.id,
            jobType: 'fulltime',
            lat: null,
            lng: null,
            location: JSON.stringify({city: null, state: null, isRemote: true}),
            notificationType: 'ALL',
            publicLink: null,
            referralBonus: JSON.stringify({
              hasBonus: true,
              tieredBonusId: this.state.selectedBonus.id,
            }),
            salary: JSON.stringify({from: '', to: '', interval: null}),
            shares: 0,
            status: 'open',
            title: this.state.jobTitle,
            views: 0,
          },
        },
      })
      .then((res) => {
        console.log('create job res', res);
        this.setState({selectedJob: res.data.createJob});
        return res;
      })
      .catch((err) => console.log('create job err', err));
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
    this.setState({showProgress: true, progress: 80}, () => {
      this.circularProgress.animate(this.state.progress, 1000, Easing.quad);
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

  handleReferralSuccess = () => {
    this.setState({progress: 100}, () =>
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
      setTimeout(
        () =>
          this.setState({
            modalVisible: false,
            name: '',
            userName: '',
            jobTitle: '',
            selectedContact: '',
            selectedUser: '',
            selectedJob: '',
            selectedBonus: '',
            success: false,
            email: '',
          }),
        1000,
      ),
    );
  };
  handleSubmit = async () => {
    if (this.fieldsValidator()) {
      this.shrinkAnimation();
      //showMessage({message: 'Creating Referral', type: 'info'});
      if (!this.state.selectedContact) await this.createContact();
      if (!this.state.selectedJob) await this.createJob();
      if (!this.state.selectedUser) await this.createUser();
      this.createReferral();
    }
  };
  fieldsValidator = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.state.name) {
      alert('Please enter Candidate name.');
      return false;
    }
    if (!re.test(this.state.email.toLowerCase())) {
      alert('Please enter valid email');
      return false;
    }
    if (!this.state.userName) {
      alert('Please select Referring Employee');
      return false;
    }
    if (!this.state.jobTitle) {
      alert('Please mention a job');
      return false;
    }
    if (!this.state.selectedJob) {
      if (!this.state.selectedBonus) {
        alert('Please select a bonus');
        return false;
      }
    }
    return true;
  };
  render() {
    let {
      company: {symbol, theme},
    } = this.props.currentUser;
    theme = theme ? JSON.parse(theme) : {};
    let width = this.props.width;
    return (
      <View>
        {width > 450 ? (
          <TouchableOpacity
            onPress={() => this.setState({modalVisible: true})}
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
              Add Referral
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => this.setState({modalVisible: true})}
            style={[
              styles.button,
              this.props.style,
              {
                height: 42,
                width: '99.5%',
                alignSelf: 'center',
                backgroundColor: theme.enabled
                  ? theme.addButtonColor
                  : COLORS.red,
              },
            ]}>
            {/* <Icon name="user" color={COLORS.white} /> */}
            <Text style={{color: 'white', fontSize: 18}}>Add Referral</Text>
          </TouchableOpacity>
        )}

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
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}></View>
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
                      Add Referral
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: COLORS.lightGray,
                        textAlign: 'center',
                      }}>
                      Start typing on employee or job name to select an existing
                      record or to create a new entry.
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({modalVisible: false});
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
                <View style={{padding: 10, paddingBottom: 5}}>
                  <Text style={{fontWeight: 'bold'}}>
                    Select or Create a Candidate
                  </Text>
                  <TextInput
                    style={Styles.input}
                    placeholder={'Enter Candidate Name'}
                    value={this.state.name}
                    onChangeText={(val) => this.handleCandidateNameChange(val)}
                    onFocus={() => {
                      this.setState({
                        showContactsSuggestion: true,
                        suggestedContacts: this.state.contacts,
                      });
                    }}
                  />
                  {this.state.showContactsSuggestion &&
                  this.state.suggestedContacts &&
                  this.state.suggestedContacts.length ? (
                    <ScrollView
                      style={{
                        maxHeight: 100,
                        borderWidth: 1,
                        borderColor: '#d9d9d9',
                      }}
                      nestedScrollEnabled={true}>
                      {this.state.suggestedContacts.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={{padding: 10}}
                          onPress={() => {
                            this.setState({
                              name: `${item.firstName} ${item.lastName}`,
                              showContactsSuggestion: false,
                              selectedContact: item,
                              email: item.emailAddress,
                            });
                          }}>
                          <Text>{`${item.firstName} ${item.lastName}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}

                  <TextInput
                    style={Styles.input}
                    placeholder={'Email'}
                    value={this.state.email}
                    onChangeText={(val) => this.setState({email: val})}
                    editable={this.state.selectedContact ? false : true}
                  />
                  <Text style={{fontWeight: 'bold', marginTop: 5}}>
                    Referring Employee
                  </Text>
                  <TextInput
                    style={Styles.input}
                    placeholder={'Enter Employee Name'}
                    value={this.state.userName}
                    onChangeText={(val) => this.handleUserNameChange(val)}
                    onFocus={() =>
                      this.setState({
                        showUsersSuggestion: true,
                        suggestedUsers: this.state.users,
                      })
                    }
                  />
                  {this.state.showUsersSuggestion &&
                  this.state.suggestedUsers &&
                  this.state.suggestedUsers.length ? (
                    <ScrollView
                      style={{
                        maxHeight: 100,
                        borderWidth: 1,
                        borderColor: '#d9d9d9',
                      }}
                      nestedScrollEnabled={true}>
                      {this.state.suggestedUsers.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={{padding: 10}}
                          onPress={() => {
                            this.setState({
                              userName: `${item.firstName} ${item.lastName}`,
                              showUsersSuggestion: false,
                              selectedUser: item,
                            });
                          }}>
                          <Text>{`${item.firstName} ${item.lastName}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}
                  <Text style={{fontWeight: 'bold', marginTop: 5}}>Job</Text>
                  <TextInput
                    style={Styles.input}
                    placeholder={'Enter Job Title'}
                    value={this.state.jobTitle}
                    onChangeText={(val) => this.handleJobNameChange(val)}
                    onFocus={() => {
                      this.setState({
                        suggestedJobs: this.state.jobs,
                        showJobsSuggestion: true,
                      });
                    }}
                  />
                  {this.state.showJobsSuggestion &&
                  this.state.suggestedJobs &&
                  this.state.suggestedJobs.length ? (
                    <ScrollView
                      style={{
                        maxHeight: 100,
                        borderWidth: 1,
                        borderColor: '#d9d9d9',
                      }}
                      nestedScrollEnabled={true}>
                      {this.state.suggestedJobs.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={{padding: 10}}
                          onPress={() => {
                            this.setState({
                              jobTitle: `${item.title}`,
                              showJobsSuggestion: false,
                              selectedJob: item,
                            });
                          }}>
                          <Text>{`${item.title}`}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : null}
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginTop: 5,
                      color:
                        !this.state.selectedJob && this.state.jobTitle
                          ? 'black'
                          : COLORS.lightGray3,
                    }}>
                    Bonus
                  </Text>
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          bonusPop:
                            !this.state.selectedJob && this.state.jobTitle
                              ? true
                              : false,
                        })
                      }
                      style={[
                        Styles.input,
                        this.state.selectedJob && {
                          borderColor: COLORS.lightGray3,
                        },
                      ]}>
                      {this.state.selectedBonus ? (
                        <Text style={{textTransform: 'capitalize'}}>
                          {this.state.selectedJob
                            ? this.state.selectedJob.referralBonus
                              ? this.state.selectedJob.referralBonus.amount
                                ? this.state.selectedJob.referralBonus.amount
                                : 0
                              : 0
                            : this.state.selectedBonus.name}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                    {this.state.bonusPop && (
                      <TouchableOpacity
                        onPress={() => this.setState({bonusPop: false})}
                        style={{
                          position: 'absolute',
                          bottom: -0,
                          height: 300,
                          width: '100%',
                        }}>
                        <ScrollView
                          nestedScrollEnabled={true}
                          style={[
                            Styles.absoluteView,
                            {
                              width: '80%',
                              alignSelf: 'flex-start',
                            },
                          ]}>
                          <View style={{padding: 10}}>
                            <CreateBonus
                              theme={theme}
                              userGroups={this.state.userGroups}
                              currentUser={this.props.currentUser}
                              getBonus={this.props.getBonus}
                            />
                          </View>
                          {this.props.bonuses && this.props.bonuses.length ? (
                            this.props.bonuses.map((el) => (
                              <TouchableOpacity
                                onPress={() => {
                                  this.setState({
                                    bonusPop: false,
                                    selectedBonus: el,
                                  });
                                }}
                                style={{padding: 10}}>
                                <Text style={{textTransform: 'capitalize'}}>
                                  {el.name}
                                </Text>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <TouchableOpacity
                              style={{padding: 10}}
                              onPress={() => this.setState({bonusPop: false})}>
                              <Text>No Bonuses available</Text>
                            </TouchableOpacity>
                          )}
                        </ScrollView>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* {this.state.selectedJob &&
                  this.state.selectedJob.referralBonus ? null : (
                    <CreateBonus
                      theme={theme}
                      userGroups={this.state.userGroups}
                      currentUser={this.props.currentUser}
                      getBonus={this.props.getBonus}
                    />
                  )} */}

                  <View
                    style={{
                      marginHorizontal: '2%',
                      width: '96%',
                      justifyContent: 'center',
                    }}>
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
                          style={{width: '100%', alignItems: 'center'}}
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

                    {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
            </Button> */}
                    {/* <Button style={styles.SubmitBtn} onPress={this.handleSubmit}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
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
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'gray',
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

export default withApollo(AddReferral);
