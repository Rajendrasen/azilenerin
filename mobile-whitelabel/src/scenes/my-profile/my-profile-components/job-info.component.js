import React from 'react';
import { View, Text } from 'react-native';
import { WhiteSpace } from '@ant-design/react-native';
import DepartmentItem from './department-item.component';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { styles } from '../my-profile.styles';

const { JobInfoContainer, JobItemValue } = styles;

const EmployeeJobInfo = props => {
  const { department, title, role, managedDepartments, currency, employeeGroup } = props;
  let location = props.location ? JSON.parse(props.location) : null;

  const employeeRole = role => {
    switch (role) {
      case 'employee':
        return customTranslate('ml_Employee');
      case 'admin':
        return customTranslate('ml_Administrator');
      case 'manager':
        return customTranslate('ml_Manager');
      case 'superAdmin':
        return customTranslate('ml_SuperAdministrator');
      default:
        return null;
    }
  };
  const departmentName = department ? department.name : customTranslate('ml_NotListed');
  return (
    <View style={JobInfoContainer}>
      <Text style={styles.JobItemText}>
        {customTranslate('ml_Department')}: <Text style={JobItemValue}>{departmentName}</Text>
      </Text>
      <Text style={styles.JobItemText}>
        {customTranslate('ml_JobTitle')}: <Text style={JobItemValue}>{title || customTranslate('ml_NotListed')}</Text>
      </Text>
      <Text style={styles.JobItemText}>
        {customTranslate('ml_Currency')}:{' '}
        <Text style={JobItemValue}>{currency || customTranslate('ml_NotListed')}</Text>
      </Text>
      {employeeGroup ? (
        <Text style={styles.JobItemText}>
          {customTranslate('ml_EmployeeGroup')}:{' '}
          <Text style={JobItemValue}>{employeeGroup || customTranslate('ml_NotListed')}</Text>
        </Text>
      ) : null}

      <Text style={styles.JobItemText}>
        {customTranslate('ml_Location')}:{' '}
        <Text style={JobItemValue}>
          {location && (location.city || location.state || location.country)
            ? `${location.city || ''}, ${location.state || ''}, ${location.country || ''}`
            : customTranslate('ml_NotListed')}
        </Text>
      </Text>
      <WhiteSpace size="lg" />
      <Text style={styles.JobItemText}>
        {customTranslate('ml_Role')}:{' '}
        <Text style={JobItemValue}>{employeeRole(role) || customTranslate('ml_NotListed')}</Text>
      </Text>
      {role === 'manager' && managedDepartments ? (
        <View>
          <Text style={styles.JobItemText}>{customTranslate('ml_ManagerPermissions')}:</Text>
          <DepartmentItem departments={managedDepartments} />
        </View>
      ) : null}
    </View>
  );
};

export default EmployeeJobInfo;
