import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Modal,
    Animated,
    Easing,
    TextInput,
    ScrollView,
    SafeAreaView,
    Platform,
    PermissionsAndroid,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import {
    getAppName,
    getDomain,
    getErinSquare,
    getLightGrayLogo,
} from '../../WhiteLabelConfig';
import { ReferralModal } from '../../_shared/components/on-deck/OnDeckModalContainer';
import lookup from 'country-code-lookup';
import { translateString } from '../../_shared/services/language-manager';
import gql from 'graphql-tag';
import get from 'lodash/get';
import _ from 'lodash';
import JobCard from './job-card/job-card.container';
import { COLORS } from '../../_shared/styles/colors';
import EmptyScene from '../empty-scene/empty-scene.component';
import { listTieredBonuses } from '../../_store/_shared/api/graphql/custom/tiered-bonuses/list-tiered-bonuses.graphql';
import { GetUserByCognitoId } from '../../_store/_shared/api/graphql/custom/users/getUserByCognitoId';
import { withApollo } from 'react-apollo';
//import Dimensions from 'Dimensions';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { Loader } from '.././loader';
const { width, height } = Dimensions.get('window');
import { SearchBar, Button } from '@ant-design/react-native';
import { SearchBarOverrides } from './jobs.component.style';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from '../../_shared/components/icon/index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    ListJobs,
    queryJobsByCompanyIdDateIndex,
    queryJobsByCompanyIdDateIndexOnlyIds,
    listSubCompanies,
} from '../../_store/_shared/api/graphql/custom/jobs/jobs-by-companyId.graphql';
import {
    listDepartments,
    queryDepartmentsByCompanyIdIndex,
} from '../../_store/_shared/api/graphql/custom/departments/list-departments.graphql';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
//import Toast from 'react-native-toast-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Geolocation from 'react-native-geolocation-service';
import { downloadFromS3 } from '../../common';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import * as geolib from 'geolib';
import AsyncStorage from '@react-native-community/async-storage';
import { getCompanyByHost } from '../auth/login/login.graphql';
import { log } from 'react-native-reanimated';

class Jobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotJobHeight: 'auto',
            showAll: false,
            showHot: false,
            hotJobs: [],
            showSubCompanyFilterModal: false,
            allSubCompanies: [],
            statusChange: false,
            status: 'open',
            allowSelf: false,
            animatedModal: false,
            refreshing: false,
            jobs: null, //Jobs according to the page
            // totalJobs: [],
            pageNumber: 1,
            pageLoading: true,
            spinAnim: new Animated.Value(0),
            searchTerm:
                this.props.searchText != undefined ? this.props.searchText : '',
            departments: [],
            selectedDepartments: [],
            searchedJobs: [],
            showDepartments: false,
            showDepartmentsFilter: false,
            filterModal: false,
            depts: {},
            zip: '',
            bon: {},
            filters: {
                status: 'open',
                departments: {},
                bonuses: {},
                subCompanies: {},
            },
            latestJobs: [],
            reloading: false,
            nextToken: '',
            onDeckReferModal: false,
            deckData: '',
            moveOffDeck: false,
            sendEmail: false,
            subCompanies: [],
            subComps: {},
            location: this.props.currentUser.location
                ? JSON.parse(this.props.currentUser.location)
                : {},
            tempLocation: this.props.currentUser.location
                ? JSON.parse(this.props.currentUser.location)
                : {},
            showLocationModal: false,
            showLocationModalFilter: false,
            locationModal: false,
            selectedRadius: 0,
            lat: '',
            lng: '',
            width: Dimensions.get('window').width,
            onEndloading: false,
            showBonuses: false,
            showBonusesFilter: false,
            bonuses: [],
            referralFilter: 0,
            themeData: '',
            keyUpdate: 0,
            allJobsTitle: '',
            hotjobsTitle: '',
            showallTitle: '',
            handlerefresh: false,
            hideBonusFilterOnBrowseJobs: false,
            jobsToggle: false,
            refreshList: false,
        };
        this.onEndReachedCalledDuringMomentum = true;
        if (this.props.searchText != undefined || this.props.searchText != null) {
            this.handleSearch(this.props.searchText);
        }
        console.log('printed props', this.props.searchText);
    }

    getJobs = () => {

        this.props.client
            .query({
                query: queryJobsByCompanyIdDateIndexOnlyIds,
                variables: {
                    companyId: this.props.currentUser.companyId,
                    first: 10,
                    after: this.state.nextToken ? this.state.nextToken : null,
                },
                fetchPolicy: 'no-cache',
            })
            .then((res) => {
                this.setState(
                    {
                        latestJobs: [
                            ...this.state.latestJobs,
                            ...res.data.queryJobsByCompanyIdDateIndex.items,
                        ],
                        jobs: [
                            ...this.state.latestJobs,
                            ...res.data.queryJobsByCompanyIdDateIndex.items,
                        ],
                        nextToken: res.data.queryJobsByCompanyIdDateIndex.nextToken,
                        pageLoading: false,
                        reloading: false,
                        onEndloading: false,
                    },
                    () => {
                        this.fetchData(1);
                    },
                    // () => {
                    //   if (
                    //     this.state.latestJobs &&
                    //     this.state.latestJobs.length &&
                    //     !this.state.jobs
                    //   ) {
                    //     this.fetchData(1);
                    //   }
                    // },
                );
                if (!res.data.queryJobsByCompanyIdDateIndex.nextToken) {
                    this.setState({
                        pageLoading: false,
                        reloading: false,
                    });
                }
            })
            .catch((err) => {
                console.log('err', err);
                this.setState({ pageLoading: false, reloading: false });
            });
    };
    handleAddressSelect = (val) => {
        if (val) {
            let addArray = val.formatted_address.split(',');
            let country = addArray[addArray.length - 1];
            let state = addArray[addArray.length - 2];
            let city = addArray[0];
            this.setState({
                tempLocation: { country: country.trim(), state: state, city: city },
                locationModal: false,
                showLocationModal: true,
            });
        }
    };

    hideBonusFilterCheck = () => {
        console.log();
        try {
            this.props.client
                .query({
                    query: GetUserByCognitoId,
                    variables: { cognitoId: this.props.currentUser.cognitoId },
                })
                .then((res) => {
                    console.log(
                        'hideBonusFilterOnBrowseJobs',
                        res?.data?.getUserByCognitoId?.company,
                    );
                    this.setState({
                        hideBonusFilterOnBrowseJobs:
                            res?.data?.getUserByCognitoId?.company
                                ?.hideBonusFilterOnBrowseJobs,
                    });
                });
        } catch (error) {
            console.log(error);
        }
    };

    getAllowSelfReferral = async (user) => {
        this.props.client.cache
            .reset()
            .then(async (result) => {
                const { data } = await this.props.client.query({
                    query: GetUserByCognitoId,
                    variables: { cognitoId: user.cognitoId },
                });
                this.setState({
                    allowSelf: data.getUserByCognitoId.company.allowSelfReferrals,
                });
            })
            .catch((err) => {
                console.log('test error', err);
            });
    };
    timer;
    apiTest = () => {
        console.log('searchTerm', this.state.handlerefresh);

        this.setState({ searching: true, jobsToggle: true, refreshList: true });

        // if (!this.state.searchTerm) {
        //   this.setState(
        //     (state) => ({searchedJobs: [], jobs: state.latestJobs}),
        //     () => this.newFetchData(1),
        //   );
        //   return;
        // }
        let { selectedRadius, location, lat, lng, zip } = this.state;
        let searchValue = '';

        if (this.state.handlerefresh) {
            searchValue = '';
        } else {
            searchValue = this.state.searchTerm || '';
        }

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
                        status: this.state.status,
                    },
                ],
                none: [],
            },

            page: {
                size: 250,
            },
        };
        if (zip && selectedRadius && lat && lng) {
            if (selectedRadius == 'remote') {
                query.filters.all.push({ is_remote: 'true' });
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
                query.filters.all.push({ location: locationFilter });
            }
        }
        if (location.city && location.state && selectedRadius && lat && lng) {
            if (selectedRadius == 'remote') {
                query.filters.all.push({ is_remote: 'true' });
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
                query.filters.all.push({ location: locationFilter });
            }
        }
        if (Object.keys(this.state.depts).length) {
            query.filters.all.push({ department_id: Object.keys(this.state.depts) });
        }
        if (Object.keys(this.state.subComps).length) {
            query.filters.all.push({
                sub_company_id: Object.keys(this.state.subComps),
            });
        }
        if (Object.keys(this.state.bon).length) {
            query.filters.all.push({ tiered_bonus_id: Object.keys(this.state.bon) });
        }
        if (this.state.referralFilter == 1) {
            query.filters.all.push({ public_link_exists: 'true' });
        }
        if (this.state.referralFilter == 2) {
            query.filters.all.push({ internal_job_link_exists: 'true' });
        }
        if (this.state.referralFilter == 2) {
            query.filters.none.push({ hide_im_interested: 'true' });
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
                cache: 'no-cache',
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
                this.setState(
                    {
                        handlerefresh: false,
                        searchedJobs: results,
                        searching: false,
                        refreshList: false,
                        jobsToggle: false,
                        generalJobs: results.filter(
                            (item) => item.isGeneralReferral == 'true',
                        ),
                    },
                    () => this.newFetchData(1),
                );
                return results;
            })
            .catch((err) => {
                console.log('jobserr', err);
                this.setState({ jobsToggle: false });
            });
    };
    newFetchData = async (pageNumber) => {
        console.log('>>>fdggfgfgfgf', this.state.handlerefresh);
        if (this.state.handlerefresh) {
            this.apiTest();
        }
        // if (
        //   this.state.searchTerm ||
        //   Object.keys(this.state.depts).length ||
        //   this.state.selectedRadius ||
        //   this.state.statusChange
        // ) {
        //this.updateFilteredJobsByLocation().then(res=>console.log('location job', res))
        let filteredJobs = [];
        let hotJobs = this.state.searchedJobs.filter((el) => el.isHotJob == 'true');
        let normalJobs = this.state.searchedJobs.filter(
            (el) => el.isHotJob != 'true',
        );
        // console.log("hot jobs", hotJobs[0]);
        filteredJobs = [...normalJobs];
        this.setState({ hotJobs });
        //let newArr = _.sortBy(filteredJobs, 'dateCreated').reverse();
        let newArr = filteredJobs;
        if (!newArr.length) {
            this.setState({
                pageNumber: 1,
                jobs: [],
                pageLoading: false,
                reloading: false,
                onEndloading: false,
            });
            return;
        }
        let fromIndex = (pageNumber - 1) * 10;
        let toIndex = fromIndex + 10;
        let pageJobs = newArr.slice(fromIndex, toIndex);
        let jobTitles = [];
        var language_code;
        let translatedJobTitles = [];
        // if (this.state.doTranslation) {
        jobTitles = pageJobs.map((job) => job.title);
        await AsyncStorage.getItem('appLocale').then((code) => {
            console.log('language code for the app', code);
            language_code = code;
            console.log(this.props.currentUser.company.name);
        });
        if (this.props.currentUser.company.name == 'Securitas Direct') {
            this.setState({
                allJobsTitle: 'TODOS LOS TRABAJOS',
                hotjobsTitle: 'TRABAJOS POPULARES',
                showallTitle: 'Mostrar todo',
            });
        } else {
            this.setState({
                allJobsTitle: 'ALL JOBS',
                hotjobsTitle: 'HOT JOBS',
                showallTitle: 'Show All',
            });
        }

        console.log('lang code', language_code);
        if (
            language_code != 'us' &&
            language_code != 'en' &&
            language_code != null
        ) {
            // let jobtitle = await translateString('allJobs');
            // console.log("JOB TITLE FOR THE ALL JOBS ", jobtitle)

            translatedJobTitles = await translateString(jobTitles);
            pageJobs.forEach(
                (job, i) =>
                    (job.translatedTitle = translatedJobTitles[i].translatedText),
            );
        }
        // translatedJobTitles = await translateString(jobTitles);
        // pageJobs.forEach(
        //     (job, i) => (job.translatedTitle = translatedJobTitles[i].translatedText),
        // );
        //}

        if (pageNumber == 1) {
            this.setState({
                pageNumber: pageNumber,
                jobs: pageJobs,
                pageLoading: false,
                reloading: false,
                onEndloading: false,
            });
            //  console.log("all jobs", pageJobs[0]);
            // this.flatlistRef.scrollToOffset({ animated: false, offset: 0 });
        } else {
            this.setState({
                pageNumber: pageNumber,
                jobs: [...this.state.jobs, ...pageJobs],
                pageLoading: false,
                reloading: false,
                onEndloading: false,
            });
        }
        // } else {
        //   this.getJobs();
        // }
    };
    componentDidMount() {
        const extendedCompaniesData = currentUser?.extendedCompaniesData;

        //console.log("extended>>>>>>>>>>>>", extendedCompaniesData);
        Dimensions.addEventListener('change', () => {
            this.setState({
                width: Dimensions.get('window').width,
            });
        });
        this.getDepartments();
        this.getBonuses();
        this.getCompanyByHost();
        this.getSubCompanies();
        this.hideBonusFilterCheck();
        if (
            this.state.location &&
            this.state.location.city &&
            this.state.location.state
        ) {
            this.getLatLngFromAddress(
                this.state.location.city,
                this.state.location.state,
            ).then((res) => this.apiTest());
        } else {
            this.apiTest();
        }
        this.handleAndroidPermission();
        //this.apiTest();
        this.spin();
        const { currentUser } = this.props;
        this.setState({ allowSelf: currentUser.company.allowSelfReferrals });
        //setTimeout(() => this.fetchData(1), 5000);
    }
    getDepartments = (token = null) => {
        this.setState({ departments: [] });
        this.props.client
            .query({
                query: gql(queryDepartmentsByCompanyIdIndex),
                variables: {
                    companyId: this.props.currentUser?.company?.id,
                    after: token,
                },
            })

            .then((res) => {
                console.log('department length', this.state.departments);
                let department =
                    res?.data?.queryDepartmentsByCompanyIdIndex?.items.filter(
                        (x) => x.active,
                    );
                this.setState({
                    departments: department,
                });
                console.log(
                    'response department >>',
                    res?.data?.queryDepartmentsByCompanyIdIndex?.items.filter(
                        (x) => x.active,
                    ),
                );
                //  this.setState({ departments: [...this.state.departments, ...res?.data?.queryDepartmentsByCompanyIdIndex?.items.filter(x => x.active)], keyUpdate: this.state.keyUpdate++ })

                // this.setState(
                //     (prev) => ({
                //         departments: [
                //             ...prev.departments,
                //             ...res.data.queryDepartmentsByCompanyIdIndex.items.filter(
                //                 (item) => item.active,
                //             ),
                //         ],
                //     }),
                //     () => {
                //         if (res.data.queryDepartmentsByCompanyIdIndex.nextToken) {
                //             this.getDepartments(
                //                 res.data.queryDepartmentsByCompanyIdIndex.nextToken,
                //             );
                //         }
                //     },
                // );
            });
    };

    getSubCompanies = (token = null) => {
        let companyList = [];
        //  console.log("token is ", token);
        this.props.client
            .query({
                query: listSubCompanies,
                variables: {
                    filter: {
                        companyId: {
                            eq: this.props.currentUser.company.id,
                        },
                    },
                    nextToken: token,
                    limit: 1000,
                },
            })
            .then((res) => {
                // console.log('sub company res >>', res.data.listSubCompanies.nextToken);
                if (res.data && res.data.listSubCompanies) {
                    companyList.push(res.data.listSubCompanies.items);
                    console.log('company list ', companyList[0].length);
                    // this.setState({

                    //     allSubCompanies: _.sortBy(res.data.listSubCompanies.items, [
                    //         'name',
                    //     ]),
                    //     subCompanies: _.sortBy(res.data.listSubCompanies.items, ['name']),
                    // });
                    this.setState({
                        allSubCompanies: [
                            ...this.state.allSubCompanies,
                            ...res.data.listSubCompanies.items,
                        ],
                        subCompanies: [
                            ...this.state.subCompanies,
                            ...res.data.listSubCompanies.items,
                        ],
                    });
                    if (res.data.listSubCompanies.nextToken) {
                        this.getSubCompanies(res?.data?.listSubCompanies.nextToken || null);
                    }
                }
            });
    };
    getBonuses = () => {
        this.props.client
            .query({
                query: gql(listTieredBonuses),
                variables: {
                    filter: {
                        companyId: {
                            eq: this.props.currentUser.company.id,
                        },
                        archived: {
                            ne: true,
                        },
                    },
                    limit: 1000,
                },
            })
            .then((res) => {
                //console.log('bonsu res', res.data.listTieredBonuses.items);
                this.setState({ bonuses: res.data.listTieredBonuses.items });
            });
    };
    componentDidUpdate = (prevProps, prevState) => {
        // if (
        //   (!prevProps.jobs && this.props.jobs) ||
        //   (prevProps.jobs && this.props.jobs && prevProps.jobs.length != this.props.jobs.length)
        // ) {
        //   this.fetchData(1);
        // }
        // if (prevProps.jobs !== this.props.jobs) {
        //   if (
        //     this.props.onFetchMore &&
        //     this.props.nextToken &&
        //     this.props.nextToken !== prevProps.nextToken
        //   ) {
        //     this.props.onFetchMore();
        //     // this.setState({
        //     //   filteredJobs: this.props.jobs ? this.props.jobs : null,
        //     //   allJobs: this.props.jobs ? this.props.jobs : null,
        //     // });
        //     // this.setState({ pageLoading: true });
        //     this.fetchData(1);
        //   }
        // }
        // if (prevProps.nextToken !== this.props.nextToken && !this.props.nextToken) {
        //   this.setState({ pageLoading: false, refreshing: false });
        // }
        // if (this.state.nextToken && this.state.nextToken != prevState.nextToken)
        //   this.getJobs();
        if (
            prevProps.departments != this.props.departments ||
            (this.state.departments?.length == 0 && this.props.departments)
        ) {
            // this.setState({ departments: this.props.departments });
        }
    };
    searchFilterFunction = (text) => {
        const newData = this.props.departments.filter((item) => {
            const itemData = item.name && `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({ departments: newData });
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
    fetchData = async (pageNumber) => {
        //this.setState({ pageLoading: true });
        let filteredJobs = await this.filterJobs(this.state.searchTerm);
        //let newArr = _.sortBy(filteredJobs, 'dateCreated').reverse();
        let newArr = filteredJobs;
        let fromIndex = (pageNumber - 1) * 10;
        let toIndex = fromIndex + 10;
        let pageJobs = newArr.slice(fromIndex, toIndex);
        if (pageNumber == 1) {
            this.setState({
                pageNumber: pageNumber,
                jobs: pageJobs,
                pageLoading: false,
                reloading: false,
            });
        } else {
            this.setState({
                pageNumber: pageNumber,
                jobs: [...this.state.jobs, ...pageJobs],
                pageLoading: false,
                reloading: false,
            });
        }
    };

    toggleIsSubmitting = () => {
        this.setState((prevState) => ({ animatedModal: !prevState.animatedModal }));
    };

    filterJobs(searchTerm) {
        return this.updateFilteredJobsByLocation().then((latestJobs) => {
            if (latestJobs && latestJobs.length > 0) {
                let depts = {};
                if (this.state.departments && this.state.departments?.length > 0) {
                    let tempDepts = [...this.state.departments];
                    for (let i = 0; i < tempDepts.length; i++) {
                        if (tempDepts[i].selected) {
                            this.state.depts[tempDepts[i].id] = tempDepts[i].name;
                        }
                    }
                }
                if (searchTerm && Object.keys(this.state.depts).length > 0) {
                    return latestJobs.filter((item) => {
                        if (item.status === this.state.status) {
                            if (item.title) {
                                return (
                                    item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >
                                    -1 && this.state.depts[item.departmentId]
                                );
                            }
                        }
                    });
                }
                if (searchTerm) {
                    return latestJobs.filter((item) => {
                        if (item.status === this.state.status) {
                            if (item.title) {
                                return (
                                    item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >
                                    -1
                                );
                            }
                        }
                    });
                }
                if (Object.keys(this.state.depts).length > 0) {
                    return latestJobs.filter((item) => {
                        if (item.status === this.state.status) {
                            if (item.title) {
                                return item.title && this.state.depts[item.departmentId];
                            }
                        }
                    });
                }
                return latestJobs.filter((item) => {
                    if (item.status === this.state.status) {
                        if (item.title) {
                            return item.title;
                        }
                    }
                });
            } else {
                return [];
            }
        });
    }

    handleSearch = (text) => {
        console.log('called the handle search ', text);
        // let {selectedRadius, depts, status} = this.state;
        // if (
        //   !text &&
        //   !selectedRadius &&
        //   !Object.keys(depts).length &&
        //   status === 'open'
        // ) {
        //   this.setState((state) => ({
        //     jobs: state.latestJobs,
        //     searchTerm: text,
        //     searching: false,
        //   }));
        //   this.flatlistRef.scrollToOffset({animated: false, offset: 0});
        //   return;
        // }
        if (this.props.searchText != undefined || this.props.searchText != null) {
            this.setState(
                {
                    searchTerm: text,
                },
                () => {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.apiTest(text);
                    }, 400);
                },
            );
        } else {
            this.setState(
                {
                    searchTerm: text,
                },
                () => {
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        this.apiTest();
                    }, 400);
                },
            );
        }

        //this.fetchData(1);
    };
    fetchDataOnRefresh = () => {
        setTimeout(() => this.fetchData(1), 10);
    };
    handleCardClick = (data) => {
        this.setState({ onDeckReferModal: true, deckData: { ...data } });
    };

    componentWillUnmount() {
        Dimensions.removeEventListener('change');
    }

    refreshScreen = () => {
        console.log('Called for screen');
        this.setState({ pageLoading: true });
        this.getJobs();
        this.apiTest();
    };

    //single item
    renderItem = ({ item }) => (
        <JobCard
            generalReferral={item.isGeneralReferral}
            jobId={item.id}
            translatedTitle={item.translatedTitle}
            job={item}
            key={item.id}
            setCurrentUser={this.props.setCurrentUser}
            currentUser1={this.props.currentUser}
            currentUser={this.props.currentUser.id}
            selfReferralValue={this.props.currentUser.company.allowSelfReferrals}
            client={this.props.client}
            toggleIsSubmitting={this.toggleIsSubmitting}
            onDeckRefer={this.props.onDeckRefer}
            handleCardClick={this.handleCardClick}
            refreshJobs={this.refreshScreen}
            // refreshJobs={() => { this.setState({ handlerefresh: true, reloading: true, latestJobs: [], searchTerm: '', nextToken: '' }, () => this.newFetchData(1)) }}
            currencyRate={this.props.currencyRate}
            currencySymbol={this.props.currencySymbol}
            width={this.state.width}
            isHotJob={item.isHotJob}
            //new added start
            onUpdateJob={this.props.onUpdateJob}
            onCreateUserJobShare={this.props.onCreateUserJobShare}
            onUpdateUserJobShare={this.props.onUpdateUserJobShare}
            // new added end
            subCompanyName={item.subCompanyName}
        />
    );

    handleDeckRefer = () => {
        if (!this.checkIfOnDeckAlreadyReferred(this.state.deckData.jobId)) {
            // Toast.show('Referring...', Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.darkGray,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
                message: 'Referring...',
                type: 'info',
            });
            this.props
                .onCreateReferral({
                    input: {
                        companyId: this.props.currentUser?.companyId,
                        contactId: this.props.onDeckRefer?.contactId,
                        userId: this.props.onDeckRefer?.userId,
                        jobId: this.state.deckData?.jobId,
                        status: 'referred',
                        note: null,
                        message: null,
                        referralType: this.state.sendEmail ? 'email' : null,
                    },
                })
                .then((res) => {
                    this.setState({ onDeckReferModal: false, deckData: '' }, () => {
                        this.props.handleAfterReferral(this.state.moveOffDeck);
                    });
                })
                .catch((err) => {
                    //Toast.show('Something went wrong.');
                    showMessage({
                        message: 'Something went wrong.',
                        type: 'danger',
                    });
                });
        } else alert('Already referred to this job.');
    };
    checkIfOnDeckAlreadyReferred = (jobId) => {
        console.log(
            'contactPreviousReferrals',
            this.props?.onDeckRefer?.contactPreviousReferrals,
        );
        console.log("jobId", jobId);
        if (
            this.props?.onDeckRefer?.contactPreviousReferrals?.find(
                (item) => item?.job.id == jobId,
            )
        ) {
            return true;
        }
        return false;
    };
    _menu = null;
    menu2 = null;

    setMenuRef = (ref) => {
        this._menu = ref;
    };

    handleRadiusSelect = (val) => {
        this.setState({ selectedRadius: val }, () => {
            this.apiTest();
        });
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    setMenu2Ref = (ref) => {
        this.menu2 = ref;
    };

    handleReferralFilter = (val) => {
        this.setState({ referralFilter: val }, () => {
            this.apiTest();
        });
        if (this.menu2) this.menu2.hide();
    };

    showMenu2 = () => {
        this.menu2.show();
    };

    handleAndroidPermission = () => {
        if (Platform.OS == 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Allow location access for better experience.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            ).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.setState({ zip: '' });
                    this.getLocation();
                }
            });
        } else {
            this.setState({ zip: '' });
            Geolocation.requestAuthorization('whenInUse').then(() => {
                this.getLocation();
            });
        }
    };

    getLocation = () => {
        Geolocation.getCurrentPosition(
            (info) => {
                this.fetchReverseGeo(info.coords.latitude, info.coords.longitude);
            },
            (err) => console.log('blocked'),
        );
    };

    fetchReverseGeo = (lat, lng) => {
        const key = 'AIzaSyDA9bz4iuSAItrIUdJI8KiASKgLHGcUkjg';

        fetch(
            'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            lat +
            ',' +
            lng +
            '&key=' +
            key,
        )
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === 'OK') {
                    if (responseJson.results[1]) {
                        for (var i = 0; i < responseJson.results.length; i++) {
                            if (responseJson.results[i].types[0] === 'locality') {
                                let city = get(
                                    responseJson.results[i].address_components[0],
                                    'long_name',
                                );
                                //  updateCityProfile(city);
                                let state = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 2
                                    ],
                                    'long_name',
                                );
                                //   updateStateProfile(state);
                                let country = get(
                                    responseJson.results[i].address_components[
                                    responseJson.results[i].address_components.length - 1
                                    ],
                                    'long_name',
                                );
                                //  updateCountryProfile(country);
                                this.setState({
                                    location: {
                                        city,
                                        state,
                                        country,
                                    },
                                    tempLocation: {
                                        city,
                                        state,
                                        country,
                                    },
                                });
                            }
                        }
                    } else {
                        console.log('No reverse geocode results.');
                    }
                }
            });
    };

    newDepartmentFilter = (job) => {
        let { depts } = this.state;
        if (!Object.keys(depts).length) return job;
        if (this.state.depts[job.departmentId]) return job;
        return null;
    };

    newUpdateFilteredJobsByLocation = (job) => {
        let { selectedRadius, location, lat, lng } = this.state;
        if (!selectedRadius) return job;
        if (!location || !location.city || !location.state) return job;
        if (job.lat && job.lng) {
            let radius = selectedRadius;
            radius = parseInt(radius) * 1000 * 1.60934;
            let isInRadius = geolib.isPointWithinRadius(
                { latitude: lat, longitude: lng },
                { latitude: job.lat, longitude: job.lng },
                radius,
            );
            if (isInRadius) {
                return job;
            }
        }
        return null;
    };

    updateFilteredJobsByLocation = async (selectedDistances) => {
        if (
            this.state.location &&
            this.state.location.city &&
            this.state.location.state
        ) {
            let {
                location: { city, state },
                selectedRadius,
            } = this.state;
            let filteredJobs = [];
            if (selectedRadius == 0) {
                filteredJobs = this.state.searchedJobs;
                return filteredJobs;
            } else {
                let radius = selectedRadius;
                radius = parseInt(radius) * 1000 * 1.60934; // converting miles into km
                // this.setState({
                //   radiusInKm: radius,
                // });
                if (!this.state.lat || !this.state.lng) {
                    await this.getLatLngFromAddress(city, state);
                }
                this.state.searchedJobs.forEach((job) => {
                    if (job.lat && job.lng) {
                        let isInRadius = geolib.isPointWithinRadius(
                            { latitude: this.state.lat, longitude: this.state.lng },
                            { latitude: job.lat, longitude: job.lng },
                            radius,
                        );
                        if (isInRadius) {
                            filteredJobs.push(job);
                        }
                    }
                });
                return filteredJobs;
            }
        } else {
            return this.state.searchedJobs;
        }
    };

    getLatLngFromAddress = async (city, state, zip) => {
        try {
            const key = 'AIzaSyDA9bz4iuSAItrIUdJI8KiASKgLHGcUkjg';
            let address = zip ? zip : city + ',' + state;
            const response = await fetch(
                'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                address +
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

    getAmountFromBonus = (bonus) => {
        if (!bonus) {
            return 0;
        }
        if (bonus.amount) {
            return this.props.currencySymbol + amount;
        }
        if (bonus.tiers) {
            let amount = 0;
            bonus.tiers?.map((item) => {
                var t = JSON.parse(item);
            });
            for (let i = 0; i < bonus.tiers.length; i++) {
                let tier = JSON.parse(bonus.tiers[i]);
                if (tier.recipientType == 'employee') {
                    amount += parseInt(tier.amount);
                }
            }
            return this.props.currencySymbol + amount;
        }
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
                // console.log('company by host in job section', res?.data?.getCompanyByHost);
                this.setState({ themeData: res?.data?.getCompanyByHost?.theme });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });
        const { status } = this.state.filters;
        const showClosed = status === 'closed';
        const { currentUser } = this.props;
        let location, department;
        if (this.props.onDeckRefer) {
            location = this.state.deckData.location;
            department = this.state.deckData.department;
        }
        let {
            company: {
                symbol,
                theme,
                allowSelfReferralsInternalLink,
                enableGeneralReferrals,
            },
        } = currentUser;
        theme = theme ? JSON.parse(theme) : {};
        let width = this.state.width;
        let onDeckRefer = this.props.onDeckRefer ? (
            <Modal visible={this.state.onDeckReferModal} transparent>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)' }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ alignItems: 'center' }}>
                        <View
                            style={[
                                {
                                    flex: 1,
                                    height: '96%',
                                    width: '94%',
                                    marginHorizontal: '3%',
                                    backgroundColor: '#fff',
                                    paddingBottom: 24,
                                    maxWidth: 450,
                                },
                                {
                                    backgroundColor: 'white',
                                    borderRadius: 30,
                                    //marginTop: 20,
                                },
                            ]}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View
                                    style={{ flex: 5, justifyContent: 'center', paddingTop: 27 }}>
                                    <Text
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                            color: '#ef3c3f',
                                            fontSize: 28,
                                            marginBottom: 0,
                                            fontWeight: '600',
                                        }}>
                                        Review Referral
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ onDeckReferModal: false });
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

                                    <IonIcon name="ios-close" size={40} color="#8f99a2"></IonIcon>
                                </TouchableOpacity>
                            </View>
                            <Text
                                style={[
                                    {
                                        fontSize: 14,
                                        fontWeight: '300',
                                        width: '100%',
                                        textAlign: 'center',
                                        marginVertical: 15,
                                    },
                                    { paddingHorizontal: 35 },
                                ]}>
                                Review and submit this referral and we'll send the candidate a
                                link to apply.
                            </Text>
                            <View
                                style={{
                                    justifyContent: 'space-around',
                                    flexDirection: 'row',
                                    backgroundColor: 'rgb(189, 249, 189)',
                                    width: '95%',
                                    alignSelf: 'center',
                                    borderRadius: 5,
                                    paddingVertical: 20,
                                    marginBottom: 10,
                                }}>
                                <View style={{ flex: 1, marginLeft: 20 }}>
                                    <Text
                                        style={{
                                            marginBottom: 5,
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                        }}>
                                        {this.state.deckData.title}
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                        <Icon
                                            name="folder"
                                            color={COLORS.darkGray}
                                            style={styles.folder}
                                        />
                                        <Text style={{ marginLeft: 5 }}>
                                            {department && department.name}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name="placeholder" color={COLORS.darkGray} />
                                        <Text style={{ marginLeft: 5 }} numberOfLines={3}>
                                            {location &&
                                                !location.isRemote &&
                                                (location.city || location.state)
                                                ? `${location.city}, ${location.state}`
                                                : 'Remote'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flex: 0.5, marginRight: 5 }}>
                                    <Text style={{ marginBottom: 5 }}>
                                        {customTranslate('ml_ReferralBonus')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: 20,
                                            color: COLORS.green,
                                        }}>
                                        {this.props.currencySymbol +
                                            parseInt(
                                                this.state.deckData.bonus * this.props.currencyRate,
                                            )}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    justifyContent: 'space-around',
                                    flexDirection: 'row',
                                    backgroundColor: 'rgb(189, 249, 189)',
                                    width: '95%',
                                    alignSelf: 'center',
                                    borderRadius: 5,
                                    paddingVertical: 20,
                                    marginBottom: 10,
                                }}>
                                <View>
                                    <Text style={{ marginBottom: 5 }}>
                                        {customTranslate('ml_Candidate')}:
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                        {this.props.onDeckRefer.contactName}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{ marginBottom: 5 }}>
                                        {customTranslate('ml_ReferredBy')}:
                                    </Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                        {this.props.onDeckRefer.userName}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '90%',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    height: 30,
                                }}>
                                {this.state.sendEmail ? (
                                    <IonIcon
                                        color={COLORS.green}
                                        name="ios-checkbox"
                                        size={26}
                                        onPress={() => this.setState({ sendEmail: false })}
                                    />
                                ) : (
                                    <IonIcon
                                        color={COLORS.blue}
                                        name="ios-square-outline"
                                        size={30}
                                        onPress={() => this.setState({ sendEmail: true })}
                                    />
                                )}
                                <Text style={{ marginLeft: 5, color: COLORS.darkGray }}>
                                    Send Candidate a referral email to accept or decline.
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: '90%',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                    height: 30,
                                }}>
                                {this.state.moveOffDeck ? (
                                    <IonIcon
                                        color={COLORS.green}
                                        name="ios-checkbox"
                                        size={26}
                                        onPress={() => this.setState({ moveOffDeck: false })}
                                    />
                                ) : (
                                    <IonIcon
                                        color={COLORS.blue}
                                        name="ios-square-outline"
                                        size={30}
                                        onPress={() => this.setState({ moveOffDeck: true })}
                                    />
                                )}
                                <Text style={{ marginLeft: 5, color: COLORS.darkGray }}>
                                    Move Candidate off deck.
                                </Text>
                            </View>
                            <View style={styles.SubmitBtnContainer}>
                                <Button style={styles.SubmitBtn} onPress={this.handleDeckRefer}>
                                    <Text style={styles.SubmitBtnText}>
                                        {customTranslate('ml_SubmitReferral')}{' '}
                                    </Text>
                                    {/* <Icon name="checkmark_circle" color="white" /> */}
                                </Button>
                                {/* <Button style={styles.SubmitBtn}>
              <Text style={styles.SubmitBtnText}>Submit Referral </Text>
              <Icon name="checkmark_circle" color="white" />
            </Button> */}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        ) : null;
        if (this.state.pageLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Animated.Image
                        style={{ height: 60, width: 60, transform: [{ rotate: spin }] }}
                        source={
                            theme.enabled && symbol && symbol.key
                                ? {
                                    uri: downloadFromS3(symbol.key),
                                }
                                : getErinSquare()
                        }
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={{ backgroundColor: '#EFEFF2' }}>
                        {enableGeneralReferrals ? (
                            <ReferralModal
                                generalJobs={this.state.generalJobs}
                                themedata={this.state.themeData}
                            />
                        ) : null}
                        {width <= 450 && (
                            <View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '90%',
                                    }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <SearchBar
                                            placeholder={customTranslate('ml_Search')}
                                            onChange={(text) => {
                                                this.handleSearch(text);
                                            }}
                                            showCancelButton={false}
                                            styles={SearchBarOverrides}
                                            clearButtonMode="never"
                                        />
                                        {this.state.searching ? (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    right: 25,
                                                    justifyContent: 'center',
                                                }}>
                                                <ActivityIndicator size={'small'} color="grey" />
                                            </View>
                                        ) : null}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ filterModal: true })}
                                        style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require('../../_shared/assets/filter.png')}
                                            style={{ height: 35, width: 35, tintColor: 'grey' }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '90%',
                                        alignSelf: 'center',
                                    }}>
                                    <Menu
                                        ref={this.setMenuRef}
                                        button={
                                            <TouchableOpacity
                                                style={{
                                                    paddingHorizontal: 15,
                                                    backgroundColor: '#fff',
                                                    borderWidth: 0.5,
                                                    borderColor: COLORS.lightGray3,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    borderRadius: 15,
                                                    height: 30,
                                                    marginHorizontal: 2.5,
                                                    marginBottom: 10,
                                                    justifyContent: 'space-between',
                                                }}
                                                onPress={this.showMenu}>
                                                <Text style={styles.activeFilterText}>
                                                    {this.state.selectedRadius == 0
                                                        ? customTranslate('ml_AllLocations')
                                                        : this.state.selectedRadius == 'remote'
                                                            ? 'Remote'
                                                            : this.state.selectedRadius == 'country'
                                                                ? customTranslate('ml_MyCountry')
                                                                : customTranslate('ml_WithIn') +
                                                                ' ' +
                                                                this.state.selectedRadius +
                                                                ' ' +
                                                                customTranslate('ml_Miles')}
                                                </Text>
                                                <MaterialIcons
                                                    name={'arrow-drop-down'}
                                                    size={20}
                                                    color={COLORS.buttonGrayOutline}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }>
                                        <MenuItem
                                            onPress={() => this.handleRadiusSelect(0)}
                                            style={{ width: 250 }}>
                                            {customTranslate('ml_AllLocations')}
                                        </MenuItem>
                                        {get(this.state, 'location.country', '') ? (
                                            <MenuItem
                                                onPress={() => this.handleRadiusSelect('country')}
                                                style={{ width: 250 }}>
                                                {customTranslate('ml_MyCountry')}
                                            </MenuItem>
                                        ) : null}
                                        <MenuItem
                                            onPress={() => this.handleRadiusSelect('remote')}
                                            style={{ width: 250 }}>
                                            {'Remote'}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(25)}>
                                            {customTranslate('ml_WithIn')} 25{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(50)}>
                                            {customTranslate('ml_WithIn')} 50{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(100)}>
                                            {customTranslate('ml_WithIn')} 100{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(200)}>
                                            {customTranslate('ml_WithIn')} 200{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                    </Menu>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginHorizontal: 2.5,
                                            marginBottom: 15,
                                            marginTop: 5,
                                            marginLeft: 3,
                                        }}
                                        onPress={() =>
                                            this.setState({ showLocationModalFilter: true })
                                        }>
                                        <View
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: 7,
                                                backgroundColor: 'rgb(255, 168, 80)',
                                                marginRight: 5,
                                            }}></View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: 'gray',
                                                textTransform: 'capitalize',
                                            }}>
                                            {this.state.zip
                                                ? 'Zip: ' + this.state.zip
                                                : !this.state.location.city &&
                                                    !this.state.location.state
                                                    ? customTranslate('ml_NoLocation')
                                                    : `${this.state.location.city || ''}, ${this.state.location.state || ''
                                                    }`}
                                        </Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{ flex: 1, marginRight: -10, alignItems: 'flex-end' }}>
                                        {/* <TouchableOpacity
                      style={{marginTop: 5, marginLeft: 5}}
                      onPress={() =>
                        this.setState({doTranslation: true}, () =>
                          this.newFetchData(1),
                        )
                      }>
                      <Image
                        resizeMode="contain"
                        style={{width: 23, height: 23}}
                        source={require('../../_shared/assets/google.png')}
                      />
                    </TouchableOpacity> */}
                                    </View>
                                    <Modal visible={this.state.locationModal}>
                                        <SafeAreaView style={{ flex: 1 }}>
                                            <View style={{ flex: 1 }}>
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
                                                            <Text style={{ color: '#fff' }}>
                                                                {customTranslate('ml_Cancel')}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        </SafeAreaView>
                                    </Modal>
                                    <Modal
                                        visible={this.state.showLocationModalFilter}
                                        transparent>
                                        <SafeAreaView
                                            style={{
                                                flex: 1,
                                                backgroundColor: 'rgba(0,0,0,.4)',
                                                alignItems: 'center',
                                            }}>
                                            <View
                                                style={{
                                                    width: '90%',
                                                    maxHeight: height - 150,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 10,
                                                    paddingHorizontal: 10,
                                                    paddingBottom: 10,
                                                    maxWidth: 450,
                                                }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ flex: 10, justifyContent: 'center' }}>
                                                        <Text
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'center',
                                                                color: COLORS.grayMedium,
                                                                fontSize: 19,
                                                                marginBottom: 0,
                                                                fontWeight: '600',
                                                            }}>
                                                            {customTranslate('ml_ChangeJobSearchLocation')}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState((state) => ({
                                                                showLocationModalFilter: false,
                                                                tempLocation: state.location,
                                                            }));
                                                        }}
                                                        style={[
                                                            { alignSelf: 'flex-end' },
                                                            {
                                                                flex: 1,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            },
                                                        ]}>
                                                        {/* close button */}
                                                        {/* change to without circle  */}

                                                        <IonIcon
                                                            name="ios-close"
                                                            size={40}
                                                            color="#8f99a2"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity
                                                    style={{
                                                        //backgroundColor: COLORS.blue,
                                                        //padding: 10,
                                                        borderRadius: 5,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                    onPress={this.handleAndroidPermission}>
                                                    <EvilIcon
                                                        name="location"
                                                        size={25}
                                                        color={COLORS.blue}
                                                    />
                                                    <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                                        {customTranslate('ml_AutofillLocation')}
                                                    </Text>
                                                </TouchableOpacity>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 5,
                                                    }}>
                                                    <Text style={{ flex: 1.5 }}>
                                                        {customTranslate('ml_City')}:{' '}
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            {
                                                                borderRadius: 5,
                                                                borderWidth: 0.5,
                                                                height: 40,
                                                                padding: 4,
                                                            },
                                                            { justifyContent: 'center', flex: 5 },
                                                        ]}
                                                        onPress={() =>
                                                            this.setState({
                                                                locationModal: true,
                                                                showLocationModalFilter: false,
                                                                zip: '',
                                                            })
                                                        }>
                                                        <Text>{this.state.tempLocation.city}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 5,
                                                    }}>
                                                    <Text style={{ flex: 1.5 }}>
                                                        {customTranslate('ml_State')}:{' '}
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            {
                                                                borderRadius: 5,
                                                                borderWidth: 0.5,
                                                                height: 40,
                                                                padding: 4,
                                                                borderColor: COLORS.lightGray,
                                                            },
                                                            { justifyContent: 'center', flex: 5 },
                                                        ]}>
                                                        <Text style={{ color: COLORS.lightGray }}>
                                                            {this.state.tempLocation.state}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 5,
                                                    }}>
                                                    <Text style={{ flex: 1.5 }}>
                                                        {customTranslate('ml_Country')}:{' '}
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            {
                                                                borderRadius: 5,
                                                                borderWidth: 0.5,
                                                                height: 40,
                                                                padding: 4,
                                                            },
                                                            {
                                                                justifyContent: 'center',
                                                                flex: 5,
                                                                borderColor: COLORS.lightGray,
                                                            },
                                                        ]}>
                                                        <Text style={{ color: COLORS.lightGray }}>
                                                            {this.state.tempLocation.country}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                    Or
                                                </Text>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginTop: 5,
                                                    }}>
                                                    <Text style={{ flex: 1.5 }}>{'Zip Code'}: </Text>
                                                    <TextInput
                                                        onChangeText={(val) =>
                                                            this.setState({
                                                                zip: val,
                                                                tempLocation: {
                                                                    country: '',
                                                                    state: '',
                                                                    city: '',
                                                                },
                                                            })
                                                        }
                                                        style={[
                                                            {
                                                                borderRadius: 5,
                                                                borderWidth: 0.5,
                                                                height: 40,
                                                                padding: 4,
                                                            },
                                                            {
                                                                justifyContent: 'center',
                                                                flex: 5,
                                                                borderColor: COLORS.lightGray,
                                                            },
                                                        ]}
                                                    />
                                                </View>
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: 10,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginTop: 10,
                                                        backgroundColor: COLORS.primary,
                                                        borderRadius: 5,
                                                        flexDirection: 'row',
                                                    }}
                                                    onPress={() => {
                                                        this.setState(
                                                            (state) => ({
                                                                location: state.tempLocation,
                                                                showLocationModalFilter: false,
                                                            }),
                                                            () => {
                                                                this.getLatLngFromAddress(
                                                                    this.state.location.city,
                                                                    this.state.location.state,
                                                                    this.state.zip,
                                                                ).then(() => this.apiTest());
                                                            },
                                                        );
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: '#fff',
                                                            fontSize: 20,
                                                            fontWeight: '300',
                                                            marginRight: 5,
                                                        }}>
                                                        {customTranslate('ml_Update')}
                                                    </Text>
                                                    {/* <Icon name="checkmark_circle" color="white" /> */}
                                                </TouchableOpacity>
                                            </View>
                                        </SafeAreaView>
                                    </Modal>
                                </View>
                            </View>
                        )}

                        {!this.props.onDeckRefer && width > 450 && (
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                }}>
                                <ScrollView
                                    horizontal
                                    style={{
                                        paddingTop: 0,
                                        paddingBottom: width > 450 ? 0 : 5,
                                        paddingHorizontal: width > 450 ? 0 : 2.5,
                                    }}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ alignItems: 'center' }}>
                                    <TouchableOpacity
                                        style={styles.filterButton}
                                        //onPress={() => console.log("on pressed",)}
                                        onPress={() => this.setState({ showDepartments: true })}>
                                        <Text
                                            style={
                                                Object.keys(this.state.depts).length > 0
                                                    ? styles.activeFilterText
                                                    : styles.inactiveFilterText
                                            }>
                                            {customTranslate('ml_Departments')}
                                        </Text>
                                        <IonIcon
                                            name={'md-arrow-dropdown'}
                                            size={20}
                                            color={COLORS.buttonGrayOutline}
                                            style={{ marginLeft: 10, marginTop: 2 }}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.filterButton}
                                        onPress={() => this.setState({ showBonuses: true })}>
                                        <Text
                                            style={
                                                Object.keys(this.state.bon).length > 0
                                                    ? styles.activeFilterText
                                                    : styles.inactiveFilterText
                                            }>
                                            Bonus
                                        </Text>
                                        <IonIcon
                                            name={'md-arrow-dropdown'}
                                            size={20}
                                            color={COLORS.buttonGrayOutline}
                                            style={{ marginLeft: 10, marginTop: 2 }}
                                        />
                                    </TouchableOpacity>
                                    <Menu
                                        ref={this.setMenuRef}
                                        button={
                                            <TouchableOpacity
                                                style={styles.filterButton}
                                                onPress={this.showMenu}>
                                                <Text style={styles.activeFilterText}>
                                                    {this.state.selectedRadius == 0
                                                        ? customTranslate('ml_AllLocations')
                                                        : customTranslate('ml_WithIn') +
                                                        ' ' +
                                                        this.state.selectedRadius +
                                                        ' ' +
                                                        customTranslate('ml_Miles')}
                                                </Text>
                                                <IonIcon
                                                    name={'md-arrow-dropdown'}
                                                    size={20}
                                                    color={COLORS.buttonGrayOutline}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }>
                                        <MenuItem
                                            onPress={() => this.handleRadiusSelect(0)}
                                            style={{ width: 250 }}>
                                            {customTranslate('ml_AllLocations')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(25)}>
                                            {customTranslate('ml_WithIn')} 25{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(50)}>
                                            {customTranslate('ml_WithIn')} 50{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(100)}>
                                            {customTranslate('ml_WithIn')} 100{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                        <MenuItem onPress={() => this.handleRadiusSelect(200)}>
                                            {customTranslate('ml_WithIn')} 200{' '}
                                            {customTranslate('ml_Miles')}
                                        </MenuItem>
                                    </Menu>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginHorizontal: 2.5,
                                            marginRight: 10,
                                        }}
                                        onPress={() => this.setState({ showLocationModal: true })}>
                                        <View
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: 7,
                                                backgroundColor: 'rgb(255, 168, 80)',
                                                marginRight: 5,
                                            }}></View>
                                        <Text style={{ fontSize: 14, color: 'gray' }}>
                                            {!this.state.location.city && !this.state.location.state
                                                ? 'No location'
                                                : `${this.state.location.city || ''}, ${this.state.location.state || ''
                                                }`}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.filterButton}
                                        onPress={() =>
                                            this.setState(
                                                (state) => ({
                                                    status: state.status == 'open' ? 'closed' : 'open',
                                                    statusChange: true,
                                                }),
                                                () => this.apiTest(),
                                            )
                                        }>
                                        <Text
                                            style={
                                                this.state.status == 'open'
                                                    ? styles.activeFilterText
                                                    : styles.inactiveFilterText
                                            }>
                                            {this.state.status == 'open'
                                                ? customTranslate('ml_Jobs_OpenJobs')
                                                : customTranslate('ml_ClosedJobs')}
                                        </Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                {width > 450 && (
                                    <View style={{ width: 250 }}>
                                        <SearchBar
                                            placeholder={customTranslate('ml_Search')}
                                            onChange={(text) => {
                                                this.handleSearch(text);
                                            }}
                                            showCancelButton={false}
                                            styles={SearchBarOverrides}
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                    <Modal visible={this.state.showDepartments} transparent>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,.4)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: width - 30,
                                    maxHeight: height - 150,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    maxWidth: 450,
                                }}>
                                <TouchableOpacity
                                    style={{
                                        width: 40,
                                        alignSelf: 'flex-end',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() =>
                                        this.setState((state) => ({
                                            showDepartments: false,
                                            filters: { ...state.filters, departments: state.depts },
                                        }))
                                    }>
                                    <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                </TouchableOpacity>
                                <ScrollView style={{ padding: 10 }}>
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {this.state.departments &&
                                            this.state.departments?.length > 0 &&
                                            this.state.departments.map((dep) => (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: this.state.filters.departments[
                                                            dep.id
                                                        ]
                                                            ? 'rgb(189, 249, 189)'
                                                            : 'transparent',
                                                        height: 40,
                                                        borderRadius: 5,
                                                        paddingHorizontal: 10,
                                                        marginBottom: 5,
                                                        marginRight: 3,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        borderWidth: this.state.filters.departments[dep.id]
                                                            ? 0
                                                            : 1,
                                                        borderColor: '#888',
                                                    }}
                                                    key={dep.id}
                                                    onPress={() => {
                                                        let tempDepts = { ...this.state.filters.departments };
                                                        if (tempDepts[dep.id]) {
                                                            delete tempDepts[dep.id];
                                                        } else {
                                                            tempDepts[dep.id] = dep.name;
                                                        }
                                                        this.setState({
                                                            filters: {
                                                                ...this.state.filters,
                                                                departments: tempDepts,
                                                            },
                                                        });
                                                    }}>
                                                    {/* <Text
                                                        style={{
                                                            color: this.state.filters.departments[dep.id]
                                                                ? 'rgb(29, 134, 29)'
                                                                : '#777',
                                                        }}>
                                                        {dep.name}
                                                    </Text> */}
                                                    {/* <TouchableOpacity
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() => {
                                    let temp = [...this.state.selectedDepartments];
                                    let tempDep = [...this.state.departments];
                                    let i = temp.findIndex(item => item.id == dep.id);
                                    tempDep.push(dep);
                                    temp.splice(i, 1);
                                    this.setState(
                                      {
                                        selectedDepartments: temp,
                                        departments: tempDep,
                                      },
                                      () => console.log('slfldksflsf', this.state)
                                    );
                                  }}
                                >
                                  <IonIcon name="ios-close" size={25} color="gray" />
                                </TouchableOpacity> */}
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                </ScrollView>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            //backgroundColor: COLORS.red,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            margin: 5,
                                            flex: 1,
                                            borderWidth: 0.5,
                                            borderColor: COLORS.buttonGrayOutline,
                                        }}
                                        onPress={() => {
                                            this.setState(
                                                (state) => ({
                                                    filters: { ...state.filters, departments: {} },
                                                    depts: {},
                                                }),
                                                () => {
                                                    this.apiTest();
                                                },
                                            );
                                        }}>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 20,
                                                fontWeight: '300',
                                                marginRight: 5,
                                                color: COLORS.buttonGrayText,
                                                textTransform: 'capitalize',
                                            }}>
                                            {customTranslate('ml_Clear')}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            margin: 5,
                                            flex: 1,
                                        }}
                                        onPress={() => {
                                            this.setState(
                                                (state) => ({
                                                    depts: state.filters.departments,
                                                    showDepartments: false,
                                                }),
                                                () => {
                                                    this.apiTest();
                                                },
                                            );
                                        }}>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 20,
                                                fontWeight: '300',
                                                marginRight: 5,
                                                textTransform: 'capitalize',
                                            }}>
                                            {customTranslate('ml_Apply')}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Modal visible={this.state.showBonuses} transparent>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,.4)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: width - 30,
                                    maxHeight: height - 150,
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    maxWidth: 450,
                                }}>
                                <TouchableOpacity
                                    style={{
                                        width: 40,
                                        alignSelf: 'flex-end',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={() =>
                                        this.setState((state) => ({
                                            showBonuses: false,
                                            filters: { ...state.filters, bonuses: state.bon },
                                        }))
                                    }>
                                    <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                </TouchableOpacity>
                                <ScrollView style={{ padding: 10 }}>
                                    <View
                                        style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {this.state.bonuses &&
                                            this.state.bonuses.length > 0 &&
                                            this.state.bonuses.map((b) => (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: this.state.filters.bonuses[b.id]
                                                            ? 'rgb(189, 249, 189)'
                                                            : 'transparent',
                                                        height: 40,
                                                        borderRadius: 5,
                                                        paddingHorizontal: 10,
                                                        marginBottom: 5,
                                                        marginRight: 3,
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        borderWidth: this.state.filters.bonuses[b.id]
                                                            ? 0
                                                            : 1,
                                                        borderColor: '#888',
                                                    }}
                                                    key={b.id}
                                                    onPress={() => {
                                                        let tempBonuses = { ...this.state.filters.bonuses };
                                                        if (tempBonuses[b.id]) {
                                                            delete tempBonuses[b.id];
                                                        } else {
                                                            tempBonuses[b.id] = b.name;
                                                        }
                                                        this.setState({
                                                            filters: {
                                                                ...this.state.filters,
                                                                bonuses: tempBonuses,
                                                            },
                                                        });
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: this.state.filters.bonuses[b.id]
                                                                ? 'rgb(29, 134, 29)'
                                                                : '#777',
                                                        }}>
                                                        {b.name}
                                                    </Text>
                                                    {/* <TouchableOpacity
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() => {
                                    let temp = [...this.state.selectedDepartments];
                                    let tempDep = [...this.state.departments];
                                    let i = temp.findIndex(item => item.id == dep.id);
                                    tempDep.push(dep);
                                    temp.splice(i, 1);
                                    this.setState(
                                      {
                                        selectedDepartments: temp,
                                        departments: tempDep,
                                      },
                                      () => console.log('slfldksflsf', this.state)
                                    );
                                  }}
                                >
                                  <IonIcon name="ios-close" size={25} color="gray" />
                                </TouchableOpacity> */}
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                </ScrollView>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            //backgroundColor: COLORS.red,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            margin: 5,
                                            flex: 1,
                                            borderWidth: 0.5,
                                            borderColor: COLORS.buttonGrayOutline,
                                        }}
                                        onPress={() => {
                                            this.setState(
                                                (state) => ({
                                                    filters: { ...state.filters, bonuses: {} },
                                                    bon: {},
                                                }),
                                                () => {
                                                    this.apiTest();
                                                },
                                            );
                                        }}>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 20,
                                                fontWeight: '300',
                                                marginRight: 5,
                                                color: COLORS.buttonGrayText,
                                                textTransform: 'capitalize',
                                            }}>
                                            {customTranslate('ml_Clear')}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            margin: 5,
                                            flex: 1,
                                        }}
                                        onPress={() => {
                                            this.setState(
                                                (state) => ({
                                                    bon: state.filters.bonuses,
                                                    showBonuses: false,
                                                }),
                                                () => {
                                                    this.apiTest();
                                                },
                                            );
                                        }}>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 20,
                                                fontWeight: '300',
                                                marginRight: 5,
                                                textTransform: 'capitalize',
                                            }}>
                                            {customTranslate('ml_Apply')}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Modal visible={this.state.locationModal}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{ flex: 1 }}>
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
                                                    showLocationModal: true,
                                                })
                                            }>
                                            <Text style={{ color: '#fff' }}>
                                                {customTranslate('ml_Cancel')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Modal visible={this.state.showLocationModal} transparent>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,.4)',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: '90%',
                                    maxHeight: height - 150,
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    paddingHorizontal: 10,
                                    paddingBottom: 10,
                                    maxWidth: 450,
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 10, justifyContent: 'center' }}>
                                        <Text
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                color: COLORS.grayMedium,
                                                fontSize: 19,
                                                marginBottom: 0,
                                                fontWeight: '600',
                                            }}>
                                            {customTranslate('ml_ChangeJobSearchLocation')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState((state) => ({
                                                showLocationModal: false,
                                                tempLocation: state.location,
                                            }));
                                        }}
                                        style={[
                                            { alignSelf: 'flex-end' },
                                            {
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            },
                                        ]}>
                                        {/* close button */}
                                        {/* change to without circle  */}

                                        <IonIcon name="ios-close" size={40} color="#8f99a2" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        //backgroundColor: COLORS.blue,
                                        //padding: 10,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                    onPress={this.handleAndroidPermission}>
                                    <EvilIcon name="location" size={25} color={COLORS.blue} />
                                    <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                        {customTranslate('ml_AutofillLocation')}
                                    </Text>
                                </TouchableOpacity>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5,
                                    }}>
                                    <Text style={{ flex: 1.5 }}>
                                        {customTranslate('ml_City')}:{' '}
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                borderRadius: 5,
                                                borderWidth: 0.5,
                                                height: 40,
                                                padding: 4,
                                            },
                                            { justifyContent: 'center', flex: 5 },
                                        ]}
                                        onPress={() =>
                                            this.setState({
                                                locationModal: true,
                                                showLocationModal: false,
                                                zip: '',
                                            })
                                        }>
                                        <Text>{this.state.tempLocation.city}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5,
                                    }}>
                                    <Text style={{ flex: 1.5 }}>
                                        {customTranslate('ml_State')}:{' '}
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                borderRadius: 5,
                                                borderWidth: 0.5,
                                                height: 40,
                                                padding: 4,
                                                borderColor: COLORS.lightGray,
                                            },
                                            { justifyContent: 'center', flex: 5 },
                                        ]}>
                                        <Text style={{ color: COLORS.lightGray }}>
                                            {this.state.tempLocation.state}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5,
                                    }}>
                                    <Text style={{ flex: 1.5 }}>
                                        {customTranslate('ml_Country')}:{' '}
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            {
                                                borderRadius: 5,
                                                borderWidth: 0.5,
                                                height: 40,
                                                padding: 4,
                                            },
                                            {
                                                justifyContent: 'center',
                                                flex: 5,
                                                borderColor: COLORS.lightGray,
                                            },
                                        ]}>
                                        <Text style={{ color: COLORS.lightGray }}>
                                            {this.state.tempLocation.country}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ textAlign: 'center', marginTop: 5 }}>Or</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 5,
                                    }}>
                                    <Text style={{ flex: 1.5 }}>{'Zip Code'}: </Text>
                                    <TextInput
                                        onChangeText={(val) =>
                                            this.setState({
                                                zip: val,
                                                tempLocation: {
                                                    country: '',
                                                    state: '',
                                                    city: '',
                                                },
                                            })
                                        }
                                        style={[
                                            {
                                                borderRadius: 5,
                                                borderWidth: 0.5,
                                                height: 40,
                                                padding: 4,
                                            },
                                            {
                                                justifyContent: 'center',
                                                flex: 5,
                                                borderColor: COLORS.lightGray,
                                            },
                                        ]}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{
                                        paddingVertical: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 10,
                                        backgroundColor: COLORS.blue,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                    }}
                                    onPress={() => {
                                        this.setState(
                                            (state) => ({
                                                location: state.tempLocation,
                                                showLocationModal: false,
                                            }),
                                            () => {
                                                this.getLatLngFromAddress(
                                                    this.state.location.city,
                                                    this.state.location.state,
                                                    this.state.zip,
                                                ).then(() => this.apiTest());
                                            },
                                        );
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 20,
                                            fontWeight: '300',
                                            marginRight: 5,
                                        }}>
                                        {customTranslate('ml_Update')}
                                    </Text>
                                    {/* <Icon name="checkmark_circle" color="white" /> */}
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                    <Modal visible={this.state.filterModal} transparent>
                        <Modal visible={this.state.showDepartmentsFilter} transparent>
                            <SafeAreaView
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,.4)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        width: width - 30,
                                        maxHeight: height - 150,
                                        backgroundColor: '#fff',
                                        borderRadius: 5,
                                        maxWidth: 450,
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 40,
                                            alignSelf: 'flex-end',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() =>
                                            this.setState((state) => ({
                                                showDepartmentsFilter: false,
                                                filters: { ...state.filters, departments: state.depts },
                                            }))
                                        }>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                    <ScrollView style={{ padding: 10 }}>
                                        <View
                                            style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {this.state.departments &&
                                                this.state.departments?.length > 0 &&
                                                this.state.departments.map((dep) => (
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: this.state.filters.departments[
                                                                dep.id
                                                            ]
                                                                ? 'rgb(189, 249, 189)'
                                                                : 'transparent',
                                                            height: 40,
                                                            borderRadius: 5,
                                                            paddingHorizontal: 10,
                                                            marginBottom: 5,
                                                            marginRight: 3,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            borderWidth: this.state.filters.departments[
                                                                dep.id
                                                            ]
                                                                ? 0
                                                                : 1,
                                                            borderColor: '#888',
                                                        }}
                                                        key={dep.id}
                                                        onPress={() => {
                                                            let tempDepts = {
                                                                ...this.state.filters.departments,
                                                            };
                                                            if (tempDepts[dep.id]) {
                                                                delete tempDepts[dep.id];
                                                            } else {
                                                                tempDepts[dep.id] = dep.name;
                                                            }
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    departments: tempDepts,
                                                                },
                                                            });
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: this.state.filters.departments[dep.id]
                                                                    ? 'rgb(29, 134, 29)'
                                                                    : '#777',
                                                            }}>
                                                            {dep.name}
                                                        </Text>
                                                        {/* <TouchableOpacity
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() => {
                                    let temp = [...this.state.selectedDepartments];
                                    let tempDep = [...this.state.departments];
                                    let i = temp.findIndex(item => item.id == dep.id);
                                    tempDep.push(dep);
                                    temp.splice(i, 1);
                                    this.setState(
                                      {
                                        selectedDepartments: temp,
                                        departments: tempDep,
                                      },
                                      () => console.log('slfldksflsf', this.state)
                                    );
                                  }}
                                >
                                  <IonIcon name="ios-close" size={25} color="gray" />
                                </TouchableOpacity> */}
                                                    </TouchableOpacity>
                                                ))}
                                        </View>
                                    </ScrollView>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        filters: { ...state.filters, departments: {} },
                                                        depts: {},
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.clearButtonText}>
                                                {customTranslate('ml_Clear')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.applyButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        depts: state.filters.departments,
                                                        showDepartmentsFilter: false,
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.applyButtonText}>
                                                {customTranslate('ml_Apply')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                        <Modal visible={this.state.showSubCompanyFilterModal} transparent>
                            <SafeAreaView
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,.4)',
                                    alignItems: 'center',
                                    paddingTop: 20,
                                    justifyContent: 'center',
                                }}>
                                <View
                                    key={this.state.keyUpdate}
                                    style={{
                                        width: width - 30,
                                        maxHeight: height / 1.5,
                                        backgroundColor: '#fff',
                                        borderRadius: 5,
                                        maxWidth: 450,
                                    }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            placeholder="Search Sub Company"
                                            onChangeText={(val) => {
                                                let arr = this.state.allSubCompanies.filter((item) =>
                                                    item.name
                                                        .toLowerCase()
                                                        .includes(val.toLocaleLowerCase()),
                                                );
                                                this.setState({ subCompanies: arr });
                                            }}
                                            style={[
                                                {
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 40,
                                                    padding: 4,
                                                    margin: 10,
                                                    flex: 1,
                                                },
                                                {
                                                    justifyContent: 'center',
                                                    borderColor: COLORS.lightGray,
                                                },
                                            ]}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                paddingHorizontal: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() =>
                                                this.setState((state) => ({
                                                    showSubCompanyFilterModal: false,
                                                    filters: {
                                                        ...state.filters,
                                                        subCompanies: state.subComps,
                                                    },
                                                }))
                                            }>
                                            <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={{ padding: 10 }}>
                                        <View
                                            style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {this.state.allSubCompanies &&
                                                this.state.allSubCompanies.length > 0 &&
                                                _.orderBy(
                                                    this.state.allSubCompanies,
                                                    ['name'],
                                                    ['asc'],
                                                ).map((dep) => (
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: this.state.filters.subCompanies[
                                                                dep.id
                                                            ]
                                                                ? 'rgb(189, 249, 189)'
                                                                : 'transparent',
                                                            height: 40,
                                                            borderRadius: 5,
                                                            paddingHorizontal: 10,
                                                            marginBottom: 5,
                                                            marginRight: 3,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            borderWidth: this.state.filters.subCompanies[
                                                                dep.id
                                                            ]
                                                                ? 0
                                                                : 1,
                                                            borderColor: '#888',
                                                        }}
                                                        key={dep.id}
                                                        onPress={() => {
                                                            let tempDepts = {
                                                                ...this.state.filters.subCompanies,
                                                            };
                                                            if (tempDepts[dep.id]) {
                                                                delete tempDepts[dep.id];
                                                            } else {
                                                                tempDepts[dep.id] = dep.name;
                                                            }
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    subCompanies: tempDepts,
                                                                },
                                                            });
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: this.state.filters.subCompanies[dep.id]
                                                                    ? 'rgb(29, 134, 29)'
                                                                    : '#777',
                                                            }}>
                                                            {dep.name}
                                                        </Text>
                                                        {/* <TouchableOpacity
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() => {
                                    let temp = [...this.state.selectedDepartments];
                                    let tempDep = [...this.state.departments];
                                    let i = temp.findIndex(item => item.id == dep.id);
                                    tempDep.push(dep);
                                    temp.splice(i, 1);
                                    this.setState(
                                      {
                                        selectedDepartments: temp,
                                        departments: tempDep,
                                      },
                                      () => console.log('slfldksflsf', this.state)
                                    );
                                  }}
                                >
                                  <IonIcon name="ios-close" size={25} color="gray" />
                                </TouchableOpacity> */}
                                                    </TouchableOpacity>
                                                ))}
                                        </View>
                                    </ScrollView>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        filters: { ...state.filters, subCompanies: {} },
                                                        subComps: {},
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.clearButtonText}>
                                                {customTranslate('ml_Clear')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.applyButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        subComps: state.filters.subCompanies,
                                                        showSubCompanyFilterModal: false,
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.applyButtonText}>
                                                {customTranslate('ml_Apply')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                        <Modal visible={this.state.showBonusesFilter} transparent>
                            <SafeAreaView
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,.4)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        width: width - 30,
                                        maxHeight: height - 150,
                                        backgroundColor: '#fff',
                                        borderRadius: 5,
                                        maxWidth: 450,
                                    }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 40,
                                            alignSelf: 'flex-end',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() =>
                                            this.setState((state) => ({
                                                showBonusesFilter: false,
                                                filters: { ...state.filters, bonuses: state.bon },
                                            }))
                                        }>
                                        <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                    </TouchableOpacity>
                                    <ScrollView style={{ padding: 10 }}>
                                        <View
                                            style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {this.state.bonuses &&
                                                this.state.bonuses.length > 0 &&
                                                this.state.bonuses.map((b) => (
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: this.state.filters.bonuses[b.id]
                                                                ? 'rgb(189, 249, 189)'
                                                                : 'transparent',
                                                            height: 40,
                                                            borderRadius: 5,
                                                            paddingHorizontal: 10,
                                                            marginBottom: 5,
                                                            marginRight: 3,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            borderWidth: this.state.filters.bonuses[b.id]
                                                                ? 0
                                                                : 1,
                                                            borderColor: '#888',
                                                        }}
                                                        key={b.id}
                                                        onPress={() => {
                                                            let tempBonuses = { ...this.state.filters.bonuses };
                                                            if (tempBonuses[b.id]) {
                                                                delete tempBonuses[b.id];
                                                            } else {
                                                                tempBonuses[b.id] = b.name;
                                                            }
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    bonuses: tempBonuses,
                                                                },
                                                            });
                                                        }}>
                                                        <Text
                                                            style={{
                                                                color: this.state.filters.bonuses[b.id]
                                                                    ? 'rgb(29, 134, 29)'
                                                                    : '#777',
                                                            }}>
                                                            {this.getAmountFromBonus(b)}
                                                        </Text>
                                                        {/* <TouchableOpacity
                                  style={{
                                    paddingHorizontal: 5,
                                    justifyContent: 'center',
                                  }}
                                  onPress={() => {
                                    let temp = [...this.state.selectedDepartments];
                                    let tempDep = [...this.state.departments];
                                    let i = temp.findIndex(item => item.id == dep.id);
                                    tempDep.push(dep);
                                    temp.splice(i, 1);
                                    this.setState(
                                      {
                                        selectedDepartments: temp,
                                        departments: tempDep,
                                      },
                                      () => console.log('slfldksflsf', this.state)
                                    );
                                  }}
                                >
                                  <IonIcon name="ios-close" size={25} color="gray" />
                                </TouchableOpacity> */}
                                                    </TouchableOpacity>
                                                ))}
                                        </View>
                                    </ScrollView>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        filters: { ...state.filters, bonuses: {} },
                                                        bon: {},
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.clearButtonText}>
                                                {customTranslate('ml_Clear')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.applyButton}
                                            onPress={() => {
                                                this.setState(
                                                    (state) => ({
                                                        bon: state.filters.bonuses,
                                                        showBonusesFilter: false,
                                                    }),
                                                    () => {
                                                        this.apiTest();
                                                    },
                                                );
                                            }}>
                                            <Text style={styles.applyButtonText}>
                                                {customTranslate('ml_Apply')}
                                            </Text>
                                            {/* <Icon name="checkmark_circle" color="white" /> */}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal>
                        <Modal visible={this.state.locationModal}>
                            <SafeAreaView style={{ flex: 1 }}>
                                <View style={{ flex: 1 }}>
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
                                                <Text style={{ color: '#fff' }}>
                                                    {customTranslate('ml_Cancel')}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </SafeAreaView>
                        </Modal>
                        <Modal visible={this.state.showLocationModalFilter} transparent>
                            <SafeAreaView
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(0,0,0,.4)',
                                    alignItems: 'center',
                                }}>
                                <View
                                    style={{
                                        width: '90%',
                                        maxHeight: height - 150,
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        paddingHorizontal: 10,
                                        paddingBottom: 10,
                                        maxWidth: 450,
                                    }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 10, justifyContent: 'center' }}>
                                            <Text
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    color: COLORS.grayMedium,
                                                    fontSize: 19,
                                                    marginBottom: 0,
                                                    fontWeight: '600',
                                                }}>
                                                {customTranslate('ml_ChangeJobSearchLocation')}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState((state) => ({
                                                    showLocationModalFilter: false,
                                                    tempLocation: state.location,
                                                }));
                                            }}
                                            style={[
                                                { alignSelf: 'flex-end' },
                                                {
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                            ]}>
                                            {/* close button */}
                                            {/* change to without circle  */}

                                            <IonIcon name="ios-close" size={40} color="#8f99a2" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            //backgroundColor: COLORS.blue,
                                            //padding: 10,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}
                                        onPress={this.handleAndroidPermission}>
                                        <EvilIcon name="location" size={25} color={COLORS.blue} />
                                        <Text style={{ color: COLORS.blue, marginLeft: 1 }}>
                                            {customTranslate('ml_AutofillLocation')}
                                        </Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}>
                                        <Text style={{ flex: 1.5 }}>
                                            {customTranslate('ml_City')}:{' '}
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                {
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 40,
                                                    padding: 4,
                                                },
                                                { justifyContent: 'center', flex: 5 },
                                            ]}
                                            onPress={() =>
                                                this.setState({
                                                    locationModal: true,
                                                    showLocationModalFilter: false,
                                                    zip: '',
                                                })
                                            }>
                                            <Text>{this.state.tempLocation.city}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}>
                                        <Text style={{ flex: 1.5 }}>
                                            {customTranslate('ml_State')}:{' '}
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                {
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 40,
                                                    padding: 4,
                                                    borderColor: COLORS.lightGray,
                                                },
                                                { justifyContent: 'center', flex: 5 },
                                            ]}>
                                            <Text style={{ color: COLORS.lightGray }}>
                                                {this.state.tempLocation.state}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}>
                                        <Text style={{ flex: 1.5 }}>
                                            {customTranslate('ml_Country')}:{' '}
                                        </Text>
                                        <TouchableOpacity
                                            style={[
                                                {
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 40,
                                                    padding: 4,
                                                },
                                                {
                                                    justifyContent: 'center',
                                                    flex: 5,
                                                    borderColor: COLORS.lightGray,
                                                },
                                            ]}>
                                            <Text style={{ color: COLORS.lightGray }}>
                                                {this.state.tempLocation.country}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>Or</Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginTop: 5,
                                        }}>
                                        <Text style={{ flex: 1.5 }}>{'Zip Code'}: </Text>
                                        <TextInput
                                            onChangeText={(val) =>
                                                this.setState({
                                                    zip: val,
                                                    tempLocation: {
                                                        country: '',
                                                        state: '',
                                                        city: '',
                                                    },
                                                })
                                            }
                                            style={[
                                                {
                                                    borderRadius: 5,
                                                    borderWidth: 0.5,
                                                    height: 40,
                                                    padding: 4,
                                                },
                                                {
                                                    justifyContent: 'center',
                                                    flex: 5,
                                                    borderColor: COLORS.lightGray,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            paddingVertical: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: 10,
                                            backgroundColor: COLORS.blue,
                                            borderRadius: 5,
                                            flexDirection: 'row',
                                        }}
                                        onPress={() => {
                                            this.setState(
                                                (state) => ({
                                                    location: state.tempLocation,
                                                    showLocationModalFilter: false,
                                                }),
                                                () => {
                                                    this.getLatLngFromAddress(
                                                        this.state.location.city,
                                                        this.state.location.state,
                                                        this.state.zip,
                                                    ).then(() => this.apiTest());
                                                },
                                            );
                                        }}>
                                        <Text
                                            style={{
                                                color: '#fff',
                                                fontSize: 20,
                                                fontWeight: '300',
                                                marginRight: 5,
                                            }}>
                                            {customTranslate('ml_Update')}
                                        </Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </Modal>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: COLORS.blackTransparent,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View
                                style={{
                                    width: '90%',
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    padding: 10,
                                }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                    <View style={{ paddingHorizontal: 10 }}></View>
                                    <Text style={{ fontSize: 20, color: 'grey' }}>
                                        {customTranslate('ml_FilterJobs')}
                                    </Text>
                                    <TouchableOpacity
                                        disabled={this.state.jobsToggle}
                                        onPress={() => this.setState({ filterModal: false })}
                                        style={{ paddingHorizontal: 10 }}>
                                        <IonIcon
                                            name={'ios-close'}
                                            size={30}
                                            color={COLORS.buttonGrayOutline}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        style={styles.filterRow}
                                        disabled={this.state.jobsToggle}
                                        onPress={() =>
                                            this.setState({ showDepartmentsFilter: true })
                                        }>
                                        <Text
                                            style={
                                                Object.keys(this.state.depts).length > 0
                                                    ? styles.activeFilterText
                                                    : styles.inactiveFilterText
                                            }>
                                            {customTranslate('ml_Departments')}
                                        </Text>
                                        <MaterialIcons
                                                    name={'arrow-drop-down'}
                                                    size={20}
                                                    color={COLORS.buttonGrayOutline}
                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                                />
                                    </TouchableOpacity>
                                    {this.state.subCompanies &&
                                        this.state.subCompanies.length > 0 ? (
                                        <TouchableOpacity
                                            style={styles.filterRow}
                                            disabled={this.state.jobsToggle}
                                            onPress={() => {
                                                this.getDepartments(),
                                                    this.setState({ showSubCompanyFilterModal: true });
                                            }}>
                                            <Text
                                                style={
                                                    Object.keys(this.state.subComps).length > 0
                                                        ? styles.activeFilterText
                                                        : styles.inactiveFilterText
                                                }>
                                                {this.props.currentUser?.company?.subCompanyLabel
                                                    ? this.props.currentUser?.company?.subCompanyLabel
                                                    : 'Company'}
                                            </Text>
                                            <MaterialIcons
                                                name={'arrow-drop-down'}
                                                size={20}
                                                color={COLORS.buttonGrayOutline}
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                            />
                                        </TouchableOpacity>
                                    ) : null}
                                    {!this.state.hideBonusFilterOnBrowseJobs && (
                                        <TouchableOpacity
                                            style={styles.filterRow}
                                            disabled={this.state.jobsToggle}
                                            onPress={() => this.setState({ showBonusesFilter: true })}>
                                            <Text
                                                style={
                                                    Object.keys(this.state.bon).length > 0
                                                        ? styles.activeFilterText
                                                        : styles.inactiveFilterText
                                                }>
                                                {customTranslate('ml_Bonus')}
                                            </Text>
                                            <MaterialIcons
                                                name={'arrow-drop-down'}
                                                size={20}
                                                color={COLORS.buttonGrayOutline}
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {allowSelfReferralsInternalLink && (
                                        <Menu
                                            ref={this.setMenu2Ref}
                                            button={
                                                <TouchableOpacity
                                                    onPress={this.showMenu2}
                                                    disabled={this.state.jobsToggle}
                                                    style={styles.filterRow}>
                                                    <Text style={styles.inactiveFilterText}>
                                                        {this.state.referralFilter == 0
                                                            ? "All (Refer / I'm Interested)"
                                                            : this.state.referralFilter == 1
                                                                ? 'Refer Someone'
                                                                : "I'm Interested"}
                                                    </Text>
                                                    <MaterialIcons
                                                    name={'arrow-drop-down'}
                                                    size={20}
                                                    color={COLORS.buttonGrayOutline}
                                                    style={{ marginLeft: 10, marginTop: 2 }}
                                            />
                                                </TouchableOpacity>
                                            }>
                                            <MenuItem
                                                onPress={() => this.handleReferralFilter(0)}
                                                style={{ width: 250 }}>
                                                All (Referral / I'm Interested)
                                            </MenuItem>
                                            <MenuItem
                                                onPress={() => this.handleReferralFilter(1)}
                                                style={{ width: 250 }}>
                                                Refer Someone
                                            </MenuItem>
                                            <MenuItem
                                                onPress={() => this.handleReferralFilter(2)}
                                                style={{ width: 250 }}>
                                                I'm Interested
                                            </MenuItem>
                                        </Menu>
                                    )}
                                    {/* <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 2.5,
                      marginBottom: 15,
                      marginTop: 5,
                      marginLeft: 3,
                    }}
                    onPress={() =>
                      this.setState({showLocationModalFilter: true})
                    }>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: 'rgb(255, 168, 80)',
                        marginRight: 5,
                      }}></View>
                    <Text style={{fontSize: 14, color: 'gray'}}>
                      {!this.state.location.city && !this.state.location.state
                        ? 'No location'
                        : `${this.state.location.city || ''}, ${
                            this.state.location.state || ''
                          }`}
                    </Text>
                  </TouchableOpacity> */}

                                    <TouchableOpacity
                                        style={styles.filterRow}
                                        disabled={this.state.jobsToggle}
                                        onPress={() =>
                                            this.setState(
                                                (state) => ({
                                                    status: state.status == 'open' ? 'closed' : 'open',
                                                    statusChange: true,
                                                }),
                                                () => this.apiTest(),
                                            )
                                        }>
                                        <Text
                                            style={
                                                this.state.status == 'open'
                                                    ? styles.activeFilterText
                                                    : styles.inactiveFilterText
                                            }>
                                            {this.state.status == 'open'
                                                ? customTranslate('ml_Jobs_OpenJobs')
                                                : customTranslate('ml_ClosedJobs')}
                                        </Text>
                                        <MaterialIcons
                                                name={'arrow-drop-down'}
                                                size={20}
                                                color={COLORS.buttonGrayOutline}
                                                style={{ marginLeft: 10, marginTop: 2 }}
                                            />
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            style={styles.clearButton}
                                            disabled={this.state.jobsToggle}
                                            onPress={() =>
                                                this.setState(
                                                    {
                                                        depts: {},
                                                        bon: {},
                                                        subComps: {},
                                                        status: 'open',
                                                        filters: {
                                                            status: 'open',
                                                            departments: {},
                                                            bonuses: {},
                                                            subCompanies: {},
                                                        },
                                                        referralFilter: 0,
                                                    },
                                                    () => this.apiTest(),
                                                )
                                            }>
                                            <Text style={styles.clearButtonText}>
                                                {customTranslate('ml_Clear')}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.applyButton}
                                            disabled={this.state.jobsToggle}
                                            onPress={() => this.setState({ filterModal: false })}>
                                            <Text style={styles.applyButtonText}>
                                                {customTranslate('ml_Apply')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.animatedModal}
                        // visible={true}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                        }}>
                        <View
                            style={{
                                height: height,
                                width: width,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                style={{ width: width - 40, height: height / 2 }}
                                source={require('../../_shared/assets/makingreferral300.gif')}
                            />
                        </View>
                    </Modal>
                    {/* animated modal end */}
                    <View style={styles.headerRow}>
                        {/* <View>
              <Text style={styles.openJobs}>{showClosed ? 'Closed' : 'Open'} Jobs</Text>
            </View> */}
                        {/* <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({ status: 'open' }, () => {
                    this.fetchData(1);
                  })
                }
              >
                <Text style={[styles.inactiveButton, !showClosed && styles.activeButton]}>
                  Open
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ status: 'closed' }, () => {
                    this.fetchData(1);
                  });
                }}
              >
                <Text style={[styles.inactiveButton, showClosed && styles.activeButton]}>
                  Closed
                </Text>
              </TouchableOpacity>
            </View> */}
                        <View />
                    </View>
                    {this.state.hotJobs &&
                        this.state.hotJobs.length &&
                        !this.state.showAll ? (
                        <View style={{ height: this.state.hotJobHeight }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 10,
                                    marginTop: 5,
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                    }}>
                                    {this.state.hotjobsTitle}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState((prev) => ({ showHot: !prev.showHot }))
                                    }>
                                    <Text style={{ color: COLORS.blue }}>
                                        {this.state.showHot ? 'Collapse' : this.state.showallTitle}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <FlatList
                                    horizontal={!this.state.showHot}
                                    pagingEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={[...this.state.hotJobs]}
                                    keyExtractor={(item) => item.id}
                                    extraData={[this.state.hotJobs]}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                width: Dimensions.get('window').width,
                                                alignItems: 'center',
                                            }}>
                                            {this.renderItem({ item })}
                                        </View>
                                    )}
                                />
                            </ScrollView>
                        </View>
                    ) : null}
                    {this.state.jobs &&
                        this.state.jobs.length > 0 &&
                        !this.state.showHot ? (
                        <React.Fragment>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginHorizontal: 10,
                                    marginTop: 5,
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                    }}>
                                    {this.state.allJobsTitle}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState((prev) => ({ showAll: !prev.showAll }))
                                    }>
                                    <Text style={{ color: COLORS.blue }}>
                                        {' '}
                                        {this.state.showAll ? 'Collapse' : this.state.showallTitle}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                onScroll={(e) => {
                                    if (e.nativeEvent.contentOffset.y > 10) {
                                        this.setState({ hotJobHeight: 0 });
                                    } else {
                                        this.setState({ hotJobHeight: 'auto' });
                                    }
                                }}
                                key={this.state.width}
                                numColumns={
                                    this.state.width > 450
                                        ? Math.floor(this.state.width / 300)
                                        : 1
                                }
                                removeClippedSubviews={false}
                                bounces={true}
                                // initialNumToRender={10}
                                // maxToRenderPerBatch={10}
                                // ref={(ref) => (this.flatlistRef = ref)}
                                // updateCellsBatchingPeriod={10}
                                onRefresh={() => {
                                    this.setState(
                                        {
                                            handlerefresh: true,
                                            reloading: true,
                                            latestJobs: [],
                                            searchTerm: '',
                                            nextToken: '',
                                        },
                                        () => this.newFetchData(1),
                                    );
                                    //this.getAllowSelfReferral(currentUser);
                                    //this.props.refetchJobs();
                                    // this.fetchDataOnRefresh()
                                }}
                                refreshing={this.state.reloading}
                                columnWrapperStyle={
                                    this.state.width > 450 ? { justifyContent: 'center' } : false
                                }
                                style={styles.outerListcontainer}
                                data={this.state.jobs}
                                renderItem={this.renderItem}
                                extraData={this.state.refreshList}
                                contentContainerStyle={styles.listContainer}
                                keyExtractor={(item) => item.id}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false;
                                }}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => {
                                    if (
                                        this.state.pageNumber + 1 >
                                        this.state.searchedJobs.length / 10 + 1 &&
                                        !this.state.onEndloading
                                    ) {
                                        this.setState({ onEndloading: true });
                                        //this.newFetchData(1);
                                    } else {
                                        if (!this.state.onEndloading) {
                                            this.setState({ onEndloading: true });
                                            this.newFetchData(this.state.pageNumber + 1);
                                        }
                                    }
                                }}
                            />
                            {onDeckRefer}
                        </React.Fragment>
                    ) : (
                        <View>
                            <View
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    alignItems: 'center',
                                    padding: 20,
                                    paddingTop: Dimensions.get('window').height / 8,
                                }}>
                                <Image
                                    source={getLightGrayLogo()}
                                    style={{
                                        height: Dimensions.get('window').width / 2,
                                        width: Dimensions.get('window').width / 2,
                                        marginBottom: 30,
                                    }}
                                />
                                {this.props.children}
                                <Text
                                    style={{
                                        color: '#999999',
                                        textAlign: 'center',
                                        marginHorizontal: 20,
                                        marginTop: 10,
                                    }}>
                                    {'There are no jobs that match your filters.'}
                                </Text>
                                <TouchableOpacity
                                    style={{
                                        borderColor: COLORS.dashboardBlue,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        padding: 10,
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}
                                    onPress={() => {
                                        //this.spin();
                                        //this.setState({pageLoading: true, latestJobs: []});
                                        this.setState(
                                            {
                                                depts: {},
                                                bon: {},
                                                subComps: {},
                                                status: 'open',
                                                filters: {
                                                    status: 'open',
                                                    departments: {},
                                                    bonuses: {},
                                                    subCompanies: {},
                                                },
                                                pageLoading: true,
                                                selectedRadius: 0,
                                            },
                                            () => {
                                                this.spin();
                                                this.apiTest();
                                            },
                                        );
                                    }}>
                                    <Text style={{ color: COLORS.dashboardBlue }}>
                                        Clear Search Filters
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ color: COLORS.grayMedium, marginTop: 10 }}>
                                    or{' '}
                                    <Text
                                        style={{ color: COLORS.dashboardBlue }}
                                        onPress={() => {
                                            this.spin();
                                            this.setState({ pageLoading: true, latestJobs: [] });
                                            this.apiTest();
                                        }}>
                                        Refresh Jobs
                                    </Text>
                                </Text>
                                {/* <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.red,
                    borderRadius: 5,
                    paddingVertical: 10,
                    marginTop: 10,
                    width: 100,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    //this.spin();
                    //this.setState({pageLoading: true, latestJobs: []});
                    this.apiTest();
                  }}>
                  <Text style={{color: '#fff'}}>{customTranslate('ml_Refresh')}</Text>
                </TouchableOpacity> */}
                            </View>
                        </View>
                    )}
                </View>
            );
        }
    }
}
export default withApollo(Jobs);
const styles = StyleSheet.create({
    loading: {
        paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    listContainer: {
        width: '100%',
        alignItems: 'center',
    },
    outerListcontainer: {
        marginTop: 5,
    },
    openJobs: { marginTop: 20, marginLeft: 15, fontSize: 15 },
    headerRow: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    activeButton: {
        color: COLORS.white,
        fontSize: 17,
    },
    inactiveButton: {
        borderColor: COLORS.buttonGrayOutline,
        fontSize: 17,
        color: COLORS.lightGray,
    },
    buttonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
        marginRight: 22,
    },
    noJobsText: {
        color: COLORS.darkGray,
        fontWeight: '600',
        fontSize: 16,
    },
    SubmitBtn: {
        backgroundColor: COLORS.blue,
        marginBottom: 0,
    },

    SubmitBtnText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '300',
    },

    SubmitBtnContainer: {
        marginHorizontal: '2%',
        width: '96%',
        justifyContent: 'center',
    },
    filterButton: {
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: COLORS.lightGray3,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginHorizontal: 2.5,
    },
    activeFilterText: { fontSize: 13, color: COLORS.blue, fontWeight: '700' },
    inactiveFilterText: {
        fontSize: 13,
        color: COLORS.lightGray,
        fontWeight: '400',
    },
    clearButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '300',
        marginRight: 5,
        color: COLORS.buttonGrayText,
        textTransform: 'capitalize',
    },
    clearButton: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        //backgroundColor: COLORS.red,
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        flex: 1,
        borderWidth: 0.5,
        borderColor: COLORS.buttonGrayOutline,
    },
    applyButton: {
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        flex: 1,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '300',
        marginRight: 5,
        textTransform: 'capitalize',
    },
    filterRow: {
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderColor: COLORS.lightGray3,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        marginHorizontal: 2.5,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
});
