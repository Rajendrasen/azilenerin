import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { COLORS } from '../../_shared/styles/colors';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { withApollo } from 'react-apollo';
import Icons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import gql from 'graphql-tag';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import { showMessage } from 'react-native-flash-message';
let updateUserQuery = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      accountClaimId
      companyId
      emailAddress
      employeeId
      role
      userGroupId
      firstName
      lastName
      title
      avatar {
        bucket
        region
        key
        __typename
      }
      departmentId
      lastLogin
      lastNotificationCheck
      incentiveEligible
      totalReferrals
      active
      connectedApps
      createdById
      location
      currency
      languageCode
      dateFormat
      __typename
    }
  }
`;
let getUserQuery = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      careerProfile
      accountClaimId
      companyId
      departmentId
      department {
        id
        name
        __typename
      }
      emailAddress
      role
      userGroupId
      firstName
      lastName
      title
      avatar {
        bucket
        key
        region
        __typename
      }
      active
      connectedApps
      incentiveEligible
      location
      currency
      languageCode
      dateFormat
      isAllowJobNotification
      __typename
    }
  }
`;
export class CareerProfile extends Component {
  state = {
    width: Dimensions.get('window').width,
    user: '',
    careerProfile: '',
    addSkillModal: false,
    skillInput: '',
    addWorkHistoryModel: false,
    workHistoryPosition: '',
    workHistoryCompany: '',
    workHistoryStartDate: '',
    workHistoryEndDate: '',
    workHistoryDescription: '',



  };
  componentDidMount() {
    this.getUser();
  }
  updateUser = (input) => {
    console.log('input', input);
    return this.props.client
      .mutate({
        mutation: updateUserQuery,
        variables: {
          input: {
            id: this.props.currentUser.id,
            careerProfile: JSON.stringify(input),
          },
        },
      })
      .then((res) => {
        this.setState({ careerProfile: input });
        // console.log('update user res', res);

        return res;
      })
      .catch((err) => {
        this.setState({ addSkillModal: false });
      });
  };
  handleAddSkill = () => {
    if (!this.state.skillInput) {
      alert('Please add a skill');
      return;
    }
    let careerProfile = { ...this.state.careerProfile };
    let skills = [...careerProfile.skills];
    skills.push(this.state.skillInput);
    careerProfile.skills = skills;
    this.updateUser(careerProfile).then((res) => {
      showMessage({
        message: 'Adding Skill...',
        type: 'success',
      });
      this.setState({ addSkillModal: false, skillInput: '' });
    });
  };
  handleRemoveSkill = (i) => {
    let careerProfile = { ...this.state.careerProfile };
    let skills = [...careerProfile.skills];
    skills.splice(i, 1);
    careerProfile.skills = skills;
    this.updateUser(careerProfile).then((res) => {
      showMessage({
        message: 'Removing Skill...',
        type: 'info',
      });
    });
  };
  handleAddJob = () => {
  const body ={
    "current": true,
    "title": this.state.workHistoryPosition,
    "name": this.state.workHistoryCompany,
    "description":this.state.workHistoryDescription,
    "end":{
      "month":moment(this.state.workHistoryEndDate).month(),
      "year":moment(this.state.workHistoryEndDate).year(),
      "fullString": moment(this.state.workHistoryEndDate).format("YYYY-MM-DD"),
      "monthName": moment(this.state.workHistoryEndDate).format("MMMM"),
      "current":true
    },
     "start":{
       "month":moment(this.state.workHistoryEndDate).month(),
       "year":moment(this.state.workHistoryStartDate).year(),
       "fullString": moment(this.state.workHistoryEndDate).format("YYYY-MM-DD"),
       "monthName":moment(this.state.workHistoryStartDate).format("MMMM")
      }
  }
    console.log("body is ::", body)
    let careerProfile = { ...this.state.careerProfile };
    let jobAdd = [...careerProfile.employment];
    jobAdd.push(body);
    careerProfile.employment = jobAdd;
    this.updateUser(careerProfile).then((res) => {
      showMessage({
        message: 'Adding Job...',
        type: 'success',
      });
      this.setState({ addWorkHistoryModel: false });
    });

  };
  getUser = () => {
    this.props.client
      .query({
        query: getUserQuery,
        variables: { id: this.props.currentUser.id },
        fetchPolicy: 'network-only',
      })
      .then((res) => {
        this.setState({
          user: res.data.getUser,
          careerProfile: JSON.parse(res.data.getUser.careerProfile),
        });
      });
  };
  render() {
    console.log(this.state.careerProfile);
    const { currentUser } = this.props;
    let {
      company: { theme },
    } = currentUser;
    theme = theme ? JSON.parse(theme) : {};
    let { width, careerProfile } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            height: 42,
            width: width > 450 ? 'auto' : '99.5%',
            borderRadius: 3,
            alignSelf: width > 450 ? 'flex-start' : 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              width <= 450
                ? theme.enabled
                  ? theme.addButtonColor
                  : COLORS.red
                : 'transparent',
            borderWidth: this.props.referContact ? 1 : 0,
            borderColor: COLORS.buttonGrayOutline,
          }}
          onPress={async () => {
            // console.log('sld');
            try {
              const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
              });
              // console.log(
              //   res.uri,
              //   res.type, // mime type
              //   res.name,
              //   res.size,
              // );
              showMessage({ message: 'Uploading Resume', type: 'success' });
            } catch (err) {
              if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
              } else {
                throw err;
              }
            }
          }}>
          {width > 450 && (
            <AntIcon
              style={{ marginRight: 5, marginTop: 3 }}
              size={35}
              color={COLORS.red}
              name="pluscircle"
            />
          )}
          <Text
            style={{
              color:
                width > 450
                  ? COLORS.darkGray
                  : this.props.referContact
                    ? COLORS.buttonGrayText
                    : 'white',
              fontSize: this.props.referContact ? 14 : 18,
              textAlign: 'center',
              fontWeight: width > 450 ? 'bold' : 'normal',
            }}>
            Import Resume{' '}
          </Text>
          {width <= 450 && (
            <Icons
              name="ios-add-circle-outline"
              color="#fff"
              size={23}
              style={{ marginLeft: 2 }}
            />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1, padding: 5 }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              padding: 5,
              maxHeight: 160,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 5,
              }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Skills</Text>
              <Text
                onPress={() => this.setState({ addSkillModal: true })}
                style={{ color: COLORS.blue }}>
                + Add Skill
              </Text>
            </View>
            {careerProfile.skills && careerProfile.skills.length && (
              <ScrollView>
                <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                  {careerProfile.skills.map((skill, i) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: COLORS.lightGreen,
                        padding: 5,
                        margin: 2,
                      }}>
                      <Text style={{ marginRight: 5 }}>{skill}</Text>
                      <AntIcon
                        size={15}
                        name="close"
                        color={COLORS.dashboardGreen}
                        onPress={() => this.handleRemoveSkill(i)}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 5,
              padding: 5,
              marginTop: 10,
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                Work History
              </Text>
              <Text style={{ color: COLORS.blue }} onPress={() => this.setState({ addWorkHistoryModel: true })}>+ Add Work History</Text>
            </View>
            {careerProfile.employment && careerProfile.employment.length && (
              <ScrollView>
                {careerProfile.employment.filter(emp=>emp).map((emp, i) => (
                  <View
                    style={{
                      borderBottomColor: COLORS.lightGray,
                      borderBottomWidth: 0.5,
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={{
                        color: COLORS.buttonGrayText,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>title
                      {/* {emp.title} */}
                    </Text>
                    <Text style={{ marginTop: 2 }}>{emp.name}</Text>
                    <Text style={{ marginTop: 2 }}>
                      {emp['start.year']} - {emp['end.year']}
                    </Text>
                    <Text
                      style={{
                        marginTop: 8,
                        color: COLORS.grayMedium,
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      Description
                    </Text>
                    <Text style={{ marginTop: 1 }}>{emp.description || '-'}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <Modal transparent visible={this.state.addSkillModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '90%',
                alignSelf: 'center',
                borderRadius: 5,
              }}>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 5, alignItems: 'center' }}>
                  <Text style={{ fontSize: 19, color: COLORS.darkGray }}>
                    Add Skill
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                  <AntIcon
                    name="close"
                    size={23}
                    color={COLORS.grayMedium}
                    onPress={() =>
                      this.setState({ addSkillModal: false, skillInput: '' })
                    }
                  />
                </View>
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.grayMedium,
                  height: 30,
                  margin: 10,
                  padding: 2,
                }}
                value={this.state.skillInput}
                onChangeText={(val) => this.setState({ skillInput: val })}
              />
              <TouchableOpacity
                onPress={this.handleAddSkill}
                style={{
                  backgroundColor: COLORS.blue,
                  height: 35,
                  marginHorizontal: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontSize: 17 }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal transparent visible={this.state.addWorkHistoryModel}>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                width: '93%',
                alignSelf: 'center',
                borderRadius: 5,
              }}>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 5, alignItems: 'center' }}>
                  <Text style={{ fontSize: 19, color: COLORS.darkGray }}>
                    Add Job
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
                  <AntIcon
                    name="close"
                    size={23}
                    color={COLORS.grayMedium}
                    onPress={() =>
                      this.setState({ addWorkHistoryModel: false, })
                    }
                  />
                </View>
              </View>
              <View style={{ height: 55, flexDirection: 'row', marginTop: 17 }}>

                <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
                  <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                    Position
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.grayMedium,
                      height: 35,
                      paddingLeft: 6,
                      borderRadius:3
                    }}
                    placeholder={"Position"}
                    placeholderTextColor={"#9E9E9E"}
                    value={this.state.workHistoryPosition}
                    onChangeText={(val) => this.setState({ workHistoryPosition: val })}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
                  <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                    Company
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.grayMedium,
                      height: 35,
                      paddingLeft: 6,
                      borderRadius:3
                    }}
                    placeholder={"Company"}
                    placeholderTextColor={"#9E9E9E"}
                    value={this.state.workHistoryCompany}
                    onChangeText={(val) => this.setState({ workHistoryCompany: val })}
                  />
                </View>
              </View>

              <View style={{ height: 55, flexDirection: 'row', marginTop: 9 }}>

                <View style={{ flex: 1, marginLeft: 7, marginRight: 7 }}>
                  <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                    Start Date
                 </Text>
                 <DatePicker
                    style={{width: 155}}
                    date={this.state.workHistoryStartDate}
                    mode="date"
                    placeholder="Select start date"
                    format="YYYY-MM-DD"
                    minDate={moment().format('YYYY-MM-DD')}
                    //maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 0.2,
                        marginLeft: 0,
                        width:0,
                        height:0
                      },
                      dateInput: {
                        // marginLeft: 10,
                        backgroundColor: 'white',
                        height: 33,
                        borderRadius: 3,
                        borderColor:'#000',
                        // justifyContent:'flex-start'
                        alignItems:'flex-start',
                        paddingLeft:6
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({
                        workHistoryStartDate: moment(date, 'YYYY-MM-DD'),
                      });
                    }}
                  /> 
                </View>

                <View style={{ flex: 1, marginRight: 7 }}>
                  <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                    End Date
                </Text>
                 <DatePicker
                    style={{width: 155}}
                    date={this.state.workHistoryEndDate}
                    mode="date"
                    placeholder="Select end date"
                    format="YYYY-MM-DD"
                    minDate={moment().format('YYYY-MM-DD')}
                    //maxDate="2016-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 0.2,
                        marginLeft: 0,
                        width:0,
                        height:0
                      },
                      dateInput: {
                        // marginLeft: 36,
                        backgroundColor: 'white',
                        height: 33,
                        borderRadius: 3,
                        borderColor:'#000', 
                        alignItems:'flex-start',
                        paddingLeft:6
                      },
                    }}
                    onDateChange={(date) => {
                      this.setState({
                        workHistoryEndDate: moment(date, 'YYYY-MM-DD'),
                      });
                    }}
                  /> 
                </View>
              </View>

              <Text style={{ fontSize: 16, color: COLORS.darkGray, marginLeft: 6,marginTop:10 }}>
                Description
                </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: COLORS.grayMedium,
                  height: 65,
                  marginLeft: 6,
                  marginRight: 6,
                  // marginTop: 4,
                // padding:2

                }}
                placeholder={"Description"}
                placeholderTextColor={"#9E9E9E"}
                numberOfLines={3}
                multiline={true}
    
                value={this.state.workHistoryDescription}
                onChangeText={(val) => this.setState({workHistoryDescription: val})}
              />
              <View style={{ flexDirection:'row',marginTop:26,paddingBottom:11  }}>
              <TouchableOpacity
                onPress={()=>{
                  this.setState({addWorkHistoryModel:false})
                }}
                style={{
                  borderColor: COLORS.black,
                  borderWidth:.7,
                  height: 35,
                  marginHorizontal: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex:1
                }}>
                <Text style={{ color: '#000', fontSize: 17 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.handleAddJob}
                style={{
                  backgroundColor: COLORS.blue,
                  height: 35,
                  marginHorizontal: 10,
                  marginBottom: 5,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex:1

                }}>
                <Text style={{ color: 'white', fontSize: 17 }}>Submit</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withApollo(CareerProfile);
