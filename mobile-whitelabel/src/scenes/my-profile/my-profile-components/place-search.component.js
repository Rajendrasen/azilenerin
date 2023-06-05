import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

export class PlaceSearch extends Component {
  state = {
    modalVisible: false,
  };
  render() {
    return (
      <React.Fragment>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.inputTitle}>Currency</Text>
          <TouchableOpacity
            onPress={() => this.setState({ currencyModal: true })}
            style={[styles.input, { justifyContent: 'center' }]}
          >
            <Text>{this.state.currency}</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

export default PlaceSearch;
