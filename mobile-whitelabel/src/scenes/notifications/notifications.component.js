import React from 'react';
import NotificationsList from './notifications-list.component';
import _ from 'lodash';
import {View, Text, Animated, Easing} from 'react-native';
import {ActivityIndicator} from '@ant-design/react-native';
import EmptyScene from '../empty-scene/empty-scene.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import {styles} from './notifications.style';
import {getErinSquare} from '../../WhiteLabelConfig';

class NotificationsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNotifications: props.userNotifications,
      spinAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.spin();
  }
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
  componentDidUpdate(prevProps) {
    if (prevProps.userNotifications !== this.props.userNotifications) {
      this.setState({userNotifications: this.props.userNotifications});
    }
  }

  newNotificationCount = () => {
    const {userNotifications} = this.state;
    let count = 0;
    if (userNotifications && userNotifications.webNotifications) {
      userNotifications.webNotifications.forEach((notification) => {
        if (!userNotifications.lastNotificationCheck) {
          count = userNotifications.webNotifications.length;
        } else if (
          notification.dateCreated > userNotifications.lastNotificationCheck
        ) {
          count += 1;
        }
      });
      return count;
    }
    return count;
  };

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const {userNotifications} = this.state;
    const {currentUser} = this.props;
    let {
      company: {theme, symbol},
    } = currentUser;
    theme = theme ? JSON.parse(theme) : {};
    let initialData = userNotifications;
    if (!userNotifications) {
      initialData = [];
    }
    const sortedNotifications = _.sortBy(initialData, 'dateCreated').reverse();

    if (this.props.loading && !userNotifications) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Animated.Image
            style={{height: 60, width: 60, transform: [{rotate: spin}]}}
            source={
              theme.enabled && symbol && symbol.key
                ? {
                    uri:
                      'https://s3.us-east-2.amazonaws.com/erin-avatars/' +
                      symbol.key,
                  }
                : getErinSquare()
            }
          />
        </View>
      );
    }

    if (!userNotifications || !userNotifications.length) {
      return (
        <EmptyScene>
          <Text style={styles.noNotificationsText}>
            {customTranslate('ml_YouHaveNoAlertsAtThisTime')}
          </Text>
        </EmptyScene>
      );
    }

    return (
      <NotificationsList
        userNotifications={userNotifications}
        sortedNotifications={sortedNotifications}
        currentUser={currentUser}
        lastNotificationCheck={this.props.lastNotificationCheck}
      />
    );
  }
}

export default NotificationsComponent;
