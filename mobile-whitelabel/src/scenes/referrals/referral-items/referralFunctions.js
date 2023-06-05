import { searchReferralsNetwork } from "./searchReferralsNetwork";


export const searchReferralsDataNetwork = async (props) => {
    let qry = get(props, 'query', '');
    let gdprReferrals = get(props, 'gdprReferrals');
    let gdpr;
    if (gdprReferrals) gdpr = searchGDPRData(props);
    if (get(props, 'query', '').includes('@')) qry = `"${get(props, 'query')}"`;
    let query = {
        query: qry,
        filters: {
            all: [
                {
                    company_id: get(props, 'filters.companies'),
                },
            ],
            any: [],
            none: [],
        },
        page: {
            size: get(props, 'size', 1000),
        },
    };
    if (get(props, 'role') === 'supportAdmin') query.filters.all.splice(0, 1);
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
        // query.filters.any = filters;
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
    if (get(props, 'filters.statuses', []).length > 0) {
        const swiftypeAllFilters = get(query, 'filters.all');
        const stageFilters = get(props, 'filters.statuses', []);
        query.filters.all = [...swiftypeAllFilters, { status: stageFilters }];
    }
    if (get(props, 'filters.customStatuses', []).length > 0) {
        const swiftypeAnyFilters = get(query, 'filters.any');
        const companyStageFilters = get(props, 'filters.customStatuses', []);
        query.filters.any = [
            ...swiftypeAnyFilters,
            { custom_status: companyStageFilters },
        ];
    }
    if (get(props, 'filters.bonuses', []).length > 0) {
        let filters = get(query, 'filters.all');
        let bonuses = [];
        get(props, 'filters.bonuses', []).forEach((b) => bonuses.push(b));
        let newFilter = {
            tiered_bonus_id: bonuses,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }
    if (get(props, 'filters.recruiters', []).length > 0) {
        let filters = get(query, 'filters.all');
        let recruiters = [];
        get(props, 'filters.recruiters', []).forEach((r) => recruiters.push(r));
        let newFilter = {
            hiring_manager_id: recruiters,
        };
        filters.push(newFilter);
        query.filters.all = filters;
    }
    const matchedReferrals = await searchReferralsNetwork(query);
    let allData = [];
    gdpr.forEach((ref) => allData.push(ref));
    //let exactMatchData = [];
    matchedReferrals.forEach((ref) => {
        const resume = parse(get(ref, 'contact_resume.raw', '{}'));
        const contactResume = get(resume, 'key') ? resume : null;
        let newRef = {
            //bonusStatus: get(ref, 'status.raw'),
            companyId: get(ref, 'company_id.raw'),
            contact: {
                id: get(ref, 'contact_id.raw'),
                firstName: get(ref, 'contact_first_name.raw'),
                lastName: get(ref, 'contact_last_name.raw'),
                employeeId: get(ref, 'contact_employee_id.raw'),
                emailAddress: get(ref, 'contact_email_address.raw'),
                phoneNumber: get(ref, 'contact_phone_number.raw'),
            },
            contactId: get(ref, 'contact_id.raw'),
            contactResume,
            customStatus: get(ref, 'custom_status.raw'),
            diversityHire: get(ref, 'diversity_hire.raw') === 'true' ? true : false,
            hireDate: get(ref, 'date_hired.raw'),
            id: get(ref, 'id.raw'),
            job: {
                id: get(ref, 'job_id.raw'),
                title: get(ref, 'job_title.raw'),
                hiringManager: get(ref, 'hiring_manager_id.raw'),
                tieredBonusId: get(ref, 'tiered_bonus_id.raw'),
                tieredBonus: {
                    id: get(ref, 'tiered_bonus_id.raw'),
                    name: get(ref, 'tiered_bonus_name.raw'),
                    tiers: get(ref, 'tiered_bonus_tiers.raw'),
                },
                subCompanyId: get(ref, 'sub_company_id'),
            },
            bonus: {
                amount: get(ref, 'bonus_amount.raw'),
                tieredBonusId: get(ref, 'tiered_bonus_id.raw'),
            },
            jobId: get(ref, 'job_id.raw'),
            message: get(ref, 'message.raw', null),
            note: get(ref, 'note.raw'),
            referralDate: get(ref, 'date_referred.raw'),
            referralType: get(ref, 'referral_type.raw'),
            status: get(ref, 'status.raw'),
            user: {
                id: get(ref, 'user_id.raw'),
                firstName: get(ref, 'user_first_name.raw'),
                lastName: get(ref, 'user_last_name.raw'),
                employeeId: get(ref, 'contact_employee_id.raw'),
                //incentiveEligible: true,
                //userGroupId: '3944e182-425e-11ea-b77f-2e728ce88125',
            },
            userId: get(ref, 'user_id.raw'),
            referralSource: get(ref, 'referral_source.raw'),
        };
        if (get(ref, 'retro_tiered_bonus_id.raw')) {
            newRef.tieredBonusId = get(ref, 'retro_tiered_bonus_id.raw');
            let retroTieredBonus = {
                id: get(ref, 'retro_tiered_bonus_id.raw'),
                name: get(ref, 'retro_tiered_bonus_name.raw'),
                tiers: get(ref, 'retro_tiered_bonus_tiers.raw'),
            };
            newRef.tieredBonus = retroTieredBonus;
        }
        if (get(ref, 'campaign_id.raw')) {
            newRef.campaignId = get(ref, 'campaign_id.raw');
            newRef.campaign = {
                id: get(ref, 'campaign_id.raw'),
                archived: get(ref, 'campaign_archived.raw'),
                name: get(ref, 'campaign_name.raw'),
                startDate: get(ref, 'campaign_start_date.raw'),
                endDate: get(ref, 'campaign_end_date.raw'),
                tieredBonusId: get(ref, 'campaign_tiered_bonus_id.raw'),
                tieredBonus: {
                    id: get(ref, 'campaign_tiered_bonus_id.raw'),
                    name: get(ref, 'campaign_tiered_bonus_name.raw'),
                    tiers: get(ref, 'campaign_tiered_bonus_tiers.raw'),
                },
            };
        }
        allData.push(newRef);
        // if (
        //   get(props, 'query') === get(ref, 'job_external_id.raw') ||
        //   get(props, 'query') === get(ref, 'user_employee_id.raw') ||
        //   get(props, 'query') === get(ref, 'contact_employee_id.raw')
        // ) {
        //   exactMatchData.push(newRef);
        //   allData.push(newRef);
        // } else {
        //   allData.push(newRef);
        // }
    });
    //const data = exactMatchData.length > 0 ? exactMatchData : allData;
    const data = allData;
    let totals = {};
    if (get(props, 'filterOn') && data.length < 1000) {
        totals.total = data.length;
        totals.accepted = data.filter(
            (r) =>
                // get(r, 'status') === 'interviewing' ||
                get(r, 'status') === 'accepted'
            // get(r, 'status') === 'hired'
        ).length;
        totals.interviewing = data.filter(
            (r) => get(r, 'status') === 'interviewing'
        ).length;
        totals.hired = data.filter((r) => get(r, 'status') === 'hired').length;
        totals.declined = data.filter(
            (r) => get(r, 'status') === 'declined'
        ).length;
        totals.noResponse = data.filter(
            (r) => get(r, 'status') === 'noresponse'
        ).length;
        totals.inactive = data.filter(
            (r) => get(r, 'status') === 'inactive'
        ).length;
        totals.notHired = data.filter(
            (r) => get(r, 'status') === 'notHired'
        ).length;
    } else {
        totals = get(props, 'totals');
    }
    return { data, totals, query: get(props, 'query', '') };
};









