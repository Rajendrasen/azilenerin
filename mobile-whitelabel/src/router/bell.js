import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import styles from './router.component.style';
import { Actions } from 'react-native-router-flux';
import { withGetUserNotifications } from '../_store/_shared/api/components/users/with-get-user-notifications.provider';
import { compose } from '../_shared/services/utils';
import { get } from 'lodash';
import { withApollo } from 'react-apollo';
import { GetUserByCognitoId } from '../_store/_shared/api/graphql/custom/users/getUserByCognitoId';

class bell extends Component {
    state = { count: 0 };
    componentDidMount() {
        this.newNotificationCount();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (
            (this.props.userNotifications &&
                nextProps.userNotifications &&
                (this.props.userNotifications.length !=
                    nextProps.userNotifications.length ||
                    get(nextProps, 'userNotifications[0].id', '') !=
                    get(this, 'props.userNotifications[0].id', ''))) ||
            (nextProps.userNotifications && !this.props.userNotifications)
        ) {
            return true;
        }
        if (nextState.count != this.state.count) {
            return true;
        }
        return false;
    }
    componentDidUpdate(prevProps) {
        if (
            (this.props.userNotifications &&
                prevProps.userNotifications &&
                (get(this, 'props.userNotifications.length', '') !=
                    get(prevProps, 'userNotifications.length', '') ||
                    get(prevProps, 'userNotifications[0].id', '') !=
                    get(this, 'props.userNotifications[0].id', ''))) ||
            (!prevProps.userNotifications && this.props.userNotifications)
        ) {
            this.newNotificationCount();
        }
    }
    newNotificationCount = async () => {
        const { data } = await this.props.client.query({
            query: GetUserByCognitoId,
            variables: { cognitoId: this.props.user.currentUser.cognitoId },
        });
        const { userNotifications } = this.props;
        const currentUser = data.getUserByCognitoId;
        let count = 0;
        if (userNotifications) {
            userNotifications.forEach((notification) => {
                if (!currentUser.lastNotificationCheck) {
                    count = userNotifications.length;
                } else if (
                    notification.dateCreated > currentUser.lastNotificationCheck
                ) {
                    count += 1;
                }
            });
        }
        //return count;
        this.setState({ count: count });
    };
    timer;
    render() {
        return (
            <View style={styles.rightbutton}>
                {this.state.count > 0 && (
                    <View style={styles1.popover}>
                        <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                            {this.state.count}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    //style={styles.avatarContainer}
                    style={{
                        width: 40,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        let date = new Date().toISOString();
                        this.props
                            .updateUser({
                                variables: {
                                    input: {
                                        id: this.props.user.currentUser.id,
                                        lastNotificationCheck: date,
                                    },
                                },
                            })
                            .then((res) => this.newNotificationCount());
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            Actions.alerts();
                        }, 1000);
                    }}>
                    {/* {avatar && (
                <Image
                  resizeMode="contain"
                  style={styles.image}
                  source={{
                    uri: avatar,
                  }}
                />
              )}
              {!avatar && (
                <Text style={styles.initials}>
                  {firstName ? firstName[0] : ''}
                  {lastName ? lastName[0] : ''}
                </Text>
              )} */}
                    <Image
                        source={require('../_shared/assets/ring.png')}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles1 = StyleSheet.create({
    popover: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        zIndex: 10,
        marginLeft: -1,
        marginTop: -1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default compose(withGetUserNotifications)(withApollo(bell));
