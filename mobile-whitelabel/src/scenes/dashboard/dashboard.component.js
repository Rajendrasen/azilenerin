import React, {Component} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  FlatList,
  Modal,
} from 'react-native';
import get from 'lodash/get';
import gql from 'graphql-tag';
import {Actions} from 'react-native-router-flux';
import AntIcon from 'react-native-vector-icons/AntDesign';

// import { get } from 'lodash';
import {ReferralCard} from './tiles/referral-card/referral-card';
import Tutorial from '../../_shared/components/misc/tutorial.component';
import {updateUserQuery} from '../my-profile/profile.graphql';
import JobCardd from '../jobs/job-card/job-card.container';
import {
  getTopReferrers,
  getDashboardDepartments,
  listDashboardReferrals,
  getDbReferrals,
  getOpenJobsCountByCompany,
  getDashboardUser,
} from '../../_store/_shared/api/graphql/custom/dashboard/dashboard-queries';
import {RecommendedReferralCard} from './tiles/recommended-referral/recommended';
import {queryBonusByContactIdIndex} from '../../_store/_shared/api/graphql/custom/bonuses/query-bonus-by-contact-id.graphql';
import {queryContactsByAtsIdIndex} from '../../_store/_shared/api/graphql/custom/contacts/contacts-by-ats-id.graphql';
import {GetUserByCognitoId} from '../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
import {listJobMatches} from '../../_store/_shared/api/graphql/custom/jobMatch/list-job-match.graphql';
import {EmployeeRankCard} from './tiles/employee-ranking/employee-ranking';
import {AcceptedReferrals} from './tiles/accepted-referrals/accepted-referrals';
import {JobCard} from './tiles/job-card/jobcard';
import {PointsCard} from './tiles/points-card/pointsCard';
import {QuickLink} from './tiles/quick-links/quicklinks';
import {TopReferrers} from './tiles/top-referrers/top-referrers';
import {Employees} from './tiles/employees/employees';
import {Referrals} from './tiles/referrals/referrals';
import {RecentReferral} from './tiles/recent-referrals/recentReferrals.component';
import {JobNetwork} from './tiles/job-network/jobNetwork.component';
import {Jobs} from './tiles/jobs/jobs';
import {Bonus} from './tiles/bonus/bonus';
import {TopDepartments} from './tiles/top-departments/top-departments';
import {BonusCard} from './tiles/bonus-card/bonusCard';
import {ConnectCard} from './tiles/connect-earn/connect';
import {ContactsCard} from './tiles/connect-contacts/contacts';
//import ReadMore from 'react-native-read-more-text';
import HTML from 'react-native-render-html';
import {COLORS} from '../../_shared/styles/colors';
//import ViewMoreText from 'react-native-view-more-text';
import getSymbolFromCurrency from 'currency-symbol-map';
import i18n from 'react-native-i18n';
import {
  customTranslate,
  setLanguage,
  setLanguageWithCheck,
} from '../../_shared/services/language-manager';
import _ from 'lodash';

import {withApollo} from 'react-apollo';
import {ReferralsCount} from './tiles/referrals-count/referrals-count';
import {downloadFromS3} from '../../common';
import {
  getAppName,
  getDomain,
  getErinSquare,
  getPrimaryColor,
} from '../../WhiteLabelConfig';
import {LeaderBoardCard} from './tiles/leaderboard/leaderboardCard';
import AsyncStorage from '@react-native-community/async-storage';
import InternalJobCard from './tiles/job-card/internal-jobs-card';
import MobilityJobCard from '../../scenes/jobs/job-card/mobility-job-card';
import {EMPLOYEE_DASHBOARD} from '../../_shared/services/constants';
import {queryAnnouncementsByCompanyIdIndex} from '../../_store/_shared/api/graphql/custom/announcements/query-announcement-by-company-id-date-created.graphql';
import AnnouncementCard from '../announcements/announcement-card';
import moment from 'moment';
import OnDeckModal from '../../_shared/components/on-deck/OnDeckModal';
import {
  GeneralReferal,
  ReferralModal,
} from '../../_shared/components/on-deck/OnDeckModalContainer';
import {getCompanyByHost} from '../auth/login/login.graphql';
//import ReferSomeone from '../../_shared/components/on-deck/OnDeckModal';

const managePointsLog = gql`
  mutation managePointsLog($input: ManagePointsLogInput!) {
    managePointsLog(input: $input) {
      id
      companyId
      userId
      event
      note
      operation
      points
    }
  }
`;
class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      numOfLines: 0,
      jobMatches: [],
      status: false,
      htmlStatus:false,
      loading: true,
      spinAnim: new Animated.Value(0),
      width: Dimensions.get('window').width,
      bonuses: [],
      jobsCount: '',
      topReferrers: [],
      topDepartments: [],
      allReferrals: [],
      matchingAtsIdContacts: [],
      hiredCount: 0,
      referredCount: 0,
      processingCount: 0,
      acceptedCount: 0,
      notHiredCount: 0,
      dbReferrals: '',
      bonusJobs: '',
      bonusReferral: '',
      dashBonuses: '',
      employees: '',
      allTopReferrers: [],
      isLoginPopupVisible: false,
      points: '',
      pointsRanking: '',
      jobs: [],
      showYourReferrals: true,
      showMadeRankings: true,
      showPoints: true,
      showLeaderBoards: true,
      showPolicy: true,
      showOpenPositions: true,
      announcement: '',
      generalJobs: [],
      showApplyAndGrowCard: false,
      showReferSomeoneCard: false,
      themeData: '',
      depts: [],
      subComps: [],
      bon: [],
      referralFilter: 0,
      status: 'open',
      enableAppReview: false,
      sendReferralColor: get(
        this.props.currentUser,
        'company.sendReferralColor',
      )
        ? get(this.props.currentUser, 'company.sendReferralColor')
        : '#34B3E9',
      applyInternallyColor: get(
        this.props.currentUser,
        'company.applyInternallyColor',
      )
        ? get(this.props.currentUser, 'company.applyInternallyColor')
        : '#00EBD0',
    };
  }

  componentDidMount() {
    console.log('this.props.currentUser', this.props.currentUser);
    console.log('>>>>>>>>>>>>>>>>', this.props.currentUser?.company);
    Dimensions.addEventListener('change', () => {
      this.setState({
        width: Dimensions.get('window').width,
      });
    });
    this.spin();
    this.getCurrencyRate(
      this.props.currentUser && this.props.currentUser.userGroup
        ? this.props.currentUser.userGroup.currency
        : 'USD',
    );
    //  console.log('QQQQQ', this.props.currentUser.totalReferrals);
    this.getReferrals();
    this.getDbReferrals();
    this.getUser();
    this.getContactsByAtsId();
    this.getDashboardData();
    this.getJobMatches();
    this.getDepartments();
    this.getTopReferrers();
    this.getJobsCount();
    this.withUserDashboard();
    this.getAnnouncement();
    this.getCompanyByHost();
    this.updateUserLastLogin();
    this.apiTest();

    setTimeout(() => {
      AsyncStorage.getItem('firstLoginValue').then((res) => {
        this.setState({
          isLoginPopupVisible: res == 'true' ? true : false,
        });
      });
    }, 1000);
  }

  getAnnouncement = () => {
    // const {
    //     currentUser: { companyId },
    // } = useSelector((state) => state.user);
    const companyId = this.props.currentUser.companyId;
    console.log('company id new', this.props.currentUser.companyId);
    this.props.client
      .query({
        query: queryAnnouncementsByCompanyIdIndex,
        variables: {companyId},
      })
      .then((res) => {
        // console.log("ANNOUNCEMENT DATA", res?.data?.queryAnnouncementsByCompanyIdIndex?.items[0])
        this.setState({
          announcement: res?.data?.queryAnnouncementsByCompanyIdIndex?.items[0],
        });
      });
  };

  withUserDashboard = () => {
    this.props.client
      .query({
        query: getDashboardUser,
        variables: {
          id: this.props.currentUser.id,
        },
      })
      .then((res) => {
        console.log('dash points', res?.data?.getUser?.points);

        // this.props.currentUser?.lastMobileLogin == null
        //     ? this.updatePointLog(res?.data?.getUser?.points)
        //     : null

        // console.log('OOOOOO', res?.data?.getUser);
        this.setState({
          points: res?.data?.getUser?.points,
          pointsRanking: res?.data?.getUser?.pointsRanking,
        });
      });
  };

  getUser = async () => {
    await this.props.client
      .query({
        query: GetUserByCognitoId,
        variables: {
          cognitoId: this.props.currentUser.cognitoId,
        },
      })
      .then((res) => {
        // console.log('cognito>>>>>', res.data.getUserByCognitoId);
        let currentUser = res.data.getUserByCognitoId;
        // console.log("languageCode",currentUser?.languageCode)
        setLanguageWithCheck(currentUser?.languageCode);
        // for (const [key, value] of Object.entries(currentUser)) {
        //     console.log(`cognito>>>>> Data=>${key}: ${value}`);
        //   }
        this.props.setCurrentUser(currentUser);
        const extendedContactsData = get(
          currentUser,
          'extendedContactData',
          [],
        );
        let allJobMatches = extendedContactsData
          .map((contact) => get(contact, 'jobMatches'))
          .flat();
        allJobMatches = allJobMatches.filter((match) => match !== undefined);
        console.log('Object is ', currentUser?.company?.employeeDashboard);
        if (typeof currentUser?.company?.employeeDashboard == 'string') {
          let employeeDashboard = JSON.parse(
            currentUser?.company?.employeeDashboard,
          );
          if (
            employeeDashboard.find(
              (x) => x.name == EMPLOYEE_DASHBOARD.YOUR_REFERRALS,
            )
          ) {
            this.setState({showYourReferrals: true});
          } else {
            this.setState({showYourReferrals: false});
          }

          if (
            employeeDashboard.find(
              (x) => x.name == EMPLOYEE_DASHBOARD.LEADERBOARDS,
            )
          ) {
            this.setState({showLeaderBoards: true});
          } else {
            this.setState({showLeaderBoards: false});
          }

          if (
            employeeDashboard.find(
              (x) => x.name == EMPLOYEE_DASHBOARD.REFERRALS_MADE_RANKING,
            )
          ) {
            this.setState({showMadeRankings: true});
          } else {
            this.setState({showMadeRankings: false});
          }

          if (
            employeeDashboard.find((x) => x.name == EMPLOYEE_DASHBOARD.POLICY)
          ) {
            this.setState({showPolicy: true});
          } else {
            this.setState({showPolicy: false});
          }

          if (
            employeeDashboard.find((x) => x.name == EMPLOYEE_DASHBOARD.POINTS)
          ) {
            this.setState({showPoints: true});
          } else {
            this.setState({showPoints: false});
          }

          if (
            employeeDashboard.find(
              (x) => x.name == EMPLOYEE_DASHBOARD.JOBS_OVERVIEW,
            )
          ) {
            this.setState({showOpenPositions: true});
          } else {
            this.setState({showOpenPositions: false});
          }
          // condition to show showApplyAndGrowCard
          if (
            employeeDashboard?.some(
              (x) => x.name == EMPLOYEE_DASHBOARD.INTERNAL_MOBILITY,
            )
          ) {
            this.setState({showApplyAndGrowCard: true});
          } else {
            this.setState({showApplyAndGrowCard: false});
          }

          // condition to show showReferSomeoneCard

          if (
            employeeDashboard?.some(
              (x) => x.name == EMPLOYEE_DASHBOARD.REFER_SOMEONE,
            )
          ) {
            this.setState({showReferSomeoneCard: true});
          } else {
            this.setState({showReferSomeoneCard: false});
          }
        }

        if (get(currentUser, 'role') !== 'extendedUser') {
          let userMatches = get(currentUser, 'jobMatches', []);
          userMatches = userMatches.filter(
            (match) =>
              !get(match, 'job.hideImInterested') &&
              get(currentUser, 'companyId') === get(match, 'job.companyId'),
          );
          allJobMatches.push(...userMatches);
          if (allJobMatches.length <= 0) this.getTemporaryJobMatches();
          allJobMatches = _.orderBy(
            allJobMatches,
            ['relevance'],
            ['desc', 'asc'],
          );
          allJobMatches = allJobMatches.map((match) => {
            match.job.location = JSON.parse(get(match, 'job.location'));
            return match;
          });
        }
        console.log('allJobMatches', allJobMatches.length);
        this.setState({allJobMatches});
      });
  };

  getTemporaryJobMatches = async (searchCriteria) => {
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

  getJobs = (props) => {
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
        responseData?.results?.map((item, index) => {
          if (index < 2) {
            jobsData.push(item);
          }
        });
        // let data = responseData?.results.filter(x => x.isGeneralReferral == 'true');
        // console.log("general jobs ", data);
        // this.setState({
        //     generalJobs: responseData.results.filter(
        //         (item) => item.isGeneralReferral == 'true',
        //     ),
        // })

        this.setState({jobs: jobsData});
      });
  };
  updatePointLog = (points) => {
    let {pointsSettings} = this.props.currentUser.company;
    if (!pointsSettings) {
      return;
    }
    pointsSettings = JSON.parse(pointsSettings);
    console.log('POINT SETTINGS', pointsSettings);
    // if (!pointsSettings.enabled || this.props.currentUser.lastMobileLogin || !pointsSettings?.useMobileApp) {
    //     return;
    // }
    console.log('calling manage poinst log');
    let checkpoint = {
      companyId: this.props.currentUser.company.id,
      userId: this.props.currentUser.id,
      event: 'useMobileApp',
      note: 'logging in for first time',
      points: pointsSettings.useMobileApp,
      operation: 'add',
    };
    let userpoints = points;
    // console.log(this.props.currentUser);
    var currentUserPoints;
    if (
      userpoints == undefined ||
      userpoints == null ||
      userpoints == NaN ||
      userpoints == 'NaN'
    ) {
      currentUserPoints = 0;
    } else {
      currentUserPoints = points;
    }
    console.log(currentUserPoints, this.state.points);
    console.log(JSON.parse(pointsSettings.useMobileApp) + points);

    let input = {
      id: this.props.currentUser.id,
      lastMobileLogin: new Date().toISOString(),
      points: JSON.parse(pointsSettings.useMobileApp) + currentUserPoints,
    };
    console.log(input);
    console.log(checkpoint);
    this.props.client
      .mutate({
        mutation: managePointsLog,
        variables: {
          input: {
            companyId: this.props.currentUser.company.id,
            userId: this.props.currentUser.id,
            event: 'useMobileApp',
            note: 'logging in for first time',
            points: pointsSettings.useMobileApp,
            operation: 'add',
          },
        },
      })
      .then((res) => {
        this.props.client
          .mutate({
            mutation: updateUserQuery,
            variables: {
              input: {
                id: this.props.currentUser.id,
                lastMobileLogin: new Date().toISOString(),
                points:
                  JSON.parse(pointsSettings.useMobileApp) + currentUserPoints,
              },
            },
          })
          .then((res) => {
            this.props.setCurrentUser(res.data.updateUser);
          })
          .catch((err) => console.log('err', err));
      })
      .catch((err) => {
        console.log('err', err);
      });
    console.log('query complete');
  };
  getDashboardData = () => {
    this.props.client
      .query({
        query: getOpenJobsCountByCompany,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        let data = res.data.getOpenJobsCountByCompany;
        // console.log('LLLLL', data.to);
        this.setState({
          bonusJobs: data.bonusJobs ? JSON.parse(data.bonusJobs) : null,
          bonusReferral: data.bonusReferral
            ? JSON.parse(data.bonusReferral)
            : null,
          dashBonuses: data.bonuses ? JSON.parse(data.bonuses) : null,
          employees: data.employees ? JSON.parse(data.employees) : null,
        });
      });
  };
  getDbReferrals = () => {
    this.props.client
      .query({
        query: getDbReferrals,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        this.setState({dbReferrals: res.data.getDbReferrals});
      });
  };
  getDepartments = () => {
    this.props.client
      .query({
        query: getDashboardDepartments,
        variables: {
          filter: {
            companyId: {eq: this.props.currentUser.company.id},
            active: {eq: true},
          },
          limit: 10000,
        },
      })
      .then((res) => {
        this.setState({
          topDepartments: _.sortBy(res.data.listDepartments.items, 'totalUsers')
            .reverse()
            .splice(0, 5),
        });
      });
  };

  getReferrals = (token = null) => {
    this.props.client
      .query({
        query: listDashboardReferrals,
        variables: {
          filter: {
            userId: {eq: this.props.currentUser.id},
          },
          limit: 10000,
          nextToken: token,
        },
      })
      .then((res) => {
        this.setState(
          {
            allReferrals: [
              ...this.state.allReferrals,
              ...res.data.listReferrals.items,
            ],
          },
          () => {
            if (res.data.listReferrals.nextToken)
              this.getReferrals(res.data.listReferrals.nextToken || null);
            else {
              let hiredCount = 0;
              let referredCount = 0;
              let processingCount = 0;
              let acceptedCount = 0;
              let notHiredCount = 0;
              this.state.allReferrals.forEach((item) => {
                switch (item.status.toLowerCase()) {
                  case 'hired':
                    hiredCount += 1;
                    break;
                  case 'nothired':
                    notHiredCount += 1;
                    break;
                  case 'referred':
                    referredCount += 1;
                    break;
                  case 'accepted':
                    acceptedCount += 1;
                    break;
                  default:
                    processingCount += 1;
                    break;
                }
              });
              this.setState({
                hiredCount: hiredCount,
                referredCount: referredCount,
                processingCount: processingCount,
                acceptedCount: acceptedCount,
                notHiredCount: notHiredCount,
              });
            }
          },
        );
      });
  };
  getContactsByAtsId = (token = null) => {
    if (!this.props.currentUser.accountClaim) return;
    this.props.client
      .query({
        query: gql(queryContactsByAtsIdIndex),
        variables: {
          atsId: this.props.currentUser.accountClaim.atsId,
          limit: 10000,
          nextToken: token,
        },
      })
      .then((res) => {
        this.setState(
          {
            matchingAtsIdContacts: [
              ...this.state.matchingAtsIdContacts,
              ...res.data.queryContactsByAtsIdIndex.items,
            ],
          },
          () => {
            if (res.data.queryContactsByAtsIdIndex.nextToken) {
              this.getContactsByAtsId(
                res.data.queryContactsByAtsIdIndex.nextToken || null,
              );
            } else {
              this.setBonuses();
            }
          },
        );
      });
  };
  getJobMatches = (token = null) => {
    this.props.client
      .query({
        query: gql(listJobMatches),
        variables: {
          filter: {
            userId: {eq: this.props.currentUser.id},
          },
          limit: 10000,
          nextToken: token,
        },
      })
      .then((res) => {
        //console.log('jobMatches', res)
        this.setState(
          {
            jobMatches: [
              ...this.state.jobMatches,
              ...res.data.listJobMatches.items,
            ],
          },
          () => {
            //console.log('count' , this.state.jobMatches.length)
            if (res.data.listJobMatches.nextToken) {
              this.getJobMatches(res.data.listJobMatches.nextToken || null);
            }
          },
        );
      });
  };
  getTopReferrers = () => {
    this.props.client
      .query({
        query: getTopReferrers,
        variables: {companyId: this.props.currentUser.company.id},
      })
      .then((res) => {
        this.setState({
          allTopReferrers: _.orderBy(
            res.data.getTopReferrers,
            'totalReferrals',
            'desc',
          ),
          topReferrers: res.data.getTopReferrers
            ? _.sortBy(res.data.getTopReferrers, 'totalReferrals')
                .reverse()
                .splice(0, 5)
            : [],
        });
      });
  };

  getJobsCount = () => {
    this.props.client
      .query({
        query: gql`
          query getOpenJobsCountByCompany($companyId: ID!) {
            getOpenJobsCountByCompany(companyId: $companyId) {
              openJobs
              __typename
            }
          }
        `,
        variables: {
          companyId: this.props.currentUser.company.id,
        },
      })
      .then((res) => {
        this.setState({jobsCount: res.data.getOpenJobsCountByCompany.openJobs});
      });
  };

  updateUserLastLogin = () => {
    this.props.client
      .mutate({
        mutation: gql`
          mutation UpdateUser($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
              lastLogin
            }
          }
        `,
        variables: {
          input: {
            id: this.props.currentUser.id,
            lastLogin: new Date().toISOString(),
            lastMobileLogin: new Date().toISOString(),
          },
        },
      })
      .then((res) => console.log('rea', res))
      .catch((err) => console.log('err', err));
  };

  setBonuses = () => {
    const {bonuses = []} = this.state;
    get(this.state, 'matchingAtsIdContacts', []).forEach(async (contact) => {
      const contactId = get(contact, 'id');
      const {data} = await this.props.client.query({
        query: gql(queryBonusByContactIdIndex),
        variables: {contactId},
      });
      const allBonuses = get(data, 'queryBonusByContactIdIndex.items', []);
      const candidateBonuses = allBonuses.filter(
        (bonus) => get(bonus, 'recipientType') === 'candidate',
      );
      this.setState({bonuses: [...bonuses, ...candidateBonuses]});
    });
  };

  componentDidUpdate = (prevProps) => {
    // if (prevProps.jobs !== this.props.jobs) {
    //   if (this.props.onFetchMore) this.props.onFetchMore();
    //   // this.setState({
    //   //   filteredJobs: this.props.jobs ? this.props.jobs : null,
    //   //   allJobs: this.props.jobs ? this.props.jobs : null,
    //   // });
    // }
    if (
      this.state.loading &&
      //!this.props.jobsLoading &&
      !this.props.currentReferralLoading &&
      !this.props.jobMatchesLoading &&
      !this.props.atsLoading
    ) {
      this.setState({
        loading: false,
      });
    }
  };
  ShowHideTextComponentView = () => {
    console.log("htmlStatus",this.state.htmlStatus)
    // if (this.state.status == true) {
    //   this.setState({status: false});
    // } else {
    //   this.setState({status: true});
    // }
   this.setState({htmlStatus:!this.state.htmlStatus})
  };
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
  findBestMatch(arr) {
    if (arr.length === 0) {
      return -1;
    }
    let maxIndex = -1;
    let maxRelevance = 9;
    arr.forEach((m, i) => {
      if (m.relevance > maxRelevance && m.matchStatus !== false) {
        maxIndex = i;
        maxRelevance = m.relevance;
      }
    });
    return maxIndex;
  }
  _handleTextReady = () => {
    // console.log('ready!');
  };

  renderViewMore(onPress) {
    return <Text onPress={onPress}>View more</Text>;
  }
  renderViewLess(onPress) {
    return <Text onPress={onPress}>View less</Text>;
  }

  getCurrencyRate = async (currency) => {
    // const response = await fetch(
    //   `https://api.exchangeratesapi.io/latest?base=USD&symbols=${currency}`,
    // );
    // const result = await response.json();
    // if (result.error) {
    //   // Make this USD
    //   this.props.setCurrencyData(1, '$');
    // } else {
    //   const rate = result.rates[currency].toFixed(5);
    //   const symbol = getSymbolFromCurrency(currency);
    //   this.props.setCurrencyData(rate, symbol);
    // }
    try {
      let symbol = getSymbolFromCurrency(currency);
      symbol = symbol || '$';
      this.props.setCurrencyData(1, symbol);
    } catch (err) {
      this.props.setCurrencyData(1, '$');
    }
  };
  handleFirstLoginPopup = () => {
    AsyncStorage.removeItem('firstLoginValue');
    this.setState({isLoginPopupVisible: false});
  };
  getCompanyByHost = () => {
    this.props.client
      .query({
        query: getCompanyByHost,
        variables: {
          host: getDomain(),
        },
      })
      .then((res) => {
        //console.log(res?.data?.getCompanyByHost?.);
        this.setState({
          themeData: res?.data?.getCompanyByHost?.theme,
          enableAppReview: res?.data?.getCompanyByHost?.enableAppReview,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  apiTest = () => {
    //this.setState({ searching: true });
    // if (!this.state.searchTerm) {
    //   this.setState(
    //     (state) => ({searchedJobs: [], jobs: state.latestJobs}),
    //     () => this.newFetchData(1),
    //   );
    //   return;
    // }
    let selectedRadius,
      location,
      lat,
      lng,
      zip = '';
    let searchValue = this.state.searchTerm || '';
    if (!isNaN(searchValue) && searchValue) {
      console.log('qq', isNaN(searchValue));
      searchValue = `"\"${searchValue.replace('"', '')}\""`;
    }
    console.log('bbbb', searchValue);
    let query = {
      query: searchValue.toLowerCase(),
      filters: {
        all: [
          {
            record_type: 'Job',
          },
          {
            company_id: this.props.currentUser.companyId,
          },
          {
            status: 'open',
          },
        ],
        none: [],
      },
      page: {
        size: 1000,
      },
    };
    if (zip && selectedRadius && lat && lng) {
      if (selectedRadius == 'remote') {
        query.filters.all.push({is_remote: 'true'});
      } else if (selectedRadius == 'country' && location && location.country) {
        query.filters.all.push({
          country: (
            lookup.byCountry(location.country) || lookup.byIso(location.country)
          ).iso2,
        });
      } else {
        let locationFilter = {
          center: lat + ', ' + lng,
          distance: selectedRadius,
          unit: 'mi',
        };
        query.filters.all.push({location: locationFilter});
      }
    }
    if (location?.city && location?.state && selectedRadius && lat && lng) {
      if (selectedRadius == 'remote') {
        query.filters.all.push({is_remote: 'true'});
      } else if (selectedRadius == 'country' && location && location.country) {
        query.filters.all.push({
          country: (
            lookup.byCountry(location.country) || lookup.byIso(location.country)
          ).iso2,
        });
      } else {
        let locationFilter = {
          center: lat + ', ' + lng,
          distance: selectedRadius,
          unit: 'mi',
        };
        query.filters.all.push({location: locationFilter});
      }
    }
    if (Object.keys(this.state.depts).length) {
      query.filters.all.push({department_id: Object.keys(this.state.depts)});
    }
    if (Object.keys(this.state.subComps).length) {
      query.filters.all.push({
        sub_company_id: Object.keys(this.state.subComps),
      });
    }
    if (Object.keys(this.state.bon).length) {
      query.filters.all.push({tiered_bonus_id: Object.keys(this.state.bon)});
    }
    if (this.state.referralFilter == 1) {
      query.filters.all.push({public_link_exists: 'true'});
    }
    if (this.state.referralFilter == 2) {
      query.filters.all.push({internal_job_link_exists: 'true'});
    }
    if (this.state.referralFilter == 2) {
      query.filters.none.push({hide_im_interested: 'true'});
    }
    console.log('query', query);
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
        // console.log('jobs', json);
        let matchedJobs = json.results;
        let results = [];
        //console.log("match>>>", matchedJobs[0]);
        matchedJobs.filter((job) => {
          // const isTitleMatch = get(job, 'title.raw', '')
          //   .toLowerCase()
          //   .includes(searchValue.toLowerCase());
          // const isIdMatch = get(job, 'external_job_id.raw', '')
          //   .toLowerCase()
          //   .includes(searchValue.toLowerCase());
          // if (isTitleMatch || isIdMatch) {
          // console.log(">>>", JSON.stringify(JSON.parse(job.campaign_tiered_bonus.raw)));
          const newJob = {
            id: get(job, 'job_id.raw'),
            departmentId: get(job, 'department_id.raw'),
            description: get(job, 'description.raw'),
            jobId: get(job, 'job_id.raw'),
            externalJobId: get(job, 'external_job_id.raw'),
            location: get(job, 'location.raw', '{}'),
            lat: get(job, 'lat.raw'),
            lng: get(job, 'lng.raw'),
            status: get(job, 'status.raw', 'closed'),
            title: get(job, 'title.raw', ''),
            isHotJob: get(job, 'is_hot_job.raw', 'false'),
            subCompanyName: get(job, 'sub_company_name.raw', ''),
            campaignId: get(job, 'campaign_id.raw'),
            campaignName: get(job, 'campaign_name.raw'),
            campaignStartDate: get(job, 'campaign_start_date.raw'),
            campaignEndDate: get(job, 'campaign_end_date.raw'),
            campaignTieredBonus: get(job, 'campaign_tiered_bonus.raw'),
            campaignTieredBonusId: get(job, 'campaign_tiered_bonus.raw.id'),
            isGeneralReferral: get(job, 'is_general_referral.raw'),
          };

          if (!results.find((job) => get(job, 'id') === get(newJob, 'id'))) {
            results.push(newJob);
          }
          // }
          // return isTitleMatch || isIdMatch;
        });
        //  console.log(">>>>>>>>>>>", results[0]);
        this.setState({
          // searchedJobs: results,
          // searching: false,
          generalJobs: results.filter(
            (item) => item.isGeneralReferral == 'true',
          ),
        });
        return results;
      })
      .catch((err) => console.log('jobserr', err));
  };

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    // if (this.props.jobs) {
    //   AsyncStorage.setItem('Jobs', JSON.stringify(this.props.jobs));
    // }
    if (this.props.currentUser) {
      AsyncStorage.setItem(
        'currentUser',
        JSON.stringify(this.props.currentUser),
      );
    }

    var allowRefer = this.props.currentUser.company.allowSelfReferrals;
    if (allowRefer) {
      AsyncStorage.setItem('allowSelfReferrals', JSON.stringify(allowRefer));
    }

    const {
      currentUser,
      // topReferrers,
      // ,
      // referrals,
      jobs = [],
      // userDashboard,
      //  jobMatches,
      // contacts,
    } = this.props;
    let htmlData = JSON.stringify(
      currentUser?.company?.dashboardReferralPolicyText,
    )
      ?.split('\\n')
      .join(' ');
    // console.log("htmlData",htmlData);
    let {jobMatches} = this.state;
    let {role} = currentUser;
    // console.log('role,role', role);
    let {accountType} = currentUser.company;
    let {
      company: {symbol, theme},
    } = currentUser;
    theme = theme ? JSON.parse(theme) : {};
    // console.log("dashboardReferralPolicyText", currentUser.company.dashboardReferralPolicyText.replace(/<[^>]*>?/gm, ''))
    if (!currentUser || !currentUser.id) {
      return (
        <View style={styles.spin}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    const recommendedReferral = this.findBestMatch(jobMatches);
    let recommendedJob, matchesRecommendedJob, matchNumber;
    if (recommendedReferral >= 0) {
      // recommendedJob = jobs.filter(
      //   job => job.id === jobMatches[recommendedReferral].jobId && job.status === 'open'
      // );
      // matchesRecommendedJob = jobs.filter(job => {
      //   return job.id === jobMatches[recommendedReferral].jobId;
      // });
      // matchNumber = matchesRecommendedJob.length + 1;
    }

    // const departmentsToUse = departments ? departments : [];
    // const referralsToUse = referrals ? referrals : [];
    // const jobsToUse = jobs ? jobs : [];
    // const yourDepartments = get(userDashboard, 'managedDepartments', []);
    //the implementation that was in here using get was returning null.

    // const direct = contacts.filter(
    //   (contact) =>
    //     contact.importMethod &&
    //     (contact.importMethod === 'email' || contact.importMethod === 'manual'),
    // ).length;
    // const social = contacts.length - direct;
    // const shouldShowConnectAndEarn =
    //   social === 0 &&
    //   currentUser &&
    //   currentUser.company &&
    //   currentUser.company.contactIncentiveBonus &&
    //   currentUser.company.contactIncentiveBonus !== '0';
    // const shouldShowConnectContacts =
    //   direct === 0 &&
    //   social === 0 &&
    //   currentUser &&
    //   currentUser.company &&
    //   (!currentUser.company.contactIncentiveBonus ||
    //     currentUser.company.contactIncentiveBonus === '0');
    return (
      <View style={{flex: 1}}>
        {this.state.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Animated.Image
              style={{height: 60, width: 60, transform: [{rotate: spin}]}}
              source={
                theme.enabled && symbol && symbol.key
                  ? {
                      uri: downloadFromS3(symbol.key),
                    }
                  : getErinSquare()
              }
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.container}
            style={styles.outerContainer}>
            <Tutorial currentUser={this.props.currentUser} />
            {this.props.currentUser?.company?.popupTitle &&
              this.props.currentUser?.company?.popupTitleContent && (
                <Modal
                  visible={this.state.isLoginPopupVisible}
                  transparent
                  style={{
                    flex: 1,
                    height: '100%',
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        height: 300,
                        width: '85%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 20,
                        borderRadius: 6,
                      }}>
                      <ScrollView>
                        <Text
                          style={{
                            letterSpacing: 1,
                            marginBottom: 10,
                            fontWeight: 'bold',
                            alignSelf: 'center',
                          }}>
                          {this.props.currentUser?.company?.popupTitle}
                        </Text>
                        <View style={{paddingHorizontal: 10}}>
                          <HTML
                            containerStyle={styles.htmlContainer}
                            html={
                              this.props.currentUser?.company?.popupTitleContent
                            }></HTML>
                        </View>

                        {/* <Text
                          style={{
                            letterSpacing: 1,
                            marginBottom: 10,
                          }}>
                          we are happy to see that{' '}
                        </Text> */}
                      </ScrollView>

                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 100,
                          padding: 10,
                          borderRadius: 8,
                          backgroundColor: COLORS.primary,
                        }}
                        onPress={() => this.handleFirstLoginPopup()}>
                        <Text>Got it ! </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

            {role.toLowerCase() == 'employee' &&
              this.state.showApplyAndGrowCard &&
              (getAppName() == 'allied' || getAppName() == 'erin') && (
                <View
                  style={{
                    height: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '98%',
                    marginTop: 5,
                    borderRadius: 8,
                    backgroundColor: this.state.applyInternallyColor,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      letterSpacing: 12,
                      fontWeight: 'bold',
                    }}>
                    APPLY
                  </Text>
                  <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                    & GROW YOUR CAREER
                  </Text>
                  <TouchableOpacity
                    onPress={() => Actions.MobilityStack()}
                    style={{
                      marginTop: 10,
                      borderRadius: 8,
                      height: 50,
                      width: '50%',
                      backgroundColor: '#024577',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#fff', fontSize: 16}}>
                      {customTranslate('ml_apply_internally')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {role.toLowerCase() == 'employee' &&
              this.state.showReferSomeoneCard &&
              (getAppName() == 'allied' || getAppName() == 'erin') && (
                <View
                  style={{
                    height: 150,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '98%',
                    marginTop: 10,
                    borderRadius: 8,
                    backgroundColor: this.state.sendReferralColor,
                  }}>
                  <Text
                    style={{
                      fontSize: 28,
                      letterSpacing: 8,
                      fontWeight: 'bold',
                    }}>
                    REFER
                  </Text>
                  <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                    YOUR FRIENDS
                  </Text>
                  <TouchableOpacity
                    onPress={() => Actions.jobs()}
                    style={{
                      borderRadius: 8,
                      marginTop: 10,
                      height: 50,
                      width: '50%',
                      backgroundColor: '#024577',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{color: '#fff', fontSize: 16}}>
                      {customTranslate('ml_send_referral')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            <View
              style={{
                width: '99%',
              }}>
              {role.toLowerCase() == 'extendeduser' && (
                <RecentReferral {...this.props} title={'RECENT REFERRALS'} />
              )}

              {role.toLowerCase() !== 'admin' &&
                role.toLowerCase() !== 'manager' &&
                accountType != 'free' && (
                  <View
                    style={{
                      flexDirection: this.state.width > 450 ? 'row' : 'column',
                    }}>
                    {role.toLowerCase() != 'extendeduser' &&
                    this.state.showOpenPositions ? (
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <JobCard
                          title={customTranslate('ml_Summary').toUpperCase()}
                          jobs={this.state.jobsCount}
                          referralsMade={this.props.currentReferralCount}
                          jobMatches={this.state.jobMatches}
                        />
                      </View>
                    ) : null}
                    {this.state.showYourReferrals && (
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ReferralCard
                          {...this.props}
                          title={i18n
                            .t('ml_Dashboard_YourReferrals')
                            .toUpperCase()}
                        />
                      </View>
                    )}

                    {getAppName() == 'heartlandAffiliation' && (
                      <View
                        style={{
                          height: 120,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '98%',
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                          borderRadius: 8,
                        }}>
                        <GeneralReferal
                          passedStyling={{width: '80%', paddingRight: 25}}
                          generalJobs={this.state.generalJobs}
                          themedata={this.state.themeData}
                        />
                      </View>
                    )}

                    {/* <OnDeckModal
                                        // contact={[]}
                                        // company={this.props.currentUser?.company}
                                        /> */}
                    {/* {
                                            getAppName() == 'heartlandAffiliation' &&
                                            <TouchableOpacity activeOpacity={0.8} onPress={() => console.log("ffd")} style={{ height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, width: '98%', alignSelf: 'center' }}>
                                                <View style={{ height: 50, width: '80%', flexDirection: 'row', backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                                                    <AntIcon
                                                        style={{ marginRight: 5, marginTop: 3 }}
                                                        size={35}
                                                        color={COLORS.white}
                                                        name="pluscircle"
                                                    />
                                                    <Text
                                                        style={{
                                                            color: '#fff'
                                                        }}>
                                                        {customTranslate('ml_SubmitGeneralReferral')}
                                                    </Text>
                                                </View>

                                            </TouchableOpacity>
                                        } */}
                  </View>
                )}
              {role.toLowerCase() == 'extendeduser' && (
                <JobNetwork {...this.props} title={'JOB NETWORK'} />
              )}
            </View>
            {/* {!!shouldShowConnectAndEarn && (
              <ConnectCard
                title="Connect & Earn More"
                currencyRate={this.props.currencyRate}
                currencySymbol={this.props.currencySymbol}
              />
            )} */}
            {/* {recommendedJob &&
              recommendedJob.map((job, index) => (
                <RecommendedReferralCard
                  key={index}
                  title="RECOMMENDED REFERRAL"
                  selectJob={typeof job !== 'undefined' ? job : null}
                  matchNumber={typeof matchNumber !== 'undefined' ? matchNumber : null}
                  currencyRate={this.props.currencyRate}
                  currencySymbol={this.props.currencySymbol}
                  {...this.props}
                />
              ))} */}

            <View
              style={{
                width: '99%',
              }}>
              {role.toLowerCase() !== 'admin' &&
                role.toLowerCase() !== 'manager' &&
                role.toLowerCase() != 'extendeduser' &&
                accountType != 'free' && (
                  <View
                    style={{
                      flexDirection: this.state.width > 450 ? 'row' : 'column',
                    }}>
                    {this.state.showMadeRankings && (
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <EmployeeRankCard
                          {...this.props}
                          title={'REFERRALS MADE RANKING'.toUpperCase()}
                        />
                      </View>
                    )}

                    {this.state.showPoints &&
                      this.props.currentUser.company.pointsSettings &&
                      JSON.parse(this.props.currentUser.company.pointsSettings)
                        .enabled && (
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <PointsCard
                            titlee={customTranslate('ml_Points').toUpperCase()}
                            points={this.state.points}
                            pointsRanking={this.state.pointsRanking}
                            {...this.props}
                          />
                        </View>
                      )}
                    {/* {
                                            this.state.showLeaderBoards && (
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    {this.props.currentUser?.company
                                                        ?.publicLeaderboard && (
                                                            <LeaderBoardCard
                                                                title={customTranslate(
                                                                    'ml_Leaderboards',
                                                                ).toUpperCase()}
                                                                currentUser={currentUser}
                                                                topReferrers={this.state.allTopReferrers || []}
                                                            />
                                                        )}
                                                </View>
                                            )
                                        } */}
                    {this.state.announcement != null && (
                      <View
                        style={{
                          width: '100%',
                          padding: 2,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <AnnouncementCard
                          dashboardView={true}
                          title={this.state.announcement?.title}
                          description={this.state.announcement?.content}
                          createdDate={moment(
                            this.state.announcement?.dateCreated,
                          ).format('MM/DD/YYYY h:mm a')}
                        />
                        <TouchableOpacity
                          onPress={() => Actions.AnnouncementStack()}
                          activeOpacity={0.8}
                          style={{
                            alignSelf: 'flex-end',
                            height: 50,
                            padding: 10,
                          }}>
                          <Text style={{fontWeight: 'bold'}}>
                            See All Announcements
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* <TouchableOpacity onPress={() => {
                                            Actions.AnnouncementStack()
                                        }} style={{ height: 20, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <Text style={{
                                                color: COLORS.blue,
                                                fontWeight: '600',
                                                textTransform: 'capitalize',
                                                marginRight: 5,
                                                fontSize: 13,
                                                marginLeft: 10,
                                            }}> View More Announcements</Text>
                                        </TouchableOpacity> */}
                  </View>
                )}

              {getAppName() != 'trinity' ? (
                (role.toLowerCase() == 'admin' ||
                  role.toLowerCase() == 'manager' ||
                  accountType == 'free') && (
                  <View>
                    <View
                      style={{
                        flexDirection:
                          this.state.width > 450 ? 'row' : 'column',
                      }}>
                      {accountType != 'free' && (
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <Employees
                            title={customTranslate(
                              'ml_RegisteredEmployees',
                            ).toUpperCase()}
                            referralsMade={this.props.currentReferralCount}
                            jobMatches={this.state.jobMatches}
                            total={
                              this.state.employees
                                ? this.state.employees.total
                                : 0
                            }
                            withReferrals={
                              this.state.employees
                                ? this.state.employees.withReferralEmployee
                                : 0
                            }
                            withoutReferrals={
                              this.state.employees
                                ? this.state.employees.withoutReferralEmployee
                                : 0
                            }
                            newEmployees={
                              this.state.employees
                                ? this.state.employees.newEmployeeThisMonth
                                : 0
                            }
                          />
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection:
                          this.state.width > 450 ? 'row' : 'column',
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Bonus
                          title={customTranslate('ml_Bonuses').toUpperCase()}
                          totalAvailable={
                            this.state.dashBonuses?.totalAvailable
                          }
                          earned={this.state.dashBonuses?.earned}
                          inWaitingPrcess={
                            this.state.dashBonuses?.inWaitingPrcess
                          }
                          currencySymbol={this.props.currencySymbol}
                          dashBonuses={this.state.dashBonuses}
                        />
                      </View>
                      {accountType != 'free' && (
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <AcceptedReferrals
                            {...this.props}
                            title={customTranslate(
                              'ml_AcceptedReferrals',
                            ).toUpperCase()}
                            totalReferrals={this.state.allReferrals.length}
                            referrals={
                              this.state.dbReferrals
                                ? JSON.parse(
                                    this.state.dbReferrals.acceptedReferrals,
                                  )
                                : null
                            }
                          />
                          {this.state.width > 450 && (
                            <ReferralsCount
                              {...this.props}
                              title={i18n
                                .t('ml_EmployeeDashboard_ReferralsMade')
                                .toUpperCase()}
                              referrals={
                                this.state.dbReferrals
                                  ? JSON.parse(this.state.dbReferrals.referrals)
                                  : null
                              }
                            />
                          )}
                        </View>
                      )}
                    </View>
                    {accountType != 'free' && this.state.width <= 450 && (
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <ReferralsCount
                          {...this.props}
                          title={i18n
                            .t('ml_EmployeeDashboard_ReferralsMade')
                            .toUpperCase()}
                          referrals={
                            this.state.dbReferrals
                              ? JSON.parse(this.state.dbReferrals.referrals)
                              : null
                          }
                        />
                      </View>
                    )}

                    <View
                      style={{
                        flexDirection:
                          this.state.width > 450 ? 'row' : 'column',
                      }}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Referrals
                          title={customTranslate(
                            'ml_Referrals_Referrals',
                          ).toUpperCase()}
                          referralsMade={this.props.currentReferralCount}
                          jobMatches={this.state.jobMatches}
                          totalReferrals={
                            this.state.bonusReferral
                              ? this.state.bonusReferral.totalReferral
                              : 0
                          }
                          tierWise={
                            this.state.bonusReferral
                              ? this.state.bonusReferral.tierWise
                              : null
                          }
                          statusWise={
                            this.state.bonusReferral
                              ? this.state.bonusReferral.statusWise
                              : null
                          }
                        />
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Jobs
                          title={customTranslate('ml_Jobs').toUpperCase()}
                          referralsMade={this.props.currentReferralCount}
                          jobMatches={this.state.jobMatches}
                          totalJobs={
                            this.state.bonusJobs
                              ? this.state.bonusJobs.totalJobs
                              : 0
                          }
                          jobsWithoutReferral={
                            this.state.bonusJobs
                              ? this.state.bonusJobs.totalJobNoReferral
                              : 0
                          }
                          jobsWithReferral={
                            this.state.bonusJobs
                              ? this.state.bonusJobs.totalJobReferral
                              : 0
                          }
                          tierWise={
                            this.state.bonusJobs
                              ? this.state.bonusJobs.tierWise
                              : null
                          }
                        />
                      </View>
                    </View>
                    {accountType != 'free' && (
                      <View
                        style={{
                          flexDirection:
                            this.state.width > 450 ? 'row' : 'column',
                        }}>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <TopReferrers
                            title={customTranslate(
                              'ml_TopReferrers',
                            ).toUpperCase()}
                            referralsMade={this.props.currentReferralCount}
                            jobMatches={this.state.jobMatches}
                            topReferrers={this.state.topReferrers}
                          />
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                          <TopDepartments
                            title={customTranslate(
                              'ml_TopDepartments',
                            ).toUpperCase()}
                            referralsMade={this.props.currentReferralCount}
                            jobMatches={this.state.jobMatches}
                            topDepartments={this.state.topDepartments}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )
              ) : (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={styles.settingCard}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: 1,
                      }}>
                      {`your referrals`.toUpperCase()}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        height: 80,
                        marginTop: 10,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <View
                        style={{
                          width: '48%',
                          borderRadius: 8,
                          height: 70,
                          padding: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                          {this.props.currentUser.totalReferrals}
                        </Text>
                        <Text
                          style={{
                            color: COLORS.grayMedium,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          Referrals
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: COLORS.dashboardGreen,
                          width: '48%',
                          borderRadius: 8,
                          height: 70,
                          padding: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                          $0
                        </Text>
                        <Text
                          style={{
                            color: '#eee',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}>
                          Earned
                        </Text>
                      </View>
                    </View>
                  </View>
                  <EmployeeRankCard
                    {...this.props}
                    title={'REFERRALS MADE RANKING'.toUpperCase()}
                  />
                  <PointsCard
                    titlee={customTranslate('ml_Points').toUpperCase()}
                    points={this.state.points}
                    pointsRanking={this.state.pointsRanking}
                    {...this.props}
                  />
                </View>
              )}
              {role.toLowerCase() !== 'manager'&&role.toLowerCase() !== 'superadmin' &&
                this.state.showLeaderBoards && (
                  <View style={{flex: 1, alignItems: 'center'}}>
                    {this.props.currentUser?.company?.publicLeaderboard && (
                      <LeaderBoardCard
                        title={customTranslate('ml_Leaderboards').toUpperCase()}
                        currentUser={currentUser}
                        topReferrers={this.state.allTopReferrers || []}
                      />
                    )}
                  </View>
                )}
              {/* <View style={{flex: 1, alignItems: 'center'}}>
                <QuickLink
                  title={customTranslate('ml_QuickLinks').toUpperCase()}
                  referralsMade={this.props.currentReferralCount}
                  jobMatches={this.props.jobMatches}
                />
              </View> */}
            </View>
            {/* {!!shouldShowConnectContacts && <ContactsCard title="CONNECT CONTACTS" />} */}
            <View
              style={{
                flexDirection: this.state.width > 450 ? 'row' : 'column',
                width: '99%',
              }}>
              {/* <View style={{ flex: 1, alignItems: 'center' }}>
                <JobCard
                  title={customTranslate('ml_Jobs_OpenJobs').toUpperCase()}
                  jobs={this.props.jobs}
                  referralsMade={this.props.currentReferralCount}
                  jobMatches={this.props.jobMatches}
                />
              </View> */}
              {this.state.bonuses && this.state.bonuses.length ? (
                <View style={{flex: 1, alignItems: 'center'}}>
                  <BonusCard
                    title={customTranslate(
                      'ml_YourRetentionBonus',
                    ).toUpperCase()}
                    bonuses={this.state.bonuses}
                  />
                </View>
              ) : null}

              {/* <View style={{ flex: 1, alignItems: 'center' }}>
                <QuickLink
                  title={'QUICK LINKS'}
                  referralsMade={this.props.currentReferralCount}
                  jobMatches={this.props.jobMatches}
                />
              </View> */}
            </View>
            <View style={styles.container} />

            {/* <ViewMoreText
          numberOfLines={3}
          renderViewMore={this.renderViewMore}
          renderViewLess={this.renderViewLess}
          textStyle={{ textAlign: 'center' }}
        >
          <Text>
            Lorem ipsum dolor sit amet, in quo dolorum ponderum, nam veri molestie constituto eu. Eum enim tantas sadipscing ne, ut omnes malorum nostrum cum. Errem populo qui ne, ea ipsum antiopam definitionem eos.
          </Text>
        </ViewMoreText> */}
            {/* {currentUser.company.dashboardReferralPolicyText &&
          currentUser.company.dashboardReferralPolicyText !==
          '<p><br></p>' ? ( */}

            {this.props.currentUser.company.enableJobMatching &&
              this.props.currentUser.company.allowSelfReferrals &&
              role.toLowerCase() != 'extendeduser' &&
              this.state.allJobMatches && (
                <>
                  <View style={{alignItems: 'flex-start', width: '100%'}}>
                    <Text
                      style={{
                        letterSpacing: 1,
                        fontWeight: 'bold',
                        marginHorizontal: 10,
                        marginVertical: 5,
                      }}>
                      {'Internal Jobs For You'.toUpperCase()}
                    </Text>
                  </View>
                  {this.state.jobs.length > 0 && getAppName() == 'trinity' && (
                    <FlatList
                      data={this.state.jobs}
                      renderItem={({item, index}) => {
                        // console.log('item is ', item?.title);
                        return (
                          <MobilityJobCard
                            generalReferral={item.isGeneralReferral}
                            jobId={item.id.raw}
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
                            width={Dimensions.get('window').width}
                            isHotJob={item.isHotJob}
                            subCompanyName={item?.sub_company_name?.raw}
                          />
                          // <InternalJobCard
                          //     title={item?.title?.raw}
                          //     location={"Multiple Locations"}
                          //     department={item?.department_name?.raw}
                          //     sub_company_name={item?.sub_company_name?.raw}
                          // />
                        );
                      }}
                    />
                  )}

                  {this.state.allJobMatches &&
                  this.state.allJobMatches.length > 0 ? (
                    <FlatList
                      horizontal
                      pagingEnabled={true}
                      showsHorizontalScrollIndicator={false}
                      data={this.state.allJobMatches}
                      keyExtractor={(item) => item.id}
                      renderItem={({item}) => (
                        <View
                          style={{
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                          }}>
                          <JobCardd
                            hideReferSomeone
                            jobId={item.jobId}
                            job={item}
                            key={item.id}
                            setCurrentUser={this.props.setCurrentUser}
                            currentUser1={this.props.currentUser}
                            currentUser={this.props.currentUser.id}
                            selfReferralValue={
                              this.props.currentUser.company.allowSelfReferrals
                            }
                            client={this.props.client}
                            currencyRate={this.props.currencyRate}
                            currencySymbol={this.props.currencySymbol}
                            width={this.state.width}
                            hideBonusAmount
                          />
                        </View>
                      )}
                    />
                  ) : (
                    <Text
                      style={[
                        {
                          alignSelf: 'center',
                          margin: 10,
                          color: COLORS.buttonGrayOutline,
                          fontWeight: '600',
                          textAlign: 'center',
                        },
                      ]}>
                      No Jobs Available
                    </Text>
                  )}
                </>
              )}
            {this.state.enableAppReview != true &&
              this.state.showPolicy &&
              currentUser.company.dashboardReferralPolicyText &&
              currentUser.company.dashboardReferralPolicyText.replace(
                /<[^>]*>?/gm,
                '',
              )?.length > 0 && (
                <View style={styles.settingCard}>
                  {/* <Text style={styles.settingCardText}>
                    {customTranslate('ml_Dashboard_ReferralPolicy').toUpperCase()}
                  </Text> */}
                  {
                    // Pass any View or Component inside the curly bracket.
                    // Here the ? Question Mark represent the ternary operator.
                    this.state.htmlStatus ? (
                      <HTML
                        numberOfLines={this.state.numOfLines}
                        onLayout={(e) => {
                          this.setState({
                            numOfLines:
                              e.nativeEvent.layout.height > 20 ? 2 : 1,
                          });
                        }}
                        tagsStyles={{
                          p: {fontSize: 13, color: COLORS.lightGray},
                          ul: {fontSize: 13, color: COLORS.lightGray},
                        }}
                        containerStyle={styles.htmlContainer}
                         html={JSON.stringify(currentUser.company.dashboardReferralPolicyText)}
                        // html={

                        //     (htmlData?.split(''))[0] == '"' && (htmlData?.split(''))[((htmlData?.split(''))?.length) - 1] == '"' ? htmlData?.substring(1, htmlData?.length - 1) : htmlData
                        // }
                      />
                    ) : (
                      <View>
                        <HTML
                          numberOfLines={1}
                          onLayout={(e) => {
                          this.setState({ numOfLines: e.nativeEvent.layout.height > 20 ? 2 : 1 })
                          }}
                          tagsStyles={{
                            p: {fontSize: 13, color: COLORS.lightGray},
                            ul: {fontSize: 13, color: COLORS.lightGray},
                          }}
                          containerStyle={styles.htmlContainer}
                          html={
                            getAppName() == 'trinity'
                              ? currentUser.company.dashboardReferralPolicyText.substr(
                                  0,
                                  400,
                                )
                              : currentUser.company.dashboardReferralPolicyText.substr(
                                  0,
                                  230,
                                )
                          }
                        />
                      </View>
                    )
                  }
                  {currentUser.company.dashboardReferralPolicyText &&
                  currentUser.company.dashboardReferralPolicyText.replace(
                    /<[^>]*>?/gm,
                    '',
                  ).length > 230 ? (
                    this.state.htmlStatus ? (
                      <TouchableOpacity
                        style={{paddingLeft: 10, paddingBottom: 5}}
                        onPress={this.ShowHideTextComponentView}>
                        <Text
                          style={{
                            color: COLORS.blue,
                            fontWeight: 'bold',
                            textTransform: 'lowercase',
                          }}>
                          {customTranslate('ml_ShowLess')}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{paddingLeft: 10, paddingBottom: 5}}
                        onPress={this.ShowHideTextComponentView}>
                        <Text
                          style={{
                            color: COLORS.blue,
                            fontWeight: 'bold',
                            textTransform: 'lowercase',
                          }}>
                          {customTranslate('ml_ShowMore')}
                        </Text>
                      </TouchableOpacity>
                    )
                  ) : null}
                </View>
              )}
          </ScrollView>
        )}
      </View>
    );
  }
}

export default withApollo(Dashboard);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: 'transparent',
  },
  spin: {
    marginTop: 50,
  },
  settingCard: {
    minHeight: 100,
    width: '98%',
    backgroundColor: COLORS.white,
    borderRadius: 1,
    // shadowOffset: {width: 0, height: 1 },
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    // elevation: 1,
    alignSelf: 'center',

    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
  },
  settingCardText: {
    //fontSize: 15,
    fontWeight: 'bold',
    //marginLeft: 10,
    //paddingTop: 8,
    letterSpacing: 1,
  },
  htmlContainer: {
    width: '100%',
    flex: 0,
    //padding: 10,
    marginTop: 10,
  },
  cardText: {
    fontSize: 14,
    padding: 10,
  },
});
