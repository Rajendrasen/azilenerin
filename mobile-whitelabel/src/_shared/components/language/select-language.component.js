import React, {Component} from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {COLORS} from '../../styles/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {withApollo} from 'react-apollo';
import {userActions} from '../../../_store/actions';
import {updateUserQuery} from '../../../scenes/my-profile/profile.graphql';
import {connect} from 'react-redux';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../../_shared/services/language-manager';
import {
  setLanguage,
  languageCodeResolver,
} from '../../../_shared/services/language-manager';
const {width, height} = Dimensions.get('window');

export class selectLanguage extends Component {
  updateUser = (languageCode) => {
    console.log('inside');
    this.props.client
      .mutate({
        mutation: updateUserQuery,
        variables: {
          input: {
            id: this.props.currentUser.id,
            languageCode,
          },
        },
      })
      .then((res) => {
        console.log('response', res);
        this.props.setCurrentUser(res.data.updateUser);
        setLanguage(languageCode);
        this.props.close();
      })
      .catch((err) => {
        setLanguage(languageCode);
        this.props.close();
      });
  };
  render() {
    return (
      <React.Fragment>
        <Modal visible={this.props.visible} transparent>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.card}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}></View>

                <View style={{flex: 5}}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 20,
                      fontWeight: '600',
                      color: COLORS.darkGray,
                      marginTop: 15,
                      marginBottom: 10,
                    }}>
                    {customTranslate('ml_SelectLanguage')}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    // let locale = languageCodeResolver(i18n.currentLocale());

                    // setLanguage(locale);
                    this.props.close();
                  }}>
                  <IonIcon
                    name="md-close"
                    color={COLORS.buttonGrayOutline}
                    size={25}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('US');
                    // setLanguage('US');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'US'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    English
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'US' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('ZH-CN');
                    // setLanguage('PT-BR');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'ZH-CN'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Chinese (Simplified)
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'ZH-CN' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('NL');
                    // setLanguage('PT-BR');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'NL'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Dutch
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'NL' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('FR');
                    // setLanguage('FR');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'FR'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    French
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'FR' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('DE');
                    // setLanguage('DE');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'DE'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    German
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'DE' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('IT');
                    // setLanguage('PT');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'IT'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Italian
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'IT' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('JA');
                    // setLanguage('PT');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'JA'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Japanese
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'JA' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('PT');
                    // setLanguage('PT');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'PT'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Portuguese
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'PT' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('RU');
                    // setLanguage('RU');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'RU'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Russian
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'RU' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    this.updateUser('ES');
                    // setLanguage('ES');
                    // this.props.close();
                  }}>
                  <Text
                    style={[
                      styles.rowText,
                      {
                        color:
                          languageCodeResolver(i18n.currentLocale()) == 'ES'
                            ? COLORS.dashboardBlue
                            : COLORS.grayMedium,
                      },
                    ]}>
                    Spanish
                  </Text>
                  {languageCodeResolver(i18n.currentLocale()) == 'ES' && (
                    <IonIcon
                      name="md-checkmark"
                      color={COLORS.dashboardBlue}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
      </React.Fragment>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    width: width - 30,
    maxWidth: 450,
    maxHeight: 700,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingBottom: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.blackTransparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    padding: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowText: {fontSize: 16, fontWeight: '400', color: COLORS.grayMedium},
});

const mapStateToProps = (state) => {
  const {currentUser} = state.user;
  return {
    currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser(user) {
      dispatch(userActions.createSetCurrentUserAction(user));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withApollo(selectLanguage));
