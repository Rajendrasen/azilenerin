import React, { Component } from 'react';
import { Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { List, InputItem, Button } from '@ant-design/react-native';
import { createForm } from 'rc-form';
import { Auth } from 'aws-amplify';
import styles, { ListStyleOverrides } from './reset-password.styles';
import { Actions } from 'react-native-router-flux';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import { COLORS } from '../../../_shared/styles/colors';
const {
  ItemStyle,
  SubmitBtn,
  SubmitBtnContainer,
  SubmitBtnText,
  SubmitBtnActive,
  InputStyle,
  InputStyleContainer,
  LabelStyles,
  FormStyles,
} = styles;

const Item = List.Item;
class ResetPasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidCredentials: null,
      serverError: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit() {
    this.setState({ serverError: false, invalidCredentials: false });
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.setState({ serverError: true, errorMessage: err.message });
        return;
      }

      Auth.currentAuthenticatedUser()
        .then(user => {
          return Auth.changePassword(user, values.oldPassword, values.newPassword);
        })
        .then(data => {
          if (data === 'SUCCESS') {
            // Toast.show('Password Changed!', Toast.LONG, Toast.TOP, {
            //   backgroundColor: COLORS.dashboardGreen,
            //   height: 50,
            //   width: 250,
            //   borderRadius: 10,
            // });
            showMessage({
              message: "Password Changed!",
              type: "success",
            });
            return Actions.pop();
          }
        })
        .catch(err => {
          if (err.code === 'NotAuthorizedException') {
            return this.setState({ invalidCredentials: true, errorMessage: err.message });
          }
          return this.setState({ serverError: true, errorMessage: err.message });
        });
    });
  }

  render() {
    const { getFieldError, getFieldDecorator } = this.props.form;
    return (
      <List
        styles={StyleSheet.create(ListStyleOverrides)}
        style={[FormStyles]}
        renderHeader={() => null}
        renderFooter={() =>
          (getFieldError('oldPassword') && getFieldError('oldPassword').join(',')) ||
          (getFieldError('newPassword') && getFieldError('newPassword').join(','))
        }
      >
        <Item style={[ItemStyle, InputStyleContainer]}>
          <Text style={LabelStyles}>{customTranslate('ml_CurrentPassword')}</Text>
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: 'Old Password Required',
              },
            ],
          })(
            <InputItem
              style={InputStyle}
              clear
              type="password"
              autoCorrect={false}
              autoCapitalize="none"
            />
          )}
        </Item>
        <Item style={[ItemStyle, InputStyleContainer]}>
          <Text style={LabelStyles}>{customTranslate('ml_NewPassword')}</Text>
          {getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: 'New Password Required',
              },
            ],
          })(<InputItem style={InputStyle} type="password" clear />)}
        </Item>
        <Item style={[ItemStyle, SubmitBtnContainer]}>
          <Button onPress={this.handleSubmit} style={SubmitBtn} activeStyle={SubmitBtnActive}>
            <Text style={[SubmitBtnText]}>{customTranslate('ml_ResetPassword')}</Text>
          </Button>
        </Item>
        {(this.state.invalidCredentials || this.state.serverError) && (
          <Item>
            <Text>{this.state.errorMessage}</Text>
          </Item>
        )}
      </List>
    );
  }
}

export const ResetPassword = createForm()(ResetPasswordComponent);
