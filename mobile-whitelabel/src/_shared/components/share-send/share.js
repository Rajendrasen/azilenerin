import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Alert } from 'react-native';
import { COLORS } from '../../styles/colors';
import AppIcon from '../app-icon.component';
import styles from './share.component.style';

class ShareSend extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <Text style={styles.close}>X</Text>
            </TouchableOpacity>
            <View>
              <Text>Share</Text>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <AppIcon name="share" color={COLORS.white} />
          <Text style={styles.buttontext}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ShareSend;
