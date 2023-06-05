import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import _, { get } from 'lodash';
import { COLORS } from '../../_shared/styles/colors';
import SpinnerComponent from '../../_shared/components/spinner/spinner.component';
import getSymbolFromCurrency from 'currency-symbol-map';
import { customTranslate } from '../../_shared/services/language-manager';

import IonIcon from 'react-native-vector-icons/Ionicons';
import { getLightGrayLogo, getPrimaryColor } from '../../WhiteLabelConfig';
import { GetCompanyPointsData, getUserPoints } from './giftStore.graphql';
import { showMessage } from 'react-native-flash-message';

const GiftStore = (props) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [cards, setCards] = useState([]);
    const [points, setPoints] = useState(null);
    const [pointsSettings, setPointsSettings] = useState(null);
    const [companyBalance, setCompanyBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState({});
    const [visible, setVisible] = useState(false);
    const [denomination, setDenomination] = useState('');
    // const points = get(currentUser, 'points', 0);

    const updatePointsData = (fetchPolicy = 'network-only') => {
        var pointsSettings = 0
        var giftCardStoreBalance = 0;
        props.client
            .query({
                query: GetCompanyPointsData,
                fetchPolicy,
                variables: {
                    id: currentUser.companyId,
                },
            })
            .then((response) => {
                let comp = response.data.getCompany;
                // console.log("comp", comp);
                // console.log(JSON.parse(comp.pointsSettings));
                pointsSettings = JSON.parse(comp.pointsSettings);
                giftCardStoreBalance = comp.giftCardStoreBalance
                setPointsSettings(pointsSettings);
                setCompanyBalance(giftCardStoreBalance);
                getGiftCards(pointsSettings, giftCardStoreBalance);
            });

    };

    const UserPoints = async () => {
        const points = await props.client
            .query({
                query: getUserPoints,
                fetchPolicy: 'cache-first',
                variables: { id: currentUser.id },
            })
            .then((response) => response.data.getUserPoints.points);
        console.log(">>>", points);
        if (points) {
            setPoints(points);
        }

    }


    useEffect(() => {
        UserPoints()
        updatePointsData()

    }, []);
    const getGiftCards = async (pointsSettings, giftCardStoreBalance) => {
        let url = `https://qdgqgk78kd.execute-api.us-east-2.amazonaws.com/gift-card-store-prod?products=products&companyId=${currentUser.company.id}&pointsRatio=null`;
        fetch(url)
            .then((res) => res.json())
            .then((json) => {
                setCards(get(json, 'results', []));
                console.log(pointsSettings, giftCardStoreBalance);
                let sorted = json?.results?.sort((a, b) => a.name.localeCompare(b.name))
                let balance = giftCardStoreBalance
                let results = json?.results
                sorted = results.filter((product) => {
                    let denominations = product.denominations;
                    denominations = denominations ? denominations : [];
                    denominations = denominations.filter((denomination) => {
                        return get(denomination, 'amount') / 100 <= balance;
                    });
                    product.denominations = denominations;
                    if (denominations.length > 0) {
                        return product;
                    }
                });
                setCards(sorted);
                setLoading(false);
            })
            .catch((err) => setLoading(false));
    };

    const addToCart = () => {
        if (
            points >=
            calculatePointValueOfCard(
                denomination,
                pointsSettings.pointsRatio
            )
        ) {
            setVisible(false);
            console.log("denomination");
        }
        else {
            showMessage({
                message: customTranslate('ml_Error_Gift_Card'),
                type: 'danger',
            });
            setVisible(false);
            console.log("Error");
        }
    }
    function calculatePointValueOfCard(cardDenomination, pointsRatio) {
        return (cardDenomination / 100) * pointsRatio;
    }




    if (loading)
        return (
            <View style={styles.center}>
                <SpinnerComponent />
            </View>
        );
    if (!cards || !cards.length)
        return (
            <View style={[styles.center]}>
                <Image source={getLightGrayLogo()} style={styles.noImage} />
                <Text style={styles.noMessage}>
                    You do not have any Gift Cards yet.{' '}
                    <Text style={{ fontWeight: 'bold' }}>Make Referrals</Text> to earn
          points.{' '}
                </Text>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => {
                        setLoading(true);
                        getGiftCards();
                    }}>
                    <Text style={{ color: '#fff' }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        );
    const renderCard = (item) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    setVisible(true);
                    setCurrentCard(item);
                }}
                style={styles.container}>
                <Image
                    style={{ height: 200 }}
                    resizeMode="cover"
                    source={{ uri: get(item, 'themes[0].thumbnail_url', '') }}
                />
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.subName}>{currentUser.languageCode + "$" + (_.minBy(item.denominations, 'price').price / 100) + "-" + currentUser.languageCode + "$" + (_.maxBy(item.denominations, 'price').price / 100)}</Text>
                </View>
            </TouchableOpacity>
        );
    };





    return (
        <View style={[{ flex: 1 }]}>
            <View style={{ margin: 7.5 }}>
                <Text style={styles.name}>
                    Balance:{' '}
                    <Text style={{ color: COLORS.green }}>
                        {getSymbolFromCurrency(currentUser.currency)}
                        {parseFloat(
                            points && pointsSettings ? points / pointsSettings.pointsRatio : 0,
                        )}
                    </Text>
                </Text>
                <Text style={{ color: COLORS.grayMedium, marginTop: 5 }}>
                    ({points} Points)
        </Text>
            </View>
            <FlatList
                data={cards}
                renderItem={({ item }) => {
                    return renderCard(item);
                }}
            />
            {visible ? (
                <Modal transparent visible={visible}>
                    <View
                        style={[
                            styles.center,
                            {
                                backgroundColor: COLORS.blackTransparent,
                            },
                        ]}>
                        <View style={styles.modalWhiteContainer}>
                            <View style={styles.modalImageContainer}>
                                <Text style={styles.name}>Select Denomination</Text>
                                <TouchableOpacity
                                    onPress={() => setVisible(false)}
                                    style={{ paddingHorizontal: 15 }}>
                                    <IonIcon name="ios-close" size={40} color={'#8f99a2'} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ padding: 15 }}>
                                {renderCard(currentCard)}
                                <ScrollView>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {get(currentCard, 'denominations', []).map((d) => (
                                            <TouchableOpacity
                                                onPress={() => setDenomination(d)}
                                                style={[
                                                    styles.dCell,
                                                    denomination.amount == d.amount && {
                                                        backgroundColor: getPrimaryColor(),
                                                    },
                                                ]}>
                                                <Text
                                                    style={{
                                                        color:
                                                            denomination.amount == d.amount
                                                                ? COLORS.white
                                                                : COLORS.grayMedium,
                                                    }}>
                                                    {' '}
                                                    {currentUser.languageCode + getSymbolFromCurrency(d.currency)} {d.amount / 100}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity style={styles.secondaryButton}>
                                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                                        {/* <Icon name="checkmark_circle" color="white" /> */}
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.primaryButton} onPress={() => addToCart()} >
                                        <Text style={styles.primaryButtonText}>Add To Cart</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    secondaryButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '300',
        marginRight: 5,
        color: COLORS.buttonGrayText,
        textTransform: 'capitalize',
    },
    secondaryButton: {
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        //backgroundColor: COLORS.red,
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        flex: 1,
        borderWidth: 0.5,
        borderColor: COLORS.buttonGrayOutline,
    },
    primaryButton: {
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        flexDirection: 'row',
        margin: 5,
        flex: 1,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '300',
        marginRight: 5,
        textTransform: 'capitalize',
    },
    dCell: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: COLORS.lightGray3,
        margin: 5,
        borderRadius: 10,
    },
    modalWhiteContainer: {
        width: Dimensions.get('window').width - 15,
        backgroundColor: '#e5e5e5',
        alignSelf: 'center',
        borderRadius: 15,
    },
    noImage: {
        height: Dimensions.get('window').width / 2,
        width: Dimensions.get('window').width / 2,
        marginBottom: 30,
    },
    noMessage: {
        color: '#999999',
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 10,
    },
    refreshButton: {
        backgroundColor: COLORS.red,
        borderRadius: 5,
        paddingVertical: 10,
        marginTop: 10,
        width: 100,
        alignItems: 'center',
        alignSelf: 'center',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: {
        marginHorizontal: 7.5,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        overflow: 'hidden',
    },
    name: {
        fontWeight: 'bold',
        color: COLORS.grayMedium,
        fontSize: 16,
    },
    subName: {
        color: COLORS.grayMedium,
        fontSize: 13,
        marginTop: 5,
    },
    modalImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        borderBottomColor: COLORS.lightGray3,
        borderBottomWidth: 1,
    },
});

export default withApollo(GiftStore);
