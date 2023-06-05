import React, {Component} from 'react';
import {View, Modal, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../styles/colors';
import Icons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

export class Tutorial extends Component {
  state = {
    modalVisible: false,
  };
  componentDidMount() {
    AsyncStorage.getItem('demo').then((res) => {
      if (!res && this.props.currentUser.company.accountType === 'free') {
        this.setState({modalVisible: true}, () => {
          AsyncStorage.setItem('demo', 'true');
        });
      }
    });
  }
  render() {
    return (
      <View>
        <Modal transparent visible={this.state.modalVisible}>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.blackTransparent,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{backgroundColor: '#fff', borderRadius: 10, width: '90%'}}>
              <View style={{flexDirection: 'row', paddingTop: 5}}>
                <View style={{flex: 1}}></View>
                <View style={{flex: 6, alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: 'bold',
                      color: COLORS.red,
                    }}>
                    Welcome to Erin Free
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.lightGray,
                    }}>
                    Watch our 2-minute how-to-video
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({modalVisible: false})}
                  style={{flex: 1, alignItems: 'center'}}>
                  <Icons name="ios-close" size={30} color="#8f99a2"></Icons>
                </TouchableOpacity>
              </View>
              <View
                style={{height: 200, marginVertical: 20, marginHorizontal: 10}}>
                <WebView
                  style={{flex: 1}}
                  javaScriptEnabled={true}
                  source={{
                    uri: 'https://player.vimeo.com/video/471959976',
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: false})}
                style={{
                  padding: 10,
                  paddingHorizontal: 20,
                  backgroundColor: COLORS.blue,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{color: '#fff'}}>Got it, Let's Start!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default Tutorial;
