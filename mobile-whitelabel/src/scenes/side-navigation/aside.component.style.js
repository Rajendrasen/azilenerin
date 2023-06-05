import { StyleSheet, Dimensions } from 'react-native';
import { getAppName } from '../../WhiteLabelConfig';
import { hpx } from '../../_shared/constants/responsive';
import { COLORS } from '../../_shared/styles/colors';
let { width } = Dimensions.get('window');
export default StyleSheet.create({
    footerContainer: {
        height: 70,
    },
    sidenav: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: COLORS.sidebarGray,
    },
    logo: {
        //height: 60,
        height: getAppName() == 'heartlandAffiliation' ? 100 : 70,
        width: 200,
        resizeMode: 'contain',
        marginTop: 0,
        //marginLeft: 20,
        alignSelf: 'center',
    },
    item: {
        padding: 5,
        marginTop: 10,
        marginLeft: 25,
        fontSize: 18,
        color: COLORS.black,
    },

    navfooter: {
        marginLeft: 25,
        color: '#fff',
    },

    navlink: {
        color: COLORS.blue,
        marginLeft: 25,
    },

    navheight: {
        height: 70,
    },
    list: {
        fontSize: width > 450 ? 15 : 17,
        lineHeight: 35,
        marginLeft: 30,
        color: '#fff',
    },
});
