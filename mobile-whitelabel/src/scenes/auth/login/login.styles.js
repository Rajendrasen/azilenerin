import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../_shared/styles/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    formContainer: {
        flex: 0,

    },
    BackgroundImageContainer: {
        // flex: 1,
        // marginTop: -10,
        width,
        height: height + 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BackgroundImage: { width: '100%', height: '100%' },
    Logo: {
        width: width - 90,
        height: 70,
        marginTop: -40,
    },
    LinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',

    },
    Link: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 2
    },
});
