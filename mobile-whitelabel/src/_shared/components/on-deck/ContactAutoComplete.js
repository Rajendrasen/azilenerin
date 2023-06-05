import React from 'react';
import {Text, View, TouchableOpacity, Platform,} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {List, TextareaItem} from '@ant-design/react-native';
import {Actions} from 'react-native-router-flux';
import {styles} from '../refer-someone/referral-modal.styles';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from 'react-native-i18n';
import {customTranslate} from '../../services/language-manager';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {COLORS} from '../../styles/colors';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import {getAppName} from '../../../WhiteLabelConfig';

class ContactAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      hideResults: true,
      visible: false,
      jobTitle: '',
    };
    this.handleAutoCompleteCustomValidator =
      this.handleAutoCompleteCustomValidator.bind(this);
    this.handleNewContactCustomValidator =
      this.handleNewContactCustomValidator.bind(this);
  }
    
  componentDidMount() {
    if (this.props.referContact) {
      this.props.handleNewContact();
      setTimeout(() => this.onChangeText(this.props.referContact), 1000);
    }
  }

  componentWillMount() {
    const {selectedContact} = this.props;
    if (selectedContact) {
      this.setState({
        text: `${selectedContact.firstName} ${selectedContact.lastName}`,
        hideResults: true,
      });
      this.props.form.setFieldsValue({
        userId: selectedContact.id,
      });
    }
  }

  onBlur() {
    this.setState({hideResults: true});
  }

  onFocus() {
    this.setState({hideResults: false});
  }

  handleNewContactCustomValidator(rule, value, callback) {
    const {customValidator} = this.props;
    const {contacts = []} = this.props;
    const errors = [];

    const customValidatorError = customValidator();
    if (customValidatorError) {
      errors.push(customValidatorError);
      callback(errors);
      return;
    }
    const foundContact = contacts.find(
      (contact) => contact.emailAddress === value,
    );
    const foundContactPhone = contacts.find(
      (contact) => contact.phoneNumber === value,
    );
    const emailPattern =
      /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,20}[\.][a-z]{2,5}/g;
    const phonePattern =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    //
    if (!emailPattern.test(value)) {
      const error = new Error(customTranslate('ml_InvalidEmailId'));
      errors.push(error);
    }
    if (foundContact) {
      const error = new Error(
        customTranslate('ml_AContactWithThisEmailAddressAlreadyExists'),
      );
      errors.push(error);
    } else if (foundContactPhone) {
      const error = new Error('A contact with this Phone # already exists');
      errors.push(error);
    }

    callback(errors);
  }

  handleAutoCompleteCustomValidator(rule, value, callback) {
    const {ContactOptions, customValidator} = this.props;
    const errors = [];

    const customValidatorError = customValidator();
    if (customValidatorError) {
      errors.push(customValidatorError);
    }

    const isMatch = ContactOptions.find((option) => option.id === value);
    if (!isMatch) {
      const error = new Error(
        customTranslate('ml_ValueDoesNotMatchAnAvailableOption'),
      );
      errors.push(error);
    }
    if (isMatch && !isMatch.emailAddress) {
      const error = new Error(customTranslate('ml_ContactNoEmailPhone'));
      errors.push(error);
    }

    callback(errors);
  }

  onChangeText(text) {
    console.log('onchange test  ', text);
    const {handleContactChange} = this.props;
    if (typeof text === 'object') {
      this.setState({
        text: `${text.firstName} ${text.lastName}`,
        hideResults: true,
      });
      this.props.form.setFieldsValue({
        userId: text.id,
      });
    } else {
      this.setState({text});
    }
    handleContactChange(text);
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  handleOptions = (item) => {
    this.hideMenu();
    console.log(item?.id);
    this.setState({
      job: item?.id,
      jobTitle: item?.title,
    });
    this.props.form.setFieldsValue({
      jobId: item?.id,
    });
    //this.setState({optionItem: item});
  };

  renderItem = (item) => {
    // console.log('item>>', item);
    return (
      <TouchableOpacity
        onPress={() => this.onChangeText(item.item)}
        style={styles.AutoCompleteListItemStyles}>
        {Platform.OS == 'ios' ? (
          <Text>{`${item?.item?.firstName} ${item?.item?.lastName}`}</Text>
        ) : (
          <Text> {item?.item?.firstName + ' ' + item?.item?.lastName}</Text>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const {newContact, handleNewContact, ContactOptions} = this.props;

    console.log('ContactOptions>>>>>', ContactOptions);
    // console.log('new contact -- ', this.props.newContact);
    // console.log('contact options -- ', ContactOptions);
    const {getFieldDecorator} = this.props.form;
    const FormItem = List.Item;
    if (newContact) {
      return (
        <View>
          <View style={{margin: 10}}>
            <Text style={{fontWeight: 'bold', marginBottom: 5}}>
              {'Submit to:'}
            </Text>
            {getAppName() == 'erin' ? (
              <Menu
                ref={this.setMenuRef}
                style={{width: '89%', marginTop: 50}}
                button={
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#d9d9d9',
                      height: 50,
                      borderRadius: 8,
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                    }}
                    onPress={() => this.showMenu()}>
                    <Text
                      onPress={this.showMenu}
                      style={{
                        color: this.state.jobTitle == '' ? '#d9d9d9' : '#000',
                        textTransform: 'capitalize',
                        marginRight: 5,
                        fontSize: 14,
                      }}>
                      {this.state.jobTitle == ''
                        ? 'Select General Referral Category'
                        : this.state.jobTitle}
                    </Text>
                    <FontIcon
                      color={'#000'}
                      name="angle-down"
                      size={20}
                      onPress={this.showMenu}
                    />
                  </TouchableOpacity>
                }>
                {this.props.generalJobs?.map((item) => (
                  <MenuItem
                    key={item.title}
                    onPress={() => this.handleOptions(item)}>
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
            ) : (
              <DropDownPicker
                listMode="MODAL"
                setValue={(item) => {
                  // console.log('item', item());
                  this.setState({
                    job: item(),
                  });
                  this.props.form.setFieldsValue({
                    jobId: item(),
                  });
                }}
                value={this.state.job}
                onClose={() => this.setState({visible: false})}
                onOpen={() => this.setState({visible: true})}
                placeholder={'Select General Referral Category'}
                style={{borderColor: '#d9d9d9'}}
                placeholderStyle={{color: '#d9d9d9'}}
                zIndex={1000}
                open={this.state.visible}
                items={this.props.generalJobs?.map((item) => ({
                  ...item,
                  value: item.id,
                  label: item.title,
                }))}
              />
            )}

            {/* */}
          </View>
          <Text style={styles.FormTitle}>
            {customTranslate('ml_EnterReferralInformation')}
          </Text>
          <View style={{marginHorizontal: 10}}>
            <View style={styles.FormItemStyles}>
              {/* <FormItem style={styles.FormItemStyles}> */}
              {getFieldDecorator('firstName', {
                rules: [
                  {
                    required: true,
                    message: customTranslate('ml_PleaseInputFirstName'),
                  },
                ],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: 'white',
                    },
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d9d9d9',
                    borderRadius: 4,
                    marginVertical: 5,
                    padding: 1,
                    fontSize: 12,
                    paddingBottom: 12,
                  }}
                  placeholder={customTranslate('ml_FirstName')}
                />,
              )}
              {/* </FormItem> */}
            </View>
            <View style={styles.FormItemStyles}>
              {/* <FormItem style={styles.FormItemStyles}> */}
              {getFieldDecorator('lastName', {
                rules: [
                  {
                    required: true,
                    message: customTranslate('ml_PleaseInputLastName'),
                  },
                ],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: 'white',
                    },
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d9d9d9',
                    borderRadius: 4,
                    marginVertical: 5,
                    padding: 1,
                    fontSize: 12,
                    paddingBottom: 12,
                  }}
                  placeholder={customTranslate('ml_LastName')}
                />,
              )}
            </View>
            <View style={styles.FormItemStyles}>
              {/* <FormItem  > */}
              {getFieldDecorator('emailAddress', {
                rules: [
                  //{ type: 'email', message: 'Enter a valid E-mail' },
                  {
                    required: true,
                    message: '*',
                  },
                  {validator: this.handleNewContactCustomValidator},
                ],
              })(
                <TextareaItem
                  styles={{
                    container: {
                      borderBottomColor: 'white',
                    },
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d9d9d9',
                    borderRadius: 4,
                    marginVertical: 5,
                    padding: 1,
                    fontSize: 12,
                    paddingBottom: 12,
                    // justifyContent: "flex-start"
                  }}
                  placeholder={customTranslate('ml_Email')}
                  autoCorrect={false}
                  autoCapitalize="none"
                />,
              )}
              {/* </FormItem> */}
            </View>
            <Text
              style={[styles.SmallText, {color: 'grey', marginVertical: 10}]}>
              {customTranslate('ml_Or')}{' '}
              <Text
                style={[
                  styles.SmallText,
                  styles.AddContactsHere,
                  styles.LinkStyles,
                  {fontWeight: '600'},
                ]}
                onPress={() => {
                  handleNewContact();
                  //setTimeout(() => this.onChangeText(this.props.referContact), 1000);
                }}>
                {customTranslate('ml_ClickHere')}{' '}
              </Text>
              {customTranslate('ml_ToAddExistingContact')}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.AutoCompleteZIndex}>
          <View style={{margin: 10}}>
            <Text style={{fontWeight: 'bold', marginBottom: 5}}>
              {'Submit to:'}
            </Text>
            <DropDownPicker
              listMode="MODAL"
              setValue={(item) => {
                // console.log('item', item());
                this.setState({
                  job: item(),
                });
                this.props.form.setFieldsValue({
                  jobId: item(),
                });
              }}
              value={this.state.job}
              onClose={() => this.setState({visible: false})}
              onOpen={() => this.setState({visible: true})}
              placeholder={'Select General Referral Category'}
              style={{borderColor: '#d9d9d9'}}
              placeholderStyle={{color: '#d9d9d9'}}
              zIndex={1000}
              open={this.state.visible}
              items={this.props.generalJobs?.map((item) => ({
                ...item,
                value: item.id,
                label: item.title,
              }))}
            />
          </View>
          <FormItem style={styles.FormItemStyles}>
            {getFieldDecorator('userId', {
              rules: [
                {required: true, message: 'Please Input Contact Name'},
                {
                  validator: this.handleAutoCompleteCustomValidator,
                },
              ],
            })(
              <View style={[styles.LabelStyles, styles.AutoCompleteZIndex]}>
                <Text>{customTranslate('ml_ReferAContact')}</Text>
                <Autocomplete
                  data={ContactOptions}
                  defaultValue={this.state.text}
                  hideResults={this.state.hideResults}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={this.state.text}
                  autoCapitalize="none"
                  autoCorrect={false}
                  listStyle={styles.AutoCompleteListStyles}
                  inputContainerStyle={styles.InputStyles}
                  onFocus={() => this.onFocus()}
                  placeholder={customTranslate('ml_StartTyping')}
                  renderItem={(item) => this.renderItem(item)}
                  listContainerStyle={{flex: 1}}
                  flatListProps={{nestedScrollEnabled: true}}
                />
              </View>
            )}
            <Text style={[styles.LinkContainerStyles, {textAlign: 'center'}]}>
              {customTranslate('ml_Or')}{' '}
              <Text
                style={[
                  styles.SmallText,
                  styles.AddContactsHere,
                  styles.LinkStyles,
                ]}
                onPress={handleNewContact}>
                {customTranslate('ml_ClickHere')}{' '}
              </Text>
              {customTranslate('ml_ToEnterNameAndEmail')}
            </Text>
          </FormItem>
        </View>
      );
    }
  }
}

export default ContactAutoComplete;
