import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { List, InputItem, Button } from '@ant-design/react-native';
import { createForm } from 'rc-form';
import { Auth } from 'aws-amplify';
import styles, { ListStyleOverrides } from './forgot-password-card.styles';
import { Actions } from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../../_shared/services/language-manager';
//import Toast from 'react-native-toast-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import { COLORS } from '../../../../_shared/styles/colors';

const {
  ItemStyle,
  SubmitBtn,
  SubmitBtnContainer,
  SubmitBtnText,
  SubmitBtnActive,
  BtnContainer,
  InputStyle,
  InputStyleContainer,
  LabelStyles,
  FormStyles,
  ForgotPasswordBtn,
  ForgotPasswordBtnText,
  ForgotPasswordBtnActive,
  ErrorContainer,
} = styles;

class ForgotPasswordCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidCredentials: false,
      serverError: false,
      delivery: false,
      instructions: false,
    };
    this.handleSubmitUsername = this.handleSubmitUsername.bind(this);
  }

  handleSubmitUsername() {
    this.setState({
      invalidCredentials: false,
      serverError: false,
      delivery: false,
      instructions: false,
    });
    this.props.form.validateFields((err, values) => {
      if (!values.email) {
        this.setState({ invalidCredentials: true, errorMessage: 'Username cannot be empty' });
        return;
      } else if (err) {
        this.setState({ serverError: true, errorMessage: err.message });
        return;
      }
      Auth.forgotPassword(values.email.toLowerCase())
        .then(data => {
          this.setState({
            delivery: data.CodeDeliveryDetails,
            username: values.email,
            instructions: `An email has been sent to ${data.CodeDeliveryDetails.Destination} with instructions on how to reset your password`,
          });
        })
        .catch(err => {
          this.setState({
            serverError: true,
            errorMessage: err.message,
          });
        });
    });
  }

  handleSubmitForgotPassword() {
    this.props.form.validateFields((err, values) => {
      if (!values.code || !values.password) {
        this.setState({ invalidCredentials: true, errorMessage: 'Please complete all fields' });
        return;
      } else if (err) {
        this.setState({ serverError: true, errorMessage: err.message });
        return;
      }
      Auth.forgotPasswordSubmit(this.state.username.toLowerCase(), values.code, values.password)
        .then(() => {
          // Toast.show(customTranslate('ml_PasswordUpdatedSuccessfully'), Toast.LONG, Toast.TOP, {
          //   backgroundColor: COLORS.dashboardGreen,
          //   height: 50,
          //   width: 250,
          //   borderRadius: 10,
          // });
          showMessage({
            message: customTranslate('ml_PasswordUpdatedSuccessfully'),
            type: "success",
          });
          Actions.pop();
          // this.props.onStateChange('signIn', {})
        })
        .catch(err => {
          this.setState({ serverError: true, errorMessage: err.message });
        });
    });
  }

  onReset = () => {
    this.props.form.resetFields();
  };

  validateEmail = (rule, value, callback) => {
    if (value) {
      callback();
    }
  };
  render() {
    const { getFieldError, getFieldDecorator } = this.props.form;

    return (
      <List
        styles={StyleSheet.create(ListStyleOverrides)}
        style={[FormStyles]}
        renderHeader={() => null}
        renderFooter={() =>
          (getFieldError('email') && getFieldError('email').join(',')) ||
          (getFieldError('password') && getFieldError('password').join(','))
        }
      >
        {!this.state.delivery && (
          <View style={[ItemStyle, InputStyleContainer]}>
            <Text style={LabelStyles}>{customTranslate('ml_PleaseEnterYourEmail')}</Text>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: customTranslate('ml_NotAValidEmailAddress'),
                },
                {
                  required: true,
                  message: 'E-mail Required',
                },
              ],
            })(<InputItem style={InputStyle} clear />)}
          </View>
        )}
        {this.state.delivery && (
          <View>
            <View style={[ItemStyle, InputStyleContainer]}>
              <Text style={LabelStyles}>{customTranslate('ml_Code')}</Text>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: customTranslate('ml_CodeRequired'),
                  },
                ],
              })(<InputItem style={InputStyle} clear />)}
            </View>
            <View style={[ItemStyle, InputStyleContainer]}>
              <Text style={LabelStyles}>{customTranslate('ml_NewPassword')}</Text>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: customTranslate('ml_PasswordRequired'),
                  },
                ],
              })(<InputItem style={InputStyle} type="password" clear />)}
            </View>
          </View>
        )}
        {!this.state.delivery && (
          <View style={[ItemStyle, SubmitBtnContainer]}>
            <Button
              onPress={this.handleSubmitUsername}
              style={SubmitBtn}
              activeStyle={SubmitBtnActive}
            >
              <Text style={[SubmitBtnText]}>{customTranslate('ml_Send')}</Text>
            </Button>
          </View>
        )}
        {this.state.delivery && (
          <View style={[ItemStyle, SubmitBtnContainer]}>
            <Button
              onPress={() => this.handleSubmitForgotPassword()}
              style={SubmitBtn}
              activeStyle={SubmitBtnActive}
            >
              <Text style={[SubmitBtnText]}>{customTranslate('ml_Submit')}</Text>
            </Button>
          </View>
        )}
        <View style={[ItemStyle, BtnContainer]}>
          <Button
            style={ForgotPasswordBtn}
            activeStyle={ForgotPasswordBtnActive}
            onPress={() => {
              // this.props.onStateChange('signIn', {})
              Actions.pop();
            }}
          >
            <Text style={ForgotPasswordBtnText}>{customTranslate('ml_BackToLogin')}</Text>
          </Button>
        </View>
        {this.state.instructions && (
          <View style={ErrorContainer}>
            <Text>{this.state.instructions}</Text>
          </View>
        )}
        {(this.state.invalidCredentials || this.state.serverError) && (
          <View>
            <Text>{this.state.errorMessage}</Text>
          </View>
        )}
      </List>
    );
  }
}

export const ForgotPasswordForm = createForm()(ForgotPasswordCard);
