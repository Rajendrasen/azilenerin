import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Modal,
    TextInput,
    Platform,
    Image
} from 'react-native';
import { COLORS } from '../../_shared/styles/colors';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { withApollo } from 'react-apollo';
import Icons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import gql from 'graphql-tag';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { nf, wpx, hpx } from '../../_shared/constants/responsive';
import { showMessage } from 'react-native-flash-message';
import { get, keys } from 'lodash';
import { customTranslate } from '../../_shared/services/language-manager';
import { GetUserByCognitoId } from '../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
import { updateUser } from '../../_store/_shared/api/graphql/custom/users/updateUser.graphql';
import { getAppName } from '../../WhiteLabelConfig';
const { width, height } = Dimensions.get('window');

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
        edit: false,
        editIndex: '',
        testState: false,
        openToNewRole: this.props.currentUser.openToNewRole,
        openToNewRoleText: "Erin",
        index: 0
    };
    componentDidMount() {
        //console.log("openToNewRole", this.props.currentUser.openToNewRole)
        // this.getUserByCognitoId()
        this.getUser();
        this.handleRoleText();
    }

    componentDidUpdate(prevProps) {
        // console.log("OPEN TO NEW ROLE", prevProps?.currentUser?.openToNewRole, this.state.openToNewRole)
        if (prevProps?.currentUser?.openToNewRole !== this.props.currentUser.openToNewRole) {
            this.setState({ openToNewRole: this.props.currentUser.openToNewRole })
        }
        else {
            // console.log("prevProps");
            // this.setState({ index: Math.random() })
            // this.setState({ openToNewRole: this.props.currentUser.openToNewRole })
        }
    }

    updateUser = (input) => {
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
    updateUserForRole = (value) => {
        console.log({
            id: this.props.currentUser.id,
            openToNewRole: value
        })
        return this.props.client
            .mutate({
                mutation: gql(updateUser),
                variables: {
                    input: {
                        id: this.props.currentUser.id,
                        openToNewRole: value
                    },
                },
            })
            .then((res) => {
                console.log("response of update", res)
            })
            .catch((err) => {
                //this.setState({ addSkillModal: false });
            });
    };



    handleAddSkill = () => {
        if (!this.state.skillInput) {
            alert('Please add a skill');
            return;
        }
        // console.log("career profile", this.state.careerProfile);
        let careerProfile = {}
        let skills = []
        if (this.state.careerProfile) {
            careerProfile = { ...this.state.careerProfile };
            skills = [...careerProfile?.skills];
            skills.push(this.state.skillInput);
            careerProfile.skills = skills;
        }
        else {
            skills.push(this.state.skillInput);
            careerProfile.skills = skills;
        }


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
        const body = {
            current: true,
            title: this.state.workHistoryPosition,
            name: this.state.workHistoryCompany,
            description: this.state.workHistoryDescription,
            end: {
                month: moment(this.state.workHistoryEndDate).month(),
                year: moment(this.state.workHistoryEndDate).year(),
                fullString: moment(this.state.workHistoryEndDate).format('YYYY-MM-DD'),
                monthName: moment(this.state.workHistoryEndDate).format('MMMM'),
                current: true,
            },
            start: {
                month: moment(this.state.workHistoryEndDate).month(),
                year: moment(this.state.workHistoryStartDate).year(),
                fullString: moment(this.state.workHistoryEndDate).format('YYYY-MM-DD'),
                monthName: moment(this.state.workHistoryStartDate).format('MMMM'),
            },
        };
        let careerProfile = {}
        let jobAdd = []

        if (this.state.careerProfile) {
            // console.log("carrer profile", this.state.careerProfile)
            careerProfile = { ...this.state.careerProfile };
            if ('employment' in careerProfile) {
                jobAdd = [...careerProfile?.employment];
            }

            jobAdd = jobAdd.filter((item) => item);
        }
        else {
            jobAdd = jobAdd.filter((item) => item);
        }


        if (this.state.edit) {
            jobAdd[this.state.editIndex] = body;
        } else {
            jobAdd.push(body);
        }
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
                    careerProfile: JSON.parse(get(res, 'data.getUser.careerProfile', {})),
                });
            });
    };

    getUserByCognitoId = () => {
        console.log("This is a here 3")
        try {
            this.props.client
                .query({
                    query: GetUserByCognitoId,
                    variables: {
                        cognitoId: this.props.currentUser.cognitoId,
                    },
                }).then((res) => console.log("new res", res))
        } catch (error) {
            console.log("Error", error.message)
        }
        // this.props.client.query({
        //     query: GetUserByCognitoId,
        //     variables: { cognitoId: user.cognitoId },
        // });
    }

    onUpdateUser(value) {
        console.log("This is a here 2")

        const userInput = {
            input: {
                openToNewRole: value,
                id: get(this.props.currentUser, 'id'),
            },
        };
        let url = 'https://mrg923zyv4.execute-api.us-east-2.amazonaws.com/default/extended-network-update-matches-prod-api';
        fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ id: get(this.props.currentUser, 'id') }),
        }).then(
            (response) => {
                console.log("response", response)
                this.updateUserForRole(value)
            }
        )
        // console.log(this.props.onUpdateDepartment());
        this.updateUserForRole(value)
        this.props.updateCurrentUser(userInput.input);
        this.getUserByCognitoId()

    }

    handleOpenRoles = (value) => {
        console.log("This is a here 1")
        this.onUpdateUser(value)
    }


    handleRoleText = () => {
        let appName = getAppName()
        switch (appName) {
            case 'erin':
                this.setState({ openToNewRoleText: this.props.currentUser?.company?.name })
                break
            case 'pinterest':
                this.setState({ openToNewRoleText: 'Pinterest' })
                break
            case 'primaryaim':
                this.setState({ openToNewRoleText: 'Primary Aim' })
                break
            case 'sunrise':
                this.setState({ openToNewRoleText: 'Sunrise' })
                break
            case 'allied':
                this.setState({ openToNewRoleText: 'Allied Universal' })
                break
            case 'trinity':
                this.setState({ openToNewRoleText: 'Trinity' })
                break
            case 'sevita':
                this.setState({ openToNewRoleText: 'Sevita' })
                break
            case 'heartland':
                this.setState({ openToNewRoleText: 'Heartland' })
                break
            case 'talentreef':
                this.setState({ openToNewRoleText: 'Talent Reef' })
                break
            case 'referCX':
                this.setState({ openToNewRoleText: 'Refer CX' })
                break
            case 'seaworld':
                this.setState({ openToNewRoleText: 'Seaworld' })
                break
            case 'ReferVets':
                this.setState({ openToNewRoleText: 'Refer Vets' })
                break
            case 'Apploi':
                this.setState({ openToNewRoleText: 'Apploi' })
                break
            case 'Twilio':
                this.setState({ openToNewRoleText: 'Twillio' })
                break
            case 'GoDaddy':
                this.setState({ openToNewRoleText: 'GoDaddy' })
                break
            case 'IQVIA':
                this.setState({ openToNewRoleText: 'IQVIA' })
                break
            case 'VILIVING':
                this.setState({ openToNewRoleText: 'VILIVING' })
                break
            case 'heartlandAffiliation':
                this.setState({ openToNewRoleText: 'HeartLand Affliation' })
                break
            case 'northWestReferrals':
                this.setState({ openToNewRoleText: 'NorthWest Referrals' })
                break
            case 'gannettFleming':
                this.setState({ openToNewRoleText: 'Gannett Fleming' })
                break
            case 'mscReferrals':
                this.setState({ openToNewRoleText: 'MSC' })
                break
            default:
                this.setState({ openToNewRoleText: this.props.currentUser?.company?.name })
                break
        }
    }

    render() {
        const { currentUser } = this.props;
        let {
            company: { theme },
        } = currentUser;
        theme = theme ? JSON.parse(theme) : {};
        let { width, careerProfile } = this.state;
        return (
            <View style={{ flex: 1 }} key={this.state.index}>
                {/* <TouchableOpacity
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
              showMessage({message: 'Uploading Resume', type: 'success'});
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
              style={{marginRight: 5, marginTop: 3}}
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
              style={{marginLeft: 2}}
            />
          )}
        </TouchableOpacity> */}

                <View style={{ flex: 1, padding: 5 }} >
                    {
                        this.props.currentUser.openToNewRole ?
                            <View style={{ width: wpx(415), height: hpx(60), backgroundColor: '#fff', marginVertical: hpx(10), alignItems: 'center', alignSelf: 'flex-start', borderRadius: 5, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { this.handleOpenRoles(!this.state.openToNewRole), this.setState({ openToNewRole: !this.state.openToNewRole }) }} style={{ marginHorizontal: wpx(10) }}>
                                    <Image
                                        source={require("../../_shared/assets/OpenRoles.png")}
                                        resizeMode={'contain'}
                                        style={{ width: wpx(40), height: wpx(40) }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontSize: nf(13), fontWeight: 'bold' }}>{customTranslate('ml_open_to_new_roles')}</Text>
                            </View>
                            :
                            <View style={{ width: wpx(415), height: hpx(60), backgroundColor: '#fff', marginVertical: hpx(10), alignItems: 'center', alignSelf: 'flex-start', borderRadius: 5, flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.handleOpenRoles(!this.state.openToNewRole)} style={{ marginHorizontal: wpx(10) }}>
                                    <Image
                                        source={require("../../_shared/assets/OpenRolesOff.png")}
                                        resizeMode={'contain'}
                                        style={{ width: wpx(40), height: wpx(40) }}
                                    />
                                </TouchableOpacity>
                                <Text style={{ fontSize: nf(13), fontWeight: 'bold' }}>{"Looking for a new role at " + `${this.state.openToNewRoleText}` + "? Let us know!"}</Text>
                            </View>
                    }
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginVertical: 10,
                            marginTop: 10
                        }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>SKILLS</Text>
                        <Text
                            onPress={() => this.setState({ addSkillModal: true })}
                            style={{ color: COLORS.blue }}>
                            + Add Skill
                             </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            padding: 5,
                            maxHeight: 160,
                            marginTop: 10,
                            height: hpx(250)
                        }}>
                        {careerProfile?.skills?.length == 0 &&
                            <Text style={{ width: "100%", height: "40%", paddingVertical: 10, textAlign: 'center', color: COLORS.buttonGrayText, fontSize: 16, fontWeight: 'bold' }}>{"Get started by adding your skills!"}</Text>
                        }
                        {careerProfile &&
                            careerProfile.skills &&
                            careerProfile.skills.length ? (
                            <ScrollView contentContainerStyle={{
                                flexWrap: 'wrap', flexDirection: 'row', marginVertical: 15,
                                marginTop: 10, paddingBottom: 10
                            }}>
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
                            </ScrollView>
                        ) : null}
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 20,
                            marginBottom: 10,
                        }}>
                        <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                            WORK HISTORY
                            </Text>
                        <Text
                            style={{ color: COLORS.blue }}
                            onPress={() =>
                                this.setState({
                                    addWorkHistoryModel: true,
                                    workHistoryPosition: '',
                                    workHistoryCompany: '',
                                    workHistoryStartDate: '',
                                    workHistoryEndDate: '',
                                    workHistoryDescription: '',
                                })
                            }>
                            + Add Work History
                             </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            padding: 5,
                            marginTop: 10,
                            paddingBottom: 20,
                            height: hpx(410)
                        }}>
                        {careerProfile?.employment?.length == 0 &&
                            <Text style={{ width: "100%", height: "40%", paddingVertical: 10, textAlign: 'center', color: COLORS.buttonGrayText, fontSize: 16, fontWeight: 'bold' }}>{"Add your work history to start receiving job recommendations."}</Text>
                        }
                        {careerProfile &&
                            careerProfile.employment &&
                            careerProfile.employment.length ? (
                            <View style={{ height: hpx(390) }}>
                                <ScrollView>
                                    {careerProfile.employment
                                        .filter((emp) => emp)
                                        .map((emp, i) => (
                                            <View
                                                style={{
                                                    borderBottomColor: COLORS.lightGray,
                                                    borderBottomWidth: 0.5,
                                                    paddingVertical: 10,
                                                }}>
                                                <View
                                                    style={{
                                                        backgroundColor: null,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: COLORS.buttonGrayText,
                                                            fontSize: 16,
                                                            fontWeight: 'bold',
                                                            width: wpx(320)
                                                        }}
                                                        multiline={true}
                                                    >
                                                        {emp.title}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            color: COLORS.blue,
                                                            fontSize: 16,
                                                            fontWeight: 'bold',
                                                            marginRight: 20,
                                                        }}
                                                        onPress={() =>
                                                            this.setState(
                                                                {
                                                                    workHistoryPosition: emp.title,
                                                                    workHistoryCompany: emp.name,
                                                                    workHistoryStartDate:
                                                                        emp.start.fullString &&
                                                                            emp.start.fullString != 'Invalid date'
                                                                            ? emp.start.fullString
                                                                            : '',
                                                                    workHistoryEndDate:
                                                                        emp.end.fullString &&
                                                                            emp.end.fullString != 'Invalid date'
                                                                            ? emp.end.fullString
                                                                            : '',
                                                                    workHistoryDescription: emp.description,
                                                                },
                                                                () => {
                                                                    this.setState({
                                                                        addWorkHistoryModel: true,
                                                                        edit: true,
                                                                        editIndex: i,
                                                                    });
                                                                },
                                                            )
                                                        }>
                                                        Edit
                        </Text>
                                                </View>

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
                                                <Text style={{ marginTop: 1 }}>
                                                    {emp.description || '-'}
                                                </Text>
                                            </View>
                                        ))}
                                </ScrollView>
                            </View>
                        ) : null}
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
                                        onPress={() => this.setState({ addWorkHistoryModel: false })}
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
                                            borderRadius: 3,
                                        }}
                                        placeholder={'Position'}
                                        placeholderTextColor={'#9E9E9E'}
                                        value={this.state.workHistoryPosition}
                                        onChangeText={(val) =>
                                            this.setState({ workHistoryPosition: val })
                                        }
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
                                            borderRadius: 3,
                                        }}
                                        placeholder={'Company'}
                                        placeholderTextColor={'#9E9E9E'}
                                        value={this.state.workHistoryCompany}
                                        onChangeText={(val) =>
                                            this.setState({ workHistoryCompany: val })
                                        }
                                    />
                                </View>
                            </View>
                            <View style={{ height: 55, flexDirection: 'row', marginTop: 9 }}>
                                <View style={{ flex: 1, marginLeft: 7, marginRight: 7 }}>
                                    <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                                        Start Date
                  </Text>
                                 <DatePicker
                                        style={{ width: 155 }}
                                        date={this.state.workHistoryStartDate}
                                        mode="date"
                                        placeholder="Select start date"
                                        format="YYYY-MM-DD"
                                        //minDate={moment().format('YYYY-MM-DD')}
                                        //maxDate="2016-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 0.2,
                                                marginLeft: 0,
                                                width: 0,
                                                height: 0,
                                            },
                                            dateInput: {
                                                // marginLeft: 10,
                                                backgroundColor: 'white',
                                                height: 33,
                                                borderRadius: 3,
                                                borderColor: '#000',
                                                // justifyContent:'flex-start'
                                                alignItems: 'flex-start',
                                                paddingLeft: 6,
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
                                        style={{ width: 155 }}
                                        date={this.state.workHistoryEndDate}
                                        mode="date"
                                        placeholder="Select end date"
                                        format="YYYY-MM-DD"
                                        //minDate={moment().format('YYYY-MM-DD')}
                                        //maxDate="2016-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 0.2,
                                                marginLeft: 0,
                                                width: 0,
                                                height: 0,
                                            },
                                            dateInput: {
                                                // marginLeft: 36,
                                                backgroundColor: 'white',
                                                height: 33,
                                                borderRadius: 3,
                                                borderColor: '#000',
                                                alignItems: 'flex-start',
                                                paddingLeft: 6,
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
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: COLORS.darkGray,
                                    marginLeft: 6,
                                    marginTop: 10,
                                }}>
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
                                placeholder={'Description'}
                                placeholderTextColor={'#9E9E9E'}
                                numberOfLines={3}
                                multiline={true}
                                value={this.state.workHistoryDescription}
                                onChangeText={(val) =>
                                    this.setState({ workHistoryDescription: val })
                                }
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 26,
                                    paddingBottom: 11,
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ addWorkHistoryModel: false });
                                    }}
                                    style={{
                                        borderColor: COLORS.black,
                                        borderWidth: 0.7,
                                        height: 35,
                                        marginHorizontal: 10,
                                        marginBottom: 5,
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flex: 1,
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
                                        flex: 1,
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

// import React, { Component } from 'react';
// import {
//   Text,
//   View,
//   TouchableOpacity,
//   Dimensions,
//   ScrollView,
//   Modal,
//   TextInput,
// } from 'react-native';
// import { COLORS } from '../../_shared/styles/colors';
// import AntIcon from 'react-native-vector-icons/AntDesign';
// import { withApollo } from 'react-apollo';
// import Icons from 'react-native-vector-icons/Ionicons';
// import DocumentPicker from 'react-native-document-picker';
// import gql from 'graphql-tag';
// import DatePicker from 'react-native-datepicker';
// import moment from 'moment';

// import { showMessage } from 'react-native-flash-message';
// let updateUserQuery = gql`
//   mutation UpdateUser($input: UpdateUserInput!) {
//     updateUser(input: $input) {
//       id
//       accountClaimId
//       companyId
//       emailAddress
//       employeeId
//       role
//       userGroupId
//       firstName
//       lastName
//       title
//       avatar {
//         bucket
//         region
//         key
//         __typename
//       }
//       departmentId
//       lastLogin
//       lastNotificationCheck
//       incentiveEligible
//       totalReferrals
//       active
//       connectedApps
//       createdById
//       location
//       currency
//       languageCode
//       dateFormat
//       __typename
//     }
//   }
// `;
// let getUserQuery = gql`
//   query GetUser($id: ID!) {
//     getUser(id: $id) {
//       id
//       careerProfile
//       accountClaimId
//       companyId
//       departmentId
//       department {
//         id
//         name
//         __typename
//       }
//       emailAddress
//       role
//       userGroupId
//       firstName
//       lastName
//       title
//       avatar {
//         bucket
//         key
//         region
//         __typename
//       }
//       active
//       connectedApps
//       incentiveEligible
//       location
//       currency
//       languageCode
//       dateFormat
//       isAllowJobNotification
//       __typename
//     }
//   }
// `;
// export class CareerProfile extends Component {
//   state = {
//     width: Dimensions.get('window').width,
//     user: '',
//     careerProfile: '',
//     addSkillModal: false,
//     skillInput: '',
//     addWorkHistoryModel: false,
//     workHistoryPosition: '',
//     workHistoryCompany: '',
//     workHistoryStartDate: '',
//     workHistoryEndDate: '',
//     workHistoryDescription: '',

//   };
//   componentDidMount() {
//     this.getUser();
//   }
//   updateUser = (input) => {
//     console.log('input', input);
//     return this.props.client
//       .mutate({
//         mutation: updateUserQuery,
//         variables: {
//           input: {
//             id: this.props.currentUser.id,
//             careerProfile: JSON.stringify(input),
//           },
//         },
//       })
//       .then((res) => {
//         this.setState({ careerProfile: input });
//         // console.log('update user res', res);

//         return res;
//       })
//       .catch((err) => {
//         this.setState({ addSkillModal: false });
//       });
//   };
//   handleAddSkill = () => {
//     if (!this.state.skillInput) {
//       alert('Please add a skill');
//       return;
//     }
//     let careerProfile = { ...this.state.careerProfile };
//     let skills = [...careerProfile.skills];
//     skills.push(this.state.skillInput);
//     careerProfile.skills = skills;
//     this.updateUser(careerProfile).then((res) => {
//       showMessage({
//         message: 'Adding Skill...',
//         type: 'success',
//       });
//       this.setState({ addSkillModal: false, skillInput: '' });
//     });
//   };
//   handleRemoveSkill = (i) => {
//     let careerProfile = { ...this.state.careerProfile };
//     let skills = [...careerProfile.skills];
//     skills.splice(i, 1);
//     careerProfile.skills = skills;
//     this.updateUser(careerProfile).then((res) => {
//       showMessage({
//         message: 'Removing Skill...',
//         type: 'info',
//       });
//     });
//   };
//   handleAddJob = () => {
//   const body ={
//     "current": true,
//     "title": this.state.workHistoryPosition,
//     "name": this.state.workHistoryCompany,
//     "description":this.state.workHistoryDescription,
//     "end":{
//       "month":moment(this.state.workHistoryEndDate).month(),
//       "year":moment(this.state.workHistoryEndDate).year(),
//       "fullString": moment(this.state.workHistoryEndDate).format("YYYY-MM-DD"),
//       "monthName": moment(this.state.workHistoryEndDate).format("MMMM"),
//       "current":true
//     },
//      "start":{
//        "month":moment(this.state.workHistoryEndDate).month(),
//        "year":moment(this.state.workHistoryStartDate).year(),
//        "fullString": moment(this.state.workHistoryEndDate).format("YYYY-MM-DD"),
//        "monthName":moment(this.state.workHistoryStartDate).format("MMMM")
//       }
//   }
//     console.log("body is ::", body)
//     let careerProfile = { ...this.state.careerProfile };
//     let jobAdd = [...careerProfile.employment];
//     jobAdd.push(body);
//     careerProfile.employment = jobAdd;
//     this.updateUser(careerProfile).then((res) => {
//       showMessage({
//         message: 'Adding Job...',
//         type: 'success',
//       });
//       this.setState({ addWorkHistoryModel: false });
//     });

//   };
//   getUser = () => {
//     this.props.client
//       .query({
//         query: getUserQuery,
//         variables: { id: this.props.currentUser.id },
//         fetchPolicy: 'network-only',
//       })
//       .then((res) => {
//         this.setState({
//           user: res.data.getUser,
//           careerProfile: JSON.parse(res.data.getUser.careerProfile),
//         });
//       });
//   };
//   render() {
//     console.log(this.state.careerProfile);
//     const { currentUser } = this.props;
//     let {
//       company: { theme },
//     } = currentUser;
//     theme = theme ? JSON.parse(theme) : {};
//     let { width, careerProfile } = this.state;
//     return (
//       <View style={{ flex: 1 }}>
//         <TouchableOpacity
//           style={{
//             height: 42,
//             width: width > 450 ? 'auto' : '99.5%',
//             borderRadius: 3,
//             alignSelf: width > 450 ? 'flex-start' : 'center',
//             flexDirection: 'row',
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor:
//               width <= 450
//                 ? theme.enabled
//                   ? theme.addButtonColor
//                   : COLORS.red
//                 : 'transparent',
//             borderWidth: this.props.referContact ? 1 : 0,
//             borderColor: COLORS.buttonGrayOutline,
//           }}
//           onPress={async () => {
//             // console.log('sld');
//             try {
//               const res = await DocumentPicker.pick({
//                 type: [DocumentPicker.types.images],
//               });
//               // console.log(
//               //   res.uri,
//               //   res.type, // mime type
//               //   res.name,
//               //   res.size,
//               // );
//               showMessage({ message: 'Uploading Resume', type: 'success' });
//             } catch (err) {
//               if (DocumentPicker.isCancel(err)) {
//                 // User cancelled the picker, exit any dialogs or menus and move on
//               } else {
//                 throw err;
//               }
//             }
//           }}>
//           {width > 450 && (
//             <AntIcon
//               style={{ marginRight: 5, marginTop: 3 }}
//               size={35}
//               color={COLORS.red}
//               name="pluscircle"
//             />
//           )}
//           <Text
//             style={{
//               color:
//                 width > 450
//                   ? COLORS.darkGray
//                   : this.props.referContact
//                     ? COLORS.buttonGrayText
//                     : 'white',
//               fontSize: this.props.referContact ? 14 : 18,
//               textAlign: 'center',
//               fontWeight: width > 450 ? 'bold' : 'normal',
//             }}>
//             Import Resume{' '}
//           </Text>
//           {width <= 450 && (
//             <Icons
//               name="ios-add-circle-outline"
//               color="#fff"
//               size={23}
//               style={{ marginLeft: 2 }}
//             />
//           )}
//         </TouchableOpacity>
//         <View style={{ flex: 1, padding: 5 }}>
//           <View
//             style={{
//               backgroundColor: 'white',
//               borderRadius: 5,
//               padding: 5,
//               maxHeight: 160,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginBottom: 5,
//               }}>
//               <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Skills</Text>
//               <Text
//                 onPress={() => this.setState({ addSkillModal: true })}
//                 style={{ color: COLORS.blue }}>
//                 + Add Skill
//               </Text>
//             </View>
//             {careerProfile.skills && careerProfile.skills.length && (
//               <ScrollView>
//                 <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
//                   {careerProfile.skills.map((skill, i) => (
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         backgroundColor: COLORS.lightGreen,
//                         padding: 5,
//                         margin: 2,
//                       }}>
//                       <Text style={{ marginRight: 5 }}>{skill}</Text>
//                       <AntIcon
//                         size={15}
//                         name="close"
//                         color={COLORS.dashboardGreen}
//                         onPress={() => this.handleRemoveSkill(i)}
//                       />
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//           <View
//             style={{
//               backgroundColor: 'white',
//               borderRadius: 5,
//               padding: 5,
//               marginTop: 10,
//               flex: 1,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginBottom: 10,
//               }}>
//               <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
//                 Work History
//               </Text>
//               <Text style={{ color: COLORS.blue }} onPress={() => this.setState({ addWorkHistoryModel: true })}>+ Add Work History</Text>
//             </View>
//             {careerProfile.employment && careerProfile.employment.length && (
//               <ScrollView>
//                 {careerProfile.employment.map((emp, i) => (
//                   <View
//                     style={{
//                       borderBottomColor: COLORS.lightGray,
//                       borderBottomWidth: 0.5,
//                       paddingVertical: 10,
//                     }}>
//                     <Text
//                       style={{
//                         color: COLORS.buttonGrayText,
//                         fontSize: 16,
//                         fontWeight: 'bold',
//                       }}>
//                       {emp.title}
//                     </Text>
//                     <Text style={{ marginTop: 2 }}>{emp.name}</Text>
//                     <Text style={{ marginTop: 2 }}>
//                       {emp['start.year']} - {emp['end.year']}
//                     </Text>
//                     <Text
//                       style={{
//                         marginTop: 8,
//                         color: COLORS.grayMedium,
//                         fontSize: 16,
//                         fontWeight: 'bold',
//                       }}>
//                       Description
//                     </Text>
//                     <Text style={{ marginTop: 1 }}>{emp.description || '-'}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             )}
//           </View>
//         </View>
//         <Modal transparent visible={this.state.addSkillModal}>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: COLORS.blackTransparent,
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 backgroundColor: 'white',
//                 width: '90%',
//                 alignSelf: 'center',
//                 borderRadius: 5,
//               }}>
//               <View style={{ flexDirection: 'row', marginTop: 5 }}>
//                 <View style={{ flex: 1 }} />
//                 <View style={{ flex: 5, alignItems: 'center' }}>
//                   <Text style={{ fontSize: 19, color: COLORS.darkGray }}>
//                     Add Skill
//                   </Text>
//                 </View>
//                 <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
//                   <AntIcon
//                     name="close"
//                     size={23}
//                     color={COLORS.grayMedium}
//                     onPress={() =>
//                       this.setState({ addSkillModal: false, skillInput: '' })
//                     }
//                   />
//                 </View>
//               </View>
//               <TextInput
//                 style={{
//                   borderWidth: 1,
//                   borderColor: COLORS.grayMedium,
//                   height: 30,
//                   margin: 10,
//                   padding: 2,
//                 }}
//                 value={this.state.skillInput}
//                 onChangeText={(val) => this.setState({ skillInput: val })}
//               />
//               <TouchableOpacity
//                 onPress={this.handleAddSkill}
//                 style={{
//                   backgroundColor: COLORS.blue,
//                   height: 35,
//                   marginHorizontal: 10,
//                   marginBottom: 5,
//                   borderRadius: 5,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Text style={{ color: 'white', fontSize: 17 }}>Add</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//         <Modal transparent visible={this.state.addWorkHistoryModel}>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: COLORS.blackTransparent,
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 backgroundColor: 'white',
//                 width: '93%',
//                 alignSelf: 'center',
//                 borderRadius: 5,
//               }}>
//               <View style={{ flexDirection: 'row', marginTop: 5 }}>
//                 <View style={{ flex: 1 }} />
//                 <View style={{ flex: 5, alignItems: 'center' }}>
//                   <Text style={{ fontSize: 19, color: COLORS.darkGray }}>
//                     Add Job
//                   </Text>
//                 </View>
//                 <View style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 5 }}>
//                   <AntIcon
//                     name="close"
//                     size={23}
//                     color={COLORS.grayMedium}
//                     onPress={() =>
//                       this.setState({ addWorkHistoryModel: false, })
//                     }
//                   />
//                 </View>
//               </View>
//               <View style={{ height: 55, flexDirection: 'row', marginTop: 17 }}>

//                 <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
//                   <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
//                     Position
//                   </Text>
//                   <TextInput
//                     style={{
//                       borderWidth: 1,
//                       borderColor: COLORS.grayMedium,
//                       height: 35,
//                       paddingLeft: 6,
//                       borderRadius:3
//                     }}
//                     placeholder={"Position"}
//                     placeholderTextColor={"#9E9E9E"}
//                     value={this.state.workHistoryPosition}
//                     onChangeText={(val) => this.setState({ workHistoryPosition: val })}
//                   />
//                 </View>

//                 <View style={{ flex: 1, marginLeft: 5, marginRight: 5 }}>
//                   <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
//                     Company
//                   </Text>
//                   <TextInput
//                     style={{
//                       borderWidth: 1,
//                       borderColor: COLORS.grayMedium,
//                       height: 35,
//                       paddingLeft: 6,
//                       borderRadius:3
//                     }}
//                     placeholder={"Company"}
//                     placeholderTextColor={"#9E9E9E"}
//                     value={this.state.workHistoryCompany}
//                     onChangeText={(val) => this.setState({ workHistoryCompany: val })}
//                   />
//                 </View>
//               </View>

//               <View style={{ height: 55, flexDirection: 'row', marginTop: 9 }}>

//                 <View style={{ flex: 1, marginLeft: 7, marginRight: 7 }}>
//                   <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
//                     Start Date
//                  </Text>
//                  <DatePicker
//                     style={{width: 155}}
//                     date={this.state.workHistoryStartDate}
//                     mode="date"
//                     placeholder="Select start date"
//                     format="YYYY-MM-DD"
//                     minDate={moment().format('YYYY-MM-DD')}
//                     //maxDate="2016-06-01"
//                     confirmBtnText="Confirm"
//                     cancelBtnText="Cancel"
//                     customStyles={{
//                       dateIcon: {
//                         position: 'absolute',
//                         left: 0,
//                         top: 0.2,
//                         marginLeft: 0,
//                         width:0,
//                         height:0
//                       },
//                       dateInput: {
//                         // marginLeft: 10,
//                         backgroundColor: 'white',
//                         height: 33,
//                         borderRadius: 3,
//                         borderColor:'#000',
//                         // justifyContent:'flex-start'
//                         alignItems:'flex-start',
//                         paddingLeft:6
//                       },
//                     }}
//                     onDateChange={(date) => {
//                       this.setState({
//                         workHistoryStartDate: moment(date, 'YYYY-MM-DD'),
//                       });
//                     }}
//                   />
//                 </View>

//                 <View style={{ flex: 1, marginRight: 7 }}>
//                   <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
//                     End Date
//                 </Text>
//                 <DatePicker
//                     style={{width: 155}}
//                     date={this.state.workHistoryEndDate}
//                     mode="date"
//                     placeholder="Select end date"
//                     format="YYYY-MM-DD"
//                     minDate={moment().format('YYYY-MM-DD')}
//                     //maxDate="2016-06-01"
//                     confirmBtnText="Confirm"
//                     cancelBtnText="Cancel"
//                     customStyles={{
//                       dateIcon: {
//                         position: 'absolute',
//                         left: 0,
//                         top: 0.2,
//                         marginLeft: 0,
//                         width:0,
//                         height:0
//                       },
//                       dateInput: {
//                         // marginLeft: 36,
//                         backgroundColor: 'white',
//                         height: 33,
//                         borderRadius: 3,
//                         borderColor:'#000',
//                         alignItems:'flex-start',
//                         paddingLeft:6
//                       },
//                     }}
//                     onDateChange={(date) => {
//                       this.setState({
//                         workHistoryEndDate: moment(date, 'YYYY-MM-DD'),
//                       });
//                     }}
//                   />
//                 </View>
//               </View>

//               <Text style={{ fontSize: 16, color: COLORS.darkGray, marginLeft: 6,marginTop:10 }}>
//                 Description
//                 </Text>
//               <TextInput
//                 style={{
//                   borderWidth: 1,
//                   borderColor: COLORS.grayMedium,
//                   height: 65,
//                   marginLeft: 6,
//                   marginRight: 6,
//                   // marginTop: 4,
//                 // padding:2

//                 }}
//                 placeholder={"Description"}
//                 placeholderTextColor={"#9E9E9E"}
//                 numberOfLines={3}
//                 multiline={true}

//                 value={this.state.workHistoryDescription}
//                 onChangeText={(val) => this.setState({workHistoryDescription: val})}
//               />
//               <View style={{ flexDirection:'row',marginTop:26,paddingBottom:11  }}>
//               <TouchableOpacity
//                 onPress={()=>{
//                   this.setState({addWorkHistoryModel:false})
//                 }}
//                 style={{
//                   borderColor: COLORS.black,
//                   borderWidth:.7,
//                   height: 35,
//                   marginHorizontal: 10,
//                   marginBottom: 5,
//                   borderRadius: 5,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   flex:1
//                 }}>
//                 <Text style={{ color: '#000', fontSize: 17 }}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={this.handleAddJob}
//                 style={{
//                   backgroundColor: COLORS.blue,
//                   height: 35,
//                   marginHorizontal: 10,
//                   marginBottom: 5,
//                   borderRadius: 5,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   flex:1

//                 }}>
//                 <Text style={{ color: 'white', fontSize: 17 }}>Submit</Text>
//               </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     );
//   }
// }

// export default withApollo(CareerProfile);
