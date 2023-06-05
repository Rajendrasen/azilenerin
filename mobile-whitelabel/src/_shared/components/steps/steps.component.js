import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import StepItem from './steps-item.component';

export default class Steps extends Component {
  render() {
    const { steps, status, disableManagerPermissions } = this.props;
    return (
      <View style={styles.container}>
        {steps.map((item, index) => (
          <StepItem
            item={item}
            index={index}
            totalSteps={steps.length - 1}
            status={status}
            key={item.title + item.index}
            updateStatus={this.props.updateStatus}
            noJob={this.props.noJob}
            referralStatusLabel={this.props.referralStatusLabel}
            disableManagerPermissions={disableManagerPermissions}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
