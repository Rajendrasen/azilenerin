import axios from 'axios';
import referralConfig from '../../_store/_shared/api/elastic-referral-engine';


export const searchNetwork = (query) => {
    console.log("query,referralConfig", query, referralConfig.url);
    return axios
        .post(referralConfig.url, query, {
            headers: { ...referralConfig.headers },
        })
        .then((response) => {
            console.log("response is ", response);
            response.data.results
        });
};
