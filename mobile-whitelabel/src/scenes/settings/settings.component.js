import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../_shared/styles/colors';
import i18n from 'react-native-i18n';
import { customTranslate } from '../../_shared/services/language-manager';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export class Settings extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ width: '100%', alignItems: 'flex-end', paddingTop: 10, paddingRight: 10 }}>
          <TouchableOpacity
            style={{
              padding: 5,
              borderWidth: 1,
              borderColor: '#018dd3',
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ color: '#018dd3' }}>{customTranslate('ml_Save')}</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{ padding: 10 }}>
          {/* <Text style={{ fontSize: 20, fontWeight: '500' }}>{customTranslate('ml_CompanyBrand')}</Text> */}
          <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
            <MaterialIcon name="checkbox-marked" size={22} color={COLORS.dashboardGreen} />
            <Text style={{ color: COLORS.grayMedium, fontSize: 17, marginLeft: 5 }}>
              Enable custom color themes.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
            <MaterialIcon
              name="checkbox-blank-outline"
              size={22}
              color={COLORS.buttonGrayOutline}
            />
            <Text style={{ color: COLORS.grayMedium, fontSize: 17, marginLeft: 5 }}>
              Hide Erin branding.
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View>
              <Text style={styles.inputTitle}>Navigation Menu Color:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputTitle}>Navigation Menu Highlight Color:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputTitle}>Primary Button Color:</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.inputTitle}>Add Button Color:</Text>
              <TextInput style={styles.input} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputTitle: { marginBottom: 5, fontSize: 15, fontWeight: '600', color: COLORS.grayMedium },
  input: {
    borderRadius: 5,
    borderWidth: 0.5,
    height: 40,
    padding: 4,
    borderColor: COLORS.borderColor,
  },
});

export default Settings;

//{"enabled":true,"menuColor":"#242e3f","menuHighlightColor":"#ef3c3f","buttonColor":"#038dd3","addButtonColor":"#ef3c3f"}
