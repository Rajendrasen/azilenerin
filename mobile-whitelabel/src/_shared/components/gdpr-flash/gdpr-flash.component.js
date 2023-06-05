import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS } from '../../styles/colors';

const GDPRFlash = ({ show }) => {
    const [hide, setHide] = useState(true);
    useEffect(() => {
        AsyncStorage.getItem('hideGDPRFlash').then((res) => {
            setHide(res == 'true' ? true : false);
        });
    }, []);

    return show && !hide ? (
        <TouchableOpacity
            onPress={() => {
                AsyncStorage.setItem('hideGDPRFlash', 'true');
                setHide(true);
            }}
            style={{
                width: '95%',
                backgroundColor: COLORS.lightGreen,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: COLORS.green,
                alignSelf: 'center',
                marginVertical: 5,
            }}>
            {/* <Text style={{fontSize: 13, color: COLORS.green, flex: 1}}>
        Note: Pending referrals will be populated with the referral's contact
        information once they accept.
      </Text> */}
            <Text style={{ marginLeft: 5 }}>X</Text>
        </TouchableOpacity>
    ) : null;
};

export default GDPRFlash;
