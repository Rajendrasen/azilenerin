import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getTieredBonus } from '../../graphql/custom/tiered-bonuses/get-tiered-bonus.graphql';

import get from 'lodash/get';
import { parseJsonFields } from '../../../services/parse-api.service';

export const withGetTieredBonus = Component => {
  return compose(
    graphql(gql(getTieredBonus), {
      options: props => ({
        variables: {
          id: props.tieredBonusQuery.id,
          companyId: props.tieredBonusQuery.companyId
        },
        fetchPolicy: 'cache-and-network',
      }),
      props: props => {
        let tieredBonus = get(props, 'data.getTieredBonus', undefined);
        if (tieredBonus) {
          tieredBonus = Object.assign(
            tieredBonus,
            parseJsonFields(['tiers'], tieredBonus)
          );
        }
        return {
          currentTieredBonus: tieredBonus,
        };
      },
    })
  )(Component);
};
