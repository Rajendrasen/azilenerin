import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {withApollo} from 'react-apollo';
import RenderHtml from 'react-native-render-html';

import {queryCustomPage} from './query';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import {COLORS} from '../../_shared/styles/colors';

const CustomPage = (props) => {
  const [data, setData] = useState({});
  const {
    currentUser: {companyId},
  } = useSelector((state) => state.user);
  useEffect(() => {
    getCustomPage();
  }, []);
  const getCustomPage = () => {
    props.client
      .query({
        query: queryCustomPage,
        variables: {companyId},
      })
      .then((res) =>
        setData(get(res, 'data.queryCustomPageByCompanyIdIndex', {} || {})),
      );
  };
  console.log('data', data);
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          margin: 10,
          borderRadius: 10,
          padding: 10,
        }}>
        {get(data, 'items[0].content', null) ? (
          <RenderHtml html={get(data, 'items[0].content', 'I')} />
        ) : null}
      </ScrollView>
    </View>
  );
};

export default withApollo(CustomPage);
