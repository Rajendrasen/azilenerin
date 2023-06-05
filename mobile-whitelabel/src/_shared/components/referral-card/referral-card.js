import React from 'react';
import {ActivityIndicator} from '@ant-design/react-native';
import {withApollo} from 'react-apollo';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from '../../../_shared/components/icon';
import {getContact} from '../../../_store/_shared/api/graphql/custom/contacts/contact-by-id.graphql';
import {ReferralModal} from '../refer-someone/referral-modal.container';
import {COLORS} from '../../../_shared/styles/colors';
//import Dimensions from 'Dimensions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../services/language-manager';
import {textResolver} from '../../services/utils';
import {getErinSquare} from '../../../WhiteLabelConfig';

const {width, height} = Dimensions.get('window');

class ReferralCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      matchId: this.props.matchId,
      matchInfo: null,
      match: this.props.match,
      spinAnim: new Animated.Value(0),
    };
    // alert('yay');
  }
  getDetails() {
    // debugger
    const {client} = this.props;
    const matchId = this.props.matchId;
    // debugger
    try {
      const get = new Promise(function (resolve) {
        resolve(
          client.query({
            query: getContact,
            variables: {
              id: matchId,
            },
          }),
        );
      });
      get.then((data) => {
        // debugger
        const referredMatch = data.data.getContact;
        if (typeof referredMatch.fullContactData === 'string') {
          referredMatch.fullContactData = JSON.parse(
            data.data.getContact.fullContactData,
          );
          this.setState({
            matchInfo: referredMatch,
          });
          return referredMatch;
        } else {
          this.setState({
            matchInfo: referredMatch,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getDetails();
    this.spin();
  }
  // componentWillUnmount() {
  //   // this.setState({ matchInfo: null });
  // }
  spin = () => {
    // debugger
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.back(),
        useNativeDriver: true,
      }),
    ).start(() => this.spin());
  };
  // componentDidUpdate(prevProps) {
  //   if (prevProps.matchId !== this.props.matchId) {
  //     this.getDetails();
  //   }
  // }

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const {matchInfo} = this.state;
    // debugger
    if (
      matchInfo &&
      typeof matchInfo === 'object' &&
      typeof matchInfo.firstName !== 'undefined'
    ) {
      const {firstName, lastName, id} = matchInfo;
      const currentJob =
        matchInfo.fullContactData &&
        matchInfo.fullContactData.details &&
        matchInfo.fullContactData.details.employment &&
        matchInfo.fullContactData.details.employment[0]
          ? matchInfo.fullContactData.details.employment[0]
          : ' ';
      const jobTitle = currentJob.title;
      const company = currentJob.name;
      const {onUpdateMatch, match} = this.props;

      return (
        <View
          elevation={0}
          style={[
            styles.tile,
            {
              overflow: 'hidden',
              width: width > 450 ? width / 3 - 10 : width - 15,
              marginHorizontal: 2,
            },
          ]}
          key={id}>
          <View style={{position: 'absolute', top: -23, left: -23}}>
            <View
              style={{
                borderLeftWidth: 60,
                borderLeftColor: 'transparent',
                borderBottomWidth: 60,
                borderBottomColor:
                  match.relevance >= 50
                    ? '#19bb4b'
                    : match.relevance >= 30
                    ? '#ffa850'
                    : '#cccccc',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 7,
                left: 7,
                borderLeftWidth: 60,
                borderBottomWidth: 60,
                borderLeftColor: 'transparent',
                borderBottomColor: 'white',
              }}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() =>
                  this.props.clickName(this.props.match.contactId)
                }>
                <Text style={styles.title} letterSpacing={1}>
                  {`${firstName} ${lastName}`}
                </Text>
              </TouchableOpacity>
              <View style={{alignItems: 'flex-end', flex: 1}}>
                <AntIcon
                  name="closecircleo"
                  size={20}
                  color="#444444"
                  onPress={() => this.props.noRefer(onUpdateMatch, match)}
                />
              </View>
              <View />
            </View>
            <Text style={{color: '#999999', fontSize: textResolver(14, 2)}}>
              Company: <Text style={{color: COLORS.darkGray}}>{company}</Text>
            </Text>
            <Text style={{color: '#999999', fontSize: textResolver(14, 2)}}>
              Job Title:{' '}
              <Text style={{color: COLORS.darkGray}}>{jobTitle}</Text>
            </Text>
            {/* <Text style={{ color: '#999999' }}>
              {jobTitle}
              {company ? (
                <Text>
                  <Text style={{ color: '#444444' }}>{` @ `}</Text>
                  {company}
                </Text>
              ) : (
                ''
              )}
            </Text> */}
            {/* <Text style={styles.label}>
              Company: <Text style={styles.body}>{company}</Text>
            </Text>
            <Text style={styles.label}>
              Job Title: <Text style={styles.body}>{jobTitle}</Text>
            </Text> */}
            <View style={styles.buttonRow}>
              <ReferralModal
                title={customTranslate('ml_MakeReferral')}
                job={this.props.job}
                matchInfo={matchInfo}
                style={{width: '100%'}}
                containerStyle={{width: '100%'}}
                propsJob={this.props.propsJob}
              />
              {/* <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.noRefer(onUpdateMatch, match)}
              >
                <Icon name="cancel-button" color={COLORS.white} />
                <Text style={styles.buttontext}>{"Don't Refer"}</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          elevation={5}
          style={[
            styles.tile,
            {
              width: width > 450 ? width / 3 - 10 : width - 15,
              marginHorizontal: 2,
            },
          ]}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image
              style={{height: 40, width: 40, transform: [{rotate: spin}]}}
              source={getErinSquare()}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: 10,
    width: width - 15,
    marginTop: 10,
    backgroundColor: COLORS.white,
    // shadowColor: COLORS.lightGray,
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 1,
    // },
    padding: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.lightGray,
    marginVertical: 1,
  },
  body: {
    fontWeight: 'normal',
    color: COLORS.darkGray,
  },
  container: {
    flex: 0,
    paddingLeft: 5,
  },
  headerRow: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.blue,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 7,
    paddingBottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: (10 / 375) * width,
    borderRadius: 5,
    height: (38 / 812) * height,
    width: (146 / 375) * width,
  },
  buttontext: {
    fontSize: 11,
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default ReferralCard;
