import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Modal,
  Linking,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {withApollo} from 'react-apollo';
import {
  queryInternalMobilityByCompanyIdIndex,
  JobMatchesByCompanyId,
} from './mobility.graphql';
import MobilityCard from './mobility-card';
import _, {get, startCase} from 'lodash';
import {queryReferralQuestionsByCompanyId} from '../../_store/_shared/api/graphql/custom/referrals/query-referral-questions-by-company-id';
import {
  ListJobs,
  queryJobsByCompanyIdDateIndex,
  queryJobsByCompanyIdDateIndexOnlyIds,
  listSubCompanies,
} from '../../_store/_shared/api/graphql/custom/jobs/jobs-by-companyId.graphql';
import {GetUserByCognitoId} from '../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
import {userActions} from '../../_store/actions';
import {connect} from 'react-redux';
import {searchJobDataNetwork} from '../../_shared/services/utils';
import {GetJob} from '../../_store/_shared/api/graphql/custom/jobs/job-by-id-browse-jobs.graphql';
import {nf, wpx, hpx} from '../../_shared/constants/responsive';
import {queryReferralsByUserIdReferralTypeIndex} from '../../_store/_shared/api/graphql/custom/my-applications';
import JobCard from '../jobs/job-card/job-card.container';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import MobilityJobCard from '../jobs/job-card/mobility-job-card';
import moment from 'moment';
import {customTranslate} from '../../_shared/services/language-manager';
import {COLORS} from '../../_shared/styles/colors';
import Steps from '../../_shared/components/steps/steps.component';
import {SearchBar} from '@ant-design/react-native';
import {SearchBarOverrides} from '../jobs/jobs.component.style';
import {Actions} from 'react-native-router-flux';
import {getAppName} from '../../WhiteLabelConfig';
import {color} from 'react-native-reanimated';

const ScreenWidth = Dimensions.get('screen').width;
const width = Dimensions.get('window').width;

class Mobility extends Component {
  constructor(props) {
    super(props);
    const extendedContactsData = get(
      this.props,
      'currentUser.extendedContactData',
      [],
    );

    console.log('exec new ', this.props.currentUser.extendedContactData);
    console.log('Current User', this.props.currentUser.company);

    let allJobMatches = extendedContactsData
      .map((contact) => get(contact, 'jobMatches'))
      .flat();
    allJobMatches = allJobMatches.filter((match) => match !== undefined);

    if (get(props, 'currentUser.role') !== 'extendedUser') {
      let userMatches = get(props, 'currentUser.jobMatches', []);
      userMatches = userMatches.filter(
        (match) =>
          !get(match, 'job.hideImInterested') &&
          get(props, 'currentUser.companyId') === get(match, 'job.companyId'),
      );
      allJobMatches.push(...userMatches);
      console.log('allJobMatches', allJobMatches);
      // if (allJobMatches.length <= 0) this.getTemporaryJobMatches();
      this.getTemporaryJobMatches();
    }

    allJobMatches = _.orderBy(allJobMatches, ['relevance'], ['desc', 'asc']);
    // console.log("allJobMatches", allJobMatches);
    allJobMatches = allJobMatches.map((match) => {
      // console.log(match?.job);
      // if (match?.job.hasOwnProperty('location')) {
      //     console.log("yes")
      //     match.job.location = JSON.parse(match?.job?.location);
      // } else {
      //     console.log("No");
      // }
      // match.job.location = JSON.parse(match?.job?.location);
      match.job.location = get(match, 'job.location');
      return match;
    });
    console.log('AJM >>', allJobMatches);

    this.state = {
      contentFirst: '',
      contentMiddle: '',
      contentLast: '',
      allJobMatches: [],
      jobs: [],
      allReferrals: [],
      pageNumber: 1,
      onDeckReferModal: false,
      deckData: '',
      animatedModal: false,
      searchText: '',
      openToNewRoleText: 'Erin',
    };
  }

  getJobs = (props) => {
    try {
      let jobsData = [];
      const size = get(props, 'size', 1000);
      let qry =
        props.query && !isNaN(props.query) ? `"${props.query}"` : props.query;
      let jobLevels = '';
      get(props, 'filters.jobLevels', []).forEach(
        (jobLevel) => (jobLevels += `${get(jobLevel, 'name')} `),
      );
      qry = `${qry} ${jobLevels}`;
      let query = {
        // If input is a number (!NaN), add double quotes to it, because antD Input returns a string always
        // And for some reason the query requires a double string
        query: qry,

        filters: {
          all: [
            {
              record_type: 'Job',
            },
            {
              company_id: get(props, 'filters.companies'),
            },
            {
              status: get(props, 'filters.status'),
            },
          ],
          any: [],
          none: [],
        },
        page: {
          size,
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
        .then((response) => response.json())
        .then((responseData) => {
          console.log('responseData', responseData);
          try {
            responseData?.results?.map((item, index) => {
              if (index < 2) {
                jobsData.push(item);
              }
            });
            console.log('jobs data', jobsData);
            this.setState({jobs: jobsData});
          } catch (error) {
            console.log(error);
          }
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  getTemporaryJobMatches = async (searchCriteria) => {
    console.log('searchCriteria');
    console.log('searchCriteria = ', searchCriteria);
    console.log(this.props.currentUser.title);
    const params = {
      query: searchCriteria
        ? searchCriteria.trim()
        : get(this.props, 'currentUser.title'),
      size: 15,
      //coordinates: [{ lat, lng }],
      role: get(this.props, 'currentUser.role'),
      filters: {
        // availables: [{ id: 'internal-only' }],
        companies: [get(this.props, 'currentUser.companyId')],
        //distance: filteredDistance,
        status: 'open',
      },
    };
    console.log('params', params);
    this.getJobs(params);
  };

  componentDidMount() {
    this.getInternalMobillity();
    this.getSelfReferrals();
    this.handleRoleText();
  }

  getSelfReferrals = () => {
    let referralArray = [];
    this.props.client
      .query({
        query: queryReferralsByUserIdReferralTypeIndex,
        variables: {referralType: 'self', userId: this.props.currentUser.id},
      })
      .then((res) => {
        console.log(
          'rest',
          res?.data?.queryReferralsByUserIdReferralTypeIndex?.items.length,
        );
        if (
          res?.data?.queryReferralsByUserIdReferralTypeIndex?.items.length > 0
        ) {
          res?.data?.queryReferralsByUserIdReferralTypeIndex?.items?.map(
            (item, index) => {
              if (index < 2) {
                referralArray.push(item);
              }
            },
          );
          console.log('reee', referralArray);
          this.setState({
            allReferrals: referralArray,
          });
        }
        // this.setState(
        //     {
        //         allReferrals: get(
        //             res,
        //             'data.queryReferralsByUserIdReferralTypeIndex.items',
        //             [],
        //         ).filter((item) => item.job),
        //     },
        //     () => this.fetchData(1),
        // );
      });
  };
  fetchData = (pageNumber) => {
    let fromIndex = (pageNumber - 1) * 10;
    let toIndex = fromIndex + 10;
    let newArr = this.state.allReferrals.slice(fromIndex, toIndex);
    this.setState((prev) => ({
      pageNumber,
      referrals: [...prev.referrals, ...newArr],
    }));
    console.log('reff ', this.state.referrals);
  };

  getInternalMobillity = () => {
    var data = '';
    this.props.client
      .query({
        query: queryInternalMobilityByCompanyIdIndex,
        variables: {companyId: this.props.currentUser.companyId},
      })
      .then((res) => {
        console.log('res=========>', res);

        if (
          res?.data?.queryInternalMobilityByCompanyIdIndex?.items.length > 0
        ) {
          if (
            res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
              ?.contentLast
          ) {
            if (
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]?.contentLast.includes(
                'width="425"',
              ) &&
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]?.contentLast.includes(
                'Career Toolkit Links',
              )
            ) {
              data =
                res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
                  ?.contentLast;
              data = data.replace(
                /\bwidth="(\d+)"/g,
                `width = "${ScreenWidth + 550}"`,
              );
            }
          } else {
            data =
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
                ?.contentLast;
            // this.setState({ contentLast: data })
          }
          console.log(
            'middle order',
            res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
              .contentLast,
          );
          this.setState({
            contentFirst:
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
                ?.contentFirst,
            contentMiddle:
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
                .contentMiddle,
            contentLast:
              res?.data?.queryInternalMobilityByCompanyIdIndex?.items[0]
                ?.contentLast,
          });
        }
      });
  };
  toggleIsSubmitting = () => {
    this.setState((prevState) => ({animatedModal: !prevState.animatedModal}));
  };

  handleCardClick = (data) => {
    this.setState({onDeckReferModal: true, deckData: {...data}});
  };
  referralStatus = (status) => {
    console.log('ref status', status);
    switch (status.toLowerCase()) {
      case 'referred':
        return {
          status: customTranslate('ml_Referred'),
          stepIndex: 0,
        };
      case 'accepted':
        return {
          status: customTranslate('ml_Accepted'),
          stepIndex: 1,
        };
      case 'interviewing':
        return {
          status: customTranslate('ml_Interviewing'),
          stepIndex: 2,
        };
      case 'hired':
        return {
          status: customTranslate('ml_Hired'),
          stepIndex: 3,
        };
      case 'nothired':
        return {
          status: customTranslate('ml_NotHired'),
          stepIndex: 3,
        };
      case 'inactive':
        return {
          status: customTranslate('ml_NotHired'),
          stepIndex: 3,
        };
      case 'noresponse':
        return {
          status: customTranslate('ml_NotHired'),
          stepIndex: 4,
        };
      case 'transferred':
        return {
          status: customTranslate('ml_Transferred'),
          stepIndex: 3,
        };
      default:
        return {status: customTranslate('ml_Referred'), stepIndex: 0};
    }
  };
  referralStatusLabel = (status) => {
    // console.log("status = ",status);
    switch ((status || '').toLowerCase()) {
      case 'accepted':
        return customTranslate('ml_Started');
      case 'hired':
        return customTranslate('ml_Hired');
      case 'referred':
        return customTranslate('ml_Started');
      case 'notHired':
        return customTranslate('ml_NotHired');
      case 'interviewing':
        return get(
          this,
          'props.currentUser.company.referralStatus',
          customTranslate('ml_Interviewing'),
        );
      case 'declined':
        return customTranslate('ml_Declined');
      case 'noresponse':
        return customTranslate('ml_NoResponse');
      case 'inactive':
        return customTranslate('ml_Inactive');
      case 'ineligible':
        return customTranslate('ml_Ineligible');
      case 'transferred':
        return customTranslate('ml_Transferred');
      default:
        return null;
    }
  };

  handleRoleText = () => {
    let appName = getAppName();
    switch (appName) {
      case 'erin':
        this.setState({openToNewRoleText: 'Erin'});
        break;
      case 'pinterest':
        this.setState({openToNewRoleText: 'Pinterest'});
        break;
      case 'primaryaim':
        this.setState({openToNewRoleText: 'Primary Aim'});
        break;
      case 'sunrise':
        this.setState({openToNewRoleText: 'Sunrise'});
        break;
      case 'allied':
        this.setState({openToNewRoleText: 'Allied Universal'});
        break;
      case 'trinity':
        this.setState({openToNewRoleText: 'Trinity'});
        break;
      case 'sevita':
        this.setState({openToNewRoleText: 'Sevita'});
        break;
      case 'heartland':
        this.setState({openToNewRoleText: 'Heartland'});
        break;
      case 'talentreef':
        this.setState({openToNewRoleText: 'Talent Reef'});
        break;
      case 'referCX':
        this.setState({openToNewRoleText: 'Refer CX'});
        break;
      case 'seaworld':
        this.setState({openToNewRoleText: 'Seaworld'});
        break;
      case 'ReferVets':
        this.setState({openToNewRoleText: 'Refer Vets'});
        break;
      case 'Apploi':
        this.setState({openToNewRoleText: 'Apploi'});
        break;
      case 'Twilio':
        this.setState({openToNewRoleText: 'Twillio'});
        break;
      case 'GoDaddy':
        this.setState({openToNewRoleText: 'GoDaddy'});
        break;
      case 'IQVIA':
        this.setState({openToNewRoleText: 'IQVIA'});
        break;
      case 'VILIVING':
        this.setState({openToNewRoleText: 'VILIVING'});
        break;
      case 'heartlandAffiliation':
        this.setState({openToNewRoleText: 'HeartLand Affliation'});
        break;
      case 'northWestReferrals':
        this.setState({openToNewRoleText: 'NorthWest Referrals'});
        break;
      case 'gannettFleming':
        this.setState({openToNewRoleText: 'Gannett Fleming'});
        break;
      case 'mscReferrals':
        this.setState({openToNewRoleText: 'MSC'});
        break;
      default:
        this.setState({openToNewRoleText: 'Erin'});
        break;
    }
  };

  render() {
    return (
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <Text
          style={{
            width: '90%',
            alignSelf: 'center',
            textAlign: 'center',
            marginVertical: 8,
            fontSize: 16,
          }}>
          Find your next job at{' '}
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {this.props.currentUser?.company?.name + '.'}
          </Text>
        </Text>
        <View style={styles.searchBarView}>
          <View
            style={
              this.state.searchText != ''
                ? {
                    width: '80%',
                  }
                : {width: '100%'}
            }>
            <SearchBar
              placeholder={customTranslate('ml_Search_Mobility')}
              placeholderTextColor="#bfc5d6"
              onChange={(text) => {
                this.setState({searchText: text});
              }}
              showCancelButton={false}
              styles={SearchBarOverrides}
              clearButtonMode="never"
              SearchBarOverrides
            />
          </View>
          <View style={styles.searchButtonStyle}>
            <TouchableOpacity
              onPress={() => {
                this.state.searchText != '' &&
                  Actions.jobsScene({searchText: this.state.searchText});
              }}
              style={{
                width: '100%',
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.blue,
                borderRadius: 6,
              }}>
              <Text style={{fontSize: 12, color: '#fff'}}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            fontSize: 16,
            marginHorizontal: 10,
            marginTop: 15,
            alignSelf: 'center',
          }}>
          Be matched with the perfect job{' '}
          <Text
            style={{fontSize: 16, fontWeight: 'bold', marginHorizontal: 10}}>
            for you.
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => Actions.careerProfileStack()}
          style={{
            width: 150,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.blue,
            borderRadius: 6,
            marginHorizontal: 10,
            marginVertical: 20,
            marginBottom: 5,
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: nf(14), color: '#fff', fontWeight: 'bold'}}>
            Update Career Profile
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginVertical: 20,
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 10,
          }}>
          RECOMMENDED JOBS
        </Text>

        <View
          style={{
            height:
              this.state.jobs.length == 0
                ? hpx(100)
                : Platform.OS == 'android'
                ? hpx(250)
                : hpx(210),
            paddingHorizontal: 10,
          }}>
          <FlatList
            horizontal
            data={this.state.jobs}
            ListEmptyComponent={() => (
              <View
                style={{
                  width: wpx(300),
                  height: hpx(100),
                  justifyContent: 'center',
                }}>
                <Text style={{fontSize: 16, marginHorizontal: 10}}>
                  No Recommended Jobs!
                </Text>
              </View>
            )}
            renderItem={({item}) => {
              return (
                <MobilityJobCard
                  generalReferral={item?.isGeneralReferral}
                  jobId={item?.id?.raw}
                  translatedTitle={item.translatedTitle}
                  job={item}
                  key={item.id}
                  setCurrentUser={this.props.setCurrentUser}
                  currentUser1={this.props.currentUser}
                  currentUser={this.props.currentUser.id}
                  selfReferralValue={
                    this.props.currentUser.company.allowSelfReferrals
                  }
                  client={this.props.client}
                  toggleIsSubmitting={this.toggleIsSubmitting}
                  onDeckRefer={this.props.onDeckRefer}
                  handleCardClick={this.handleCardClick}
                  currencyRate={this.props.currencyRate}
                  currencySymbol={this.props.currencySymbol}
                  width={ScreenWidth}
                  isHotJob={item.isHotJob}
                  subCompanyName={item.subCompanyName}
                />
              );
            }}
          />
        </View>

        <Text
          style={{
            marginVertical: 10,
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 10,
          }}>
          YOUR APPLICATIONS
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={this.state.allReferrals}
          contentContainerStyle={{paddingBottom: 30}}
          ListEmptyComponent={() => (
            <View
              style={{
                width: wpx(300),
                height: hpx(100),
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 16, marginHorizontal: wpx(20)}}>
                No Applications Yet!
              </Text>
            </View>
          )}
          renderItem={(item) => {
            return (
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  marginTop: 10,
                  height: 200,
                  width: width - 50,
                  marginLeft: 10,
                }}>
                <View
                  style={{height: 50, width: '100%', justifyContent: 'center'}}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item?.item?.job?.title}
                  </Text>
                </View>
                <View
                  style={{
                    height: hpx(30),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      width: '60%',
                      height: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>{'Applied On:'}</Text>
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '50%',
                        justifyContent: 'center',
                      }}>
                      <Text>
                        {moment(item.item?.referralDate).format('MM/DD/YYYY')}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    marginTop: 20,
                    height: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}>
                  <Steps
                    steps={[
                      {title: 'Started'},
                      {title: 'Interviewing'},
                      {
                        title:
                          this.referralStatus(get(item.item, 'status', ''))
                            .stepIndex == 0
                            ? customTranslate('ml_Hired')
                            : this.referralStatusLabel(
                                get(item.item, 'status', ''),
                              ),
                      },
                    ]}
                    status={this.referralStatus(get(item.item, 'status', ''))}
                    referralStatusLabel="hello"
                  />
                </View>
              </View>
            );
          }}
        />
        <MobilityCard
          firstContent={this.state.contentFirst}
          middleContent={this.state.contentMiddle}
          lastContent={this.state.contentLast}
          currentUser={this.props.currentUser}
          // recommendedJobs={this.state.jobs}
          //applications={this.state.allReferrals}
          onInterestPress={(item) => console.log(item)}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const {currentUser} = state.user;
  return {
    currentUser,
  };
};

const styles = StyleSheet.create({
  searchButtonStyle: {
    justifyContent: 'center',
    width: '20%',
  },
  seachStyle: {
    width: '80%',
  },
  searchBarView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cardview: {
    width: '100%',
    padding: 10,
    flex: 1,
  },
  title: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textstyles: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  htmlContainer: {
    borderRadius: 6,
  },
  shadow: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0.4,
    shadowOpacity: 1,
    elevation: 5,
    borderRadius: 6,
  },
});

export default connect(mapStateToProps)(withApollo(Mobility));
