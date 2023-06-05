import React, { Component } from 'react';
import { View } from 'react-native';
import MyProfileCard from './my-profile-components/my-profile-card.component';
import { styles } from './my-profile.styles';

class MyProfileComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser,
    };
  }

  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.MyProfileContainer}>
        <MyProfileCard currentUser={this.props.currentUser} />
      </View>
    );
  }
}

export default MyProfileComponent;
