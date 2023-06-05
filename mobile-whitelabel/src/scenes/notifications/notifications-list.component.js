import React from 'react';
import {ScrollView, View, Text, Image} from 'react-native';
import {List} from '@ant-design/react-native';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {NOTIFICATIONS} from '../../_shared/constants/notification-types.enum';
import Icon from '../../_shared/components/icon';
import {styles} from './notifications.style';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import {get} from 'lodash';
import {getErinSquare} from '../../WhiteLabelConfig';

const {
  ListStyles,
  RemoveMargins,
  Bold,
  ListItemStylesBlue,
  NoPicture,
  ListTextContainer,
  TimeStyles,
  CompanyAvatar,
  Avatar,
  AvatarContainer,
  RowContainer,
  ReferrerText,
  avatarContainer,
} = styles;

const ErinLogo = getErinSquare();

const NotificationList = (props) => {
  const {sortedNotifications} = props;
  let lastNotificationCheck = props.lastNotificationCheck
    ? props.lastNotificationCheck
    : props.currentUser.lastNotificationCheck;
  const pagination = {
    showTotal: function (total, range) {
      return `${range[0]}-${range[1]} of ${total} notifications `;
    },
  };

  const renderAvatar = (notification) => {
    if (!notification.user) return;
    const {type} = notification;
    if (
      type.toLowerCase().includes('point') ||
      notification?.message?.toLowerCase().includes('point')
    )
      return (
        <View style={[CompanyAvatar]}>
          <Image
            style={[{tintColor: '#fff', height: 35, width: 35}]}
            resizeMode="contain"
            source={require('../../_shared/assets/party.png')}
            alt="Erin App"
          />
        </View>
      );
    return type === NOTIFICATIONS.REFERRAL_MATCH ? (
      <View>
        <Image style={Avatar} source={{uri: ErinLogo}} alt="Erin App" />
      </View>
    ) : type === NOTIFICATIONS.JOB_CREATED ? (
      <View style={CompanyAvatar}>
        <Icon name="id" size={40} color="white" />
      </View>
    ) : type === NOTIFICATIONS.REFERRAL_HIRED ? (
      <View style={CompanyAvatar}>
        <Icon name="id" size={40} color="white" />
      </View>
    ) : type === 'empMessageCenter' ? (
      <View style={CompanyAvatar}>
        <Icon name="id" size={40} color="white" />
      </View>
    ) : type === NOTIFICATIONS.REFERRAL_ACCEPTED ? (
      <View style={[NoPicture, avatarContainer]}>
        <Text style={styles.initials}>
          {get(notification, 'referral.contact.firstName[0]', '').toUpperCase()}
          {get(notification, 'referral.contact.lastName[0]', '').toUpperCase()}
        </Text>
      </View>
    ) : (
      //  avatar !== null ? (
      //   <View>
      //     <Image style={Avatar} source={{ uri: avatar }} alt={`${firstName} ${lastName}`} />
      //   </View>
      // ) :
      <View style={[NoPicture, avatarContainer]}>
        <Text style={styles.initials}>
          {get(notification, 'referral.user.firstName[0]', '').toUpperCase()}
          {get(notification, 'referral.user.lastName[0]', '').toUpperCase()}
        </Text>
      </View>
    );
  };
  console.log('sorted notifications', sortedNotifications);

  return (
    <ScrollView>
      <List
        style={ListStyles}
        dataSource={sortedNotifications}
        pagination={pagination}>
        {sortedNotifications.slice(0, 50).map((item) => {
          // console.log(item.referral)
          if (item.type == 'empMessageCenter' && item.message) {
            return (
              <List.Item
                style={
                  !lastNotificationCheck ||
                  item.dateCreated > lastNotificationCheck
                    ? ListItemStylesBlue
                    : item.dateCreated < lastNotificationCheck
                    ? styles.ListItemStyles
                    : null
                }
                key={item.id}>
                <View style={RowContainer}>
                  <View style={AvatarContainer}>{renderAvatar(item)}</View>

                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>{item.message} </Text>
                  </View>
                </View>
              </List.Item>
            );
          }
          if (
            !item.job ||
            !item.job.title ||
            (!item.referral && item.type !== NOTIFICATIONS.JOB_CREATED)
          )
            return;
          return (
            <List.Item
              style={
                !lastNotificationCheck ||
                item.dateCreated > lastNotificationCheck
                  ? ListItemStylesBlue
                  : item.dateCreated < lastNotificationCheck
                  ? styles.ListItemStyles
                  : null
              }
              key={item.id}>
              <View style={RowContainer}>
                <View style={AvatarContainer}>{renderAvatar(item)}</View>
                {item.type === NOTIFICATIONS.REFERRAL_CREATED && (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      {item.referral && item.referral.user ? (
                        item.referral.user.id == props.currentUser.id ? (
                          <Text>You've have</Text>
                        ) : (
                          <Text style={ReferrerText} to="#">
                            {item.referral.user.firstName}{' '}
                            {item.referral.user.lastName}
                          </Text>
                        )
                      ) : null}{' '}
                      {/* {item.referral && (
                        <Text style={ReferrerText} to="#">
                          {item.referral.user.firstName} {item.referral.user.lastName}
                        </Text>
                      )} */}
                      made a referral for{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                      {' position'}
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                )}
                {item.type === NOTIFICATIONS.REFERRAL_SENT ? (
                  <View style={ListTextContainer}>
                    {item.message ? (
                      <Text>{item.message}</Text>
                    ) : (
                      <Text style={RemoveMargins}>
                        {item.referral && item.referral.user !== null ? (
                          <Text style={ReferrerText} to="#">
                            {item.referral.user.firstName}{' '}
                            {item.referral.user.lastName}
                          </Text>
                        ) : null}{' '}
                        {/* {item.referral && (
                        <Text style={ReferrerText} to="#">
                          {item.referral.user.firstName} {item.referral.user.lastName}
                        </Text>
                      )} */}
                        {customTranslate('ml_HasMadeAReferralFor')}{' '}
                        <Text style={ReferrerText} to="#">
                          {item.job.title}
                        </Text>
                      </Text>
                    )}
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.POINTS_REFERRAL_INTERVIEWING &&
                  item.message ? (
                  <View style={ListTextContainer}>
                    <Text>{item.message}</Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type == NOTIFICATIONS.POINTS_REFERRAL_HIRED ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      {item.referral && item.referral.user !== null ? (
                        <Text style={ReferrerText} to="#">
                          {item.referral.contact.firstName}{' '}
                          {item.referral.contact.lastName}
                        </Text>
                      ) : null}{' '}
                      {/* {item.referral && (
                    <Text style={ReferrerText} to="#">
                      {item.referral.user.firstName} {item.referral.user.lastName}
                    </Text>
                  )} */}
                      has been hired for the{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                      {' position. '}
                      You've earned {item.matches} points.
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.JOB_CREATED ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      <Text style={Bold}>{item.user.company.name}</Text>{' '}
                      {customTranslate('ml_HasAddedANewJob')}{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(item.dateCreated)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.REFERRAL_ACCEPTED ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      {item.referral.contact &&
                      item.referral.contact.firstName ? (
                        <Text style={ReferrerText} to="#">
                          {item.referral.contact.firstName}{' '}
                          {item.referral.contact.lastName}
                        </Text>
                      ) : null}{' '}
                      {customTranslate('ml_HasAcceptedAReferralFor')}{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                      {' position'}
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.REFERRAL_HIRED ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      <Text style={Bold}>{item.user.company.name}</Text>{' '}
                      {customTranslate('ml_JustHired')}{' '}
                      {item.referral.contact &&
                      item.referral.contact.firstName ? (
                        <Text style={ReferrerText} to="#">
                          {item.referral.contact.firstName}{' '}
                          {item.referral.contact.lastName}
                        </Text>
                      ) : null}{' '}
                      {customTranslate('ml_For')}{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.REFERRAL_REQUESTED ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      <Text style={ReferrerText} to="#">
                        {item.user.firstName} {item.user.lastName}
                      </Text>{' '}
                      {customTranslate('ml_HasRequestedReferralFor')}{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.REFERRAL_MATCH ? (
                  <View style={ListTextContainer}>
                    <Text style={RemoveMargins}>
                      You know{' '}
                      <Text style={Bold}>{item.matches.length} people </Text>
                      that match the{' '}
                      <Text style={ReferrerText} to="#">
                        {item.job.title}
                      </Text>{' '}
                      job. Click here to view them.
                    </Text>
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : item.type === NOTIFICATIONS.POINTS_REFERRAL_ACCEPTED ? (
                  <View style={ListTextContainer}>
                    {item.message ? (
                      <Text>{item.message}</Text>
                    ) : (
                      <Text style={RemoveMargins}>
                        {item.referral && item.referral.user ? (
                          item.referral.user.id == props.currentUser.id ? (
                            <Text>Your have</Text>
                          ) : (
                            <Text style={ReferrerText} to="#">
                              {item.referral.user.firstName}{' '}
                              {item.referral.user.lastName}{' '}
                            </Text>
                          )
                        ) : null}{' '}
                        earned {item.matches} points, your referral has been
                        accepted.
                        <Text style={ReferrerText} to="#">
                          {item.job.title}
                        </Text>
                      </Text>
                    )}
                    <Text style={TimeStyles}>
                      {distanceInWordsToNow(`${item.dateCreated}`)}
                    </Text>
                  </View>
                ) : (
                  <View style={RowContainer}>
                    <View style={ListTextContainer}>
                      <Text style={RemoveMargins}>{item.message || ''} </Text>
                    </View>
                  </View>
                )}
              </View>
            </List.Item>
          );
        })}
      </List>
    </ScrollView>
  );
};

export default NotificationList;
