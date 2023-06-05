import React, {Component} from 'react';
import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../styles/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
//import DocumentPicker from 'react-native-document-picker';
import ZocialIcon from 'react-native-vector-icons/Zocial';
import {List, Button, TextareaItem} from '@ant-design/react-native';
import {showMessage, hideMessage} from 'react-native-flash-message';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../services/language-manager';
import {Dropdown} from 'react-native-material-dropdown';
let {width} = Dimensions.get('window');
//import Toast from 'react-native-toast-native';

class AddEmployee extends Component {
  state = {
    employeeModal: false,
    file: '',
    value: '',
    role: 'Employee',
  };
  handleFilePick = () => {
    DocumentPicker.pick().then((res) => {
      this.setState({file: res});
    });
  };
  handleSubmit = () => {
    this.inviteUser();
  };

  inviteUser = () => {
    if (this.state && this.state.value) {
      const lines = this.state.value.split(/[\n]+/);
      users = lines.map((l) => {
        const tokens = l.split(/[,]/);
        let emailAddress,
          firstName,
          lastName,
          title,
          deptName,
          userGroupName,
          departmentId = null,
          userGroupId = null,
          usrGrp = '';
        if (tokens.length > 0) {
          emailAddress = tokens[0].trim();
          usrGrp = this.props.userGroups.filter(
            (element) => element.name === 'Default',
          );
          if (usrGrp.length > 0) {
            userGroupId = usrGrp[0].id;
          }
          if (!this.isEmail(emailAddress)) {
            alert('Invalid Email');
            return;
          }
        }
        if (tokens.length > 1) {
          firstName = tokens[1].trim();
        }
        if (tokens.length > 2) {
          lastName = tokens[2].trim();
        }
        if (tokens.length > 3) {
          title = tokens[3].trim();
        }
        if (tokens.length > 4) {
          deptName = tokens[4].trim();
          const dept = this.props.departments.filter(
            (element) => element.name.toLowerCase() === deptName.toLowerCase(),
          );
          if (dept.length > 0) {
            departmentId = dept[0].id;
          }
        }
        if (tokens.length > 5) {
          userGroupName = tokens[5].trim();
          usrGrp = '';
          userGroupId = null;
          usrGrp = this.props.userGroups.filter(
            (element) =>
              element.name.toLowerCase() === userGroupName.toLowerCase(),
          );
          if (usrGrp.length > 0) {
            userGroupId = usrGrp[0].id;
          } else {
            usrGrp = this.props.userGroups.filter(
              (element) => element.name === 'Default',
            );
            if (usrGrp.length > 0) {
              userGroupId = usrGrp[0].id;
            }
          }
        }
        return {
          emailAddress,
          firstName,
          lastName,
          title,
          departmentId,
          userGroupId,
        };
      });
      fetch(
        'https://bbh6ooqu3e.execute-api.us-east-2.amazonaws.com/default/invite',
        //'https://fyx7mq5rp6.execute-api.us-east-2.amazonaws.com/default/dev-invite',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify({
            createdById: this.props.currentUser.id,
            users: users,
            companyId: this.props.currentUser.companyId,
            role: this.state.role.toLowerCase(),
          }),
        },
      )
        .then((res) => res.json())
        .then((json) => {
          this.props.getAllUsers();
          this.setState(
            {employeeModal: false, file: '', value: '', role: 'Employee'},
            () => {},
          );
          setTimeout(() => {
            // Toast.show('Invitation sent', Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.dashboardGreen,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
              message: 'Invitation sent',
              type: 'success',
            });
          }, 1000);
        });
    } else {
      alert('Please input valid details');
    }
  };

  isEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
            onPress={() => this.setState({employeeModal: true})}
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
              {customTranslate('ml_AddEmployee')}{' '}
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
            onPress={() => this.setState({employeeModal: true})}>
            <Text style={{color: 'white', fontSize: 18}}>
              {customTranslate('ml_AddEmployee')}
            </Text>
            <Icons
              name="ios-add-circle-outline"
              color="#fff"
              size={22}
              style={{marginLeft: 5}}
            />
          </TouchableOpacity>
        )}

        <Modal visible={this.state.employeeModal} transparent>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '95%',
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 10,
                marginTop: 15,
                paddingBottom: 15,
                maxWidth: 450,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 7}}>
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: 'bold',
                      color: COLORS.darkGray,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    {customTranslate('ml_InvitePeople')}{' '}
                    {this.props.currentUser.company.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 5,
                    flex: 1,
                    alignItems: 'flex-end',
                  }}
                  onPress={() => {
                    this.setState({
                      employeeModal: false,
                      file: '',
                      value: '',
                      role: 'Employee',
                    });
                  }}>
                  <Icons name="ios-close" size={40} color="#8f99a2"></Icons>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: COLORS.grayMedium,
                  textAlign: 'center',
                }}>
                {customTranslate('ml_AddEmployees')}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: COLORS.grayMedium,
                  textAlign: 'center',
                }}>
                {customTranslate('ml_EnterOneEmailAddress')}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 15,
                  alignItems: 'center',
                  width: '100%',
                }}>
                <Text style={{fontSize: 12, color: COLORS.grayMedium, flex: 1}}>
                  {customTranslate('ml_SelectRole')}
                </Text>
                <View style={{width: 100}}>
                  <Dropdown
                    label="Favorite Fruit"
                    onChangeText={(val) => this.setState({role: val})}
                    data={[
                      {
                        value: 'Employee',
                      },
                      {
                        value: 'Admin',
                      },
                    ]}
                    renderBase={() => (
                      <View
                        style={{
                          borderRadius: 5,
                          borderWidth: 0.5,
                          borderColor: COLORS.grayMedium,
                          paddingVertical: 3,
                          paddingHorizontal: 5,
                          flexDirection: 'row',
                          marginLeft: 8,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text>{this.state.role}</Text>
                        <IonIcon
                          name={'md-arrow-dropdown'}
                          size={20}
                          color="black"
                          style={{}}
                        />
                      </View>
                    )}
                  />
                </View>
              </View>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: COLORS.grayMedium,
                  padding: 5,
                  minHeight: 40,
                  marginBottom: 5,
                }}
                multiline
                textAlignVertical="top"
                returnKeyType="next"
                value={this.state.value}
                onChangeText={(val) => this.setState({value: val})}
              />
              <Text style={{fontSize: 11, color: COLORS.grayMedium}}>
                {customTranslate('ml_YouCanAlso')}:{' '}
                <Text style={{fontWeight: '600'}}>{customTranslate('ml_EmailEtc')}</Text>
              </Text>
              {/* <Text
                style={{
                  fontSize: 12,
                  color: COLORS.grayMedium,
                  marginTop: 10,
                  textAlign: 'center',
                }}
              >
                Or{' '}
                <Text
                  style={{ color: COLORS.blue, fontWeight: '600' }}
                  onPress={this.handleFilePick}
                >
                  click here
                </Text>{' '}
                to upload a .csv file.
              </Text> */}
              {this.state.file ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                  <EntypoIcon
                    name="attachment"
                    size={18}
                    color={COLORS.lightGray}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      color: COLORS.grayMedium,
                      marginLeft: 3,
                    }}>
                    {this.state.file.name}
                  </Text>
                </View>
              ) : null}

              {/* <TouchableOpacity
                style={{
                  backgroundColor: COLORS.red,
                  borderRadius: 5,
                  paddingVertical: 5,
                  flexDirection: 'row',
                  justifyContent: 'center'

                }}
              >
                <Text style={{}}>Invite</Text>
                <ZocialIcon name="email" color="#fff" />
              </TouchableOpacity> */}
              <Button
                style={{
                  backgroundColor: COLORS.blue,
                  marginTop: 10,
                }}
                onPress={this.handleSubmit}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 20,
                    fontWeight: '300',
                  }}>
                  {customTranslate('ml_Invite')}{' '}
                </Text>
                {/* <ZocialIcon name="email" color="#fff" size={23} /> */}
              </Button>
            </View>
          </SafeAreaView>
        </Modal>
      </React.Fragment>
    );
  }
}

export default AddEmployee;
