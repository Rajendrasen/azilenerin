import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import HTML from 'react-native-render-html';
import {customTranslate} from '../../_shared/services/language-manager';
import {COLORS} from '../../_shared/styles/colors';
import {WebView} from 'react-native-webview';

const AnnouncementCard = (props) => {
  const [status, setStatus] = useState(false);
  //", props.description.length);

  //   console.log('props.description', props.description);

  const ShowHideTextComponentView = () => {
    if (status) {
      setStatus(!status);
    } else {
      setStatus(true);
    }
  };

  return (
    <View style={styles.cardStyle}>
      {props.dashboardView && (
        <Text
          style={{
            fontWeight: 'bold',
            // textTransform: 'capitalize',
            marginRight: 5,
            fontSize: 18,
            marginBottom: 20,
            marginLeft: -10,
            alignSelf: 'flex-start',
          }}>
          {' '}
          {customTranslate('ml_Announcements').toUpperCase()}
        </Text>
      )}

      <Text
        style={{
          fontWeight: 'bold',
          fontSize: props.dashboardView ? 16 : 18,
        }}>
        {props.title}
      </Text>
      {status ? (
        <HTML
          containerStyle={styles.htmlContainer}
          numberOfLines={2}
          html={props.description}></HTML>

        // <WebView
        //   style={{
        //     marginTop: 10,
        //     height: 170,
        //     backgroundColor: '#fff',
        //     opacity: 0.9,
        //   }}
        //   //   textZoom={100}
        //   //   originWhitelist={['*']}
        //   source={{html: props.description}}
        //   nestedScrollEnabled
        // />
      ) : (
        // <WebView
        //   style={{
        //     marginTop: 10,
        //     height: 170,
        //     backgroundColor: '#fff',
        //     opacity: 0.9,
        //   }}
        //   //   textZoom={100}
        //   nestedScrollEnabled
        //   source={{html: props.description.substr(0, 179)}}
        // />

        <HTML
          containerStyle={styles.htmlContainer}
          numberOfLines={2}
          html={props.description.substr(0, 179)}></HTML>
      )}
      {props.description.replace(
                    /<[^>]*>?/gm,
                    '',
                  ).length > 230 &&
        (status ? (
          <TouchableOpacity
            style={{paddingBottom: 5}}
            onPress={() => ShowHideTextComponentView()}>
            <Text
              style={{
                color: COLORS.blue,
                fontWeight: 'bold',
                textTransform: 'lowercase',
              }}>
              {customTranslate('ml_ShowLess')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{paddingBottom: 5}}
            onPress={() => ShowHideTextComponentView()}>
            <Text
              style={{
                color: COLORS.blue,
                fontWeight: 'bold',
                textTransform: 'lowercase',
              }}>
              {customTranslate('ml_ShowMore')}
            </Text>
          </TouchableOpacity>
        ))}

      <Text style={{alignSelf: 'flex-end'}}>{props.createdDate}</Text>
    </View>
  );
};
AnnouncementCard.defaultProps = {
  title: '',
  description: '',
  createdDate: '',
};
const styles = StyleSheet.create({
  cardStyle: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  htmlContainer: {
    marginTop: 10,
  },
});
export default AnnouncementCard;
