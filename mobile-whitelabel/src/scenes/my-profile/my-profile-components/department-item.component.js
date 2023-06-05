import { View, Text } from 'react-native';
import React from 'react';
import { styles } from './department-item.styles';

const { departmentContainer, departmentText, DepartmentsContainer } = styles;

const DepartmentItem = props => {
  const { departments } = props;
  return (
    <View style={DepartmentsContainer}>
      {departments.map(item => {
        return (
          <View key={item.departmentId}>
            <View style={departmentContainer}>
              <Text style={departmentText}> {item.department.name} </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default DepartmentItem;
