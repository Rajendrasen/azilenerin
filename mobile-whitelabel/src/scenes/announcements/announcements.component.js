import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {withApollo} from 'react-apollo';
import {queryAnnouncementsByCompanyIdIndex} from '../../_store/_shared/api/graphql/custom/announcements/query-announcement-by-company-id-date-created.graphql';
import AnnouncementCard from './announcement-card';
import moment from 'moment';


const AnnouncementsComponent = (props, {navigation}) => {
  const {
    currentUser: {companyId},
  } = useSelector((state) => state.user);

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getAnnouncements();
  }, []);

  const getAnnouncements = () => {
    props.client
      .query({
        query: queryAnnouncementsByCompanyIdIndex,
        variables: {companyId},
      })
      .then((res) => {
        setAnnouncements(res?.data?.queryAnnouncementsByCompanyIdIndex?.items);
      });
  };

  return (
    <ScrollView style={styles.topView} nestedScrollEnabled>
      {announcements?.length > 0 ? (
        announcements?.map((item) => {
          return (
            <AnnouncementCard
              title={item?.title}
              description={item?.content}
              createdDate={moment(item?.dateCreated).format(
                'MM/DD/YYYY h:mm a',
              )}
            />
          );
        })
      ) : (
        <View>
          <Text>No Announcements Yet</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topView: {
    flex: 1,
    padding: 10,
  },
});

export default withApollo(AnnouncementsComponent);
