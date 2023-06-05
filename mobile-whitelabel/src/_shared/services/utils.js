// import Cookies from 'js-cookie';
import moment from 'moment';
import get from 'lodash/get';
import { searchNetwork } from './network-search-api.service';
import { searchUserNetwork } from './network-search-user-api.service';

export const authHeader = () => {
    // const jwt = Cookies.get('jwt');
    return {
        // Authorization: `Bearer ${jwt}`,
    };
};

export const normalizeDollar = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const compose = (...funcs) => {
    if (funcs.length === 0) {
        return (arg) => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

export const getTieredBonusAmount = (
    tieredBonus,
    tieredBonusType,
    userGroupId,
    hireDate,
    currencyRate,
) => {
    let comptotal
    return tieredBonus.tiers.reduce((total, tier) => {

        // console.log("tier", typeof tier)
        if (typeof tier == 'string') {
            tier = JSON.parse(tier);
        }
        //  console.log("user group", userGroupId)

        const payOutDate = moment(hireDate).add(tier.payOutDays, 'days');

        const validDate = hireDate ? moment().isAfter(payOutDate) : true;
        //  console.log("valid date", tier)
        if (
            !tieredBonusType ||
            (tier.recipientType &&
                tier.recipientType.toLowerCase() === tieredBonusType.toLowerCase())
        ) {
            // console.log("inside called")
            // If hireDate is included only include eligible dates in total
            if (validDate && get(tier, 'userGroup') === userGroupId)
                total += parseInt(tier.amount * currencyRate, 10);
        }
        // console.log("total", total)
        return total;
    }, 0);
};

export const calculateReferralBonus = (
    contactIncentiveBonus,
    referralBonusAmount,
    eligible,
    tieredBonus,
    tieredBonusType,
    userGroupId,
    rate,
    hireDate,
) => {

    const currencyRate = rate ? rate : 1;
    const programActive = contactIncentiveBonus > 0;

    let tieredBonusAmount = 0;
    if (tieredBonus) {
        tieredBonusAmount = getTieredBonusAmount(
            tieredBonus,
            tieredBonusType,
            userGroupId,
            hireDate,
            currencyRate,
        );
    }

    if (tieredBonus) {
        // console.log("bnous amount", tieredBonusAmount)
        return tieredBonusAmount;
    }
    if (!referralBonusAmount || referralBonusAmount === 0) {

        return 0;
    } else if (!programActive) {

        return parseInt(referralBonusAmount * currencyRate);
    } else if (programActive && eligible) {
        return parseInt(referralBonusAmount * currencyRate);
    } else if (programActive && !eligible) {
        //  console.log("callleddd");
        return parseInt(
            Math.max(0, referralBonusAmount * currencyRate - contactIncentiveBonus),
        );
    }
};
export const calculateReferralBonusTotal = (
    referrals,
    eligible,
    incentiveBonus,
) => {
    let total = 0;
    if (!referrals) return total;
    referrals.forEach((referral) => {
        const { job } = referral;
        const amount =
            typeof job.referralBonus === 'object'
                ? job.referralBonus.amount
                : JSON.parse(job.referralBonus).amount;

        // const tiered =
        //   typeof job.referralBonus === 'object'
        //     ? job.referralBonus.tieredBonusId
        //     : JSON.parse(job.referralBonus).tieredBonusId;
        // console.log(tiered);
        if (
            referral.status === 'hired' &&
            job &&
            amount &&
            referral.referralType !== 'self'
        ) {
            //console.log(referral.hireDate);
            let bonusAmount = calculateReferralBonus(
                incentiveBonus,
                amount,
                eligible,

                // tieredBonus,
                // tieredBonusType,
                // hireDate
            );
            //let bonusAmount = eligible ? amount : amount - incentiveBonus;
            total += parseInt(bonusAmount, 10);
        }
    });
    return total;
};

export const calculateTotalBonuses = (
    bonuses,
    eligible,
    // incentiveBonus,
    currencyRate,
) => {
    let total = 0;
    if (eligible) {
        bonuses.forEach((bonus) => {
            if (
                bonus.recipientType === 'employee' &&
                (bonus.bonusStatus === 'earned' || bonus.bonusStatus === 'paid')
            ) {
                const amount = get(bonus, 'amountDue', 0);
                total += amount;
            }
        });
    } else {
        bonuses.forEach((bonus) => {
            if (bonus.recipientType === 'employee') {
                const amount = get(bonus, 'amountDue', 0);
                total += amount;
            }
        });
    }

    total = total * currencyRate;
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const textResolver = (size, point) => {
    return size - point;
};

export const parse = (val) => {
    try {
        return JSON.parse(val);
    } catch (e) {
        return val;
    }
};

export const findItemByNameAndKeywords = (name, values = []) => {
    try {
        if (values !== undefined && values.length > 0) {
            values = values.map((value) => {
                if (get(value, 'keywords')) value.keywords = parse(value.keywords);
                return value;
            });
        }
        let result = values.find((val) => {
            let keywords = get(val, 'keywords', []);
            if (!keywords) keywords = [];
            if (keywords.find((key) => key === name)) return true;
            if (get(val, 'name') === name) return true;
        });
        if (result) {
            return result;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};


export const searchUserDataNetwork = async (props) => {
    let query = {
        query: get(props, 'query', ''),
        filters: {
            all: [
                {
                    company_id: get(props, 'filters.companies', []),
                },
                {
                    role:
                        get(props, 'filters.roles', []).length > 0
                            ? get(props, 'filters.roles', [])
                            : ['employee', 'manager', 'admin'],
                },
            ],
        },
        page: {
            size: get(props, 'size', 1000),
        },
    };

    if (get(props, 'role') === 'supportAdmin') query.filters.all.splice(0, 1);

    // Status filter on the employees page
    if (
        props.filters.active === 'true' ||
        props.filters.active === 'false' ||
        props.filters.active === 'invited'
    ) {
        query.filters.all.push({ active: props.filters.active });
    }

    if (get(props, 'filters.departments', []).length > 0) {
        let filters = get(query, 'filters.all');
        let departments = [];
        get(props, 'filters.departments', []).forEach((d) =>
            departments.push(d.id)
        );
        let newFilter = {
            department_id: departments,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }

    if (get(props, 'filters.roles', []).length > 0) {
        let filters = get(query, 'filters.all');
        const newFilter = {
            role: get(props, 'filters.roles', []),
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }

    if (
        props.filters.openToNewRole === 'true' ||
        props.filters.openToNewRole === true
    ) {
        query.filters.all.push({ open_to_new_role: 'true' });
    }

    // if (get(props, 'filters.userGroups', []).length > 0) {
    //   let filters = get(query, 'filters.all');
    //   let userGroups = [];
    //   get(props, 'filters.userGroups', []).forEach((userGroup) =>
    //     userGroups.push(userGroup.id)
    //   );
    //   let newFilter = {
    //     user_group_id: userGroups,
    //   };
    //   console.log('> USER GROUP FILTERS\n', newFilter);
    //   filters.push(newFilter);
    //   query.filters.all = filters;
    // }

    if (get(props, 'filters.userGroups', []).length > 0) {
        let filters = get(query, 'filters.all');
        let userGroups = [];
        get(props, 'filters.userGroups', []).forEach((userGroup) =>
            userGroups.push(userGroup.id)
        );
        let newFilter = {
            user_group_id: userGroups,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }

    let matchedData = await searchUserNetwork(query);
    let allData = [];
    let exactMatchData = [];
    matchedData.forEach(async (item) => {
        const newItem = {
            id: get(item, 'id.raw'),
            accountClaimId: get(item, 'account_claim_id.raw'),
            active: get(item, 'active.raw'),
            avatar: parse(get(item, 'avatar.raw', '{}')),
            cognitoId: get(item, 'cognito_id.raw'),
            companyId: get(item, 'company_id.raw'),
            dateCreated: get(item, 'date_created.raw'),
            departmentId: get(item, 'department_id.raw'),
            department: parse(get(item, 'department.raw')),
            emailAddress: get(item, 'email_address.raw', 'closed'),
            employeeId: get(item, 'employee_id.raw'),
            firstName: get(item, 'first_name.raw', ''),
            lastName: get(item, 'last_name.raw', ''),
            incentiveEligible: get(item, 'incentive_eligible.raw', ''),
            lastLogin: get(item, 'last_login.raw', ''),
            lastNotificationCheck: get(item, 'last_notification_check.raw', ''),
            location: parse(get(item, 'location_text.raw')),
            openToNewRole:
                parse(get(item, 'open_to_new_role.raw')) === 'true' ? true : false,
            role: get(item, 'role.raw', ''),
            subCompanyId: get(item, 'sub_company_id.raw'),
            subCompany: parse(get(item, 'sub_company.raw')),
            title: get(item, 'title.raw', ''),
            totalReferrals: get(item, 'total_referrals.raw', ''),
            userGroup: {
                name: get(item, 'user_group_name.raw'),
                currency: get(item, 'user_group_currency.raw'),
            },
            userGroupId: get(item, 'user_group_id.raw'),
            lastMobileLogin: get(item, 'last_mobile_login.raw', ''),
        };
        if (
            get(item, 'employee_id.raw') !== '' &&
            get(props, 'query') === get(item, 'employee_id.raw')
        ) {
            exactMatchData.push(newItem);
            allData.push(newItem);
        } else {
            allData.push(newItem);
        }
    });
    const filteredData = exactMatchData.length > 0 ? exactMatchData : allData;
    return { data: filteredData, query: get(props, 'query', '') };
};

export const searchJobDataNetwork = async (props) => {
    console.log("fdff", props);
    //const compid = ['69575265-e654-4b0c-a2fd-26acc2b6f057'];
    const size = get(props, 'size', 1000);
    let qry =
        props.query && !isNaN(props.query) ? `"${props.query}"` : props.query;
    let jobLevels = '';
    get(props, 'filters.jobLevels', []).forEach(
        (jobLevel) => (jobLevels += `${get(jobLevel, 'name')} `)
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

    if (get(props, 'role') === 'supportAdmin') query.filters.all.splice(1, 1);

    if (get(props, 'filters.recruiters', []).length > 0) {
        const recruiterFilter = {
            hiring_manager_id: get(props, 'filters.recruiters', []),
        };
        query.filters.all.push(recruiterFilter);
    }

    const lat = get(props, 'coordinates[0].lat');
    const lng = get(props, 'coordinates[0].lng');
    if (get(props, 'filters.distance') && isNaN(get(props, 'filters.distance'))) {
        query.filters.all.push({ country: get(props, 'filters.distance') });
    } else if (get(props, 'filters.distance', 0) > 0 && lat && lng) {
        for (let i = 1; i <= 10; i++) {
            let key = i === 1 ? 'location' : `location${i}`;
            const locationFilter = {
                [key]: {
                    center: `${lat}, ${lng}`,
                    distance: parseInt(get(props, 'filters.distance')),
                    unit: get(props, 'unit', 'mi'),
                },
            };
            query.filters.any.push(locationFilter);
        }
    } else if (get(props, 'filters.distance', 0) < 0) {
        query.filters.all.push({
            is_remote: 'true',
        });
    }

    if (get(props, 'filters.departments', []).length > 0) {
        let filters = get(query, 'filters.all');
        let departments = [];
        get(props, 'filters.departments', []).forEach((d) =>
            departments.push(d.id)
        );
        let newFilter = {
            department_id: departments,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }

    if (get(props, 'filters.availables', []).length > 0) {
        let newFilter = {
            internal_job_link: '',
        };

        let aF = null;
        if (get(props, 'filters.availables[0].id') == 'internal-only') {
            newFilter = {
                internal_job_link_exists: 'true',
            };
            query.filters.all.push(newFilter);

            newFilter = {
                hide_im_interested: 'true',
            };
            query.filters.none.push(newFilter);
        } else if (get(props, 'filters.availables[0].id') == 'refer-exists') {
            newFilter = {
                public_link_exists: 'true',
            };
            query.filters.all.push(newFilter);
        } else {
            aF = null;
        }

        //   if (aF != null) {
        //     let filters = get(query, 'filters.all');
        //     newFilter = {
        //       internal_job_link_exists: aF.toString(),
        //     };
        //     filters.push(newFilter);

        //     query.filters.all = filters;
        //   }
    }

    if (get(props, 'filters.bonuses', []).length > 0) {
        let filters = get(query, 'filters.any');
        let bonuses = [];
        get(props, 'filters.bonuses', []).forEach((b) => bonuses.push(b));
        let newFilter = {
            tiered_bonus_id: bonuses,
        };
        filters.push(newFilter);
        newFilter = {
            campaign_tiered_bonus_id: bonuses,
        };
        filters.push(newFilter);
        query.filters.any = filters;
    }
    if (get(props, 'filters.subCompanies', []).length > 0) {
        let filters = get(query, 'filters.all');
        let subCompanies = [];
        get(props, 'filters.subCompanies', []).forEach((sc) =>
            subCompanies.push(sc)
        );
        let newFilter = {
            sub_company_id: subCompanies,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }
    let matchedJobs = await searchNetwork(query);
    console.log("matched jobs", matchedJobs);
    let allData = [];
    //let exactMatchData = [];

    //let totalMetaScore = 0;
    matchedJobs.forEach((job) => {
        // if (get(job, '_meta.score') > highestMetaScore)
        //   highestMetaScore = get(job, '_meta.score');
        //totalMetaScore += get(job, '_meta.score');
        let locations = get(job, 'locations.raw', []);
        let location = get(job, 'location_text.raw');
        locations = locations.map((location) => {
            return JSON.parse(location);
        });
        if (locations.length === 0) locations.push(parse(location));
        let newJob = {
            id: get(job, 'job_id.raw'),
            accepted: get(job, 'accepted_amount.raw'),
            campaignId: get(job, 'campaign_id.raw'),
            campaign: {
                id: get(job, 'campaign_id.raw'),
                archived: get(job, 'campaign_archived.raw'),
                endDate: get(job, 'campaign_end_date.raw'),
                name: get(job, 'campaign_name.raw'),
                startDate: get(job, 'campaign_start_date.raw'),
                tieredBonusId: get(job, 'campaign_tiered_bonus_id.raw'),
                tieredBonus: parse(get(job, 'campaign_tiered_bonus.raw', '{}')),
            },
            companyId: get(job, 'company_id.raw'),
            company: {
                id: get(job, 'company_id.raw'),
                name: get(job, 'company_name.raw'),
            },
            dateCreated: get(job, 'date_created.raw'),
            departmentId: get(job, 'department_id.raw'),
            department: {
                id: get(job, 'department_id.raw'),
                name: get(job, 'department_name.raw'),
            },
            description: get(job, 'description.raw'),
            env: get(job, 'env.raw'),
            externalJobId: get(job, 'external_job_id.raw'),
            internalJobLink: get(job, 'internal_job_link.raw'),
            isHotJob: get(job, 'is_hot_job.raw') === 'true' ? true : false,
            jobId: get(job, 'job_id.raw'),
            jobLevels: get(job, 'job_levels.raw'),
            job: {
                id: get(job, 'job_id.raw'),
                location: parse(get(job, 'location_text.raw', '{}')),
                locations,
                referralBonus: parse(get(job, 'referral_bonus.raw', '{}')),
                tieredBonusId: get(job, 'tiered_bonus_id.raw'),
                tieredBonus: parse(get(job, 'tiered_bonus.raw', '{}')),
                publicLink: get(job, 'public_link.raw'),
                internalJobLink: get(job, 'internal_job_link.raw'),
            },
            jobType: get(job, 'job_type.raw'),
            location: get(job, 'location.raw'),
            lat: get(job, 'lat.raw'),
            lng: get(job, 'lng.raw'),
            metadata: get(job, 'metadata.raw'),
            publicLink: get(job, 'public_link.raw'),
            referralBonus: parse(get(job, 'referral_bonus.raw', '{}')),
            referralsAmount: get(job, 'referrals_amount.raw', 0),
            referrals: parse(get(job, 'referrals.raw', '{}')),
            shares: get(job, 'shares.raw', 0),
            status: get(job, 'status.raw', 'closed'),
            tieredBonusId: get(job, 'tiered_bonus_id.raw'),
            tieredBonus: parse(get(job, 'tiered_bonus.raw', '{}')),
            title: get(job, 'title.raw', ''),
            views: get(job, 'views.raw', 0),
            metaScore: get(job, '_meta.score'),
            hideImInterested:
                get(job, 'hide_im_interested.raw') === 'true' ? true : false,
            isGeneralReferral:
                get(job, 'is_general_referral.raw') === 'true' ? true : false,
        };
        const subCompany = {
            id: get(job, 'sub_company_id.raw'),
            name: get(job, 'sub_company_name.raw'),
        };
        if (get(job, 'sub_company_id.raw')) {
            newJob.subCompany = subCompany;
            newJob.subCompanyId = get(job, 'sub_company_id.raw');
        }
        allData.push(newJob);
    });

    let filterJobLevels =
        get(props, 'filters.jobLevels', []).length > 0
            ? allData.filter((job) => {
                let result = false;
                get(props, 'filters.jobLevels', []).forEach((jobLevel) => {
                    if (
                        get(job, 'jobLevels', []).find(
                            (level) => level === get(jobLevel, 'name')
                        )
                    )
                        result = true;
                });
                return result;
            })
            : allData;
    let filteredData = filterJobLevels;

    const hotJobs = filteredData.filter((job) => get(job, 'isHotJob') === true);
    const jobs = filteredData.filter((job) => get(job, 'isHotJob') !== true);

    filteredData = [...hotJobs, ...jobs];
    console.log("filterdata", filteredData);
    return { data: filteredData, query: get(props, 'query', '') };
};