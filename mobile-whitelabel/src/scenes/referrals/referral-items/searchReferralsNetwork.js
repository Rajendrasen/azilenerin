import axios from 'axios';

const referralConfig = {
    url:
        'https://host-b93sm9.api.swiftype.com/api/as/v1/engines/erin-referrals/search',

    // path: '/api/as/v1/engines/erin-referrals/search',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer search-c8iq6284cm17eu79wu8podg7',
    },
};


export const searchReferralsNetwork = (query) => {
    return axios
        .post(referralConfig.url, query, {
            headers: { ...referralConfig.headers },
        })
        .then((response) => response.data.results);
};