import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../_shared/styles/colors';
let width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    header: {
        width: '100%',
    },
    headerTop: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    candidateName: {
        color: COLORS.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        color: COLORS.lightGray,
    },
    jobTitle: {
        // width: 200,
        flexWrap: 'wrap',
        color: COLORS.blue,
        fontWeight: 'bold',
    },
    referralCardContainer: {
        width: width > 450 ? width / 2 - 15 : width - 15,
        marginVertical: 8,
        backgroundColor: COLORS.white,
        // shadowColor: COLORS.lightGray,
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowOffset: {
        //   height: 1,
        //   width: 1,
        // },
        padding: 15,
        alignSelf: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 4,
    },
});
