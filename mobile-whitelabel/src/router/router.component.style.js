import { StyleSheet } from 'react-native';
import { COLORS } from '../_shared/styles/colors';

export default StyleSheet.create({
    loading: {
        marginTop: 100,
    },
    tabbar: {
        backgroundColor: COLORS.darkBlue,
        width: '100%'
    },
    dashboard: {
        marginHorizontal: 10,
        flex: 1,
    },
    company: {
        textAlign: 'center',
        color: COLORS.lightGray,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 1,
    },

    rightbutton: {
        height: 40,
        marginRight: 20,
        marginBottom: 5,
    },
    image: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderColor,
        borderWidth: 0.5,
        borderRadius: 20,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.lightGray3,
        borderColor: COLORS.borderColor,
        borderWidth: 0.5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 18,
    },
    leftbutton: {
        color: COLORS.black,
        fontSize: 30,
    },
    leftModalButton: {
        marginLeft: 10,
    },
});
