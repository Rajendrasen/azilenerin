import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { listTieredBonuses } from '../../graphql/custom/tiered-bonuses/list-tiered-bonuses.graphql';
import { updateTieredBonus } from '../../graphql/custom/tiered-bonuses/update-tiered-bonus.graphql';

import get from 'lodash/get';
import { parseJsonFields } from '../../../services/parse-api.service';

export const withListTieredBonus = Component => {
    return compose(
        graphql(gql(listTieredBonuses), {
            options: props => ({
                variables: {
                    filter: {
                        companyId: { eq: props.currentUser.companyId },
                        archived: { ne: true },
                    },
                    limit: 1000,
                    nextToken: null,
                },
                fetchPolicy: 'cache-and-network',
            }),
            props: props => {
                let bonuses = get(props, 'data.listTieredBonuses.items');
                if (bonuses) {
                    for (let bonus of bonuses) {
                        bonus = Object.assign(bonus, parseJsonFields(['tiers'], bonus));
                    }
                }
                console.log("bonuses", bonuses)
                return {
                    bonuses,
                    bonusLoading: props.data.loading,
                    refetch: props.data.refetch,
                };
            },
        }),
        graphql(gql(updateTieredBonus), {
            props: props => {
                return {
                    onUpdateTieredBonus: input => {
                        return props.mutate({
                            variables: { input },
                            refetchQueries: [
                                {
                                    query: gql(listTieredBonuses),
                                    variables: {
                                        filter: {
                                            companyId: { eq: props.ownProps.currentUser.companyId },
                                            archived: { ne: true },
                                        },
                                        limit: 1000,
                                        nextToken: null,
                                    },
                                    fetchPolicy: 'cache-and-network',
                                },
                            ],
                        });
                    },
                };
            },
        })
    )(Component);
};
